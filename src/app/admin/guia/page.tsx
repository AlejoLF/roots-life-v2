'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function GuiaPage() {
  const router = useRouter();
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('roots-admin-token');
    if (!token) {
      router.replace('/admin');
      return;
    }

    fetch('/api/admin/guia', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401) {
          sessionStorage.removeItem('roots-admin-token');
          router.replace('/admin');
          return;
        }
        if (!res.ok) {
          setError('No pudimos cargar la guía.');
          return;
        }
        const text = await res.text();
        setHtml(text);
      })
      .catch(() => setError('Error de conexión al cargar la guía.'));
  }, [router]);

  return (
    <div className="min-h-screen bg-ink-900 flex flex-col">
      {/* Barra superior de admin */}
      <header className="bg-ink-900 border-b border-ink-700 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-[11px] font-semibold uppercase tracking-widest text-white/75 hover:text-paper-100 transition-colors"
          >
            ← Volver al panel
          </Link>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-rust-200">
          Guía de uso · ROOTS LIFE
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {error && (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center max-w-md">
              <p className="text-caption text-rust-200 mb-2">Error</p>
              <p className="text-white/90 text-sm mb-4">{error}</p>
              <Link
                href="/admin"
                className="inline-block bg-rust-500 text-paper-100 px-5 py-2 text-xs font-semibold uppercase tracking-widest rounded-[2px]"
              >
                Volver al panel
              </Link>
            </div>
          </div>
        )}

        {!html && !error && (
          <div className="flex-1 flex items-center justify-center p-6">
            <p className="text-white/60 text-sm">Cargando guía...</p>
          </div>
        )}

        {html && (
          <iframe
            srcDoc={html}
            title="Guía de uso — ROOTS LIFE"
            className="flex-1 w-full border-0 bg-paper-100"
            style={{ minHeight: 'calc(100vh - 56px)' }}
          />
        )}
      </main>
    </div>
  );
}
