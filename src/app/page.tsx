import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Manifesto } from '@/components/Manifesto';
import { FeaturedCapsule } from '@/components/FeaturedCapsule';
import { StoryStrip } from '@/components/StoryStrip';
import { SerigrafiaCTA } from '@/components/SerigrafiaCTA';
import { InstagramFeed } from '@/components/InstagramFeed';
import { ProductCard } from '@/components/ProductCard';
import Link from 'next/link';
import { featuredProducts } from '@/data/catalog';

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1">
        {/* 1. Hero — full-bleed editorial con logo completo ROOTS LIFE */}
        <Hero />

        {/* 2. Manifesto — strip editorial "Real stories · Real clothes" */}
        <Manifesto />

        {/* 3. Featured capsule — No Bad Days · South Coast Series */}
        <FeaturedCapsule />

        {/* 4. Product grid — Lo más nuevo */}
        <section id="shop" className="py-16 lg:py-12">
          <div className="max-w-[75rem] mx-auto px-4 lg:px-8">
            <div className="flex justify-between items-baseline flex-wrap gap-4 mb-10">
              <h2 className="text-h2 m-0">Lo más nuevo</h2>
              <Link
                href="/catalogo"
                className="text-button text-ink-900 no-underline hover:text-rust-500 transition-colors"
              >
                Ver todo →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {featuredProducts.map((p) => (
                <ProductCard key={p.href} {...p} />
              ))}
            </div>
          </div>
        </section>

        {/* 5. Story strip — "Desde el sur" con foto antigua de Comodoro */}
        <StoryStrip />

        {/* 6. Serigrafía CTA — invertido dark */}
        <SerigrafiaCTA />

        {/* 7. Instagram feed — grid 3×2 / 6×1 */}
        <InstagramFeed />
      </main>

      <Footer />

      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/5492974000000"
        target="_blank"
        rel="noopener"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg z-50 hover:scale-105 transition-transform"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.52 3.48A11.88 11.88 0 0 0 12.06 0C5.5 0 .17 5.33.17 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.33-1.66a11.88 11.88 0 0 0 5.72 1.46h.01c6.56 0 11.89-5.33 11.89-11.9 0-3.18-1.24-6.17-3.43-8.42zM12.06 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.22-3.76.99 1-3.66-.23-.38a9.86 9.86 0 0 1-1.52-5.25c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.14 1.03 7.01 2.9a9.84 9.84 0 0 1 2.91 7.01c0 5.46-4.45 9.9-9.92 9.9zm5.44-7.43c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.09 3.2 5.07 4.48.71.31 1.26.5 1.69.64.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
        </svg>
      </a>
    </>
  );
}
