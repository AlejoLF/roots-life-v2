import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductDetail } from '@/components/ProductDetail';
import { products, getProduct, getRelated } from '@/data/products';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: 'Producto no encontrado' };
  return {
    title: `${product.title} · ${product.capsuleName}`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const relatedDetails = getRelated(slug, 4);
  const related = relatedDetails.map((p) => ({
    slug: p.slug,
    image: p.images[0].src,
    caption: `Remera · ${p.capsuleName.split(' · ')[0]}`,
    title: p.title,
    price: p.price,
    badge: p.badge,
  }));

  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1">
        <ProductDetail product={product} related={related} />
      </main>
      <Footer />
    </>
  );
}
