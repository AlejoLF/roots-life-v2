import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Política de privacidad',
  description:
    'Cómo recolectamos, usamos y protegemos tus datos personales en ROOTS LIFE.',
};

export default function PrivacidadPage() {
  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1">
        <article className="max-w-[42rem] mx-auto px-4 md:px-8 py-12 lg:py-16">
          <p className="text-caption text-ink-500 mb-3">Legales</p>
          <h1 className="text-display-lg m-0 mb-2">Política de privacidad</h1>
          <p className="text-body-sm text-ink-500 mb-10">
            Última actualización: 23 de abril de 2026
          </p>

          <Section title="1. Introducción">
            <p>
              En Roots Life nos comprometemos a proteger tus datos personales. Esta
              política explica qué datos recolectamos, cómo los usamos, con quién
              los compartimos y qué derechos tenés sobre ellos, en cumplimiento de
              la <strong>Ley 25.326 de Protección de Datos Personales</strong> de
              Argentina.
            </p>
          </Section>

          <Section title="2. Responsable del tratamiento">
            <p>
              <strong>Roots Life</strong>
              <br />
              CUIT: 20-35908470-7
              <br />
              Domicilio: Av. Kennedy 2665, Comodoro Rivadavia, Chubut, Argentina
              <br />
              Email:{' '}
              <a href="mailto:emma.irusta@hotmail.com" className="underline">
                emma.irusta@hotmail.com
              </a>
            </p>
          </Section>

          <Section title="3. Datos que recolectamos">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Datos de contacto:</strong> nombre, apellido, email,
                teléfono.
              </li>
              <li>
                <strong>Datos de envío:</strong> dirección, localidad, código
                postal, provincia.
              </li>
              <li>
                <strong>Datos de cuenta:</strong> email y contraseña (encriptada)
                si te registrás; o el identificador que nos provea Google o
                Facebook si ingresás por esas plataformas.
              </li>
              <li>
                <strong>Datos de compra:</strong> productos adquiridos, importe,
                historial de pedidos.
              </li>
              <li>
                <strong>Datos de navegación:</strong> IP, tipo de navegador,
                páginas visitadas, cookies. Ver{' '}
                <a href="/cookies" className="underline">
                  política de cookies
                </a>
                .
              </li>
              <li>
                <strong>Datos de suscripción:</strong> email para newsletter y
                preferencias de comunicación.
              </li>
            </ul>
            <p>
              <strong>No almacenamos</strong> datos de tu tarjeta de crédito ni
              débito. Esos datos los procesa exclusivamente Mercado Pago.
            </p>
          </Section>

          <Section title="4. Finalidad del tratamiento">
            <ul className="list-disc pl-6 space-y-2">
              <li>Procesar y entregar tus pedidos.</li>
              <li>Gestionar tu cuenta de usuario.</li>
              <li>Enviar comunicaciones transaccionales (confirmación de compra, estado de envío).</li>
              <li>Enviar newsletters con drops nuevos, solo si nos diste tu consentimiento.</li>
              <li>Atender consultas y reclamos.</li>
              <li>Cumplir obligaciones fiscales y legales.</li>
              <li>Mejorar el sitio mediante analíticas de uso.</li>
            </ul>
          </Section>

          <Section title="5. Base legal">
            <p>
              Tratamos tus datos en base a: (a) la ejecución del contrato de compra;
              (b) tu consentimiento expreso para comunicaciones de marketing; (c) el
              cumplimiento de obligaciones legales (fiscales, defensa al
              consumidor); y (d) nuestro interés legítimo en mejorar el servicio.
            </p>
          </Section>

          <Section title="6. Destinatarios y transferencias">
            <p>
              Compartimos datos solo con los proveedores estrictamente necesarios
              para prestar el servicio:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Mercado Pago</strong> (procesador de pagos) y{' '}
                <strong>Mercado Envíos</strong> (logística).
              </li>
              <li>
                <strong>Vercel</strong> (hosting del sitio — puede implicar
                transferencia internacional a Estados Unidos, con cláusulas
                estándar de protección).
              </li>
              <li>
                <strong>Google</strong> (autenticación opcional, Google Sheets
                para gestión interna).
              </li>
              <li>
                <strong>Supabase</strong> (base de datos de usuarios).
              </li>
              <li>
                <strong>Resend</strong> (servicio de envío de emails
                transaccionales).
              </li>
              <li>
                Autoridades competentes cuando la ley lo requiera.
              </li>
            </ul>
            <p>
              No vendemos ni cedemos tus datos a terceros con fines comerciales.
            </p>
          </Section>

          <Section title="7. Tiempo de conservación">
            <p>
              Conservamos tus datos mientras dure tu cuenta y durante los plazos
              legales exigidos (típicamente 10 años por motivos fiscales y de
              defensa del consumidor). Si cerrás la cuenta, los datos que no sea
              obligatorio conservar se eliminan.
            </p>
          </Section>

          <Section title="8. Tus derechos (ARCO)">
            <p>
              Tenés derecho a <strong>acceder, rectificar, cancelar y oponerte</strong>{' '}
              al tratamiento de tus datos. Para ejercerlos, escribinos a{' '}
              <a href="mailto:emma.irusta@hotmail.com" className="underline">
                emma.irusta@hotmail.com
              </a>{' '}
              indicando tu solicitud. Respondemos dentro de los 10 días hábiles.
            </p>
            <p>
              También podés reclamar ante la{' '}
              <strong>Agencia de Acceso a la Información Pública (AAIP)</strong>,
              órgano de control de la Ley 25.326.
            </p>
          </Section>

          <Section title="9. Seguridad">
            <p>
              Aplicamos medidas técnicas y organizativas razonables para proteger
              tus datos: encriptación de contraseñas, conexión HTTPS, acceso
              restringido, y proveedores que cumplen con estándares de seguridad.
              Ningún sistema es 100% seguro, pero nos tomamos esto con la seriedad
              que merece.
            </p>
          </Section>

          <Section title="10. Cookies">
            <p>
              Usamos cookies propias y de terceros para el funcionamiento del sitio,
              analíticas y personalización. Podés consultar los detalles en nuestra{' '}
              <a href="/cookies" className="underline">
                política de cookies
              </a>
              .
            </p>
          </Section>

          <Section title="11. Menores de edad">
            <p>
              El sitio no está dirigido a menores de 13 años. No recolectamos datos
              de menores conscientemente. Si detectamos un registro de un menor,
              lo eliminamos.
            </p>
          </Section>

          <Section title="12. Modificaciones">
            <p>
              Podemos actualizar esta política cuando corresponda. Los cambios
              relevantes se notifican por email o con un aviso destacado en el sitio.
            </p>
          </Section>

          <Section title="13. Contacto">
            <p>
              Cualquier duda o reclamo sobre esta política, escribinos a{' '}
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
