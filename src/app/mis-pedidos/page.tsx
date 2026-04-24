import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { auth } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export const metadata = {
  title: 'Mis pedidos',
  robots: { index: false, follow: false },
};

type OrderStatus =
  | 'pending'
  | 'paid'
  | 'preparing'
  | 'shipped'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Pago pendiente',
  paid: 'Pago confirmado',
  preparing: 'En preparación',
  shipped: 'Despachado',
  in_transit: 'En camino',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
  refunded: 'Reintegrado',
};

const PICKUP_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Pago pendiente',
  paid: 'Pago confirmado',
  preparing: 'En preparación',
  shipped: 'Listo para retirar',
  in_transit: 'Listo para retirar',
  delivered: 'Retirado',
  cancelled: 'Cancelado',
  refunded: 'Reintegrado',
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending: 'bg-[#4D443A] text-paper-100',
  paid: 'bg-[#3D5A4A] text-paper-100',
  preparing: 'bg-[#3D5A4A] text-paper-100',
  shipped: 'bg-[#446B85] text-paper-100',
  in_transit: 'bg-[#446B85] text-paper-100',
  delivered: 'bg-[#5A7E4A] text-paper-100',
  cancelled: 'bg-ink-700 text-white/60',
  refunded: 'bg-ink-700 text-white/60',
};

type OrderItem = {
  slug: string;
  title: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
};

type Order = {
  id: string;
  tracking_token: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  created_at: string;
  shipped_at: string | null;
  delivered_at: string | null;
  tracking_code: string | null;
  shipping_method: string | null;
};

export default async function MisPedidosPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login?callbackUrl=/mis-pedidos');

  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from('orders')
    .select(
      'id, tracking_token, status, items, total, created_at, shipped_at, delivered_at, tracking_code, shipping_method',
    )
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  const orders = (data ?? []) as Order[];

  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1 bg-paper-100">
        <div className="max-w-[56rem] mx-auto px-4 md:px-8 py-10 lg:py-16">
          <div className="mb-10">
            <p className="text-caption text-ink-500 mb-2">Tu cuenta</p>
            <h1 className="text-display-lg m-0 mb-2">Mis pedidos</h1>
            <p className="text-body text-ink-500">
              Historial de compras y estado de cada pedido.
            </p>
          </div>

          {orders.length === 0 ? <EmptyState /> : <OrdersList orders={orders} />}

          <div className="mt-10 pt-6 border-t border-[var(--color-border)]">
            <Link
              href="/perfil"
              className="text-body-sm text-ink-500 underline hover:text-ink-900"
            >
              ← Volver al perfil
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function EmptyState() {
  return (
    <div className="bg-white border border-[var(--color-border)] rounded-[4px] p-10 text-center">
      <p className="text-caption text-ink-500 mb-3">Sin pedidos todavía</p>
      <h2 className="font-display font-bold text-2xl uppercase mb-3">
        Aún no compraste nada
      </h2>
      <p className="text-body text-ink-500 leading-relaxed mb-6 max-w-[28rem] mx-auto">
        Cuando hagas tu primera compra, vas a ver el estado y el tracking acá
        mismo.
      </p>
      <Button href="/catalogo" variant="accent" size="md">
        Ir al catálogo →
      </Button>
    </div>
  );
}

function OrdersList({ orders }: { orders: Order[] }) {
  return (
    <ul className="list-none p-0 m-0 space-y-5">
      {orders.map((order) => {
        const isPickup = order.shipping_method === 'pickup';
        const labels = isPickup ? PICKUP_STATUS_LABEL : STATUS_LABEL;
        return (
        <li
          key={order.id}
          className="bg-white border border-[var(--color-border)] rounded-[4px] overflow-hidden"
        >
          {/* Header de orden */}
          <div className="px-5 py-4 border-b border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] text-ink-500 uppercase tracking-widest mb-0.5">
                Pedido #{order.id.slice(0, 8)}
                {isPickup && <span className="ml-2 text-rust-500">· Retiro en local</span>}
              </p>
              <p className="text-sm text-ink-900">
                {new Date(order.created_at).toLocaleDateString('es-AR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest ${STATUS_COLOR[order.status]}`}
            >
              {labels[order.status]}
            </span>
          </div>

          {/* Items */}
          <div className="px-5 py-4 space-y-2">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink-900 truncate">
                    {item.title}{' '}
                    <span className="text-ink-500 font-normal">
                      × {item.quantity}
                    </span>
                  </p>
                  {(item.size || item.color) && (
                    <p className="text-[11px] text-ink-500">
                      {[item.size, item.color].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
                <span className="text-ink-900 flex-shrink-0">
                  ${(item.price * item.quantity).toLocaleString('es-AR')}
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 bg-paper-100 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm">
              <span className="text-ink-500">Total: </span>
              <strong className="text-ink-900">
                ${order.total.toLocaleString('es-AR')}
              </strong>
            </p>
            <Link
              href={`/seguir/${order.tracking_token}`}
              className="text-[11px] font-semibold uppercase tracking-widest text-ink-900 hover:text-rust-500"
            >
              {isPickup ? 'Ver retiro →' : 'Ver tracking →'}
            </Link>
          </div>
        </li>
        );
      })}
    </ul>
  );
}
