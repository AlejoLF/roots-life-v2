import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';

export const metadata = {
  title: 'Contacto',
  description:
    'Escribinos. ROOTS LIFE desde Comodoro Rivadavia — Patagonia Argentina.',
};

export default function ContactoPage() {
  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1 bg-paper-100">
        <article className="max-w-[42rem] mx-auto px-4 md:px-8 py-10 lg:py-16">
          <p className="text-caption text-ink-500 mb-2">Contacto</p>
          <h1 className="text-display-lg m-0 mb-4">Escribinos</h1>
          <p className="text-body text-ink-700 leading-relaxed mb-10">
            Para consultas sobre productos, envíos, cambios o cualquier tema —
            estos son los canales que mantenemos activos.
          </p>

          {/* WhatsApp */}
          <ContactCard
            caption="Respuesta en el día"
            title="WhatsApp"
            description="Lo más rápido. Escribinos por WhatsApp y te respondemos en horario comercial."
            buttonText="Abrir WhatsApp →"
            buttonHref="https://wa.me/5492974737664"
            buttonVariant="accent"
          />

          {/* Email */}
          <ContactCard
            caption="Reclamos y consultas"
            title="Email"
            description="Para temas que necesitan quedar por escrito — reclamos, pedidos grandes, colaboraciones."
            buttonText="emma.irusta@hotmail.com"
            buttonHref="mailto:emma.irusta@hotmail.com"
            buttonVariant="outline"
          />

          {/* Instagram */}
          <ContactCard
            caption="Drops, novedades, detrás de escena"
            title="Instagram"
            description="Seguinos en @rootslife.cr para enterarte primero de nuevos lanzamientos."
            buttonText="Ir al perfil →"
            buttonHref="https://instagram.com/rootslife.cr"
            buttonVariant="dark"
          />

          {/* Taller de serigrafía */}
          <section className="mt-12 pt-10 border-t border-[var(--color-border)]">
            <p className="text-caption text-ink-500 mb-2">Serigrafía a pedido</p>
            <h2 className="text-h2 text-ink-900 mb-3">¿Querés estampar tu idea?</h2>
            <p className="text-body text-ink-700 leading-relaxed mb-5">
              También hacemos trabajos de serigrafía para marcas, bandas y
              proyectos. Tiradas desde 20 piezas, presupuesto en menos de 24hs.
            </p>
            <Button href="/serigrafia" variant="outline" size="md">
              Conocer el taller →
            </Button>
          </section>

          {/* Dirección */}
          <section className="mt-12 pt-10 border-t border-[var(--color-border)]">
            <p className="text-caption text-ink-500 mb-3">Dirección fiscal</p>
            <p className="text-body text-ink-700 leading-relaxed">
              Roots Life · CUIT 20-35908470-7
              <br />
              Av. Kennedy 2665 · Comodoro Rivadavia · Chubut
              <br />
              CP 9000 · Argentina
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}

function ContactCard({
  caption,
  title,
  description,
  buttonText,
  buttonHref,
  buttonVariant,
}: {
  caption: string;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  buttonVariant: 'primary' | 'accent' | 'outline' | 'dark' | 'ghost-inverse';
}) {
  return (
    <section className="bg-white border border-[var(--color-border)] rounded-[4px] p-6 mb-5">
      <p className="text-caption text-rust-500 mb-2">{caption}</p>
      <h2 className="font-display font-bold text-2xl uppercase mb-3">{title}</h2>
      <p className="text-body text-ink-700 leading-relaxed mb-5">{description}</p>
      <Button href={buttonHref} variant={buttonVariant} size="md">
        {buttonText}
      </Button>
    </section>
  );
}
