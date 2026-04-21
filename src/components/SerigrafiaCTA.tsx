import { Button } from './Button';

type SerigrafiaCTAProps = {
  caption?: string;
  title?: string;
  body?: string;
  ctaText?: string;
  ctaHref?: string;
};

/**
 * Serigrafía CTA — sección invertida dark compacta.
 * Centered, prose narrow, CTA acento rust.
 */
export function SerigrafiaCTA({
  caption = 'Taller de serigrafía',
  title = '¿Querés estampar tu propia idea?',
  body = 'Trabajamos sobre pedido desde el sur. Contanos qué necesitás y te armamos un presupuesto.',
  ctaText = 'Conocer el taller',
  ctaHref = '/serigrafia',
}: SerigrafiaCTAProps) {
  return (
    <section
      id="serigrafia"
      aria-labelledby="seri-title"
      className="bg-ink-900 text-paper-100 py-12 px-4 lg:py-12 lg:px-8 text-center"
    >
      <div className="max-w-[42rem] mx-auto">
        <p className="text-caption text-rust-300 mb-3">{caption}</p>
        <h2 id="seri-title" className="text-display-lg text-paper-100 mb-4"
          style={{ textShadow: 'var(--text-shadow-inverse)' }}
        >
          {title}
        </h2>
        <p className="text-body-lg text-paper-200 leading-relaxed mb-6">{body}</p>
        <Button href={ctaHref} variant="accent" size="md">
          {ctaText} <span aria-hidden>→</span>
        </Button>
      </div>
    </section>
  );
}
