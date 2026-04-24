import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { sendPostDeliveryEmail } from '@/lib/post-delivery';

/**
 * Self-report de entrega — el comprador confirma que recibió el paquete.
 * Solo válido si el status es 'shipped' o 'in_transit'. Idempotente.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  if (!token) {
    return NextResponse.json(
      { ok: false, error: 'Token faltante' },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdmin();
  const { data: order } = await supabase
    .from('orders')
    .select('id, status')
    .eq('tracking_token', token)
    .maybeSingle();

  if (!order) {
    return NextResponse.json(
      { ok: false, error: 'Pedido no encontrado' },
      { status: 404 },
    );
  }

  // Solo permitimos self-report si todavía está en tránsito
  if (!['shipped', 'in_transit'].includes(order.status)) {
    return NextResponse.json(
      { ok: false, error: `No se puede confirmar entrega desde status "${order.status}".` },
      { status: 400 },
    );
  }

  const nowIso = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  await supabase
    .from('orders')
    .update({
      status: 'delivered',
      delivered_at: nowIso,
      tracking_expires_at: expiresAt,
    })
    .eq('id', order.id);

  // Dispara email post-entrega (idempotente)
  try {
    await sendPostDeliveryEmail(order.id);
  } catch (err) {
    console.error('[confirm-delivery] post-delivery email falló:', err);
  }

  return NextResponse.json({ ok: true });
}
