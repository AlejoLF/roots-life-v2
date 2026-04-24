import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { TrackingActions } from './TrackingActions';
import { getSupabaseAdmin } from '@/lib/supabase';

export const metadata = {
  title: 'Seguimiento de pedido',
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ token: string }>;
};

type OrderItem = {
  slug: string;
  title: string;
  image?: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
};

type OrderRow = {
  id: string;
  tracking_token: string;
  status: string;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  discount: number;
  total: number;
  tracking_code: string | null;
  tracking_expires_at: string | null;
  created_at: string;
  paid_at: string | null;
  preparing_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  shipping_address: {
    firstName?: string;
    lastName?: string;
    city?: string;
    province?: string;
  } | null;
};

type StatusKey =
  | 'pending'
  | 'paid'
  | 'preparing'
  | 'shipped'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

const STATUS_LABEL: Record<StatusKey, string> = {
  pending: 'Pago pendiente',
  paid: 'Pago confirmado',
  preparing: 'En preparación',
  shipped: 'Despachado',
  in_transit: 'En camino',
  delivered: 'Entregado ✓',
  cancelled: 'Cancelado',
  refunded: 'Reintegrado',
};

const TIMELINE_STEPS: { key: StatusKey; label: string; desc: string }[] = [
  { key: 'paid', label: 'Pago confirmado', desc: 'Recibimos tu pago.' },
  {
    key: 'preparing',
    label: 'En preparación',
    desc: 'Estampamos y empaquetamos en el taller.',
  },
  {
    key: 'shipped',
    label: 'Despachado',
    desc: 'El paquete salió con Mercado Envíos.',
  },
  {
    key: 'delivered',
    label: 'Entregado',
    desc: 'Llegó a destino.',
  },
];

const STATUS_ORDER: StatusKey[] = [
  'pending',
  'paid',
  'preparing',
  'shipped',
  'in_transit',
  'delivered',
];

function stepStatusFor(
  orderStatus: StatusKey,
  stepKey: StatusKey,
): 'done' | 'current' | 'pending' {
  const orderIdx = STATUS_ORDER.indexOf(orderStatus);
  const stepIdx = STATUS_ORDER.indexOf(stepKey);
  if (orderIdx === -1 || stepIdx === -1) return 'pending';
  if (stepIdx < orderIdx) return 'done';
  if (stepIdx === orderIdx) return 'current';
  // shipped y in_transit son "en transit"; para el step 'shipped', si orden es in_transit también es done
  if (stepKey === 'shipped' && orderStatus === 'in_transit') return 'done';
  return 'pending';
}

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatARS(n: number): string {
  return '$' + n.toLocaleString('es-AR');
}

export default async function SeguirPage({ params }: Props) {
  const { token } = await params;
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from('orders')
    .select(
      'id, tracking_token, status, items, subtotal, shipping_cost, discount, total, tracking_code, tracking_expires_at, created_at, paid_at, preparing_at, shipped_at, delivered_at, shipping_address',
    )
    .eq('tracking_token', token)
    .maybeSingle();

  const order = data as OrderRow | null;

  if (!order) {
    return (
      <>
        <Header />
        <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1 bg-paper-100">
          <div className="max-w-[32rem] mx-auto px-4 py-16 text-center">
            <p className="text-caption text-ink-500 mb-3">404</p>
            <h1 className="text-display-lg m-0 mb-4">Pedido no encontrado</h1>
            <p className="text-body text-ink-500 mb-8">
              El link que usaste no corresponde a ningún pedido activo. Si
              creés que es un error, escribinos.
            </p>
            <Button href="/" variant="dark" size="md">
              Volver al inicio
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Verificar expiración
  const isExpired = Boolean(
    order.tracking_expires_at &&
      new Date(order.tracking_expires_at) < new Date(),
  );

  if (isExpired) {
    return (
      <>
        <Header />
        <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1 bg-paper-100">
          <div className="max-w-[32rem] mx-auto px-4 py-16 text-center">
            <p className="text-caption text-ink-500 mb-3">Link vencido</p>
            <h1 className="text-display-lg m-0 mb-4">
              Este pedido ya se cerró
            </h1>
            <p className="text-body text-ink-500 mb-8">
              Pasaron más de 7 días desde la entrega y el período de
              seguimiento venció. Si tenés una consulta sobre este pedido,
              escribinos directamente.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                href="https://wa.me/5492974737664"
                variant="accent"
                size="md"
              >
                WhatsApp →
              </Button>
              <Button
                href="mailto:emma.irusta@hotmail.com"
                variant="outline"
                size="md"
              >
                Escribir por email
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const status = order.status as StatusKey;
  const statusLabel = STATUS_LABEL[status] ?? order.status;
  const isCancelled = status === 'cancelled' || status === 'refunded';
  const isDelivered = status === 'delivered';
  const hasTracking = Boolean(order.tracking_code);
  const firstName = order.shipping_address?.firstName ?? '';

  const stepDates: Partial<Record<StatusKey, string | null>> = {
    paid: order.paid_at,
    preparing: order.preparing_at,
    shipped: order.shipped_at,
    delivered: order.delivered_at,
  };

  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1 bg-paper-100">
        <div className="max-w-[42rem] mx-auto px-4 md:px-8 py-10 lg:py-16">
          {/* Hero status */}
          <div className="text-center mb-10">
            <p className="text-caption text-ink-500 mb-3">
              Pedido #{order.id.slice(0, 8)}
            </p>
            <h1 className="text-display-lg m-0 mb-3">
              {firstName ? `Hola ${firstName}` : 'Tu pedido'}
            </h1>
            <p className="text-body-lg text-ink-900">{statusLabel}</p>
            {order.shipping_address?.city && (
              <p className="text-body-sm text-ink-500 mt-2">
                Envío a {order.shipping_address.city},{' '}
                {order.shipping_address.province}
              </p>
            )}
          </div>

          {/* Cancelled state */}
          {isCancelled ? (
            <div className="bg-white border border-rust-500 rounded-[4px] p-6 text-center mb-8">
              <p className="text-caption text-rust-500 mb-2">
                Pedido {status === 'cancelled' ? 'cancelado' : 'reintegrado'}
              </p>
              <p className="text-body text-ink-700">
                {status === 'cancelled'
                  ? 'Este pedido fue cancelado. Si no reconocés esta cancelación, escribinos.'
                  : 'El pago fue reintegrado al medio de pago original. Puede tomar hasta 10 días hábiles en reflejarse.'}
              </p>
            </div>
          ) : (
            <Timeline
              orderStatus={status}
              stepDates={stepDates}
              trackingCode={order.tracking_code}
            />
          )}

          {/* Tracking code card */}
          {hasTracking && !isCancelled && (
            <TrackingCodeCard
              code={order.tracking_code!}
              deliveredAt={order.delivered_at}
            />
          )}

          {/* Self-report button (solo si shipped/in_transit) */}
          {(status === 'shipped' || status === 'in_transit') && (
            <TrackingActions token={order.tracking_token} />
          )}

          {/* Delivered feedback */}
          {isDelivered && (
            <DeliveredCard expiresAt={order.tracking_expires_at} />
          )}

          {/* Order summary */}
          <OrderSummary order={order} />

          {/* Support */}
          <SupportSection />
        </div>
      </main>
      <Footer />
    </>
  );
}

function Timeline({
  orderStatus,
  stepDates,
  trackingCode,
}: {
  orderStatus: StatusKey;
  stepDates: Partial<Record<StatusKey, string | null>>;
  trackingCode: string | null;
}) {
  return (
    <section className="bg-white border border-[var(--color-border)] rounded-[4px] p-6 mb-6">
      <h2 className="text-caption text-ink-500 mb-6">Progreso del pedido</h2>
      <ol className="list-none p-0 m-0 flex flex-col gap-5">
        {TIMELINE_STEPS.map((step) => {
          const status = stepStatusFor(orderStatus, step.key);
          const date = stepDates[step.key];
          return (
            <li key={step.key} className="flex items-start gap-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  status === 'done'
                    ? 'bg-[#5A7E4A] text-paper-100'
                    : status === 'current'
                      ? 'bg-rust-500 text-paper-100 ring-4 ring-rust-500/20'
                      : 'bg-paper-200 text-ink-500'
                }`}
              >
                {status === 'done' ? '✓' : TIMELINE_STEPS.indexOf(step) + 1}
              </div>
              <div className="flex-1 pt-0.5">
                <p
                  className={`font-medium ${
                    status === 'pending' ? 'text-ink-500' : 'text-ink-900'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-sm text-ink-500 mt-0.5">{step.desc}</p>
                {date && (
                  <p className="text-[11px] text-ink-500 mt-1 font-mono">
                    {formatDate(date)}
                  </p>
                )}
                {step.key === 'shipped' && status === 'current' && trackingCode && (
                  <p className="text-[11px] text-rust-500 mt-1 font-mono">
                    Tracking: {trackingCode}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function TrackingCodeCard({
  code,
  deliveredAt,
}: {
  code: string;
  deliveredAt: string | null;
}) {
  const mpTrackingUrl = `https://www.mercadolibre.com.ar/envios/tracking/${code}`;
  return (
    <section className="bg-ink-900 text-paper-100 rounded-[4px] p-6 mb-6">
      <p className="text-caption text-rust-200 mb-2">
        {deliveredAt ? 'Entregado · Código de seguimiento' : 'Código de seguimiento'}
      </p>
      <p className="font-mono text-lg text-paper-100 mb-4 break-all">{code}</p>
      <a
        href={mpTrackingUrl}
        target="_blank"
        rel="noopener"
        className="inline-block text-[11px] font-semibold uppercase tracking-widest text-rust-200 hover:text-paper-100 underline underline-offset-[3px]"
      >
        Ver en Mercado Envíos →
      </a>
    </section>
  );
}

function DeliveredCard({ expiresAt }: { expiresAt: string | null }) {
  return (
    <section className="bg-[#E8F3E0] border border-[#5A7E4A] rounded-[4px] p-6 mb-6 text-center">
      <p className="text-caption text-[#3D5A2D] mb-2">✓ Entregado</p>
      <h2 className="font-display font-bold uppercase text-ink-900 mb-3 text-xl">
        Gracias por tu compra
      </h2>
      <p className="text-body-sm text-ink-700 leading-relaxed mb-4">
        Esperamos que te encante. Si algo no es como esperabas, tenés 15 días
        para cambios. Si todo fue bien, nos ayudás mucho con una reseña.
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        <a
          href="https://g.page/r/rootslife/review"
          target="_blank"
          rel="noopener"
          className="inline-block bg-ink-900 text-paper-100 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest rounded-[2px] hover:bg-ink-700"
        >
          Dejar reseña Google →
        </a>
        <a
          href="https://instagram.com/rootslife.cr"
          target="_blank"
          rel="noopener"
          className="inline-block border border-ink-900 text-ink-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest rounded-[2px] hover:bg-ink-900 hover:text-paper-100"
        >
          Taggearnos en Instagram
        </a>
      </div>
      {expiresAt && (
        <p className="text-[11px] text-ink-500 mt-4">
          Este link de seguimiento vence el{' '}
          {new Date(expiresAt).toLocaleDateString('es-AR', {
            day: 'numeric',
            month: 'long',
          })}
          .
        </p>
      )}
    </section>
  );
}

function OrderSummary({ order }: { order: OrderRow }) {
  return (
    <section className="bg-white border border-[var(--color-border)] rounded-[4px] overflow-hidden mb-6">
      <div className="px-5 py-3 border-b border-[var(--color-border)]">
        <h2 className="text-caption text-ink-500">Detalle de la compra</h2>
      </div>
      <ul className="list-none p-0 m-0">
        {order.items.map((item, i) => (
          <li
            key={i}
            className="px-5 py-3 flex items-center gap-3 border-b border-[var(--color-border)] last:border-b-0 text-sm"
          >
            {item.image && (
              <div
                className="w-12 h-14 bg-paper-200 bg-cover bg-center flex-shrink-0 rounded-[2px]"
                style={{ backgroundImage: `url("${item.image}")` }}
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-ink-900 truncate">{item.title}</p>
              <p className="text-[11px] text-ink-500">
                {[item.color, item.size].filter(Boolean).join(' · ')} · ×
                {item.quantity}
              </p>
            </div>
            <span className="text-ink-900 flex-shrink-0">
              {formatARS(item.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>
      <div className="px-5 py-3 bg-paper-100 space-y-1 text-sm">
        <div className="flex justify-between text-ink-500">
          <span>Subtotal</span>
          <span>{formatARS(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-ink-500">
          <span>Envío</span>
          <span>{order.shipping_cost === 0 ? 'Gratis' : formatARS(order.shipping_cost)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-rust-500">
            <span>Descuento</span>
            <span>−{formatARS(order.discount)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-[var(--color-border)] pt-2 mt-1">
          <span className="font-medium text-ink-900">Total</span>
          <span className="font-bold text-ink-900">{formatARS(order.total)}</span>
        </div>
      </div>
    </section>
  );
}

function SupportSection() {
  return (
    <section className="text-center pt-6 border-t border-[var(--color-border)]">
      <p className="text-caption text-ink-500 mb-3">¿Algo no anda?</p>
      <p className="text-body-sm text-ink-500 mb-5">
        Escribinos y lo resolvemos.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="https://wa.me/5492974737664"
          className="text-[11px] font-semibold uppercase tracking-widest text-ink-900 underline hover:text-rust-500"
        >
          WhatsApp
        </Link>
        <span className="text-ink-300">·</span>
        <Link
          href="mailto:emma.irusta@hotmail.com"
          className="text-[11px] font-semibold uppercase tracking-widest text-ink-900 underline hover:text-rust-500"
        >
          Email
        </Link>
        <span className="text-ink-300">·</span>
        <Link
          href="/cambios"
          className="text-[11px] font-semibold uppercase tracking-widest text-ink-900 underline hover:text-rust-500"
        >
          Política de cambios
        </Link>
      </div>
    </section>
  );
}
