import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Eliminar cuenta y datos',
  description:
    'Cómo eliminar tu cuenta y tus datos personales de ROOTS LIFE.',
};

export default function EliminarCuentaPage() {
  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1">
        <article className="max-w-[42rem] mx-auto px-4 md:px-8 py-12 lg:py-16">
          <p className="text-caption text-ink-500 mb-3">Legales</p>
          <h1 className="text-display-lg m-0 mb-2">
            Eliminación de cuenta y datos
          </h1>
          <p className="text-body-sm text-ink-500 mb-10">
            Última actualización: 23 de abril de 2026
          </p>

          <Section title="Tu derecho a eliminar tu cuenta">
            <p>
              En ROOTS LIFE respetamos tu privacidad y tu derecho a controlar tus
              datos personales, conforme a la{' '}
              <strong>Ley 25.326 de Protección de Datos Personales</strong> de
              Argentina. Podés solicitar la eliminación de tu cuenta y de los
              datos asociados en cualquier momento.
            </p>
          </Section>

          <Section title="Qué se elimina">
            <ul className="list-disc pl-6 space-y-2">
              <li>Tu nombre, email y contraseña</li>
              <li>Tu perfil de usuario y preferencias</li>
              <li>Tu historial de navegación y cookies asociadas</li>
              <li>Tu suscripción al newsletter (si la tenías activa)</li>
              <li>Tus vínculos con Google o Facebook (si los usaste para ingresar)</li>
            </ul>
          </Section>

          <Section title="Qué se conserva (por obligación legal)">
            <p>
              Según normativa fiscal y de defensa del consumidor, algunos datos
              asociados a compras realizadas deben conservarse por{' '}
              <strong>hasta 10 años</strong>:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Registros de facturación y datos fiscales</li>
              <li>Historial de pedidos (con datos anonimizados cuando es posible)</li>
              <li>Comprobantes de pago</li>
            </ul>
            <p>
              Estos registros se usan solo para cumplir obligaciones legales y no
              se utilizan para marketing ni se comparten comercialmente.
            </p>
          </Section>

          <Section title="Cómo solicitar la eliminación">
            <p>
              Enviá un email a{' '}
              <a
                href="mailto:emma.irusta@hotmail.com?subject=Solicitud%20de%20eliminaci%C3%B3n%20de%20cuenta"
                className="text-ink-900 underline hover:text-rust-500"
              >
                emma.irusta@hotmail.com
              </a>{' '}
              con el asunto <strong>"Eliminación de cuenta"</strong> desde la
              dirección asociada a tu cuenta, indicando:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Tu email registrado</li>
              <li>Nombre y apellido</li>
              <li>Confirmación explícita de que querés eliminar tu cuenta y datos</li>
            </ul>
            <p>
              Procesamos las solicitudes en un plazo máximo de{' '}
              <strong>10 días hábiles</strong> y te confirmamos por email cuando
              se completó.
            </p>
          </Section>

          <Section title="Si ingresaste con Facebook o Google">
            <p>
              La eliminación de tu cuenta de ROOTS LIFE no afecta tus cuentas en
              Facebook o Google — esas las administrás desde cada plataforma. Lo
              que sí hacemos es romper el vínculo de esas cuentas con nuestra
              base de datos y eliminar cualquier información que hayamos recibido
              al momento del ingreso.
            </p>
          </Section>

          <Section title="Eliminación automática futura">
            <p>
              Estamos trabajando en una opción de eliminación automática desde tu
              perfil. Mientras tanto, el proceso manual por email es el más
              seguro para verificar tu identidad.
            </p>
          </Section>

          <Section title="Contacto">
            <p>
              Cualquier duda sobre este proceso, escribinos a{' '}
              <a
                href="mailto:emma.irusta@hotmail.com"
                className="text-ink-900 underline hover:text-rust-500"
              >
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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-h3 text-ink-900 mb-3 mt-8">{title}</h2>
      <div className="text-body text-ink-700 leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}
