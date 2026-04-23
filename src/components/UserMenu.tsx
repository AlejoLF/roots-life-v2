'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

type Props = {
  invertColors?: boolean;
};

export function UserMenu({ invertColors = false }: Props) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  const iconBtnClass = `w-9 h-9 inline-flex items-center justify-center rounded-full transition-colors ${
    invertColors ? 'hover:bg-white/12' : 'hover:bg-ink-100'
  }`;

  // Loading: invisible placeholder
  if (status === 'loading') {
    return <div className="w-9 h-9" aria-hidden="true" />;
  }

  // Logged out: link to login
  if (!session?.user) {
    return (
      <Link href="/login" className={iconBtnClass} aria-label="Iniciar sesión">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </Link>
    );
  }

  const initial = (session.user.name ?? session.user.email ?? 'U')
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={iconBtnClass}
        aria-label="Menú de usuario"
        aria-expanded={open}
      >
        <span className="w-7 h-7 rounded-full bg-rust-500 text-paper-100 text-xs font-bold flex items-center justify-center uppercase">
          {initial}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-full right-0 mt-2 w-56 bg-paper-100 text-ink-900 border border-[var(--color-border)] rounded-[4px] shadow-lg py-1 overflow-hidden z-50"
        >
          <div className="px-4 py-3 border-b border-[var(--color-border)]">
            <p className="text-[10px] font-medium uppercase tracking-widest text-ink-500 mb-0.5">
              Tu cuenta
            </p>
            <p className="text-sm font-medium truncate">
              {session.user.name ?? session.user.email}
            </p>
            {session.user.name && (
              <p className="text-xs text-ink-500 truncate">
                {session.user.email}
              </p>
            )}
          </div>
          <MenuLink href="/perfil" onClick={() => setOpen(false)}>
            Mi perfil
          </MenuLink>
          <MenuLink href="/mis-pedidos" onClick={() => setOpen(false)}>
            Mis pedidos
          </MenuLink>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              signOut({ callbackUrl: '/' });
            }}
            role="menuitem"
            className="w-full text-left px-4 py-2.5 text-sm hover:bg-ink-100 transition-colors border-t border-[var(--color-border)] text-ink-700"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      role="menuitem"
      className="block px-4 py-2.5 text-sm hover:bg-ink-100 transition-colors"
    >
      {children}
    </Link>
  );
}
