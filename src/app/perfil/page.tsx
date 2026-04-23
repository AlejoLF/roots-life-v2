import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { auth } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export const metadata = {
  title: 'Mi perfil',
  robots: { index: false, follow: false },
};

export default async function PerfilPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login?callbackUrl=/perfil');

  const supabase = getSupabaseAdmin();
  const { data: user } = await supabase
    .from('users')
    .select('email, name, created_at, newsletter_opt_in')
    .eq('id', session.user.id)
    .maybeSingle();

  const { count: ordersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', session.user.id);

  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1 bg-paper-100">
        <div className="max-w-[42rem] mx-auto px-4 md:px-8 py-10 lg:py-16">
          <p className="text-caption text-ink-500 mb-2">Tu cuenta</p>
          <h1 className="text-display-lg m-0 mb-2">Hola, {user?.name ?? 'amigo'}</h1>
          <p className="text-body text-ink-500 mb-10">
            Desde acá vas a poder gestionar tus datos y ver todos tus pedidos.
          </p>

          {/* Datos de cuenta */}
          <section className="bg-white border border-[var(--color-border)] rounded-[4px] p-6 mb-6">
            <h2 className="text-caption text-ink-500 mb-4">Datos de cuenta</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-x-6 gap-y-3 text-sm">
              <dt className="text-ink-500 font-medium">Nombre</dt>
              <dd className="text-ink-900">{user?.name ?? '—'}</dd>
              <dt className="text-ink-500 font-medium">Email</dt>
              <dd className="text-ink-900">{user?.email ?? '—'}</dd>
              <dt className="text-ink-500 font-medium">Miembro desde</dt>
              <dd className="text-ink-900">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString('es-AR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : '—'}
              </dd>
              <dt className="text-ink-500 font-medium">Newsletter</dt>
              <dd className="text-ink-900">
                {user?.newsletter_opt_in ? 'Activado' : 'Desactivado'}
              </dd>
            </dl>
          </section>

          {/* Accesos */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/mis-pedidos"
              className="block bg-ink-900 text-paper-100 rounded-[4px] p-6 hover:bg-ink-700 transition-colors"
            >
              <p className="text-caption text-rust-200 mb-2">Pedidos</p>
              <h3 className="font-display font-bold text-xl uppercase mb-1">
                Mis pedidos
              </h3>
              <p className="text-white/70 text-sm">
                {ordersCount ?? 0} {ordersCount === 1 ? 'pedido' : 'pedidos'} en
                total
              </p>
            </Link>
            <Link
              href="/catalogo"
              className="block bg-white border border-[var(--color-border)] rounded-[4px] p-6 hover:border-ink-900 transition-colors"
            >
              <p className="text-caption text-ink-500 mb-2">Explorar</p>
              <h3 className="font-display font-bold text-xl uppercase mb-1">
                Ver catálogo
              </h3>
              <p className="text-ink-500 text-sm">
                Remeras, buzos y lo nuevo
              </p>
            </Link>
          </section>

          {/* Help / Legal */}
          <section className="mt-10 pt-8 border-t border-[var(--color-border)]">
            <p className="text-caption text-ink-500 mb-4">Cuenta y privacidad</p>
            <ul className="list-none p-0 m-0 space-y-2 text-sm">
              <li>
                <Link href="/recuperar" className="text-ink-900 underline hover:text-rust-500">
                  Cambiar contraseña
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-ink-900 underline hover:text-rust-500">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/eliminar-cuenta" className="text-ink-900 underline hover:text-rust-500">
                  Eliminar mi cuenta
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
