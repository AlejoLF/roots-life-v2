import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';

export const metadata = {
  title: 'Cambios y devoluciones',
  description:
    'Política de cambios y devoluciones de ROOTS LIFE. 15 días desde recibir el producto.',
};

export default function CambiosPage() {
  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1 bg-paper-100">
        <article className="max-w-[42rem] mx-auto px-4 md:px-8 py-10 lg:py-16">
          <p className="text-caption text-ink-500 mb-2">Información</p>
          <h1 className="text-display-lg m-0 mb-4">Cambios y devoluciones</h1>
          <p className="text-body text-ink-700 leading-relaxed mb-10">
            Queremos que te llegue lo que esperabas. Si algo no te cierra,
            tenés tiempo.
          </p>

          <Section title="Plazo">
            <p>
              Aceptamos cambios y devoluciones dentro de los{' '}
              <strong>15 días corridos</strong> desde la recepción del producto.
            </p>
            <p>
              Adicionalmente, como consumidor tenés{' '}
              <strong>10 días hábiles de arrepentimiento</strong> por la Ley
              24.240 artículo 34, sin necesidad de expresar causa.
            </p>
          </Section>

          <Section title="Requisitos">
            <p>El producto debe estar:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sin uso ni lavado</li>
              <li>Con etiqueta original colocada</li>
              <li>En su empaque original cuando aplique</li>
              <li>Sin olores (perfume, cigarrillo, etc)</li>
            </ul>
          </Section>

          <Section title="Cómo iniciar un cambio">
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                Escribinos por{' '}
                <a
                  href="https://wa.me/5492974737664"
                  target="_blank"
                  rel="noopener"
                  className="text-ink-900 underline hover:text-rust-500"
                >
                  WhatsApp
                </a>{' '}
                o email a{' '}
                <a
                  href="mailto:emma.irusta@hotmail.com"
                  className="text-ink-900 underline hover:text-rust-500"
                >
                  emma.irusta@hotmail.com
                </a>{' '}
                con tu número de pedido.
              </li>
              <li>Te indicamos la dirección de devolución.</li>
              <li>
                Hacés el envío — el costo del envío de devolución corre por tu
                cuenta, salvo en defectos de fábrica o error nuestro.
              </li>
              <li>
                Revisamos el producto al recibirlo (1-2 días hábiles).
              </li>
              <li>Coordinamos el cambio o procesamos el reintegro.</li>
            </ol>
          </Section>

          <Section title="Reintegros">
            <p>
              Si la devolución se acepta, el reintegro se hace al mismo medio de
              pago utilizado en la compra, en un plazo de hasta{' '}
              <strong>10 días hábiles</strong> desde que recibimos y verificamos
              el producto.
            </p>
          </Section>

          <Section title="Defectos de fábrica">
            <p>
              Si recibiste un producto con defecto, nos hacemos cargo del envío
              de devolución y te reponemos por otro en perfecto estado o
              reintegramos el importe total, a tu elección.
            </p>
          </Section>

          <div className="mt-10 pt-6 border-t border-[var(--color-border)]">
            <p className="text-body-sm text-ink-500 mb-4">
              Para todos los detalles legales, consultá los{' '}
              <a
                href="/terminos"
                className="text-ink-900 underline hover:text-rust-500"
              >
                términos y condiciones
              </a>
              .
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                href="https://wa.me/5492974737664"
                variant="accent"
                size="md"
              >
                Iniciar cambio por WhatsApp →
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
