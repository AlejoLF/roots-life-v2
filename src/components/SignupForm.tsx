'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';

type FormState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

export function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptNewsletter, setAcceptNewsletter] = useState(false);
  const [newsletterLocked, setNewsletterLocked] = useState(false);
  const [state, setState] = useState<FormState>({ kind: 'idle' });

  // Auto-chequear si el email ya está en el newsletter
  useEffect(() => {
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setNewsletterLocked(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/emails/check?email=${encodeURIComponent(trimmed)}`,
        );
        const data = await res.json();
        if (data.ok && data.subscribed) {
          setAcceptNewsletter(true);
          setNewsletterLocked(true);
        } else {
          setNewsletterLocked(false);
        }
      } catch {
        setNewsletterLocked(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [email]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state.kind === 'loading') return;

    if (!acceptTerms) {
      setState({
        kind: 'error',
        message: 'Debés aceptar los términos para continuar.',
      });
      return;
    }

    setState({ kind: 'loading' });
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          acceptTerms,
          acceptNewsletter,
        }),
      });
      const data = await res.json();

      if (!data.ok) {
        setState({
          kind: 'error',
          message: data.error ?? 'No pudimos crear la cuenta. Intentá de nuevo.',
        });
        return;
      }

      setState({ kind: 'success' });
    } catch {
      setState({
        kind: 'error',
        message: 'Error de conexión. Intentá en un momento.',
      });
    }
  }

  if (state.kind === 'success') {
    return (
      <div className="bg-ink-900 text-paper-100 rounded-[4px] p-8 text-center">
        <p className="text-caption text-rust-200 mb-3">¡Listo!</p>
        <h2 className="font-display font-bold text-xl uppercase mb-4">
          Revisá tu email
        </h2>
        <p className="text-white/85 text-sm leading-relaxed mb-6">
          Te enviamos un link de confirmación a <strong>{email}</strong>. Tocalo
          para activar tu cuenta — el link vence en 24 horas.
        </p>
        <p className="text-white/60 text-xs">
          Si no lo ves en unos minutos, revisá la carpeta de spam o promociones.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Nombre */}
      <label className="flex flex-col gap-2">
        <span className="text-[10px] font-medium uppercase tracking-widest text-ink-700">
          Nombre
        </span>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={state.kind === 'loading'}
          className="bg-white border border-[var(--color-border)] rounded-[2px] px-4 py-3 text-ink-900 text-sm focus:outline-none focus:border-ink-900 disabled:opacity-60"
          placeholder="Tu nombre"
        />
      </label>

      {/* Email */}
      <label className="flex flex-col gap-2">
        <span className="text-[10px] font-medium uppercase tracking-widest text-ink-700">
          Email
        </span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state.kind === 'loading'}
          className="bg-white border border-[var(--color-border)] rounded-[2px] px-4 py-3 text-ink-900 text-sm focus:outline-none focus:border-ink-900 disabled:opacity-60"
          placeholder="tu@email.com"
        />
      </label>

      {/* Password */}
      <label className="flex flex-col gap-2">
        <span className="text-[10px] font-medium uppercase tracking-widest text-ink-700">
          Contraseña
        </span>
        <input
          type="password"
          required
          autoComplete="new-password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={state.kind === 'loading'}
          className="bg-white border border-[var(--color-border)] rounded-[2px] px-4 py-3 text-ink-900 text-sm focus:outline-none focus:border-ink-900 disabled:opacity-60"
          placeholder="Mínimo 8 caracteres"
        />
        <span className="text-[11px] text-ink-500">
          Mayúscula + minúscula + número. Mínimo 8 caracteres.
        </span>
      </label>

      {/* Terms checkbox — obligatorio */}
      <label className="flex items-start gap-3 mt-2 cursor-pointer">
        <input
          type="checkbox"
          required
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          disabled={state.kind === 'loading'}
          className="mt-1 flex-shrink-0 accent-rust-500 w-4 h-4"
        />
        <span className="text-[12px] text-ink-700 leading-relaxed">
          Acepto los{' '}
          <a
            href="/terminos"
            target="_blank"
            rel="noopener"
            className="text-ink-900 underline hover:text-rust-500"
          >
            Términos y Condiciones
          </a>{' '}
          y la{' '}
          <a
            href="/privacidad"
            target="_blank"
            rel="noopener"
            className="text-ink-900 underline hover:text-rust-500"
          >
            Política de Privacidad
          </a>
          .
        </span>
      </label>

      {/* Newsletter opt-in */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={acceptNewsletter}
          onChange={(e) => setAcceptNewsletter(e.target.checked)}
          disabled={state.kind === 'loading' || newsletterLocked}
          className="mt-1 flex-shrink-0 accent-rust-500 w-4 h-4 disabled:cursor-not-allowed"
        />
        <span className="text-[12px] text-ink-700 leading-relaxed">
          Quiero recibir novedades de drops nuevos por email.
          {newsletterLocked && (
            <em className="block mt-1 text-[11px] text-ink-500">
              (Email ya registrado en las novedades para nuevos drops)
            </em>
          )}
        </span>
      </label>

      {state.kind === 'error' && (
        <p className="text-rust-500 text-sm mt-2" role="alert">
          {state.message}
        </p>
      )}

      <Button type="submit" variant="accent" size="lg" className="mt-4">
        {state.kind === 'loading' ? 'Creando cuenta...' : 'Crear cuenta →'}
      </Button>
    </form>
  );
}
