import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Términos y condiciones',
  description:
    'Términos y condiciones de uso del sitio y compras en ROOTS LIFE.',
};

export default function TerminosPage() {
  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1">
        <article className="max-w-[42rem] mx-auto px-4 md:px-8 py-12 lg:py-16">
          <p className="text-caption text-ink-500 mb-3">Legales</p>
          <h1 className="text-display-lg m-0 mb-2">Términos y condiciones</h1>
          <p className="text-body-sm text-ink-500 mb-10">
            Última actualización: 23 de abril de 2026
          </p>

          <Section title="1. Aceptación de los términos">
            <p>
              Al acceder y utilizar el sitio <strong>rootslife.shop</strong>, realizar una
              compra o suscribirte a nuestro newsletter, aceptás estos términos y
              condiciones. Si no estás de acuerdo, te pedimos que no uses el sitio.
            </p>
          </Section>

          <Section title="2. Identificación del prestador">
            <p>
              <strong>Razón social:</strong> Roots Life
              <br />
              <strong>CUIT:</strong> 20-35908470-7
              <br />
              <strong>Domicilio fiscal:</strong> Av. Kennedy 2665, Comodoro Rivadavia,
              Chubut (CP 9000), Argentina
              <br />
              <strong>Email de contacto:</strong>{' '}
              <a href="mailto:emma.irusta@hotmail.com" className="underline">
                emma.irusta@hotmail.com
              </a>
            </p>
          </Section>

          <Section title="3. Objeto">
            <p>
              Roots Life comercializa indumentaria urbana (remeras, buzos y piezas
              relacionadas) a través de este sitio web, con entrega a todo el
              territorio argentino.
            </p>
          </Section>

          <Section title="4. Registro de usuario">
            <p>
              Para realizar compras podés registrarte o comprar como invitado. El
              registro requiere datos personales válidos. Sos responsable de mantener
              la confidencialidad de tu contraseña y de todas las actividades que
              ocurran bajo tu cuenta.
            </p>
          </Section>

          <Section title="5. Proceso de compra">
            <p>
              Los productos se agregan al carrito y se confirman en el checkout. Al
              finalizar, aceptás el precio, los productos seleccionados y el costo
              de envío. El contrato se perfecciona con la confirmación del pago.
            </p>
          </Section>

          <Section title="6. Precios y medios de pago">
            <p>
              Todos los precios están expresados en pesos argentinos (ARS) e
              incluyen IVA. Pueden variar sin previo aviso, pero una vez confirmada
              la orden, el precio se respeta.
            </p>
            <p>
              Aceptamos los medios de pago habilitados por{' '}
              <strong>Mercado Pago</strong>: tarjetas de crédito y débito, efectivo
              (Pago Fácil, Rapipago), transferencia bancaria y saldo en cuenta. Las
              cuotas sin interés dependen de las promociones vigentes en Mercado
              Pago.
            </p>
          </Section>

          <Section title="7. Envíos">
            <p>
              Realizamos envíos a todo el país a través de{' '}
              <strong>Mercado Envíos</strong>. El costo y tiempo de entrega se
              calculan en el checkout según tu código postal y el peso del paquete.
              Una vez despachado el pedido recibís un código de seguimiento por
              email.
            </p>
          </Section>

          <Section title="8. Cambios y devoluciones">
            <p>
              Aceptamos cambios y devoluciones dentro de los{' '}
              <strong>15 días</strong> corridos desde que recibiste el producto,
              siempre que esté <strong>sin uso, con etiqueta original y en
              condiciones de reventa</strong>.
            </p>
            <p>
              El costo del envío de devolución corre por cuenta del comprador salvo
              en los casos de defecto de fábrica o error nuestro.
            </p>
          </Section>

          <Section title="9. Derecho de arrepentimiento (Ley 24.240, art. 34)">
            <p>
              Como consumidor podés arrepentirte de la compra dentro de los{' '}
              <strong>10 días hábiles</strong> desde la recepción del producto, sin
              necesidad de expresar causa. El producto debe devolverse en las
              mismas condiciones en que fue recibido.
            </p>
          </Section>

          <Section title="10. Reintegros">
            <p>
              En caso de devolución aceptada, el reintegro se realiza al mismo
              medio de pago utilizado, en un plazo de hasta{' '}
              <strong>10 días hábiles</strong> desde que recibimos y verificamos el
              producto devuelto.
            </p>
          </Section>

          <Section title="11. Responsabilidad">
            <p>
              No somos responsables por daños derivados del mal uso del producto ni
              por demoras en la entrega ocasionadas por el correo o situaciones de
              fuerza mayor. La información del sitio puede contener errores
              tipográficos o técnicos, que nos reservamos el derecho de corregir.
            </p>
          </Section>

          <Section title="12. Propiedad intelectual">
            <p>
              Todos los diseños, gráficos, logos, textos, fotografías y contenido
              del sitio son propiedad de Roots Life y están protegidos por leyes
              de propiedad intelectual. Queda prohibida su reproducción o uso sin
              autorización expresa.
            </p>
          </Section>

          <Section title="13. Modificaciones">
            <p>
              Podemos modificar estos términos en cualquier momento. Los cambios
              entran en vigencia al publicarse en el sitio. Te recomendamos
              revisarlos periódicamente. El uso continuado del sitio implica la
              aceptación de las modificaciones.
            </p>
          </Section>

          <Section title="14. Ley aplicable y jurisdicción">
            <p>
              Estos términos se rigen por las leyes de la República Argentina. Para
              cualquier controversia las partes se someten a los tribunales
              ordinarios de Comodoro Rivadavia, Chubut, renunciando expresamente a
              cualquier otro fuero.
            </p>
          </Section>

          <Section title="15. Contacto">
            <p>
              Para consultas, reclamos o ejercicio de derechos, escribinos a{' '}
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
