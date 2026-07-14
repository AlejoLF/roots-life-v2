import { getSupabaseAdmin } from './supabase';

/**
 * Supabase Storage — almacenamiento de imágenes de productos.
 * Bucket público `product-images`. Se crea automáticamente si no existe.
 */

const BUCKET = 'product-images';

let bucketReady = false;

async function ensureBucket(): Promise<void> {
  if (bucketReady) return;
  const supabase = getSupabaseAdmin();

  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET);

  if (!exists) {
    await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024, // 10 MB por archivo
      allowedMimeTypes: ['image/webp', 'image/jpeg', 'image/png'],
    });
  }
  bucketReady = true;
}

/**
 * Sube un buffer de imagen ya procesada (webp) al storage.
 * Devuelve la URL pública.
 */
export async function uploadProductImage(
  slug: string,
  buffer: Buffer,
  filename: string,
): Promise<string> {
  await ensureBucket();
  const supabase = getSupabaseAdmin();

  const path = `products/${slug}/${filename}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: 'image/webp',
    upsert: true,
    cacheControl: '31536000',
  });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Elimina una imagen del storage por su URL pública.
 * Best-effort: si falla, no rompe el flujo.
 */
export async function deleteProductImageByUrl(url: string): Promise<void> {
  try {
    const marker = `/${BUCKET}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return; // no es una URL de nuestro storage (ej: imagen legacy en /public)
    const path = url.slice(idx + marker.length);

    const supabase = getSupabaseAdmin();
    await supabase.storage.from(BUCKET).remove([path]);
  } catch (err) {
    console.error('[storage] deleteProductImageByUrl failed:', err);
  }
}

export function isStorageUrl(url: string): boolean {
  return url.includes(`/${BUCKET}/`);
}
