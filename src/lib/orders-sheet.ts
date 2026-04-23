import { appendSheetRow } from './sheets';

/**
 * Append de una orden nueva a la pestaña "orders" del Sheet del cliente.
 * Se invoca desde el webhook cuando el pago es approved (transición pending→paid).
 */

type OrderItem = {
  slug: string;
  title: string;
  image?: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
};

type ShippingAddress = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  street?: string;
  streetNumber?: string;
  apartment?: string;
  city?: string;
  province?: string;
  zip?: string;
  notes?: string;
};

type OrderForSheet = {
  id: string;
  tracking_token: string;
  status: string;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  discount: number;
  discount_code: string | null;
  total: number;
  mp_payment_id: string | null;
  shipping_address: ShippingAddress | null;
  created_at: string;
};

function formatItemsForSheet(items: OrderItem[]): string {
  return items
    .map((i) => {
      const variants = [i.size, i.color].filter(Boolean).join(' · ');
      return `${i.quantity}× ${i.title}${variants ? ` (${variants})` : ''}`;
    })
    .join('\n');
}

function formatAddressForSheet(addr: ShippingAddress | null): string {
  if (!addr) return '';
  const line1 = [
    addr.street,
    addr.streetNumber,
    addr.apartment ? `· ${addr.apartment}` : '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();
  const line2 = [addr.city, addr.province, addr.zip]
    .filter(Boolean)
    .join(', ');
  return [line1, line2].filter(Boolean).join('\n');
}

export async function appendOrderToSheet(order: OrderForSheet): Promise<void> {
  const sheetId = process.env.PRODUCTS_SHEET_ID;
  if (!sheetId) return;

  const addr = order.shipping_address;
  const cliente = addr
    ? [addr.firstName, addr.lastName].filter(Boolean).join(' ')
    : '';
  const email = addr?.email ?? '';
  const telefono = addr?.phone ?? '';
  const notasCliente = addr?.notes ?? '';

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.rootslife.shop';
  const trackingLink = `${siteUrl}/seguir/${order.tracking_token}`;

  const row: (string | number)[] = [
    order.created_at,                             // A fecha
    order.id.slice(0, 8),                         // B order_id (short)
    order.status,                                  // C status
    cliente,                                       // D cliente
    email,                                         // E email
    telefono,                                      // F teléfono
    formatAddressForSheet(addr),                   // G dirección
    formatItemsForSheet(order.items),              // H items
    order.subtotal,                                // I subtotal
    order.shipping_cost,                           // J envío
    order.discount,                                // K descuento
    order.discount_code ?? '',                     // L código
    order.total,                                   // M total
    order.mp_payment_id ?? '',                     // N mp_payment_id
    '',                                            // O tracking (el cliente lo llena al despachar)
    notasCliente,                                  // P notas del comprador
    trackingLink,                                  // Q link tracking
    '',                                            // R notas internas
  ];

  await appendSheetRow(sheetId, 'orders!A1', row);
}
