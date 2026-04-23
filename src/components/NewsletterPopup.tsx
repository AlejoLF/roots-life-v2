'use client';

import { useEffect, useState } from 'react';

/**
 * Popup newsletter con cooldown inteligente:
 *  - Aparece 25s después de la primera visita
 *  - Si el usuario lo cierra: no vuelve por 7 días (localStorage)
 *  - Si se suscribe: nunca más (flag permanente)
 *  - Respeta el estado incluso cambiando de página
 */

const STORAGE_DISMISSED = 'roots-newsletter-dismissed-at';
const STORAGE_SUBSCRIBED = 'roots-newsletter-subscribed';
const DISMISS_COOLDOWN_DAYS = 7;
const DELAY_MS = 25_000;

type SubmitState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success'; code: string; alreadySubscribed: boolean }
  | { kind: 'error'; message: string };

function shouldShow(): boolean {
  if (typeof window === 'undefined') return false;
  if (localStorage.getItem(STORAGE_SUBSCRIBED) === '1') return false;

  const dismissedAt = localStorage.getItem(STORAGE_DISMISSED);
  if (dismissedAt) {
    const when = Number(dismissedAt);
    if (!Number.isNaN(when)) {
      const daysSince = (Date.now() - when) / (1000 * 60 * 60 * 24);
      if (daysSince < DISMISS_COOLDOWN_DAYS) return false;
    }
  }
  return true;
}

export function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [state, setState] = useState<SubmitState>({ kind: 'idle' });

  useEffect(() => {
    if (!shouldShow()) return;
    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [visible]);

  function handleClose() {
    localStorage.setItem(STORAGE_DISMISSED, String(Date.now()));
    setVisible(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state.kind === 'loading') return;

    setState({ kind: 'loading' });
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'newsletter' }),
      });
      const data = await res.json();

      if (!data.ok) {
        setState({
          kind: 'error',
          message: data.error ?? 'No pudimos procesar tu email. Intentá de nuevo.',
        });
        return;
      }

      localStorage.setItem(STORAGE_SUBSCRIBED, '1');
      setState({
        kind: 'success',
        code: data.discountCode ?? 'ROOTS10',
        alreadySubscribed: data.status === 'already_subscribed',
      });
    } catch {
      setState({
        kind: 'error',
        message: 'Error de conexión. Intentá en un momento.',
      });
    }
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-title"
      className="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-8"
    >
      {/* Overlay */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={handleClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
      />

      {/* Card */}
      <div className="relative w-full max-w-[28rem] bg-ink-900 text-paper-100 rounded-[4px] shadow-2xl overflow-hidden animate-[fadeIn_0.25s_ease-out]">
        {/* Close */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Cerrar popup"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-white/60 hover:text-white/100 text-xl z-10"
        >
          ×
        </button>

        {state.kind === 'success' ? (
          <SuccessView code={state.code} alreadySubscribed={state.alreadySubscribed} onClose={handleClose} />
        ) : (
          <FormView
            email={email}
            onEmailChange={setEmail}
            onSubmit={handleSubmit}
            state={state}
          />
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

function FormView({
  email,
  onEmailChange,
  onSubmit,
  state,
}: {
  email: string;
  onEmailChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  state: SubmitState;
}) {
  return (
    <div className="px-8 py-10 text-center">
      <p className="text-[10px] font-medium uppercase tracking-[3px] text-rust-200 mb-4">
        ROOTS LIFE · Newsletter
      </p>
      <h2
        id="newsletter-title"
        className="font-display font-bold uppercase text-paper-100 mb-3"
        style={{
          fontSize: 'clamp(1.4rem, 2.5vw + 0.8rem, 2rem)',
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
          textShadow: 'var(--text-shadow-inverse)',
        }}
      >
        10% OFF<br />en tu primera compra
      </h2>
      <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-[20rem] mx-auto">
        Suscribite para enterarte primero de los drops y llevarte un{' '}
        <strong className="text-rust-200">10% de descuento</strong> en tu primer
        pedido.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          placeholder="tu@email.com"
          autoComplete="email"
          disabled={state.kind === 'loading'}
          className="bg-ink-700 border border-ink-500 rounded-[2px] px-4 py-3 text-paper-100 text-sm focus:outline-none focus:border-rust-200 text-center placeholder:text-white/40 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={state.kind === 'loading'}
          className="bg-rust-500 text-paper-100 border-[1.5px] border-rust-500 hover:bg-rust-700 hover:border-rust-700 px-6 py-3 text-sm font-body font-semibold uppercase tracking-wider transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {state.kind === 'loading' ? 'Enviando...' : 'Quiero mi 10% →'}
        </button>
      </form>

      {state.kind === 'error' && (
        <p className="text-rust-200 text-xs mt-4">{state.message}</p>
      )}

      <p className="text-white/50 text-[11px] mt-6 leading-relaxed">
        Sin spam. Te podés dar de baja en cualquier momento.
      </p>
    </div>
  );
}

function SuccessView({
  code,
  alreadySubscribed,
  onClose,
}: {
  code: string;
  alreadySubscribed: boolean;
  onClose: () => void;
}) {
  return (
    <div className="px-8 py-10 text-center">
      <p className="text-[10px] font-medium uppercase tracking-[3px] text-rust-200 mb-4">
        {alreadySubscribed ? 'Ya estabas en la lista' : '¡Listo!'}
      </p>
      <h2
        className="font-display font-bold uppercase text-paper-100 mb-4"
        style={{
          fontSize: 'clamp(1.4rem, 2.5vw + 0.8rem, 2rem)',
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
          textShadow: 'var(--text-shadow-inverse)',
        }}
      >
        {alreadySubscribed ? 'Bienvenido de vuelta' : 'Usá este código'}
      </h2>

      {!alreadySubscribed && code && (
        <div className="bg-ink-700 border border-dashed border-rust-200 rounded-[2px] px-5 py-4 my-6">
          <p className="text-[10px] uppercase tracking-widest text-white/60 mb-2">
            Tu código de descuento
          </p>
          <p
            className="font-display font-bold text-rust-200"
            style={{ fontSize: '1.75rem', letterSpacing: '0.15em' }}
          >
            {code}
          </p>
        </div>
      )}

      <p className="text-white/80 text-sm leading-relaxed mb-6">
        {alreadySubscribed
          ? 'Ya recibís nuestros drops. Te avisamos cuando salga algo nuevo.'
          : 'Pegalo al finalizar la compra y se aplica el 10% automáticamente. Te llegan también los drops nuevos al email.'}
      </p>

      <button
        type="button"
        onClick={onClose}
        className="bg-transparent text-paper-100 border-2 border-paper-100 hover:bg-paper-100 hover:text-ink-900 px-6 py-3 text-sm font-body font-semibold uppercase tracking-wider transition-all"
      >
        Seguir comprando →
      </button>
    </div>
  );
}
