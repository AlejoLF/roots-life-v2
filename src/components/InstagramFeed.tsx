type InstagramFeedProps = {
  tiles?: string[];
};

/**
 * Instagram feed — grid 3 cols mobile / 6 cols desktop, aspect 1/1.
 * Filtro grayscale, hover color (indica interacción).
 */
export function InstagramFeed({
  tiles = [
    '/images/comodoro/hero-mobile.webp',
    '/images/comodoro/ig-01.webp',
    '/images/remeras/Numerología/Numerología - Pegasus 2222 - Close up - negra.webp',
    '/images/comodoro/ig-02.webp',
    '/images/buzos/buzos roots-37.webp',
    '/images/comodoro/ig-03.webp',
  ],
}: InstagramFeedProps) {
  return (
    <section className="py-16 lg:py-12">
      <div className="max-w-[75rem] mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-baseline flex-wrap gap-4 mb-10">
          <h2 className="text-h2 m-0">Seguinos en Instagram</h2>
          <a
            href="https://instagram.com/rootslife.cr"
            target="_blank"
            rel="noopener"
            className="text-button text-ink-900 no-underline hover:text-rust-500 transition-colors"
          >
            @rootslife.cr →
          </a>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
          {tiles.map((src, i) => (
            <div
              key={i}
              className="aspect-square bg-cover bg-center transition-[filter] duration-200 hover:grayscale-0"
              style={{
                backgroundImage: `url("${src}")`,
                filter: 'grayscale(100%) contrast(1.05)',
              }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
