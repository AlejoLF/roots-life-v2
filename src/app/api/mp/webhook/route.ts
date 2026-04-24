import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import {
  getPayment,
  getShipment,
  mapShipmentStatusToOrderStatus,
} from '@/lib/mercadopago';
import { getSupabaseAdmin } from '@/lib/supabase';
import { markDiscountCodeUsed, validateDiscountCode } from '@/lib/discount';
import { sendEmail } from '@/lib/resend';
import { orderConfirmationTemplate } from '@/lib/email-templates';
import { appendOrderToSheet } from '@/lib/orders-sheet';

/**
 * Webhook de MercadoPago — recibe notificaciones de payment y merchant_order.
 *
 * Acciones según tipo:
 *  - payment.updated / payment.created: consulta estado del pago y actualiza order
 *  - merchant_order.updated: placeholder (Mercado Envíos notifica acá cambios de envío)
 *
 * Idempotente: si el webhook dispara 2 veces, no causa efectos duplicados
 * porque validamos status transitions antes de escribir.
 */

/**
 * Valida firma del webhook según docs MP.
 * Manifest: id:{dataId};request-id:{reqId};ts:{ts};
 * HMAC-SHA256 con MP_WEBHOOK_SECRET, compara con v1.
 * Si el secret no está configurado, NO valida (modo dev). En prod debería estar siempre.
 */
function isValidSignature(
  req: NextRequest,
  dataId: string | undefined,
): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('[mp-webhook] MP_WEBHOOK_SECRET no configurado — signature NO validada');
    return true;
  }

  const xSignature = req.headers.get('x-signature');
  const xRequestId = req.headers.get('x-request-id');
  if (!xSignature || !xRequestId) return false;

  const parts = xSignature.split(',').reduce<Record<string, string>>(
    (acc, part) => {
      const [k, v] = part.split('=').map((s) => s.trim());
      if (k && v) acc[k] = v;
      return acc;
    },
    {},
  );

  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  const manifest = `id:${dataId ?? ''};request-id:${xRequestId};ts:${ts};`;
  const computed = createHmac('sha256', secret).update(manifest).digest('hex');

  try {
    return timingSafeEqual(
      Buffer.from(computed, 'hex'),
      Buffer.from(v1, 'hex'),
    );
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const payload = body as { type?: string; action?: string; data?: { id?: string } };
  const type = payload.type ?? payload.action?.split('.')[0];
  const resourceId = payload.data?.id;

  // Algunos webhooks de MP también traen data.id en query string
  const urlDataId = req.nextUrl.searchParams.get('data.id') ?? undefined;
  const effectiveId = resourceId ?? urlDataId;

  // Validación de firma
  if (!isValidSignature(req, effectiveId)) {
    console.warn('[mp-webhook] signature inválida');
    return NextResponse.json(
      { ok: false, error: 'Invalid signature' },
      { status: 401 },
    );
  }

  if (!effectiveId) {
    return NextResponse.json({ ok: true, noted: 'no-id' });
  }

  console.log('[mp-webhook]', type, effectiveId);

  try {
    if (type === 'payment') {
      await handlePayment(String(effectiveId));
    } else if (type === 'shipment' || type === 'shipments') {
      await handleShipment(String(effectiveId));
    }
    // merchant_order no lo procesamos (redundante — payment + shipment cubren todo)
  } catch (err) {
    console.error('[mp-webhook] handler error:', err);
    // Devolvemos 200 para que MP no re-intente masivamente si es un bug nuestro.
    // Los errores quedan en logs de Vercel.
  }

  return NextResponse.json({ ok: true });
}

async function handlePayment(paymentId: string) {
  const payment = await getPayment(paymentId);
  const externalRef = payment.external_reference;
  if (!externalRef) {
    console.warn('[mp-webhook] payment sin external_reference', paymentId);
    return;
  }

  const supabase = getSupabaseAdmin();
  const { data: order } = await supabase
    .from('orders')
    .select(
      'id, status, discount_code, discount, total, subtotal, shipping_cost, items, shipping_address, guest_email, guest_name, user_id, tracking_token, created_at',
    )
    .eq('id', externalRef)
    .maybeSingle();

  if (!order) {
    console.warn('[mp-webhook] order no encontrada:', externalRef);
    return;
  }

  const mpStatus = payment.status;
  const isApproved = mpStatus === 'approved';
  const isPending = mpStatus === 'pending' || mpStatus === 'in_process';
  const isRejected = mpStatus === 'rejected' || mpStatus === 'cancelled';

  const nowIso = new Date().toISOString();
  const updates: Record<string, unknown> = {
    mp_payment_id: paymentId,
  };

  // Detectamos la transición "por primera vez a paid" para disparar side effects
  // (email + append sheet) sólo una vez.
  const isTransitionToPaid = isApproved && order.status === 'pending';

  if (isApproved) {
    if (order.status === 'pending') {
      updates.status = 'paid';
      updates.paid_at = nowIso;
    }
  } else if (isPending) {
    // Sin cambios
  } else if (isRejected) {
    if (order.status === 'pending') {
      updates.status = 'cancelled';
      updates.cancelled_at = nowIso;
    }
  }

  await supabase.from('orders').update(updates).eq('id', order.id);

  if (!isTransitionToPaid) return;

  // ─── Side effects que sólo corren una vez en la transición a paid ───

  // 1) Marcar código de descuento como usado
  if (order.discount_code) {
    try {
      const validated = await validateDiscountCode(order.discount_code);
      if (validated.ok) await markDiscountCodeUsed(validated);
    } catch (err) {
      console.error('[mp-webhook] marcar código falló:', err);
    }
  }

  // 2) Append a Sheet de órdenes para el cliente
  try {
    await appendOrderToSheet({
      id: order.id,
      tracking_token: order.tracking_token,
      status: 'paid',
      items: order.items,
      subtotal: order.subtotal,
      shipping_cost: order.shipping_cost,
      discount: order.discount,
      discount_code: order.discount_code,
      total: order.total,
      mp_payment_id: paymentId,
      shipping_address: order.shipping_address,
      created_at: order.created_at,
    });
  } catch (err) {
    console.error('[mp-webhook] append Sheet falló:', err);
  }

  // 3) Email de confirmación al comprador
  try {
    const buyerEmail = order.guest_email
      ?? (order.shipping_address as { email?: string } | null)?.email
      ?? null;
    const buyerName =
      order.guest_name
      ?? (order.shipping_address as { firstName?: string; lastName?: string } | null)
        ?.firstName
      ?? '';

    if (buyerEmail) {
      const tpl = orderConfirmationTemplate({
        name: buyerName,
        orderId: order.id,
        trackingToken: order.tracking_token,
        items: order.items,
        subtotal: order.subtotal,
        shippingCost: order.shipping_cost,
        discount: order.discount,
        discountCode: order.discount_code ?? undefined,
        total: order.total,
        shippingAddress: order.shipping_address ?? undefined,
      });
      await sendEmail({
        to: buyerEmail,
        subject: tpl.subject,
        html: tpl.html,
        text: tpl.text,
      });
    }
  } catch (err) {
    console.error('[mp-webhook] email de confirmación falló:', err);
  }
}

async function handleShipment(shipmentId: string) {
  const shipment = await getShipment(shipmentId);
  if (!shipment) return;

  const supabase = getSupabaseAdmin();
  // Buscar la orden por mp_shipping_id (si ya la vinculamos) o por external_reference
  const { data: orderByShipping } = await supabase
    .from('orders')
    .select(
      'id, status, shipping_address, guest_email, tracking_token, tracking_code',
    )
    .eq('mp_shipping_id', shipmentId)
    .maybeSingle();

  let order = orderByShipping;

  // Si aún no está vinculada, buscar por external_reference del shipment
  if (!order && shipment.external_reference) {
    const { data: orderByRef } = await supabase
      .from('orders')
      .select(
        'id, status, shipping_address, guest_email, tracking_token, tracking_code',
      )
      .eq('id', shipment.external_reference)
      .maybeSingle();
    order = orderByRef;
    if (order) {
      // Vincular para futuras notificaciones
      await supabase
        .from('orders')
        .update({ mp_shipping_id: shipmentId })
        .eq('id', order.id);
    }
  }

  if (!order) {
    console.warn('[mp-webhook] shipment sin orden asociada', shipmentId);
    return;
  }

  const newStatus = mapShipmentStatusToOrderStatus(shipment.status);
  if (!newStatus) return;

  const nowIso = new Date().toISOString();
  const updates: Record<string, unknown> = {};

  if (order.status !== newStatus) {
    updates.status = newStatus;
    if (newStatus === 'preparing') updates.preparing_at = nowIso;
    if (newStatus === 'shipped') updates.shipped_at = nowIso;
    if (newStatus === 'delivered') {
      updates.delivered_at = nowIso;
      // Ventana de 7 días para reclamos / tracking público
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      updates.tracking_expires_at = expiresAt.toISOString();
    }
  }

  if (shipment.tracking_number && shipment.tracking_number !== order.tracking_code) {
    updates.tracking_code = shipment.tracking_number;
  }

  if (Object.keys(updates).length === 0) return;

  await supabase.from('orders').update(updates).eq('id', order.id);

  console.log(
    '[mp-webhook] shipment update:',
    order.id.slice(0, 8),
    '→',
    updates,
  );
}

// MP a veces pega con GET para confirmar que el endpoint existe
export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'mp-webhook' });
}
