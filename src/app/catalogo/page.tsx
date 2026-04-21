'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { CapsuleGroup, CapsuleGrid } from '@/components/CapsuleGroup';
import { capsules, buzos } from '@/data/catalog';

type TabId = 'all' | 'numerologia' | 'south-coast' | 'postales' | 'roots' | 'buzos';

const tabs: { id: TabId; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'numerologia', label: 'Numerología' },
  { id: 'south-coast', label: 'South Coast' },
  { id: 'postales', label: 'Postales' },
  { id: 'roots', label: 'ROOTS' },
  { id: 'buzos', label: 'Buzos' },
];

export default function CatalogoPage() {
  const [activeTab, setActiveTab] = useState<TabId>('all');

  const showAll = activeTab === 'all';

  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1">
        {/* Page head */}
        <section className="py-10 lg:py-16 px-4 md:px-8 lg:px-12">
          <div className="max-w-[75rem] mx-auto">
            <p className="text-caption text-ink-500 mb-2">Shop · Colección 2026</p>
            <h1 className="text-display-lg m-0">Catálogo</h1>
          </div>
        </section>

        {/* Toolbar sticky */}
        <div className="sticky top-[58px] lg:top-[72px] z-20 bg-paper-100 border-b border-[var(--color-border)]">
          <div className="max-w-[75rem] mx-auto px-4 md:px-8 lg:px-12 py-3 flex items-center gap-3">
            <div className="flex gap-2 overflow-x-auto py-1 flex-1 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  aria-pressed={activeTab === tab.id}
                  className={`flex-shrink-0 px-3 md:px-4 py-2 border-[1.5px] rounded-full text-[11px] md:text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-ink-900 text-paper-100 border-ink-900'
                      : 'bg-transparent text-ink-700 border-[var(--color-border)] hover:border-ink-500'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Catalog groups */}
        <section aria-label="Productos" className="py-10 lg:py-16 px-4 md:px-8 lg:px-12">
          <div className="max-w-[75rem] mx-auto space-y-16 lg:space-y-24">
            {capsules.map((capsule) => {
              const visible = showAll || activeTab === capsule.id;
              if (!visible) return null;
              return (
                <CapsuleGroup
                  key={capsule.id}
                  capsuleId={capsule.id}
                  caption={capsule.caption}
                  title={capsule.title}
                  description={capsule.description}
                >
                  <CapsuleGrid>
                    {capsule.products.map((p) => (
                      <ProductCard key={p.href} {...p} />
                    ))}
                  </CapsuleGrid>
                </CapsuleGroup>
              );
            })}

            {(showAll || activeTab === 'buzos') && (
              <CapsuleGroup
                capsuleId="buzos"
                caption="Sección · Línea estable"
                title="Buzos"
                description="Líneas Tipográfica, Locals y Kobe. Prendas de siempre, por fuera de las cápsulas."
              >
                <CapsuleGrid>
                  {buzos.map((b) => (
                    <ProductCard key={b.href} {...b} />
                  ))}
                </CapsuleGrid>
              </CapsuleGroup>
            )}

            <p className="text-stamp text-ink-500 text-center mt-16 lg:mt-24">
              4 cápsulas · 12 remeras · 6 buzos
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
