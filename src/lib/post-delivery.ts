import { getSupabaseAdmin } from './supabase';
import { sendEmail } from './resend';
import { postDeliveryTemplate } from './email-templates';

/**
 * Dispara el email post-entrega una sola vez por pedido.
 * Se llama cuando el status transiciona a 'delivered'.
 * Usamos la columna delivered_at + un flag para evitar doble envío.
 */
export async function sendPostDeliveryEmail(orderId: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { data: order } = await supabase
    .from('orders')
    .select(
      'id, tracking_token, status, items, shipping_address, guest_email, user_id, post_delivery_email_sent_at',
    )
    .eq('id', orderId)
    .maybeSingle();

  if (!order || order.status !== 'delivered') return;

  // Evitar doble envío
  if (order.post_delivery_email_sent_at) return;

  // Tomar el email: guest_email o users.email si es registered
  let email = order.guest_email ?? '';
  let name = '';

  if (order.user_id) {
    const { data: user } = await supabase
      .from('users')
      .select('email, name')
      .eq('id', order.user_id)
      .maybeSingle();
    if (user) {
      email = user.email;
      name = user.name ?? '';
    }
  }

  if (!email && order.shipping_address) {
    const addr = order.shipping_address as {
      email?: string;
      firstName?: string;
    } | null;
    email = addr?.email ?? '';
    if (!name) name = addr?.firstName ?? '';
  }

  if (!email) return;

  const items = (order.items ?? []) as Array<{ quantity: number }>;
  const itemsCount = items.reduce((sum, i) => sum + (i.quantity ?? 1), 0);

  const tpl = postDeliveryTemplate({
    name,
    orderId: order.id,
    trackingToken: order.tracking_token,
    itemsCount,
  });

  const result = await sendEmail({
    to: email,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
  });

  if (result.ok) {
    await supabase
      .from('orders')
      .update({ post_delivery_email_sent_at: new Date().toISOString() })
      .eq('id', order.id);
  }
}
