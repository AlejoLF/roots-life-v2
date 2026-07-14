import { getSheetRows, updateSheetCell } from './sheets';

/**
 * Utilidades de administración de productos sobre la Google Sheet.
 * Usado por el panel de subida de imágenes.
 *
 * Schema pestaña "productos" (columnas):
 *   A slug | B capsule_id | C title | D caption | E price | F installments
 *   G description | H XS | I S | J M | K L | L XL | M XXL
 *   N colors | O images | P badge | Q features | R active
 *
 * La columna de imágenes es la O (índice 14). Formato: URLs separadas por " | ".
 */

const PRODUCTS_RANGE = 'productos!A2:R';
const IMAGES_COL = 'O';

export type AdminProduct = {
  rowNumber: number; // fila real en la Sheet (con header = fila 1)
  slug: string;
  title: string;
  capsuleId: string;
  active: boolean;
  images: string[];
};

function parsePipeList(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Lista todos los productos de la Sheet para el selector del panel.
 */
export async function listAdminProducts(): Promise<AdminProduct[]> {
  const sheetId = process.env.PRODUCTS_SHEET_ID;
  if (!sheetId) throw new Error('PRODUCTS_SHEET_ID no configurado');

  const rows = await getSheetRows(sheetId, PRODUCTS_RANGE);

  return rows
    .map((row, i) => {
      const slug = (row[0] ?? '').trim();
      const title = (row[2] ?? '').trim();
      if (!slug || !title) return null;
      return {
        rowNumber: i + 2, // +2: header + índice base 0
        slug,
        title,
        capsuleId: (row[1] ?? '').trim(),
        active: (row[17] ?? '').trim().toUpperCase() === 'TRUE',
        images: parsePipeList(row[14]), // columna O
      } satisfies AdminProduct;
    })
    .filter((p): p is AdminProduct => p !== null);
}

/**
 * Devuelve un producto por slug.
 */
export async function getAdminProduct(
  slug: string,
): Promise<AdminProduct | null> {
  const all = await listAdminProducts();
  return all.find((p) => p.slug === slug.trim()) ?? null;
}

/**
 * Escribe la lista ordenada de URLs de imágenes en la columna O del producto.
 * La primera URL es la principal.
 */
export async function saveProductImages(
  slug: string,
  imageUrls: string[],
): Promise<void> {
  const sheetId = process.env.PRODUCTS_SHEET_ID;
  if (!sheetId) throw new Error('PRODUCTS_SHEET_ID no configurado');

  const product = await getAdminProduct(slug);
  if (!product) throw new Error(`Producto "${slug}" no encontrado en la Sheet`);

  const value = imageUrls.filter(Boolean).join(' | ');
  await updateSheetCell(
    sheetId,
    `productos!${IMAGES_COL}${product.rowNumber}`,
    value,
  );
}
