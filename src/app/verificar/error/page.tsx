import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';

export const metadata = {
  title: 'Error de verificación',
  robots: { index: false, follow: false },
};

const REASONS: Record<string, string> = {
  missing_token: 'El link no incluye un token de verificación.',
  invalid_token: 'El link no es válido o ya fue usado.',
  expired_token: 'El link expiró. Pedí uno nuevo desde la página de login.',
  update_failed: 'No pudimos verificar tu cuenta. Probá de nuevo.',
};

type Props = {
  searchParams: Promise<{ reason?: string }>;
};

export default async function VerifyErrorPage({ searchParams }: Props) {
  const params = await searchParams;
  const reason = params.reason ?? 'invalid_token';
  const message = REASONS[reason] ?? REASONS.invalid_token;

  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1 bg-paper-100">
        <div className="max-w-[28rem] mx-auto px-4 py-16 text-center">
          <p className="text-caption text-rust-500 mb-3">✗ Verificación fallida</p>
          <h1 className="text-display-lg m-0 mb-4">No pudimos verificar</h1>
          <p className="text-body text-ink-700 leading-relaxed mb-8">{message}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/signup" variant="accent" size="md">
              Registrarme de nuevo
            </Button>
            <Button href="/login" variant="outline" size="md">
              Ir a login
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
