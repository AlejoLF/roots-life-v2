import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Política de cookies',
  description: 'Uso de cookies en el sitio ROOTS LIFE.',
};

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1">
        <article className="max-w-[42rem] mx-auto px-4 md:px-8 py-12 lg:py-16">
          <p className="text-caption text-ink-500 mb-3">Legales</p>
          <h1 className="text-display-lg m-0 mb-2">Política de cookies</h1>
          <p className="text-body-sm text-ink-500 mb-10">
            Última actualización: 23 de abril de 2026
          </p>

          <Section title="1. Qué son las cookies">
            <p>
              Las cookies son pequeños archivos de texto que los sitios web guardan
              en tu dispositivo cuando los visitás. Sirven para recordar
              preferencias, mantenerte logueado, medir el tráfico y mejorar la
              experiencia.
            </p>
          </Section>

          <Section title="2. Qué cookies usamos">
            <p>Este sitio usa los siguientes tipos de cookies:</p>
            <ul className="list-disc pl-6 space-y-3 mt-3">
              <li>
                <strong>Esenciales (propias):</strong> necesarias para que el sitio
                funcione. Guardan tu sesión, el contenido del carrito, tu estado
                de login y tus preferencias básicas. No se pueden desactivar.
              </li>
              <li>
                <strong>Funcionales (propias):</strong> recuerdan si ya viste el
                popup de newsletter y cuándo lo cerraste, para no molestarte cada
                vez que entrás.
              </li>
              <li>
                <strong>Analíticas (terceros):</strong> nos ayudan a entender qué
                páginas se visitan más y cómo se usa el sitio. No identifican
                individuos.
              </li>
              <li>
                <strong>De autenticación (terceros):</strong> si ingresás con
                Google o Facebook, esos servicios usan sus propias cookies para
                confirmar tu identidad.
              </li>
              <li>
                <strong>De pago (terceros):</strong> Mercado Pago usa cookies
                propias durante el checkout para procesar la transacción.
              </li>
            </ul>
          </Section>

          <Section title="3. Cookies de terceros">
            <p>Los principales terceros con los que interactuamos son:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong>Google</strong> — autenticación opcional y Google Analytics
                si se activa.
              </li>
              <li>
                <strong>Facebook</strong> — autenticación opcional.
              </li>
              <li>
                <strong>Mercado Pago</strong> — procesamiento de pagos.
              </li>
              <li>
                <strong>Vercel</strong> — hosting.
              </li>
            </ul>
            <p>
              Cada uno tiene su propia política de cookies. Te recomendamos
              revisarla si querés detalles específicos.
            </p>
          </Section>

          <Section title="4. Cómo gestionar las cookies">
            <p>
              Podés controlar y eliminar las cookies desde la configuración de tu
              navegador. Tené en cuenta que bloquear las cookies esenciales hace
              que el sitio no funcione correctamente (por ejemplo, no vas a poder
              loguearte ni comprar).
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>
                <strong>Chrome:</strong> Configuración → Privacidad y seguridad →
                Cookies
              </li>
              <li>
                <strong>Firefox:</strong> Opciones → Privacidad y seguridad →
                Cookies
              </li>
              <li>
                <strong>Safari:</strong> Preferencias → Privacidad
              </li>
              <li>
                <strong>Edge:</strong> Configuración → Privacidad → Cookies
              </li>
            </ul>
          </Section>

          <Section title="5. Cambios en esta política">
            <p>
              Podemos actualizar esta política para reflejar cambios en las cookies
              que usamos o en la legislación aplicable. La versión vigente siempre
              está publicada en esta página.
            </p>
          </Section>

          <Section title="6. Contacto">
            <p>
              Consultas sobre cookies a{' '}
              <a href="mailto:emma.irusta@hotmail.com" className="underline">
                emma.irusta@hotmail.com
              </a>
              .
            </p>
          </Section>
        </article>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-h3 text-ink-900 mb-3 mt-8">{title}</h2>
      <div className="text-body text-ink-700 leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}
