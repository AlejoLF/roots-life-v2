import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative z-10 bg-ink-900 text-white/90 px-4 md:px-8 lg:px-12 pt-16 pb-10">
      <div className="w-full max-w-[75rem] mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-10 lg:gap-16">
        <div>
          <span
            className="inline-block w-[120px] lg:w-[140px] mb-4 text-paper-100"
            role="img"
            aria-label="ROOTS LIFE"
          >
            <svg viewBox="0 0 387.94 291.54" className="w-full h-auto fill-current">
              <use href="/logos/logos.svg#roots-small" />
            </svg>
          </span>
          <p className="text-body-sm text-paper-300 max-w-[18rem]">
            Real Stories. Real clothes.
          </p>
        </div>

        <div>
          <h4 className="text-caption text-paper-100 mb-4">Catálogo</h4>
          <ul className="list-none p-0 m-0 space-y-2">
            <li>
              <Link href="/catalogo" className="text-body-sm text-paper-300 hover:text-paper-100 transition-colors">
                Remeras
              </Link>
            </li>
            <li>
              <Link href="/catalogo" className="text-body-sm text-paper-300 hover:text-paper-100 transition-colors">
                Buzos
              </Link>
            </li>
            <li>
              <Link href="/catalogo" className="text-body-sm text-paper-300 hover:text-paper-100 transition-colors">
                Cápsulas
              </Link>
            </li>
            <li>
              <Link href="/catalogo" className="text-body-sm text-paper-300 hover:text-paper-100 transition-colors">
                Ver todo
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-caption text-paper-100 mb-4">Ayuda</h4>
          <ul className="list-none p-0 m-0 space-y-2">
            <li>
              <a href="#" className="text-body-sm text-paper-300 hover:text-paper-100 transition-colors">
                Envíos
              </a>
            </li>
            <li>
              <a href="#" className="text-body-sm text-paper-300 hover:text-paper-100 transition-colors">
                Cambios
              </a>
            </li>
            <li>
              <a href="#" className="text-body-sm text-paper-300 hover:text-paper-100 transition-colors">
                Guía de talles
              </a>
            </li>
            <li>
              <a href="#" className="text-body-sm text-paper-300 hover:text-paper-100 transition-colors">
                Contacto
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full max-w-[75rem] mx-auto mt-10 pt-6 border-t border-ink-700 flex flex-wrap gap-4 justify-between items-center text-stamp text-white/80">
        <span>Chubut · Patagonia · Estd 2024</span>
        <div className="flex flex-wrap gap-4">
          <Link href="/terminos" className="hover:text-paper-100 transition-colors">Términos</Link>
          <Link href="/privacidad" className="hover:text-paper-100 transition-colors">Privacidad</Link>
          <Link href="/cookies" className="hover:text-paper-100 transition-colors">Cookies</Link>
        </div>
        <span>© 2026 ROOTS LIFE</span>
      </div>
    </footer>
  );
}
