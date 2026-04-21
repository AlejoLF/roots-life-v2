import { Button } from './Button';

type HeroProps = {
  subtitleLine1?: string;
  subtitleLine2?: string;
  stamp?: string;
  ctaText?: string;
  ctaHref?: string;
};

/**
 * Hero — editorial full-bleed, logo completo ROOTS LIFE (no solo imagotipo).
 * Ritmo vertical: 70vh mobile / 85vh desktop.
 * Mobile: ola B&N dramática. Desktop: atardecer panorámico color.
 */
export function Hero({
  subtitleLine1 = 'Indumentaria nacida en el sur',
  subtitleLine2 = 'Ropa real, para gente real.',
  stamp = 'Chubut · Patagonia · Estd 2024',
  ctaText = 'Ver colección',
  ctaHref = '#shop',
}: HeroProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex items-center justify-center text-paper-100 bg-ink-900 overflow-hidden min-h-[70vh] lg:min-h-[85vh]"
    >
      <h1 id="hero-title" className="sr-only">ROOTS LIFE</h1>

      {/* Mobile: ola B&N */}
      <div
        className="absolute inset-0 lg:hidden"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(14,14,14,0.45) 0%, rgba(14,14,14,0.85) 100%), url("/images/comodoro/hero-mobile.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(100%) contrast(1.05)',
        }}
        aria-hidden="true"
      />
      {/* Desktop: atardecer color */}
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(14,14,14,0.25) 0%, rgba(14,14,14,0.78) 100%), url("/images/comodoro/hero-desktop.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          filter: 'saturate(0.95) contrast(1.05)',
        }}
        aria-hidden="true"
      />
      {/* Halftone overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(247,243,234,0.05) 1px, transparent 1px)',
          backgroundSize: '6px 6px',
        }}
        aria-hidden="true"
      />

      <div className="relative text-center px-4 max-w-[42rem] py-12">
        {/* Logo completo ROOTS LIFE — imagotipo + wordmark */}
        <div
          className="mx-auto mb-6 text-paper-100"
          style={{
            width: 'clamp(110px, 16vw, 190px)',
            filter:
              'drop-shadow(0 4px 10px rgba(0,0,0,0.55)) drop-shadow(0 18px 40px rgba(0,0,0,0.45)) drop-shadow(0 36px 80px rgba(0,0,0,0.30))',
          }}
          role="img"
          aria-label="ROOTS LIFE"
        >
          <svg
            viewBox="0 0 893.36 791.99"
            className="w-full h-auto fill-current block"
          >
            <use href="/logos/logos.svg#roots-full" />
          </svg>
        </div>

        {/* Subtitle — 2 líneas editoriales */}
        <p className="text-body-sm text-paper-300 mb-8 max-w-[24rem] mx-auto leading-[1.5] tracking-[0.02em]">
          {subtitleLine1}
          <br />
          {subtitleLine2}
        </p>

        {/* CTA */}
        <div className="mb-16">
          <Button href={ctaHref} variant="primary" size="md">
            {ctaText} <span aria-hidden>→</span>
          </Button>
        </div>

        {/* Stamp */}
        <p className="text-stamp text-paper-400">{stamp}</p>
      </div>
    </section>
  );
}
