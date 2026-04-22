import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';

export const metadata = {
  title: 'Serigrafía · Taller a pedido',
  description:
    'Estampado artesanal a pedido desde Comodoro Rivadavia. Serigrafía sobre indumentaria, bolsas, afiches y piezas únicas.',
};

const processSteps = [
  {
    num: '01',
    title: 'Contanos la idea',
    desc: 'Escribinos por WhatsApp con el diseño, la prenda o el soporte que tenés en mente. Aceptamos bocetos, referencias, archivos finales.',
  },
  {
    num: '02',
    title: 'Pasamos presupuesto',
    desc: 'En menos de 24 hs te devolvemos el costo total y los tiempos. Trabajamos con minis desde 20 piezas.',
  },
  {
    num: '03',
    title: 'Preparamos las mallas',
    desc: 'Revelamos los fotolitos y montamos las mallas. Usamos tintas al agua, base acrílica para algodón, plastisol para prendas sintéticas.',
  },
  {
    num: '04',
    title: 'Estampamos y entregamos',
    desc: 'Pulpo manual de 4 brazos. Cada pieza pasa por secadero propio. Coordinamos entrega local o envío a toda Argentina.',
  },
];

const tallerSpecs = [
  { label: 'Pulpo', value: 'Manual 4 brazos' },
  { label: 'Soportes', value: 'Remeras · buzos · tote bags · afiches · stickers' },
  { label: 'Tintas', value: 'Base agua · plastisol · metálicas' },
  { label: 'Tiradas', value: 'Desde 20 piezas · máx 500 por corrida' },
  { label: 'Origen', value: 'Comodoro Rivadavia · Chubut' },
  { label: 'Envío', value: 'Toda Argentina · retiro local' },
];

export default function SerigrafiaPage() {
  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1">
        {/* Banner — full-bleed editorial, más alto para ver más imagen */}
        <section
          className="relative w-screen left-1/2 -translate-x-1/2 flex items-center justify-center overflow-hidden border-b border-ink-700 bg-ink-900"
          style={{
            aspectRatio: '16/9',
            minHeight: '340px',
            maxHeight: '620px',
            backgroundImage:
              'linear-gradient(180deg, rgba(14,14,14,0.45) 0%, rgba(14,14,14,0.75) 100%), url("/images/recursos/serigrafía - horizontal.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
          }}
        >
          <div className="relative text-center px-4 py-6 max-w-[42rem] text-paper-100">
            <p className="text-caption text-rust-200 mb-3">Taller a pedido</p>
            <h1 className="text-display-lg m-0 mb-4" style={{ textShadow: 'var(--text-shadow-inverse)' }}>
              Serigrafía desde el sur
            </h1>
            <p className="text-body md:text-body-lg text-white/90 max-w-[32rem] mx-auto">
              Estampamos sobre remeras, buzos, bolsas, afiches y lo que se te ocurra.
              Tiradas cortas, bien hechas, desde Comodoro Rivadavia.
            </p>
          </div>
        </section>

        {/* Intro — más aire lateral y tamaño más contenido */}
        <section className="py-10 lg:py-12 px-8 md:px-12 lg:px-16 max-w-[36rem] mx-auto text-center">
          <p className="text-ink-500 leading-relaxed m-0"
            style={{ fontSize: 'clamp(0.95rem, 0.4vw + 0.85rem, 1.0625rem)' }}
          >
            Hace cuatro años laburamos serigrafía como oficio. Empezamos con ROOTS LIFE y
            desde el primer día también tomamos encargos: para bandas, marcas emergentes,
            emprendimientos locales y gente que quiere algo real. Si tu idea merece quedar
            estampada, te ayudamos.
          </p>
        </section>

        {/* Process */}
        <section className="py-6 lg:py-12 px-4 md:px-8 lg:px-12 max-w-[75rem] mx-auto">
          <div className="text-center mb-10">
            <p className="text-caption text-ink-500 mb-2">El proceso</p>
            <h2 className="text-h2 m-0">Así trabajamos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
            {processSteps.map((step) => (
              <div key={step.num} className="bg-paper-100 border border-[var(--color-border)] rounded-[4px] p-5 lg:p-6 shadow-sm">
                <p className="font-display font-normal text-3xl lg:text-4xl leading-none text-ink-300 mb-4 tracking-tight">{step.num}</p>
                <h3 className="text-caption text-ink-900 mb-2">{step.title}</h3>
                <p className="text-body-sm text-ink-500 leading-relaxed m-0">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Taller — invertido dark */}
        <section className="bg-ink-900 text-paper-100 halftone-dark py-16 lg:py-16 px-4 md:px-8 lg:px-12">
          <div className="max-w-[75rem] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-16 items-center">
            <div
              className="bg-ink-700 bg-cover bg-center rounded-[2px] shadow-md"
              style={{
                aspectRatio: '4/5',
                backgroundImage: 'url("/images/recursos/serigrafía - vertical.webp")',
              }}
              role="img"
              aria-label="Taller de serigrafía ROOTS"
            />
            <div className="flex flex-col gap-5">
              <p className="text-caption text-rust-200 m-0">El taller</p>
              <h2 className="text-display-lg text-paper-100 m-0" style={{ textShadow: 'var(--text-shadow-inverse)' }}>
                Serigrafía con paciencia
              </h2>
              <p className="text-body lg:text-body-lg text-white/90 leading-relaxed m-0">
                Trabajamos en un espacio pequeño, con pulpo manual de cuatro brazos y
                secadero propio. No hacemos producciones masivas: preferimos pocas piezas
                bien estampadas antes que volumen sin alma.
              </p>
              <p className="text-body lg:text-body-lg text-white/90 leading-relaxed m-0">
                Atendemos a marcas emergentes, bandas, talleres, emprendimientos locales y
                encargos personales. Si viene de alguien que quiere hacer algo real, nos
                gusta.
              </p>
              <ul className="list-none p-0 m-0 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-3 md:gap-x-5 border-t border-ink-700 pt-4 mt-2">
                {tallerSpecs.map((spec) => (
                  <li key={spec.label}>
                    <strong className="block text-[9px] md:text-[10px] font-medium uppercase tracking-widest text-white/90 mb-1 opacity-80">
                      {spec.label}
                    </strong>
                    <span className="text-body-sm text-paper-100">{spec.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA strip */}
        <section className="py-12 lg:py-12 px-4 md:px-8 lg:px-12 text-center">
          <div className="max-w-[42rem] mx-auto">
            <h2 className="text-display-lg m-0 mb-4">¿Tenés una idea? Contanos.</h2>
            <p className="text-body-lg text-ink-500 mb-6 max-w-[36ch] mx-auto">
              Escribinos por WhatsApp y pasamos presupuesto en menos de 24 hs.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button href="https://wa.me/5492974000000" variant="accent" size="lg">
                Escribir por WhatsApp →
              </Button>
              <Button href="https://instagram.com/rootslife.cr" variant="outline" size="lg">
                Ver nuestros trabajos
              </Button>
            </div>
            <p className="text-stamp text-ink-500 mt-6">
              Comodoro Rivadavia · Chubut · Patagonia · Atendemos a toda Argentina
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
