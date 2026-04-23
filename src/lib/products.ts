import { unstable_cache } from 'next/cache';
import { getSheetRows } from './sheets';
import { products as fallbackProducts, type ProductDetail } from '@/data/products';

/**
 * Capa de lectura de productos.
 *
 * Fuente primaria: Google Sheet del cliente (tab "productos").
 * Fallback: array hardcodeado en src/data/products.ts.
 *
 * Cache: 24h via unstable_cache, tag 'products'. El endpoint /api/revalidate
 * invalida este tag para forzar re-fetch desde la Sheet.
 */

const SHEET_RANGE = 'productos!A2:N';

function useSheetSource(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.PRODUCTS_SHEET_ID,
  );
}

function parsePipePairs(raw: string): { name: string; value: string }[] {
  if (!raw) return [];
  return raw
    .split('|')
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const [name, ...rest] = chunk.split(':');
      return { name: name.trim(), value: rest.join(':').trim() };
    })
    .filter((pair) => pair.name && pair.value);
}

function parsePipeList(raw: string): string[] {
  if (!raw) return [];
  return raw
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseCommaList(raw: string): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function formatPrice(n: number): string {
  return `$${n.toLocaleString('es-AR')}`;
}

function rowToProduct(row: string[]): ProductDetail | null {
  const [
    slug,
    capsuleId,
    capsuleName,
    title,
    caption,
    priceRaw,
    installments,
    description,
    sizesRaw,
    colorsRaw,
    imagesRaw,
    badge,
    featuresRaw,
    activeRaw,
  ] = row;

  if (!slug || !title) return null;
  if (activeRaw && activeRaw.toUpperCase() === 'FALSE') return null;

  const priceNumber = Number(priceRaw?.replace(/[^\d]/g, '')) || 0;

  const colors = parsePipePairs(colorsRaw ?? '').map((p) => ({
    name: p.name,
    value: p.value,
  }));

  const images = parsePipeList(imagesRaw ?? '').map((src, i) => ({
    src,
    label: i === 0 ? 'Frontal' : `Vista ${i + 1}`,
  }));

  const features = parsePipePairs(featuresRaw ?? '').map((p) => ({
    label: p.name,
    value: p.value,
  }));

  return {
    slug: slug.trim(),
    capsuleId: (capsuleId ?? '').trim(),
    capsuleName: (capsuleName ?? '').trim(),
    title: title.trim(),
    caption: (caption ?? '').trim(),
    price: formatPrice(priceNumber),
    priceNumber,
    installments: installments?.trim() || undefined,
    description: (description ?? '').trim(),
    images: images.length > 0 ? images : [{ src: '', label: 'Sin imagen' }],
    colors: colors.length > 0 ? colors : [{ name: 'Único', value: '#FAFAFA' }],
    sizes: parseCommaList(sizesRaw ?? ''),
    badge: badge?.trim() || undefined,
    features: features.length > 0 ? features : undefined,
  };
}

async function fetchProductsFromSheet(): Promise<ProductDetail[]> {
  const sheetId = process.env.PRODUCTS_SHEET_ID!;
  const rows = await getSheetRows(sheetId, SHEET_RANGE);
  return rows
    .map(rowToProduct)
    .filter((p): p is ProductDetail => p !== null);
}

export const getProducts = unstable_cache(
  async (): Promise<ProductDetail[]> => {
    if (!useSheetSource()) {
      return fallbackProducts;
    }
    try {
      const fromSheet = await fetchProductsFromSheet();
      if (fromSheet.length === 0) {
        console.warn('[products] Sheet returned 0 rows, using fallback');
        return fallbackProducts;
      }
      return fromSheet;
    } catch (err) {
      console.error('[products] Failed to fetch from Sheet:', err);
      return fallbackProducts;
    }
  },
  ['products'],
  {
    tags: ['products'],
    revalidate: 86400,
  },
);

export async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | undefined> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug);
}

export async function getRelatedProducts(
  slug: string,
  max = 4,
): Promise<ProductDetail[]> {
  const all = await getProducts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return all.slice(0, max);
  return all
    .filter((p) => p.slug !== slug)
    .sort((a, b) => (a.capsuleId === current.capsuleId ? -1 : 1))
    .slice(0, max);
}

export type { ProductDetail };
