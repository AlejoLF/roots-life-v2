import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';

export const metadata = {
  title: 'Historia',
  description:
    'La historia de ROOTS LIFE — indumentaria urbana nacida en Comodoro Rivadavia. Patagonia, viento, calle y símbolos propios.',
};

const symbols = [
  { glyph: '✷', name: 'Pegaso', desc: 'Libertad sin perder el rumbo. La cápsula 22 22.' },
  { glyph: '☼', name: 'Atardecer', desc: 'La hora dorada de la costa. Serie South Coast.' },
  { glyph: '⛰', name: 'Cerro Chenque', desc: 'El hito de la ciudad. Punto de referencia.' },
  { glyph: '⟡', name: 'Mate', desc: 'Ritual diario. La pausa del sur.' },
  { glyph: '▲', name: 'Viento', desc: 'Constante. Lo que moldea la geografía.' },
];

const principles = [
  'Ropa para quien vive.',
  'Ediciones cortas, nunca masivas.',
  'El origen como identidad.',
  'Serigrafía a mano, siempre.',
];

const backstage = [
  { src: '/images/comodoro/ola.webp', alt: 'Ola rompiendo en la costanera', size: 'tall' },
  { src: '/images/recursos/serigrafía - horizontal.webp', alt: 'Pantalla de serigrafía', size: 'default' },
  { src: '/images/comodoro/ig-03.webp', alt: 'Panorámica de la playa', size: 'default' },
  { src: '/images/recursos/serigrafía - vertical.webp', alt: 'Estampado en prensa', size: 'tall' },
  { src: '/images/comodoro/ig-02.webp', alt: 'Shipwreck al atardecer', size: 'default' },
  { src: '/images/comodoro/ig-01.webp', alt: 'Muelle desde abajo', size: 'default' },
];

export default function HistoriaPage() {
  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1">
        {/* Hero — full-bleed con atardecer */}
        <section
          className="relative w-screen left-1/2 -translate-x-1/2 flex items-end min-h-[60vh] lg:min-h-[80vh] py-12 px-4 lg:py-16 lg:px-12 text-paper-100 overflow-hidden"
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(14,14,14,0.25) 0%, rgba(14,14,14,0.85) 100%), url("/images/comodoro/hero-desktop.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center 45%',
            filter: 'saturate(0.92) contrast(1.05)',
          }}
        >
          {/* Halftone */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(247,243,234,0.05) 1px, transparent 1px)',
              backgroundSize: '6px 6px',
            }}
            aria-hidden="true"
          />
          <div className="relative max-w-[75rem] w-full mx-auto">
            <p className="text-caption text-rust-200 mb-3">Nuestra historia</p>
            <h1
              className="font-display font-black uppercase text-paper-100 m-0 mb-5 max-w-[18ch]"
              style={{
                fontSize: 'clamp(2rem, 5vw + 0.5rem, 4rem)',
                lineHeight: 1,
                letterSpacing: '-0.025em',
                textShadow: 'var(--text-shadow-inverse)',
              }}
            >
              Nacidos<br />en el sur
            </h1>
            <p className="text-white/90 leading-relaxed max-w-[40ch] mb-8"
              style={{ fontSize: 'clamp(0.95rem, 0.5vw + 0.85rem, 1.05rem)' }}
            >
              ROOTS LIFE nace en Comodoro Rivadavia. Entre el viento, la costa y el cerro
              — un lenguaje urbano con raíces patagónicas.
            </p>
            <p className="text-stamp text-white/85">
              Chubut · Patagonia · Estd 2024
            </p>
          </div>
        </section>

        {/* Manifesto */}
        <section className="py-16 lg:py-16 px-4 md:px-8 max-w-[42rem] mx-auto">
          <p className="text-caption text-ink-500 mb-4 text-center">Manifiesto</p>
          <p className="text-display-lg text-ink-900 text-center mb-8" style={{ textShadow: 'var(--text-shadow-soft)' }}>
            Construimos símbolos.
          </p>
          <p className="text-body lg:text-body-lg text-ink-500 leading-relaxed mb-6">
            ROOTS LIFE nace en el sur — viento, costa y cerro. Una marca que no busca
            lujo ni hype, sino pertenencia: ropa para quien vive con identidad propia,
            valora el origen y se mueve entre lo urbano y lo natural.
          </p>
          <p className="text-body lg:text-body-lg text-ink-500 leading-relaxed">
            Trabajamos con ediciones cortas, serigrafía a mano y símbolos que crecen desde
            lo cotidiano. Cada pieza tiene que poder contar lo que ya sentís — sin
            explicación.
          </p>
        </section>

        {/* Quote strip */}
        <section
          className="relative w-screen left-1/2 -translate-x-1/2 flex items-center min-h-[40vh] lg:min-h-[50vh] py-16 lg:py-16 px-4 lg:px-12 text-paper-100 overflow-hidden"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(90deg, rgba(14,14,14,0.75) 0%, rgba(14,14,14,0.45) 100%), url("/images/comodoro/cerro-antiguo.webp")',
              backgroundSize: 'cover',
              backgroundPosition: 'center 40%',
            }}
            aria-hidden="true"
          />
          <div className="relative max-w-[90rem] mx-auto px-4 text-center">
            <p className="text-caption text-rust-200 mb-4">Desde el sur</p>
            <p
              className="font-display font-normal uppercase text-paper-100 m-0 tracking-tight"
              style={{
                fontSize: 'clamp(1.15rem, 3.4vw, 1.85rem)',
                lineHeight: 1.2,
                textShadow: 'var(--text-shadow-inverse)',
              }}
            >
              El sur, no es un lugar.
              <br />
              Es una forma de estar parado.
            </p>
          </div>
        </section>

        {/* Symbols grid */}
        <section className="py-16 lg:py-16 px-4 md:px-8 lg:px-12 max-w-[75rem] mx-auto">
          <div className="text-center mb-10">
            <p className="text-caption text-ink-500 mb-2">Los símbolos</p>
            <h2 className="text-h2 m-0">Vocabulario visual</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
            {symbols.map((s) => (
              <div key={s.name} className="bg-paper-100 border border-[var(--color-border)] rounded-[4px] p-5 text-center">
                <p className="text-4xl lg:text-5xl mb-3 text-ink-900">{s.glyph}</p>
                <p className="text-caption text-ink-900 mb-1">{s.name}</p>
                <p className="text-body-sm text-ink-500 m-0">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Philosophy — invertido */}
        <section className="bg-ink-900 text-paper-100 halftone-dark py-16 lg:py-16 px-4 md:px-8 lg:px-12">
          <div className="max-w-[75rem] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-16 items-center">
            <div>
              <p className="text-caption text-rust-200 mb-4">Filosofía</p>
              <p
                className="font-display font-bold uppercase text-paper-100 leading-tight mb-6"
                style={{
                  fontSize: 'clamp(1.1rem, 2.2vw + 0.6rem, var(--text-xl))',
                  textShadow: 'var(--text-shadow-inverse)',
                }}
              >
                Si el diseño necesita explicación,<br />no está terminado.
              </p>
              <p className="text-body-lg text-white/90 leading-relaxed max-w-[42ch]">
                Cada pieza se piensa desde lo cotidiano. Un símbolo vale cuando la gente
                lo reconoce como propio sin que nadie se lo tenga que explicar.
              </p>
            </div>
            <ul className="list-none m-0 p-0 grid grid-cols-1 gap-2">
              {principles.map((p, i) => (
                <li key={i} className="flex items-start gap-3 p-3 border border-ink-700 rounded-[2px] text-[11px] lg:text-xs font-medium uppercase tracking-wider text-white/90">
                  <span className="text-rust-500 font-semibold flex-shrink-0">0{i + 1}</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Backstage grid */}
        <section className="py-16 lg:py-16 px-4 md:px-8 lg:px-12 max-w-[75rem] mx-auto">
          <div className="text-center mb-8">
            <p className="text-caption text-ink-500 mb-2">Backstage</p>
            <h2 className="text-h2 m-0">Detrás de cada pieza</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3 auto-rows-[180px] md:auto-rows-[220px] lg:auto-rows-[260px]">
            {backstage.map((tile, i) => (
              <div
                key={i}
                role="img"
                aria-label={tile.alt}
                className={`backstage-tile ${tile.size === 'tall' ? 'row-span-2' : ''}`}
                style={{ backgroundImage: `url("${tile.src}")` }}
              />
            ))}
          </div>
        </section>

        {/* Closing */}
        <section className="bg-ink-900 text-paper-100 halftone-dark py-16 lg:py-16 px-4 md:px-8 lg:px-12 text-center">
          <div className="max-w-[42rem] mx-auto">
            <p
              className="font-display font-bold uppercase text-paper-100 leading-tight mb-8"
              style={{
                fontSize: 'clamp(1.5rem, 3vw + 1rem, 3rem)',
                textShadow: 'var(--text-shadow-inverse)',
              }}
            >
              Real Stories.<br />Real clothes.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button href="/catalogo" variant="primary" size="lg">Ver colección →</Button>
              <Button href="/serigrafia" variant="ghost-inverse" size="lg">Conocer el taller</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
