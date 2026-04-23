import { NextRequest, NextResponse } from 'next/server';
import { getPayment } from '@/lib/mercadopago';
import { getSupabaseAdmin } from '@/lib/supabase';
import { markDiscountCodeUsed, validateDiscountCode } from '@/lib/discount';

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

  if (!resourceId) {
    return NextResponse.json({ ok: true, noted: 'no-id' });
  }

  console.log('[mp-webhook]', type, resourceId);

  try {
    if (type === 'payment') {
      await handlePayment(String(resourceId));
    }
    // merchant_order / shipment updates: llegan a /api/mp/webhook también
    // y los procesamos en Fase 5.
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
    .select('id, status, discount_code, total')
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

  if (isApproved) {
    // Transición pending → paid (sólo si no ya estaba aprobada)
    if (order.status === 'pending') {
      updates.status = 'paid';
      updates.paid_at = nowIso;
    }
  } else if (isPending) {
    // No cambia status principal; queda pending hasta approved
  } else if (isRejected) {
    if (order.status === 'pending') {
      updates.status = 'cancelled';
      updates.cancelled_at = nowIso;
    }
  }

  await supabase.from('orders').update(updates).eq('id', order.id);

  // Si quedó approved y había un código de descuento, marcarlo como usado
  if (isApproved && order.status === 'pending' && order.discount_code) {
    const validated = await validateDiscountCode(order.discount_code);
    if (validated.ok) {
      await markDiscountCodeUsed(validated);
    }
  }

  // TODO Fase 4b: enviar email de confirmación si isApproved
  // TODO Fase 4b: append row a Sheet orders para el cliente
}

// MP a veces pega con GET para confirmar que el endpoint existe
export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'mp-webhook' });
}
