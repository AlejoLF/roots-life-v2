import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';

export const metadata = {
  title: 'Envíos',
  description:
    'Envíos a todo el país vía Mercado Envíos. Costos y tiempos se calculan en el checkout.',
};

export default function EnviosPage() {
  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1 bg-paper-100">
        <article className="max-w-[42rem] mx-auto px-4 md:px-8 py-10 lg:py-16">
          <p className="text-caption text-ink-500 mb-2">Información</p>
          <h1 className="text-display-lg m-0 mb-4">Envíos</h1>
          <p className="text-body text-ink-700 leading-relaxed mb-10">
            Enviamos a toda la Argentina. Las tarifas y tiempos se calculan
            automáticamente en el checkout según tu código postal.
          </p>

          <Section title="Cómo enviamos">
            <p>
              Trabajamos con <strong>Mercado Envíos</strong> — la logística de
              Mercado Pago. Llega a sucursal de correo o a domicilio, según
              elijas al finalizar la compra.
            </p>
          </Section>

          <Section title="Tiempos de entrega">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Comodoro Rivadavia y alrededores:</strong> 24-48 hs
              </li>
              <li>
                <strong>Chubut, Santa Cruz, Río Negro:</strong> 2-4 días hábiles
              </li>
              <li>
                <strong>Buenos Aires y resto del país:</strong> 4-7 días hábiles
              </li>
              <li>
                <strong>Zonas alejadas (Tierra del Fuego, Misiones, etc):</strong>{' '}
                7-12 días hábiles
              </li>
            </ul>
            <p className="text-body-sm text-ink-500 mt-3">
              Estos tiempos son orientativos; empiezan a correr una vez
              despachado el paquete, no desde que hiciste la compra. El tiempo
              de preparación es de 1-3 días hábiles.
            </p>
          </Section>

          <Section title="Seguimiento">
            <p>
              Apenas despachamos tu pedido recibís un email con el código de
              seguimiento. También lo podés ver en cualquier momento desde{' '}
              <a href="/mis-pedidos" className="text-ink-900 underline hover:text-rust-500">
                mi cuenta → mis pedidos
              </a>
              .
            </p>
          </Section>

          <Section title="Envío gratis">
            <p>
              Ocasionalmente hacemos promociones de envío gratis sobre cierto
              monto mínimo — se avisan en el sitio y por newsletter.
            </p>
          </Section>

          <div className="mt-10 pt-6 border-t border-[var(--color-border)]">
            <p className="text-body-sm text-ink-500 mb-4">
              Para todos los detalles legales del servicio, consultá los{' '}
              <a href="/terminos" className="text-ink-900 underline hover:text-rust-500">
                términos y condiciones
              </a>
              .
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/catalogo" variant="accent" size="md">
                Ir al catálogo →
              </Button>
              <Button href="/contacto" variant="outline" size="md">
                Consultar por WhatsApp
              </Button>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-h3 text-ink-900 mb-3 mt-8">{title}</h2>
      <div className="text-body text-ink-700 leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}
