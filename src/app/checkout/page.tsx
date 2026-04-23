import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CheckoutClient } from '@/components/CheckoutClient';
import { auth } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export const metadata = {
  title: 'Finalizar compra',
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const session = await auth();
  let initialData: {
    email: string;
    firstName: string;
    lastName: string;
  } | null = null;

  if (session?.user?.id) {
    const supabase = getSupabaseAdmin();
    const { data: user } = await supabase
      .from('users')
      .select('email, name')
      .eq('id', session.user.id)
      .maybeSingle();
    if (user) {
      const parts = (user.name ?? '').split(' ');
      initialData = {
        email: user.email,
        firstName: parts[0] ?? '',
        lastName: parts.slice(1).join(' '),
      };
    }
  }

  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1 bg-paper-100">
        <CheckoutClient initialData={initialData} />
      </main>
      <Footer />
    </>
  );
}
