import { unstable_cache } from 'next/cache';
import { getSheetRows } from './sheets';
import { products as fallbackProducts, type ProductDetail } from '@/data/products';
import { getCapsules, type Capsule } from './capsules';

/**
 * Capa de lectura de productos.
 *
 * Fuente primaria: pestaña "productos" de la Google Sheet.
 * Fallback: array hardcodeado en src/data/products.ts.
 *
 * Schema Sheet (18 columnas):
 *   A slug | B capsule_id | C title | D caption | E price | F installments
 *   G description | H XS | I S | J M | K L | L XL | M XXL
 *   N colors | O images | P badge | Q features | R active
 *
 * Cache: 24h via unstable_cache, tag 'products'.
 * El endpoint /api/revalidate invalida ese tag.
 */

const SHEET_RANGE = 'productos!A2:R';
const SIZE_LABELS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function useSheetSource(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.PRODUCTS_SHEET_ID,
  );
}

function parseBool(raw: string | undefined): boolean {
  if (!raw) return false;
  const v = raw.toString().trim().toUpperCase();
  return v === 'TRUE' || v === 'VERDADERO' || v === '1';
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

function formatPrice(n: number): string {
  return `$${n.toLocaleString('es-AR')}`;
}

function rowToProduct(row: string[], capsules: Capsule[]): ProductDetail | null {
  const [
    slug,
    capsuleId,
    title,
    caption,
    priceRaw,
    installments,
    description,
    xs, s, m, l, xl, xxl,
    colorsRaw,
    imagesRaw,
    badge,
    featuresRaw,
    activeRaw,
  ] = row;

  if (!slug || !title) return null;
  if (!parseBool(activeRaw)) return null;

  const capsule = capsules.find((c) => c.id === (capsuleId ?? '').trim());
  const capsuleName = capsule?.name ?? (capsuleId ?? '').trim();

  const priceNumber = Number(priceRaw?.toString().replace(/[^\d]/g, '')) || 0;

  const sizeFlags = [xs, s, m, l, xl, xxl].map(parseBool);
  const sizes = SIZE_LABELS.filter((_, i) => sizeFlags[i]);

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
    capsuleName,
    title: title.trim(),
    caption: (caption ?? '').trim(),
    price: formatPrice(priceNumber),
    priceNumber,
    installments: installments?.toString().trim() || undefined,
    description: (description ?? '').trim(),
    images: images.length > 0 ? images : [{ src: '', label: 'Sin imagen' }],
    colors: colors.length > 0 ? colors : [{ name: 'Único', value: '#FAFAFA' }],
    sizes,
    badge: badge?.toString().trim() || undefined,
    features: features.length > 0 ? features : undefined,
  };
}

async function fetchProductsFromSheet(): Promise<ProductDetail[]> {
  const sheetId = process.env.PRODUCTS_SHEET_ID!;
  const [rows, capsules] = await Promise.all([
    getSheetRows(sheetId, SHEET_RANGE),
    getCapsules(),
  ]);
  return rows
    .map((row) => rowToProduct(row, capsules))
    .filter((p): p is ProductDetail => p !== null);
}

export const getProducts = unstable_cache(
  async (): Promise<ProductDetail[]> => {
    if (!useSheetSource()) return fallbackProducts;
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

/**
 * Devuelve cápsulas activas ordenadas, cada una con sus productos activos
 * derivados del catálogo. Usado por /catalogo y home.
 */
export async function getCapsulesWithProducts(): Promise<
  { capsule: Capsule; products: ProductDetail[] }[]
> {
  const [capsules, products] = await Promise.all([
    getCapsules(),
    getProducts(),
  ]);
  return capsules
    .filter((c) => c.active)
    .sort((a, b) => a.order - b.order)
    .map((capsule) => ({
      capsule,
      products: products.filter((p) => p.capsuleId === capsule.id),
    }));
}

/**
 * Featured = primer producto de cada cápsula activa (hasta 4).
 * Usado en home hero grid.
 */
export async function getFeaturedProducts(max = 4): Promise<ProductDetail[]> {
  const grouped = await getCapsulesWithProducts();
  return grouped
    .map((g) => g.products[0])
    .filter((p): p is ProductDetail => Boolean(p))
    .slice(0, max);
}

/**
 * Convierte ProductDetail al shape que espera ProductCard (grid views).
 * Usa la caption del producto tal cual viene de la Sheet — le da al cliente
 * control total sobre qué se ve en cada tarjeta.
 */
export function productToCardProps(p: ProductDetail): {
  image: string;
  caption: string;
  title: string;
  price: string;
  href: string;
  badge?: string;
} {
  return {
    image: p.images[0]?.src ?? '',
    caption: p.caption,
    title: p.title,
    price: p.price,
    href: `/producto/${p.slug}`,
    badge: p.badge,
  };
}

export type { ProductDetail };
