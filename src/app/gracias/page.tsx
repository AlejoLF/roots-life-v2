import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { getSupabaseAdmin } from '@/lib/supabase';

export const metadata = {
  title: '¡Gracias!',
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ order?: string; status?: string }>;
};

function formatARS(n: number) {
  return '$' + n.toLocaleString('es-AR');
}

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
  total: number;
  subtotal: number;
  shipping_cost: number;
  discount: number;
  created_at: string;
  shipping_address: {
    firstName?: string;
    lastName?: string;
    email?: string;
    city?: string;
    province?: string;
  } | null;
};

export default async function GraciasPage({ searchParams }: Props) {
  const params = await searchParams;
  const token = params.order;
  const isPending = params.status === 'pending';

  let order: OrderRow | null = null;
  if (token) {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from('orders')
      .select(
        'id, tracking_token, status, items, total, subtotal, shipping_cost, discount, created_at, shipping_address',
      )
      .eq('tracking_token', token)
      .maybeSingle();
    order = data as OrderRow | null;
  }

  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1 bg-paper-100">
        <div className="max-w-[42rem] mx-auto px-4 md:px-8 py-10 lg:py-16">
          {!order ? (
            <NoOrderState />
          ) : (
            <>
              <SuccessHeader order={order} isPending={isPending} />
              <OrderSummary order={order} />
              <TimelineCard isPending={isPending} />
              <NextSteps order={order} />
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function NoOrderState() {
  return (
    <div className="text-center">
      <p className="text-caption text-ink-500 mb-3">No encontramos el pedido</p>
      <h1 className="text-display-lg m-0 mb-4">Algo pasó</h1>
      <p className="text-body text-ink-500 mb-8">
        No pudimos cargar los datos de tu orden. Si ya pagaste, revisá tu email
        — te vamos a mandar la confirmación igual.
      </p>
      <Button href="/" variant="dark" size="md">
        Volver al inicio
      </Button>
    </div>
  );
}

function SuccessHeader({ order, isPending }: { order: OrderRow; isPending: boolean }) {
  return (
    <div className="text-center mb-10">
      <p className="text-caption text-rust-500 mb-3">
        {isPending ? '⏱ Pago pendiente' : '✓ ¡Gracias por tu compra!'}
      </p>
      <h1 className="text-display-lg m-0 mb-3">
        {isPending ? 'Procesando tu pago' : 'Tu pedido está en camino'}
      </h1>
      <p className="text-body text-ink-500 leading-relaxed">
        Pedido{' '}
        <span className="font-mono text-ink-900">#{order.id.slice(0, 8)}</span>
        {order.shipping_address?.email && (
          <>
            {' '}· Te mandamos el detalle a{' '}
            <strong className="text-ink-900">
              {order.shipping_address.email}
            </strong>
          </>
        )}
      </p>
    </div>
  );
}

function OrderSummary({ order }: { order: OrderRow }) {
  return (
    <section className="bg-white border border-[var(--color-border)] rounded-[4px] overflow-hidden mb-6">
      <div className="px-5 py-4 border-b border-[var(--color-border)]">
        <h2 className="text-caption text-ink-500">Resumen del pedido</h2>
      </div>
      <ul className="list-none p-0 m-0">
        {order.items.map((item, i) => (
          <li
            key={i}
            className="px-5 py-4 flex items-center gap-3 border-b border-[var(--color-border)] last:border-b-0 text-sm"
          >
            {item.image && (
              <div
                className="w-14 h-16 bg-paper-200 bg-cover bg-center flex-shrink-0 rounded-[2px]"
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
      <div className="px-5 py-4 bg-paper-100 space-y-2 text-sm">
        <div className="flex justify-between text-ink-500">
          <span>Subtotal</span>
          <span>{formatARS(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-ink-500">
          <span>Envío</span>
          <span>
            {order.shipping_cost === 0 ? 'Gratis' : formatARS(order.shipping_cost)}
          </span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-rust-500">
            <span>Descuento</span>
            <span>−{formatARS(order.discount)}</span>
          </div>
        )}
        <div className="flex justify-between items-baseline border-t border-[var(--color-border)] pt-2 mt-2">
          <span className="text-base font-medium text-ink-900">Total</span>
          <span className="text-xl font-bold text-ink-900">
            {formatARS(order.total)}
          </span>
        </div>
      </div>
    </section>
  );
}

function TimelineCard({ isPending }: { isPending: boolean }) {
  const steps = [
    {
      title: 'Pago recibido',
      desc: isPending
        ? 'Estamos esperando confirmación de MercadoPago (suele ser instantánea para tarjetas, hasta 2 hs para efectivo).'
        : 'Tu pago fue confirmado y registrado.',
      status: isPending ? 'pending' : 'done',
    },
    {
      title: 'Preparación',
      desc: 'Preparamos tu pedido en el taller. 1-3 días hábiles.',
      status: 'waiting',
    },
    {
      title: 'Despacho + tracking',
      desc: 'Recibís un email con el código de seguimiento de Mercado Envíos.',
      status: 'waiting',
    },
    {
      title: 'Entrega',
      desc: 'Tiempos según tu zona. Podés consultar el tracking en cualquier momento.',
      status: 'waiting',
    },
  ] as const;

  return (
    <section className="bg-ink-900 text-paper-100 rounded-[4px] p-6 mb-6">
      <p className="text-caption text-rust-200 mb-5">Qué sigue</p>
      <ol className="list-none p-0 m-0 flex flex-col gap-5">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-4">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                step.status === 'done'
                  ? 'bg-rust-500 text-paper-100'
                  : step.status === 'pending'
                    ? 'bg-white/15 text-paper-100 border border-rust-200'
                    : 'bg-white/10 text-white/60'
              }`}
            >
              {step.status === 'done' ? '✓' : i + 1}
            </div>
            <div className="flex-1">
              <p
                className={`font-medium ${step.status === 'waiting' ? 'text-white/80' : 'text-paper-100'}`}
              >
                {step.title}
              </p>
              <p className="text-sm text-white/70 mt-1">{step.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function NextSteps({ order }: { order: OrderRow }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Button
        href={`/seguir/${order.tracking_token}`}
        variant="accent"
        size="md"
      >
        Seguir mi pedido →
      </Button>
      <Button href="/catalogo" variant="outline" size="md">
        Seguir comprando
      </Button>
    </div>
  );
}
