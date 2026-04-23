import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SignupForm } from '@/components/SignupForm';

export const metadata = {
  title: 'Crear cuenta',
  description: 'Registrate en ROOTS LIFE. 10% OFF en tu primera compra.',
};

export default function SignupPage() {
  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1 bg-paper-100">
        <div className="max-w-[28rem] mx-auto px-4 py-12 lg:py-16">
          <div className="text-center mb-8">
            <p className="text-caption text-ink-500 mb-2">Nueva cuenta</p>
            <h1 className="text-display-lg m-0 mb-3">Crear cuenta</h1>
            <p className="text-body-sm text-ink-500">
              Registrate en un minuto. Llevate{' '}
              <strong className="text-ink-900">10% OFF</strong> en tu primera
              compra.
            </p>
          </div>

          <SignupForm />

          <p className="text-body-sm text-ink-500 text-center mt-6">
            ¿Ya tenés cuenta?{' '}
            <a href="/login" className="text-ink-900 underline hover:text-rust-500">
              Iniciá sesión
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
