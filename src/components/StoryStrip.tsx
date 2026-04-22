import { Button } from './Button';

type StoryStripProps = {
  caption?: string;
  title?: string;
  body?: string;
  ctaText?: string;
  ctaHref?: string;
  bgImage?: string;
};

/**
 * Story strip — sección editorial oscura full-bleed.
 * Foto antigua del cerro de Comodoro como fondo, contenido alineado a la derecha en desktop.
 * Ritmo: 60vh mobile, 70vh desktop.
 */
export function StoryStrip({
  caption = 'Desde 2024',
  title = 'Desde el sur',
  body = 'ROOTS LIFE nace en Comodoro Rivadavia. Transformamos lo cotidiano de la Patagonia en símbolos que la gente reconoce como propios.',
  ctaText = 'Nuestra historia',
  ctaHref = '/historia',
  bgImage = '/images/comodoro/cerro-antiguo.webp',
}: StoryStripProps) {
  return (
    <section
      id="historia"
      aria-labelledby="story-title"
      className="relative flex items-end min-h-[60vh] lg:min-h-[70vh] py-16 px-4 lg:py-16 lg:px-16 text-paper-100 overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(14,14,14,0.2) 0%, rgba(14,14,14,0.8) 100%), url("${bgImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
        aria-hidden="true"
      />
      <div className="relative max-w-[32rem] lg:ml-auto">
        <p className="text-caption text-rust-300 mb-3">{caption}</p>
        <h2
          id="story-title"
          className="font-display font-bold uppercase text-paper-100 mb-4"
          style={{
            fontSize: 'clamp(1.5rem, 2.5vw + 0.5rem, 2.5rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            textShadow: 'var(--text-shadow-inverse)',
          }}
        >
          {title}
        </h2>
        <p className="text-paper-200 leading-relaxed mb-6"
          style={{ fontSize: 'clamp(0.95rem, 0.5vw + 0.85rem, 1.05rem)' }}
        >
          {body}
        </p>
        <Button href={ctaHref} variant="ghost-inverse" size="md">
          {ctaText} <span aria-hidden>→</span>
        </Button>
      </div>
    </section>
  );
}
