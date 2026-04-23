'use client';

import { useState, useMemo } from 'react';
import { ProductCard, type ProductCardProps } from '@/components/ProductCard';
import { CapsuleGroup, CapsuleGrid } from '@/components/CapsuleGroup';

type CapsuleView = {
  id: string;
  name: string;
  caption: string;
  description: string;
  products: ProductCardProps[];
};

type Props = {
  capsules: CapsuleView[];
  buzos: ProductCardProps[];
};

type TabId = string;

const BUZOS_ID = 'buzos';
const ALL_ID = 'all';

export function CatalogoClient({ capsules, buzos }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>(ALL_ID);

  const tabs = useMemo(
    () => [
      { id: ALL_ID, label: 'Todos' },
      ...capsules.map((c) => ({ id: c.id, label: c.name })),
      { id: BUZOS_ID, label: 'Buzos' },
    ],
    [capsules],
  );

  const showAll = activeTab === ALL_ID;
  const totalRemeras = capsules.reduce((n, c) => n + c.products.length, 0);

  return (
    <>
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
            if (capsule.products.length === 0) return null;
            return (
              <CapsuleGroup
                key={capsule.id}
                capsuleId={capsule.id}
                caption={capsule.caption}
                title={capsule.name}
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

          {(showAll || activeTab === BUZOS_ID) && buzos.length > 0 && (
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
            {capsules.length} {capsules.length === 1 ? 'cápsula' : 'cápsulas'} · {totalRemeras}{' '}
            {totalRemeras === 1 ? 'remera' : 'remeras'} · {buzos.length}{' '}
            {buzos.length === 1 ? 'buzo' : 'buzos'}
          </p>
        </div>
      </section>
    </>
  );
}
