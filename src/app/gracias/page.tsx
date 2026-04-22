import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';

export const metadata = {
  title: '¡Gracias!',
  robots: 'noindex',
};

function formatARS(n: number) {
  return '$' + n.toLocaleString('es-AR');
}

const timeline = [
  {
    id: 'confirmado',
    num: '01',
    title: 'Pedido confirmado',
    date: 'Hace un momento',
    desc: 'Recibimos tu compra y la confirmación del pago. Te mandamos el mail con el detalle.',
    status: 'done' as const,
  },
  {
    id: 'procesando',
    num: '02',
    title: 'Procesando',
    date: 'En las próximas 24 hs',
    desc: 'Preparamos tu pedido: estampamos, doblamos y empaquetamos con cuidado en el taller.',
    status: 'active' as const,
  },
  {
    id: 'enviado',
    num: '03',
    title: 'En camino',
    date: 'Estimado: 5-7 días hábiles',
    desc: 'Te mandamos el código de seguimiento por mail y WhatsApp apenas despachemos.',
    status: 'pending' as const,
  },
];

export default function GraciasPage() {
  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1">
        {/* Progress completo */}
        <div className="max-w-[75rem] mx-auto px-4 md:px-8 lg:px-12 pt-10 lg:pt-16">
          <div className="flex items-center gap-2 flex-wrap justify-center text-[10px] font-medium uppercase tracking-widest text-ink-300 mb-8">
            <span className="inline-flex items-center gap-2 text-ink-700">
              <span className="w-[22px] h-[22px] flex items-center justify-center rounded-full bg-ink-900 text-paper-100 border border-ink-900">1</span>
              Carrito
            </span>
            <span className="w-7 h-px bg-ink-200" />
            <span className="inline-flex items-center gap-2 text-ink-700">
              <span className="w-[22px] h-[22px] flex items-center justify-center rounded-full bg-ink-900 text-paper-100 border border-ink-900">2</span>
              Datos y pago
            </span>
            <span className="w-7 h-px bg-ink-200" />
            <span className="inline-flex items-center gap-2 text-moss-500">
              <span className="w-[22px] h-[22px] flex items-center justify-center rounded-full bg-moss-500 text-paper-100 border border-moss-500">3</span>
              Confirmación
            </span>
          </div>
        </div>

        {/* Hero de confirmación */}
        <section className="max-w-[42rem] mx-auto px-4 md:px-8 lg:px-12 pt-6 pb-10 text-center">
          <div className="w-[72px] h-[72px] mx-auto mb-5 rounded-full bg-moss-500 text-paper-100 flex items-center justify-center shadow-md animate-[popIn_500ms_ease-out]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-caption text-ink-500 mb-2">Pedido confirmado</p>
          <h1 className="text-display-lg m-0 mb-4">¡Gracias por tu compra!</h1>
          <p className="text-body text-ink-500 mb-5 max-w-[42ch] mx-auto">
            Recibimos tu pedido y lo estamos preparando con cuidado desde el taller.
            Te mandamos la confirmación por mail.
          </p>

          <div className="inline-flex items-center gap-3 px-5 py-3 bg-paper-200 rounded-[4px] text-sm text-ink-700">
            Nº de pedido:
            <strong className="text-lg font-display tracking-wide text-ink-900">RL-2026-0847</strong>
          </div>

          <p className="text-body-sm text-ink-500 mt-4 m-0">
            Confirmación enviada a <strong className="text-ink-900 font-medium">alejo@email.com</strong>
          </p>
        </section>

        {/* Detalle del pedido */}
        <section className="max-w-[60rem] mx-auto px-4 md:px-8 lg:px-12 mb-10">
          <div className="bg-paper-100 border border-[var(--color-border)] rounded-[4px] shadow-sm p-5 md:p-6">
            <h2 className="text-caption text-ink-500 pb-3 border-b border-[var(--color-border)] mb-4">Detalle del pedido</h2>
            <ul className="list-none m-0 p-0 flex flex-col gap-4 mb-4">
              <li className="grid grid-cols-[56px_1fr_auto] md:grid-cols-[64px_1fr_auto] gap-3 items-center">
                <div className="relative w-14 md:w-16 h-[70px] md:h-20 bg-cover bg-center rounded-[2px]" style={{ backgroundImage: 'url("/images/remeras/Numerología/Numerología - Pegasus 2222 - negra.webp")' }}>
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-ink-900 text-paper-100 text-[11px] font-medium flex items-center justify-center">1</span>
                </div>
                <div>
                  <p className="text-caption text-ink-500 m-0">Numerología 22 22</p>
                  <p className="text-body-sm font-medium m-0">Pegasus 2222</p>
                  <p className="text-body-sm text-ink-500 m-0">Negro · M</p>
                </div>
                <p className="text-body-sm font-medium m-0">{formatARS(24000)}</p>
              </li>
              <li className="grid grid-cols-[56px_1fr_auto] md:grid-cols-[64px_1fr_auto] gap-3 items-center">
                <div className="relative w-14 md:w-16 h-[70px] md:h-20 bg-cover bg-center rounded-[2px]" style={{ backgroundImage: 'url("/images/remeras/South Coast/South Coast - No bad days.webp")' }}>
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-ink-900 text-paper-100 text-[11px] font-medium flex items-center justify-center">1</span>
                </div>
                <div>
                  <p className="text-caption text-ink-500 m-0">South Coast Series</p>
                  <p className="text-body-sm font-medium m-0">No Bad Days</p>
                  <p className="text-body-sm text-ink-500 m-0">Crema · L</p>
                </div>
                <p className="text-body-sm font-medium m-0">{formatARS(24000)}</p>
              </li>
            </ul>

            <div className="border-t border-[var(--color-border)] pt-4 flex flex-col gap-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatARS(48000)}</span></div>
              <div className="flex justify-between text-ink-500"><span>Envío · Correo estándar</span><span>{formatARS(4500)}</span></div>
              <div className="flex justify-between text-moss-500"><span>Descuento (transferencia)</span><span>−{formatARS(4800)}</span></div>
              <div className="flex justify-between items-baseline border-t border-[var(--color-border)] pt-3 mt-1">
                <span className="text-body font-medium">Total pagado</span>
                <span className="text-h3 font-semibold">{formatARS(47700)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline oscuro */}
        <section className="bg-ink-900 text-paper-100 halftone-dark py-12 lg:py-16 px-4 md:px-8 lg:px-12">
          <div className="max-w-[75rem] mx-auto">
            <div className="text-center mb-10">
              <p className="text-caption text-rust-200 mb-2">Próximos pasos</p>
              <h2 className="text-display-lg m-0" style={{ textShadow: 'var(--text-shadow-inverse)' }}>
                Qué sigue
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {timeline.map((step) => (
                <div
                  key={step.id}
                  className={`p-4 lg:p-6 border rounded-[4px] ${
                    step.status === 'active'
                      ? 'border-rust-500 bg-ink-700'
                      : 'border-ink-700'
                  }`}
                >
                  <p className={`text-[10px] font-medium uppercase tracking-widest mb-3 ${step.status === 'active' ? 'text-rust-500' : step.status === 'done' ? 'text-moss-500' : 'text-white/80'}`}>
                    {step.num}
                    {step.status === 'done' && ' ✓'}
                    {step.status === 'active' && ' · Procesando'}
                  </p>
                  <h3 className="text-h3 text-paper-100 m-0 mb-2">{step.title}</h3>
                  <p className="text-body-sm text-white/80 m-0 mb-3">{step.date}</p>
                  <p className="text-body-sm text-white/90 m-0">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTAs finales */}
        <section className="py-12 lg:py-12 px-4 md:px-8 lg:px-12 text-center">
          <div className="max-w-[42rem] mx-auto flex flex-wrap gap-3 justify-center">
            <Button href="/catalogo" variant="dark" size="lg">
              Seguir comprando →
            </Button>
            <Button href="https://wa.me/5492974000000" variant="outline" size="lg">
              Escribir por WhatsApp
            </Button>
          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.4); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
