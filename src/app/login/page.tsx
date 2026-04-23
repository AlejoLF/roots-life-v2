import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LoginForm } from '@/components/LoginForm';

export const metadata = {
  title: 'Iniciar sesión',
  description: 'Ingresá a tu cuenta de ROOTS LIFE.',
};

type Props = {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1 bg-paper-100">
        <div className="max-w-[26rem] mx-auto px-4 py-12 lg:py-16">
          <div className="text-center mb-8">
            <p className="text-caption text-ink-500 mb-2">Bienvenido</p>
            <h1 className="text-display-lg m-0 mb-3">Iniciar sesión</h1>
            <p className="text-body-sm text-ink-500">
              Ingresá con tu email o con una red social.
            </p>
          </div>

          <LoginForm
            initialError={params.error}
            callbackUrl={params.callbackUrl ?? '/'}
          />

          <p className="text-body-sm text-ink-500 text-center mt-6">
            ¿Todavía no tenés cuenta?{' '}
            <a
              href="/signup"
              className="text-ink-900 underline hover:text-rust-500"
            >
              Crear una
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
