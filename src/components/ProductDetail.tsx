'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from './Button';
import { ProductCard } from './ProductCard';
import type { ProductDetail as ProductDetailType } from '@/data/products';
import { addToCart } from '@/lib/cart';

type ProductDetailProps = {
  product: ProductDetailType;
  related: { slug: string; image: string; caption: string; title: string; price: string; badge?: string }[];
};

export function ProductDetail({ product, related }: ProductDetailProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[Math.floor(product.sizes.length / 2)] ?? product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name ?? '');
  const [qty, setQty] = useState(1);
  const [openSection, setOpenSection] = useState<string | null>('descripcion');
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    const id = `${product.slug}-${selectedSize || 'na'}-${selectedColor || 'na'}`;
    addToCart(
      {
        id,
        slug: product.slug,
        title: product.title,
        image: product.images[0]?.src ?? '',
        price: product.priceNumber,
        size: selectedSize || undefined,
        color: selectedColor || undefined,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  function handleBuyNow() {
    handleAddToCart();
    router.push('/checkout');
  }

  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="px-4 md:px-8 lg:px-12 py-6 max-w-[75rem] mx-auto">
        <ol className="flex items-center gap-2 m-0 p-0 list-none text-[11px] font-medium tracking-widest uppercase text-ink-500 flex-wrap">
          <li><Link href="/" className="text-inherit no-underline hover:text-ink-900">Inicio</Link></li>
          <li className="text-ink-300">/</li>
          <li><Link href="/catalogo" className="text-inherit no-underline hover:text-ink-900">Shop</Link></li>
          <li className="text-ink-300">/</li>
          <li>
            <Link
              href={`/catalogo?capsula=${product.capsuleId}`}
              className="text-inherit no-underline hover:text-ink-900"
            >
              {product.capsuleName}
            </Link>
          </li>
          <li className="text-ink-300">/</li>
          <li className="text-ink-900">{product.title}</li>
        </ol>
      </nav>

      {/* PDP split */}
      <section className="max-w-[75rem] mx-auto px-4 md:px-8 lg:px-12 py-5 pb-16 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-16">
        {/* Gallery */}
        <div className="flex flex-col gap-3">
          <div
            className="bg-paper-200 bg-cover bg-center rounded-[2px] shadow-sm"
            style={{
              aspectRatio: '4/5',
              backgroundImage: `url("${product.images[selectedImage].src}")`,
            }}
            role="img"
            aria-label={`${product.title} — ${product.images[selectedImage].label}`}
          />
          {product.images.length > 1 && (
            <div className="grid grid-cols-3 gap-3 max-w-[50%]">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  aria-pressed={selectedImage === i}
                  aria-label={img.label}
                  className={`aspect-square bg-paper-200 bg-cover bg-center rounded-[2px] border-2 transition-colors ${
                    selectedImage === i ? 'border-ink-900' : 'border-transparent hover:border-ink-500'
                  }`}
                  style={{ backgroundImage: `url("${img.src}")` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-[88px] lg:self-start lg:pt-4">
          <div>
            <p className="text-caption text-ink-500 m-0">{product.caption}</p>
            <h1 className="text-display-lg m-0 mt-1 mb-2">{product.title}</h1>
            <p className="text-body-lg text-ink-900 m-0">
              {product.price}
              {product.installments && (
                <small className="text-xs font-medium text-ink-500 ml-2 tracking-wider uppercase">
                  {product.installments}
                </small>
              )}
            </p>
          </div>

          <p className="text-body text-ink-500 m-0 max-w-[32rem]">{product.description}</p>

          {/* Color */}
          {product.colors.length > 0 && (
            <div>
              <div className="flex justify-between items-baseline text-[10px] font-medium uppercase tracking-widest text-ink-500 mb-3">
                <span>Color · {selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    aria-pressed={selectedColor === c.name}
                    aria-label={`Color ${c.name}`}
                    className={`w-11 h-11 rounded-full border-2 relative transition-colors ${
                      selectedColor === c.name
                        ? 'border-ink-900'
                        : 'border-[var(--color-border)] hover:border-ink-500'
                    }`}
                  >
                    <span className="absolute inset-[3px] rounded-full" style={{ background: c.value }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          <div>
            <div className="flex justify-between items-baseline text-[10px] font-medium uppercase tracking-widest text-ink-500 mb-3">
              <span>Talle</span>
              <Link href="/talles" className="text-ink-900 no-underline border-b border-current">
                Guía de talles
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  aria-pressed={selectedSize === s}
                  className={`min-w-[52px] h-11 px-3 rounded-[4px] border-[1.5px] text-sm font-medium uppercase tracking-wide transition-all ${
                    selectedSize === s
                      ? 'bg-ink-900 text-paper-100 border-ink-900'
                      : 'bg-transparent text-ink-900 border-[var(--color-border)] hover:border-ink-500'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + CTA */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center border-[1.5px] border-[var(--color-border)] rounded-[4px] h-12">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-11 h-full font-medium text-lg hover:bg-ink-100"
                  aria-label="Restar"
                >
                  −
                </button>
                <span className="min-w-[2.5rem] text-center text-sm font-medium">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(qty + 1)}
                  className="w-11 h-full font-medium text-lg hover:bg-ink-100"
                  aria-label="Sumar"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 min-w-[200px] bg-ink-900 text-paper-100 border-[1.5px] border-ink-900 hover:bg-ink-700 hover:border-ink-700 px-8 py-4 text-sm font-body font-semibold uppercase tracking-wider transition-all"
              >
                {added ? '✓ Agregado al carrito' : 'Agregar al carrito →'}
              </button>
            </div>
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full bg-rust-500 text-paper-100 border-[1.5px] border-rust-500 hover:bg-rust-700 hover:border-rust-700 px-8 py-4 text-sm font-body font-semibold uppercase tracking-wider transition-all"
            >
              Comprar ahora · Mercado Pago →
            </button>
          </div>

          {/* Shipping banner */}
          <div className="flex items-center gap-3 bg-paper-200 p-4 rounded-[4px] text-sm text-ink-700">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <span>Envío gratis en compras superiores a $80.000. Despachos a toda Argentina.</span>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <ul className="list-none p-0 m-0 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-[var(--color-border)] pt-4">
              {product.features.map((f) => (
                <li key={f.label}>
                  <strong className="block text-[10px] font-medium uppercase tracking-widest text-ink-500 mb-1">
                    {f.label}
                  </strong>
                  <span className="text-body-sm text-ink-900">{f.value}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Accordion */}
          <div className="border-t border-[var(--color-border)]">
            {[
              { id: 'descripcion', title: 'Descripción', content: product.description },
              {
                id: 'composicion',
                title: 'Composición y cuidados',
                content:
                  'Algodón peinado o jersey orgánico. Lavar del revés con agua fría. No usar secadora. Planchar del revés sobre la estampa.',
              },
              {
                id: 'envios',
                title: 'Envíos y devoluciones',
                content:
                  'Enviamos por Correo Argentino y Andreani. Envío gratis desde $80.000. Cambios dentro de 30 días con etiquetas intactas.',
              },
            ].map((item) => (
              <div key={item.id} className="border-b border-[var(--color-border)]">
                <button
                  onClick={() => setOpenSection(openSection === item.id ? null : item.id)}
                  aria-expanded={openSection === item.id}
                  className="w-full flex justify-between items-center py-5 text-left text-sm font-medium uppercase tracking-wider text-ink-900"
                >
                  <span>{item.title}</span>
                  <span aria-hidden className="text-xl">{openSection === item.id ? '−' : '+'}</span>
                </button>
                {openSection === item.id && (
                  <div className="pb-5 text-sm text-ink-500 leading-relaxed">{item.content}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-16 px-4 md:px-8 lg:px-12">
          <div className="max-w-[75rem] mx-auto">
            <div className="flex justify-between items-baseline flex-wrap gap-4 mb-10">
              <h2 className="text-h2 m-0">También te puede gustar</h2>
              <Link href="/catalogo" className="text-button text-ink-900 no-underline hover:text-rust-500 transition-colors">
                Ver todo →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {related.map((r) => (
                <ProductCard
                  key={r.slug}
                  image={r.image}
                  caption={r.caption}
                  title={r.title}
                  price={r.price}
                  href={`/producto/${r.slug}`}
                  badge={r.badge}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
