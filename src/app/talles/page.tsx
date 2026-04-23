import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Guía de talles',
  description:
    'Medidas de remeras y buzos ROOTS LIFE. Corte oversize — elegí bien tu talle.',
};

const remerasData = [
  { size: 'XS', chest: 52, length: 70, shoulder: 47, sleeve: 22 },
  { size: 'S', chest: 54, length: 72, shoulder: 49, sleeve: 22 },
  { size: 'M', chest: 56, length: 74, shoulder: 51, sleeve: 23 },
  { size: 'L', chest: 58, length: 76, shoulder: 53, sleeve: 23 },
  { size: 'XL', chest: 60, length: 78, shoulder: 55, sleeve: 24 },
  { size: 'XXL', chest: 62, length: 80, shoulder: 57, sleeve: 24 },
];

const buzosData = [
  { size: 'XS', chest: 56, length: 68, shoulder: 52, sleeve: 62 },
  { size: 'S', chest: 58, length: 70, shoulder: 54, sleeve: 63 },
  { size: 'M', chest: 60, length: 72, shoulder: 56, sleeve: 64 },
  { size: 'L', chest: 62, length: 74, shoulder: 58, sleeve: 65 },
  { size: 'XL', chest: 64, length: 76, shoulder: 60, sleeve: 66 },
  { size: 'XXL', chest: 66, length: 78, shoulder: 62, sleeve: 67 },
];

export default function TallesPage() {
  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1 bg-paper-100">
        <article className="max-w-[48rem] mx-auto px-4 md:px-8 py-10 lg:py-16">
          <p className="text-caption text-ink-500 mb-2">Guía de talles</p>
          <h1 className="text-display-lg m-0 mb-4">Tu talle, sin vueltas</h1>
          <p className="text-body text-ink-700 leading-relaxed mb-10 max-w-[36rem]">
            Todas nuestras piezas tienen <strong>corte oversize</strong> —
            pensadas para caer holgadas, cómodas, con un largo más extendido
            que la medida clásica. Si preferís un fit más ajustado, podés elegir
            un talle por debajo del que te corresponde normalmente.
          </p>

          <CalloutCómo />

          <SizeTable title="Remeras" rows={remerasData} hasSleeve sleeveLabel="Manga" />
          <SizeTable title="Buzos" rows={buzosData} hasSleeve sleeveLabel="Manga" />

          <Section title="Cómo medir">
            <ol className="list-decimal pl-6 space-y-2 text-ink-700 text-body">
              <li>
                <strong>Pecho:</strong> medí una remera/buzo que te quede cómoda,
                apoyada plana sobre la mesa. Tomá la medida de axila a axila.
                Multiplicá por 2 para obtener el contorno total.
              </li>
              <li>
                <strong>Largo:</strong> desde la base del cuello (en la espalda)
                hasta el ruedo inferior.
              </li>
              <li>
                <strong>Hombro:</strong> de costura a costura de hombro, medido
                por la parte de atrás.
              </li>
              <li>
                <strong>Manga:</strong> desde la costura del hombro hasta el
                ruedo del puño.
              </li>
            </ol>
          </Section>

          <Section title="Cambios">
            <p className="text-ink-700">
              Si el talle no te cierra, aceptamos cambios dentro de los{' '}
              <strong>15 días</strong> desde la recepción, sin uso y con etiqueta
              original. Más detalles en nuestros{' '}
              <a
                href="/terminos#cambios"
                className="text-ink-900 underline hover:text-rust-500"
              >
                términos y condiciones
              </a>
              .
            </p>
          </Section>
        </article>
      </main>
      <Footer />
    </>
  );
}

function CalloutCómo() {
  return (
    <div className="bg-ink-900 text-paper-100 rounded-[4px] p-6 mb-10">
      <p className="text-caption text-rust-200 mb-2">Tip del fit</p>
      <p className="text-white/90 leading-relaxed">
        Oversize no es "enorme". Las medidas del pecho son <strong className="text-paper-100">4-6 cm mayores</strong> que una
        remera regular del mismo talle. El largo es <strong className="text-paper-100">4-6 cm más</strong> para que cubra
        mejor la cadera. Si sos alto, va por tu talle habitual. Si sos más bien
        compacto y querés el fit "drop shoulder", subí un talle.
      </p>
    </div>
  );
}

function SizeTable({
  title,
  rows,
  sleeveLabel = 'Manga',
}: {
  title: string;
  rows: { size: string; chest: number; length: number; shoulder: number; sleeve: number }[];
  hasSleeve?: boolean;
  sleeveLabel?: string;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-h3 text-ink-900 mb-4">{title}</h2>
      <p className="text-body-sm text-ink-500 mb-4">Medidas en centímetros (cm)</p>
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-ink-900 text-paper-100 text-[11px] uppercase tracking-widest">
              <th className="px-3 py-3 text-left">Talle</th>
              <th className="px-3 py-3 text-right">Pecho</th>
              <th className="px-3 py-3 text-right">Largo</th>
              <th className="px-3 py-3 text-right">Hombro</th>
              <th className="px-3 py-3 text-right">{sleeveLabel}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.size}
                className={`border-b border-[var(--color-border)] ${
                  i % 2 === 0 ? 'bg-white' : 'bg-paper-200'
                }`}
              >
                <td className="px-3 py-3 font-bold text-ink-900">{r.size}</td>
                <td className="px-3 py-3 text-right text-ink-700">{r.chest}</td>
                <td className="px-3 py-3 text-right text-ink-700">{r.length}</td>
                <td className="px-3 py-3 text-right text-ink-700">{r.shoulder}</td>
                <td className="px-3 py-3 text-right text-ink-700">{r.sleeve}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
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
