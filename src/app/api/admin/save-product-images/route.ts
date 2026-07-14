import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { checkAdminAuth } from '@/lib/admin-auth';
import { saveProductImages, getAdminProduct } from '@/lib/products-admin';
import { deleteProductImageByUrl, isStorageUrl } from '@/lib/storage';

export const runtime = 'nodejs';

/**
 * Guarda la lista ordenada de URLs en la columna images del producto (Sheet),
 * borra del storage las imágenes que se hayan quitado, y revalida el sitio.
 *
 * Body JSON: { slug: string, imageUrls: string[] }
 */
export async function POST(req: NextRequest) {
  const authError = checkAdminAuth(req);
  if (authError) {
    return NextResponse.json({ ok: false, error: authError }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido' }, { status: 400 });
  }

  const { slug, imageUrls } = body as { slug?: string; imageUrls?: string[] };

  if (!slug || !Array.isArray(imageUrls)) {
    return NextResponse.json(
      { ok: false, error: 'Faltan slug o imageUrls' },
      { status: 400 },
    );
  }

  try {
    // Detectar imágenes eliminadas (estaban antes, ya no) para limpiar storage
    const before = await getAdminProduct(slug);
    const oldUrls = before?.images ?? [];
    const removed = oldUrls.filter(
      (u) => isStorageUrl(u) && !imageUrls.includes(u),
    );

    // Escribir la lista nueva en la Sheet
    await saveProductImages(slug, imageUrls);

    // Limpiar storage (best-effort, no bloqueante para el resultado)
    await Promise.allSettled(removed.map((u) => deleteProductImageByUrl(u)));

    // Revalidar el sitio
    revalidateTag('products', 'max');
    revalidatePath('/', 'page');
    revalidatePath('/catalogo', 'page');
    revalidatePath('/producto/[slug]', 'page');

    return NextResponse.json({
      ok: true,
      saved: imageUrls.length,
      cleaned: removed.length,
    });
  } catch (err) {
    console.error('[save-product-images] failed:', err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Error al guardar' },
      { status: 500 },
    );
  }
}
