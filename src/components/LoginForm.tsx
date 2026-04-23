'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/Button';

type Props = {
  initialError?: string;
  callbackUrl: string;
};

const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: 'Email o contraseña incorrectos.',
  EMAIL_NOT_VERIFIED:
    'Tu email aún no está verificado. Revisá tu casilla o pedí un nuevo link.',
  AccessDenied: 'Acceso denegado.',
  OAuthAccountNotLinked:
    'Ya existe una cuenta con este email usando otro método. Iniciá con tu contraseña.',
  default: 'No pudimos iniciar sesión. Intentá de nuevo.',
};

export function LoginForm({ initialError, callbackUrl }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    initialError ? ERROR_MESSAGES[initialError] ?? ERROR_MESSAGES.default : null,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    const res = await signIn('credentials', {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);
    if (res?.error) {
      setError(ERROR_MESSAGES[res.error] ?? ERROR_MESSAGES.default);
      return;
    }
    if (res?.ok) {
      window.location.href = callbackUrl;
    }
  }

  async function handleOAuth(provider: 'google' | 'facebook') {
    await signIn(provider, { callbackUrl });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* OAuth buttons */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => handleOAuth('google')}
          disabled={loading}
          className="flex items-center justify-center gap-3 bg-white border-[1.5px] border-[var(--color-border)] text-ink-900 px-6 py-3 text-sm font-body font-semibold uppercase tracking-wider hover:border-ink-900 transition-all disabled:opacity-60"
        >
          <GoogleIcon />
          Continuar con Google
        </button>
        <button
          type="button"
          onClick={() => handleOAuth('facebook')}
          disabled={loading}
          className="flex items-center justify-center gap-3 bg-[#1877F2] border-[1.5px] border-[#1877F2] text-white px-6 py-3 text-sm font-body font-semibold uppercase tracking-wider hover:bg-[#166FE5] hover:border-[#166FE5] transition-all disabled:opacity-60"
        >
          <FacebookIcon />
          Continuar con Facebook
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-[var(--color-border)]" />
        <span className="text-[10px] uppercase tracking-widest text-ink-500">
          O con tu email
        </span>
        <div className="flex-1 h-px bg-[var(--color-border)]" />
      </div>

      {/* Credentials form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            disabled={loading}
            className="bg-white border border-[var(--color-border)] rounded-[2px] px-4 py-3 text-ink-900 text-sm focus:outline-none focus:border-ink-900 disabled:opacity-60"
            placeholder="tu@email.com"
          />
        </label>

        <label className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-widest text-ink-700">
              Contraseña
            </span>
            <a
              href="/recuperar"
              className="text-[11px] text-ink-500 underline hover:text-ink-900"
            >
              ¿La olvidaste?
            </a>
          </div>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="bg-white border border-[var(--color-border)] rounded-[2px] px-4 py-3 text-ink-900 text-sm focus:outline-none focus:border-ink-900 disabled:opacity-60"
            placeholder="••••••••"
          />
        </label>

        {error && (
          <p className="text-rust-500 text-sm" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" variant="accent" size="lg">
          {loading ? 'Ingresando...' : 'Iniciar sesión →'}
        </Button>
      </form>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.37-.35-2.1s.13-1.44.35-2.1V7.07H2.18A10.99 10.99 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.45 2.1 14.97 1 12 1A10.99 10.99 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07z" />
    </svg>
  );
}
