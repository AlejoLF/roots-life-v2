'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';

type RevalidateResult =
  | { ok: true; revalidated: string[]; timestamp: string }
  | { ok: false; error: string };

type DiagResult =
  | { ok: true; [key: string]: unknown }
  | { ok: false; error: string };

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [diagLoading, setDiagLoading] = useState(false);
  const [result, setResult] = useState<RevalidateResult | null>(null);
  const [diag, setDiag] = useState<DiagResult | null>(null);
  const [lastRun, setLastRun] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('roots-admin-token');
    if (saved) {
      setPassword(saved);
      setAuthed(true);
    }
    const last = localStorage.getItem('roots-admin-lastrun');
    if (last) setLastRun(last);
  }, []);

  async function handleDiag() {
    setDiagLoading(true);
    setDiag(null);
    try {
      const res = await fetch('/api/diag', {
        headers: { Authorization: `Bearer ${password}` },
      });
      const data = await res.json();
      setDiag(data);
    } catch (err) {
      setDiag({
        ok: false,
        error: err instanceof Error ? err.message : 'Network error',
      });
    } finally {
      setDiagLoading(false);
    }
  }

  async function handleRevalidate() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/revalidate', {
        method: 'POST',
        headers: { Authorization: `Bearer ${password}` },
      });
      const data: RevalidateResult = await res.json();
      setResult(data);
      if (data.ok) {
        sessionStorage.setItem('roots-admin-token', password);
        const ts = data.timestamp;
        localStorage.setItem('roots-admin-lastrun', ts);
        setLastRun(ts);
      } else if (res.status === 401) {
        setAuthed(false);
        sessionStorage.removeItem('roots-admin-token');
      }
    } catch (err) {
      setResult({
        ok: false,
        error: err instanceof Error ? err.message : 'Network error',
      });
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password.trim()) {
      sessionStorage.setItem('roots-admin-token', password);
      setAuthed(true);
      setResult(null);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('roots-admin-token');
    setPassword('');
    setAuthed(false);
    setResult(null);
  }

  return (
    <main className="min-h-screen bg-ink-900 text-paper-100 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[32rem]">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-caption text-rust-200 mb-2">ROOTS LIFE · Admin</p>
          <h1
            className="font-display font-bold uppercase text-paper-100 m-0"
            style={{
              fontSize: 'clamp(1.5rem, 3vw + 0.5rem, 2.5rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              textShadow: 'var(--text-shadow-inverse)',
            }}
          >
            Panel de control
          </h1>
          <p className="text-white/80 mt-3 text-sm">
            Acciones internas · acceso restringido
          </p>
        </div>

        {!authed ? (
          <form
            onSubmit={handleLogin}
            className="bg-ink-700 border border-ink-500 rounded-[2px] p-6 flex flex-col gap-4"
          >
            <label className="flex flex-col gap-2">
              <span className="text-[10px] font-medium uppercase tracking-widest text-white/80">
                Contraseña
              </span>
              <input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-ink-900 border border-ink-500 rounded-[2px] px-4 py-3 text-paper-100 text-sm focus:outline-none focus:border-rust-200"
                placeholder="••••••••"
              />
            </label>
            <Button type="submit" variant="accent" size="md">
              Entrar →
            </Button>
          </form>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Revalidate card */}
            <div className="bg-ink-700 border border-ink-500 rounded-[2px] p-6">
              <p className="text-caption text-rust-200 mb-2">Contenido</p>
              <h2 className="font-display font-bold uppercase text-paper-100 text-xl mb-3">
                Forzar actualización
              </h2>
              <p className="text-white/80 text-sm leading-relaxed mb-5">
                Re-lee productos desde Google Sheets y regenera las páginas del
                sitio. Usalo cuando cambies precios, stock o cargues un
                producto nuevo y quieras verlo reflejado ya.
              </p>
              <Button
                variant="accent"
                size="md"
                onClick={handleRevalidate}
                aria-label="Forzar revalidación"
              >
                {loading ? 'Actualizando...' : 'Actualizar ahora →'}
              </Button>
              {lastRun && !loading && (
                <p className="text-white/60 text-xs mt-4 font-mono">
                  Último refresh: {new Date(lastRun).toLocaleString('es-AR')}
                </p>
              )}
            </div>

            {/* Result feedback */}
            {result && (
              <div
                className={`border rounded-[2px] p-5 ${
                  result.ok
                    ? 'border-[#5A7A4A] bg-[#1c2a1c]'
                    : 'border-rust-500 bg-[#2a1612]'
                }`}
              >
                {result.ok ? (
                  <>
                    <p className="text-[11px] font-medium uppercase tracking-widest text-[#8FB87A] mb-2">
                      ✓ Éxito
                    </p>
                    <p className="text-white/90 text-sm mb-2">
                      Cache invalidado. Las próximas visitas van a ver la
                      versión nueva.
                    </p>
                    <p className="text-white/60 text-xs font-mono">
                      Rutas: {result.revalidated.join(' · ')}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[11px] font-medium uppercase tracking-widest text-rust-200 mb-2">
                      ✗ Error
                    </p>
                    <p className="text-white/90 text-sm">{result.error}</p>
                  </>
                )}
              </div>
            )}

            {/* Guía de uso card */}
            <Link
              href="/admin/guia"
              className="bg-ink-700 border border-ink-500 rounded-[2px] p-6 hover:border-rust-200 transition-colors block no-underline"
            >
              <p className="text-caption text-rust-200 mb-2">Ayuda</p>
              <h2 className="font-display font-bold uppercase text-paper-100 text-xl mb-3">
                Guía de uso
              </h2>
              <p className="text-white/80 text-sm leading-relaxed mb-3">
                Cómo usar cada pestaña de la planilla — productos, cápsulas,
                suscriptores y sobre todo la nueva de pedidos.
              </p>
              <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-rust-200">
                Abrir guía →
              </span>
            </Link>

            {/* Diagnóstico card */}
            <div className="bg-ink-700 border border-ink-500 rounded-[2px] p-6">
              <p className="text-caption text-rust-200 mb-2">Sheet status</p>
              <h2 className="font-display font-bold uppercase text-paper-100 text-xl mb-3">
                Diagnóstico
              </h2>
              <p className="text-white/80 text-sm leading-relaxed mb-5">
                Verifica que las env vars estén configuradas y que el servidor
                pueda leer la Google Sheet. Usalo cuando algo no actualice.
              </p>
              <Button
                variant="ghost-inverse"
                size="md"
                onClick={handleDiag}
                aria-label="Ejecutar diagnóstico"
              >
                {diagLoading ? 'Testeando...' : 'Testear conexión Sheet →'}
              </Button>
            </div>

            {diag && (
              <div className="border border-ink-500 rounded-[2px] p-5 bg-ink-700 font-mono text-[11px] text-white/90 leading-relaxed overflow-auto max-h-[500px]">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(diag, null, 2)}
                </pre>
              </div>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="text-white/60 text-xs underline hover:text-white/90 self-start"
            >
              Cerrar sesión
            </button>
          </div>
        )}

        {/* Footer nav */}
        <div className="text-center mt-10 pt-6 border-t border-ink-700">
          <a
            href="/"
            className="text-white/60 text-xs uppercase tracking-widest hover:text-white/90"
          >
            ← Volver al sitio
          </a>
        </div>
      </div>
    </main>
  );
}
