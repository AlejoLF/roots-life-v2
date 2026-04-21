'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Header.
 * - En Home: SIEMPRE con fondo navy-plum (matchea la atmósfera del top del hero) +
 *   texto/logo en blanco. Al scrollear cualquier cantidad, aparece la sombra paralela
 *   para separar del contenido.
 * - En otras páginas: fondo blanco + texto negro + sombra sutil desde el arranque.
 * Altura: 58px mobile / 72px desktop.
 */

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const handler = () => setScrolled(window.scrollY > 4);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [isHome]);

  // Home: misma imagen del hero con fixed attachment (continuación sin borde).
  // Sombra aparece al scrollear (transición suave).
  const headerClasses = isHome
    ? `text-paper-100 header-home-bg ${
        scrolled ? 'shadow-[0_2px_12px_rgba(0,0,0,0.35)]' : 'shadow-none'
      }`
    : 'bg-paper-100 text-ink-900 shadow-sm';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[200] h-[58px] lg:h-[72px] flex items-center px-4 md:px-8 lg:px-12 transition-[box-shadow] duration-300 ease-out ${headerClasses}`}
    >
      {/* Halftone overlay — fade-in al scrollear en Home */}
      {isHome && (
        <div
          className={`header-home-halftone absolute inset-0 pointer-events-none transition-opacity duration-300 ease-out ${
            scrolled ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />
      )}

      <div className="relative w-full max-w-[75rem] mx-auto grid grid-cols-[auto_1fr_auto] items-center gap-4">
        {/* Logo horizontal — SIEMPRE visible */}
        <Link
          href="/"
          className="flex items-center h-[14px] lg:h-[16px]"
          aria-label="Inicio — ROOTS LIFE"
        >
          <svg viewBox="0 0 2288.96 279.2" className="h-full w-auto fill-current">
            <use href="/logos/logos.svg#roots-horizontal" />
          </svg>
        </Link>

        {/* Nav */}
        <nav className="hidden lg:flex justify-self-center gap-7 text-[12.5px] font-medium uppercase tracking-[0.08em]">
          <Link href="/catalogo" className="hover:opacity-65 transition-opacity">
            Shop
          </Link>
          <Link href="/historia" className="hover:opacity-65 transition-opacity">
            Historia
          </Link>
          <Link href="/serigrafia" className="hover:opacity-65 transition-opacity">
            Serigrafía
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5 md:gap-3">
          <button
            className={`lg:hidden w-9 h-9 inline-flex items-center justify-center rounded-full transition-colors ${
              isHome ? 'hover:bg-white/12' : 'hover:bg-ink-100'
            }`}
            aria-label="Abrir menú"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>

          <a
            href="https://instagram.com/rootslife.cr"
            target="_blank"
            rel="noopener"
            className={`w-9 h-9 inline-flex items-center justify-center rounded-full transition-colors ${
              isHome ? 'hover:bg-white/12' : 'hover:bg-ink-100'
            }`}
            aria-label="Instagram"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
            </svg>
          </a>

          <Link
            href="/carrito"
            className={`relative w-9 h-9 inline-flex items-center justify-center rounded-full transition-colors ${
              isHome ? 'hover:bg-white/12' : 'hover:bg-ink-100'
            }`}
            aria-label="Carrito"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
