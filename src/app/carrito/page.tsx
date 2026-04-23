'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { ProductCard } from '@/components/ProductCard';
import { capsules } from '@/data/catalog';
import { useCart } from '@/hooks/useCart';
import { updateQty as updateQtyLS, removeFromCart } from '@/lib/cart';

const SHIPPING_THRESHOLD = 80000;

function formatARS(n: number) {
  return '$' + n.toLocaleString('es-AR');
}

export default function CarritoPage() {
  const { items, isReady } = useCart();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= SHIPPING_THRESHOLD ? 0 : 4500;
  const total = subtotal + shipping;
  const progressPct = Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100);
  const missingForShipping = Math.max(0, SHIPPING_THRESHOLD - subtotal);

  const related = capsules[0].products.slice(0, 4);

  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1">
        {/* Page head */}
        <section className="max-w-[75rem] mx-auto px-4 md:px-8 lg:px-12 py-10 lg:py-16">
          <p className="text-caption text-ink-500 mb-2">Tu compra</p>
          <h1 className="text-display-lg m-0 mb-2">Carrito</h1>
          <p className="text-body-sm text-ink-500 m-0">
            {isReady
              ? `${items.length} ${items.length === 1 ? 'pieza' : 'piezas'} · Envíos a toda Argentina`
              : 'Cargando...'}
          </p>
        </section>

        {/* Cart + summary */}
        {isReady && items.length === 0 ? (
          <section className="max-w-[42rem] mx-auto px-4 py-16 text-center">
            <div className="mb-6 opacity-40">
              <svg
                width="72"
                height="72"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto text-ink-500"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
              </svg>
            </div>
            <h2 className="text-h2 m-0 mb-3">Tu carrito está vacío</h2>
            <p className="text-body text-ink-500 mb-8 max-w-[28rem] mx-auto">
              Agregá productos desde el catálogo y aparecen acá con su precio y
              el resumen de envío.
            </p>
            <Button href="/catalogo" variant="accent" size="lg">
              Explorar catálogo →
            </Button>
          </section>
        ) : isReady ? (
          <section className="max-w-[75rem] mx-auto px-4 md:px-8 lg:px-12 pb-16 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 lg:gap-12">
            {/* Line items */}
            <div className="flex flex-col gap-5">
              {items.map((item) => {
                const meta = [item.color, item.size].filter(Boolean).join(' · ');
                const href = `/producto/${item.slug}`;
                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] gap-4 md:gap-6 pb-5 border-b border-[var(--color-border)]"
                  >
                    <Link
                      href={href}
                      className="bg-paper-200 bg-cover bg-center rounded-[2px] shadow-sm"
                      style={{
                        aspectRatio: '4/5',
                        backgroundImage: `url("${item.image}")`,
                      }}
                      aria-label={`Ver ${item.title}`}
                    />
                    <div className="flex flex-col gap-2 min-w-0">
                      <h2 className="text-lg md:text-xl font-medium leading-snug m-0">
                        <Link
                          href={href}
                          className="text-ink-900 no-underline hover:text-rust-500"
                        >
                          {item.title}
                        </Link>
                      </h2>
                      {meta && <p className="text-body-sm text-ink-500 m-0">{meta}</p>}
                      <div className="mt-auto pt-3 flex items-center justify-between gap-3 flex-wrap">
                        <div className="inline-flex items-center border-[1.5px] border-[var(--color-border)] rounded-[4px] h-10">
                          <button
                            onClick={() => updateQtyLS(item.id, item.quantity - 1)}
                            className="w-9 h-full hover:bg-ink-100"
                            aria-label="Restar"
                          >
                            −
                          </button>
                          <span className="min-w-[2rem] text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQtyLS(item.id, item.quantity + 1)}
                            className="w-9 h-full hover:bg-ink-100"
                            aria-label="Sumar"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-body font-medium m-0">
                          {formatARS(item.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs font-medium uppercase tracking-wide text-ink-500 underline underline-offset-[3px] hover:text-rust-700"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary sticky */}
            <aside className="bg-paper-100 border border-[var(--color-border)] rounded-[4px] shadow-sm p-5 md:p-6 flex flex-col gap-4 lg:sticky lg:top-[88px] lg:self-start">
              <h2 className="text-h2 m-0">Resumen</h2>

              {/* Shipping progress */}
              {shipping > 0 ? (
                <div className="bg-paper-200 p-3 px-4 rounded-[2px] text-xs text-ink-700">
                  <span>
                    Te faltan{' '}
                    <strong>{formatARS(missingForShipping)}</strong> para envío
                    gratis
                  </span>
                  <div className="mt-2 h-1 bg-paper-300 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-ink-900 transition-all"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-[#5A7E4A] text-paper-100 p-3 px-4 rounded-[2px] text-xs font-medium uppercase tracking-wide flex items-center gap-2">
                  <span>✓ Envío gratis desbloqueado</span>
                </div>
              )}

              {/* Totals */}
              <div className="border-t border-[var(--color-border)] pt-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatARS(subtotal)}</span>
                </div>
                <div className="flex justify-between text-ink-500">
                  <span>Envío</span>
                  <span>{shipping === 0 ? 'Gratis' : formatARS(shipping)}</span>
                </div>
                <div className="flex justify-between items-baseline border-t border-[var(--color-border)] pt-3 mt-1">
                  <span className="text-body font-medium">Total</span>
                  <span className="text-h3 font-semibold">{formatARS(total)}</span>
                </div>
              </div>

              {/* Promo (placeholder hasta que MP esté integrado) */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Código promo"
                  className="flex-1 h-10 px-3 border-[1.5px] border-[var(--color-border)] rounded-[4px] text-sm"
                />
                <button className="px-4 h-10 border-[1.5px] border-ink-900 rounded-[4px] text-xs font-medium uppercase tracking-wide hover:bg-ink-900 hover:text-paper-100 transition-colors">
                  Aplicar
                </button>
              </div>

              {/* CTAs */}
              <Button href="/checkout" variant="dark" size="lg" className="w-full">
                Finalizar compra →
              </Button>
              <Button href="/catalogo" variant="outline" size="md" className="w-full">
                Seguir comprando
              </Button>

              <p className="text-stamp text-ink-500 text-center">
                Pago seguro · Mercado Pago
              </p>
            </aside>
          </section>
        ) : null}

        {/* Related */}
        <section className="py-16 px-4 md:px-8 lg:px-12">
          <div className="max-w-[75rem] mx-auto">
            <div className="flex justify-between items-baseline flex-wrap gap-4 mb-10">
              <h2 className="text-h2 m-0">También te puede interesar</h2>
              <Link
                href="/catalogo"
                className="text-button text-ink-900 no-underline hover:text-rust-500"
              >
                Ver todo →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {related.map((p) => (
                <ProductCard key={p.href} {...p} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
