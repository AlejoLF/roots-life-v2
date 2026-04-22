import { Button } from './Button';

type FeaturedCapsuleProps = {
  caption?: string;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  ctaText?: string;
  ctaHref?: string;
  videoSrc?: string;
  videoPoster?: string;
};

/**
 * Featured capsule — sección invertida con video de fondo en el lado del texto.
 * Layout: stack mobile, 2 cols desktop (1fr/1fr).
 * - Lado izquierdo: imagen del producto (4/5 mobile, auto desktop 620px min).
 * - Lado derecho: video de fondo (loop, muted, autoplay) + overlay oscuro 55% + contenido.
 */
export function FeaturedCapsule({
  caption = 'South Coast Series',
  title = 'No Bad Days',
  description = 'Tres piezas nacidas en la costa del sur. Serigrafía a tres tintas sobre algodón orgánico. Edición limitada.',
  image = '/images/remeras/South Coast/South Coast - No bad days.webp',
  imageAlt = 'Remera No Bad Days — South Coast Series',
  ctaText = 'Explorar cápsula',
  ctaHref = '/catalogo?capsula=south-coast',
  videoSrc = '/videos/surfer-720p.mp4',
}: FeaturedCapsuleProps) {
  return (
    <section
      id="capsulas"
      aria-labelledby="capsule-title"
      className="bg-ink-900 text-paper-100 grid grid-cols-1 lg:grid-cols-2"
    >
      {/* Imagen del producto */}
      <div
        className="bg-ink-700 bg-cover bg-center aspect-[4/5] lg:aspect-auto lg:min-h-[620px]"
        role="img"
        aria-label={imageAlt}
        style={{ backgroundImage: `url("${image}")` }}
      />

      {/* Lado texto con VIDEO de fondo + overlay oscuro */}
      <div className="relative overflow-hidden min-h-[420px] md:min-h-[520px] lg:min-h-[620px] flex items-center">
        {/* Video background */}
        <video
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />

        {/* Overlay oscuro para contraste — más liviano para ver más el video */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(14,14,14,0.30) 0%, rgba(14,14,14,0.50) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Halftone sutil editorial encima */}
        <div
          className="absolute inset-0 pointer-events-none opacity-70"
          style={{
            backgroundImage:
              'radial-gradient(rgba(247,243,234,0.06) 1.2px, transparent 1.6px)',
            backgroundSize: '8px 8px',
          }}
          aria-hidden="true"
        />

        {/* Contenido */}
        <div className="relative z-10 flex flex-col justify-center py-10 px-6 lg:py-16 lg:px-12 max-w-[42rem]">
          <p className="text-caption text-rust-200 mb-2">{caption}</p>
          <h2
            id="capsule-title"
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
          <p className="text-white/90 leading-relaxed mb-6 max-w-[28rem]"
            style={{ fontSize: 'clamp(0.95rem, 0.5vw + 0.85rem, 1.05rem)' }}
          >
            {description}
          </p>
          <div>
            <Button href={ctaHref} variant="primary" size="md">
              {ctaText} <span aria-hidden>→</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
