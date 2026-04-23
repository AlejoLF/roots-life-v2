import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';

export const metadata = {
  title: 'Recuperar contraseña',
  description: 'Recuperá el acceso a tu cuenta de ROOTS LIFE.',
};

export default function RecuperarPage() {
  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1 bg-paper-100">
        <div className="max-w-[28rem] mx-auto px-4 py-16 text-center">
          <p className="text-caption text-ink-500 mb-3">Recuperar cuenta</p>
          <h1 className="text-display-lg m-0 mb-4">¿Olvidaste tu contraseña?</h1>
          <p className="text-body text-ink-700 leading-relaxed mb-8">
            Por ahora, escribinos a{' '}
            <a
              href="mailto:emma.irusta@hotmail.com"
              className="text-ink-900 underline hover:text-rust-500"
            >
              emma.irusta@hotmail.com
            </a>{' '}
            y te ayudamos a recuperar tu cuenta. Pronto vas a poder reiniciarla
            directamente desde acá.
          </p>
          <Button href="/login" variant="outline" size="md">
            ← Volver al login
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
