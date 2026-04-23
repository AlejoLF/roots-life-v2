'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserMenu } from './UserMenu';

/**
 * Header.
 * - En Home: SIEMPRE con fondo navy-plum (matchea la atmósfera del top del hero) +
 *   texto/logo en blanco. Al scrollear cualquier cantidad, aparece la sombra paralela.
 * - En otras páginas: fondo blanco + texto negro + sombra sutil desde el arranque.
 * Altura: 58px mobile / 72px desktop.
 *
 * Mobile:
 * - Logo a la izquierda.
 * - Iconos agrupados a la derecha: Instagram → Carrito → Hamburger (esquina derecha).
 * - Hamburger abre drawer lateral con nav + socials.
 */

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const handler = () => setScrolled(window.scrollY > 4);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [isHome]);

  // Close drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Body scroll lock when drawer open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // ESC closes drawer
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const headerClasses = isHome
    ? `text-paper-100 header-home-bg ${
        scrolled ? 'shadow-[0_2px_12px_rgba(0,0,0,0.35)]' : 'shadow-none'
      }`
    : 'bg-paper-100 text-ink-900 shadow-sm';

  const iconBtnClass = `w-9 h-9 inline-flex items-center justify-center rounded-full transition-colors ${
    isHome ? 'hover:bg-white/12' : 'hover:bg-ink-100'
  }`;

  return (
    <>
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

        <div className="relative w-full max-w-[75rem] mx-auto flex items-center justify-between gap-4">
          {/* Logo horizontal — izquierda */}
          <Link
            href="/"
            className="flex items-center h-[14px] lg:h-[16px]"
            aria-label="Inicio — ROOTS LIFE"
          >
            <svg viewBox="0 0 2288.96 279.2" className="h-full w-auto fill-current">
              <use href="/logos/logos.svg#roots-horizontal" />
            </svg>
          </Link>

          {/* Nav desktop — centro */}
          <nav className="hidden lg:flex gap-7 text-[12.5px] font-medium uppercase tracking-[0.08em] absolute left-1/2 -translate-x-1/2">
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

          {/* Iconos — siempre agrupados a la derecha.
              Orden: Instagram → Carrito → Hamburger (esquina). */}
          <div className="flex items-center gap-1.5 md:gap-3 ml-auto">
            <a
              href="https://instagram.com/rootslife.cr"
              target="_blank"
              rel="noopener"
              className={iconBtnClass}
              aria-label="Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
              </svg>
            </a>

            <UserMenu invertColors={isHome} />

            <Link
              href="/carrito"
              className={`relative ${iconBtnClass}`}
              aria-label="Carrito"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
              </svg>
            </Link>

            {/* Hamburger — solo mobile, última posición (esquina derecha) */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={`lg:hidden ${iconBtnClass}`}
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              aria-controls="mobile-drawer"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <MobileDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        pathname={pathname}
      />
    </>
  );
}

function MobileDrawer({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        aria-hidden={!open}
        className={`fixed inset-0 z-[300] bg-black/55 lg:hidden transition-opacity duration-300 ease-out ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <aside
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal"
        aria-hidden={!open}
        className={`fixed top-0 left-0 bottom-0 z-[310] w-[min(85vw,360px)] bg-ink-900 text-paper-100 halftone-dark shadow-2xl flex flex-col overflow-hidden lg:hidden transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Head */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-ink-700">
          <span className="flex items-center h-[16px] text-paper-100" aria-hidden>
            <svg viewBox="0 0 2288.96 279.2" className="h-full w-auto fill-current">
              <use href="/logos/logos.svg#roots-horizontal" />
            </svg>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 inline-flex items-center justify-center rounded-full text-paper-100 hover:bg-white/10 transition-colors"
            aria-label="Cerrar menú"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square">
              <path d="M4 4l16 16M20 4L4 20" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col py-4" aria-label="Navegación principal">
          {[
            { href: '/catalogo', label: 'Shop' },
            { href: '/historia', label: 'Historia' },
            { href: '/serigrafia', label: 'Serigrafía' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={`px-5 py-4 font-display text-xl uppercase tracking-tight border-b border-ink-800 transition-colors ${
                isActive(link.href) ? 'text-rust-500' : 'text-paper-100 hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Foot */}
        <div className="px-5 py-5 border-t border-ink-700 flex flex-col gap-4">
          <Link
            href="/carrito"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 border-2 border-paper-100 text-paper-100 font-body text-sm font-semibold uppercase tracking-wider hover:bg-paper-100 hover:text-ink-900 transition-colors"
          >
            Mi carrito →
          </Link>

          <div className="flex flex-col gap-3">
            <a
              href="https://instagram.com/rootslife.cr"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-3 text-white/90 text-sm hover:text-paper-100"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
              </svg>
              <span>@rootslife.cr</span>
            </a>
            <a
              href="https://wa.me/5492974737664"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-3 text-white/90 text-sm hover:text-paper-100"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.52 3.48A11.88 11.88 0 0 0 12.06 0C5.5 0 .17 5.33.17 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.33-1.66a11.88 11.88 0 0 0 5.72 1.46c6.56 0 11.89-5.33 11.89-11.9 0-3.18-1.24-6.17-3.43-8.42z" />
              </svg>
              <span>WhatsApp</span>
            </a>
          </div>

          <p className="text-[10px] font-medium uppercase tracking-widest text-white/80 pt-3 border-t border-ink-800 m-0">
            Chubut · Patagonia · Estd 2024
          </p>
        </div>
      </aside>
    </>
  );
}
