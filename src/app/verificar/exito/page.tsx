import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';

export const metadata = {
  title: 'Email verificado',
  robots: { index: false, follow: false },
};

export default function VerifySuccessPage() {
  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1 bg-paper-100">
        <div className="max-w-[28rem] mx-auto px-4 py-16 text-center">
          <p className="text-caption text-rust-500 mb-3">✓ Email verificado</p>
          <h1 className="text-display-lg m-0 mb-4">¡Listo!</h1>
          <p className="text-body text-ink-700 leading-relaxed mb-8">
            Tu cuenta está activada. Ya podés iniciar sesión y empezar a
            explorar.
          </p>
          <Button href="/login" variant="accent" size="lg">
            Ir a iniciar sesión →
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
