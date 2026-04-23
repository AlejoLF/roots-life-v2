import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CatalogoClient } from '@/components/CatalogoClient';
import { getCapsulesWithProducts, productToCardProps } from '@/lib/products';
import { buzos } from '@/data/catalog';

export const metadata = {
  title: 'Catálogo',
  description:
    'Colección completa de ROOTS LIFE — cápsulas, remeras y buzos. Serigrafía a mano desde Comodoro Rivadavia.',
};

export default async function CatalogoPage() {
  const grouped = await getCapsulesWithProducts();

  const capsules = grouped.map(({ capsule, products }) => ({
    id: capsule.id,
    name: capsule.name,
    caption: capsule.caption,
    description: capsule.description,
    products: products.map(productToCardProps),
  }));

  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1">
        <CatalogoClient capsules={capsules} buzos={buzos} />
      </main>
      <Footer />
    </>
  );
}
