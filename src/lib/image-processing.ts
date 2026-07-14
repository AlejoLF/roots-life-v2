import sharp from 'sharp';

/**
 * Procesamiento de imágenes de producto.
 *
 * Toma cualquier formato de entrada (JPG, PNG, HEIC, WebP, etc.) y devuelve
 * un WebP normalizado al aspect ratio 4:5 de la web, con relleno del color
 * papel (#FAFAFA) para que la prenda nunca se corte y todas las fotos queden
 * uniformes en la tarjeta y en el detalle.
 */

// 4:5 — mismo aspect ratio que --aspect-product en globals.css
const TARGET_WIDTH = 1200;
const TARGET_HEIGHT = 1500;

// Color del box de producto (--paper-200)
const PAPER_BG = { r: 250, g: 250, b: 250, alpha: 1 };

export type ProcessMode = 'contain' | 'cover';

/**
 * Procesa una imagen.
 * - mode 'contain' (default): encuadra la imagen entera en 4:5 con padding papel.
 *   Nada se corta. Recomendado para prendas.
 * - mode 'cover': recorta para llenar el 4:5 completo. Más editorial pero puede cortar.
 */
export async function processProductImage(
  input: Buffer,
  mode: ProcessMode = 'contain',
): Promise<Buffer> {
  const pipeline = sharp(input, { failOn: 'none' }).rotate(); // rotate() respeta EXIF orientation (fotos de celu)

  if (mode === 'cover') {
    return pipeline
      .resize(TARGET_WIDTH, TARGET_HEIGHT, {
        fit: 'cover',
        position: 'attention', // recorta priorizando el sujeto
      })
      .webp({ quality: 82 })
      .toBuffer();
  }

  // contain: fit dentro del 4:5 y rellena con papel
  return pipeline
    .resize(TARGET_WIDTH, TARGET_HEIGHT, {
      fit: 'contain',
      background: PAPER_BG,
    })
    .flatten({ background: PAPER_BG }) // aplana transparencias (PNG) sobre papel
    .webp({ quality: 82 })
    .toBuffer();
}

/**
 * Valida que el buffer sea una imagen soportada.
 */
export async function validateImage(
  input: Buffer,
): Promise<{ ok: true; format: string } | { ok: false; error: string }> {
  try {
    const meta = await sharp(input, { failOn: 'none' }).metadata();
    if (!meta.format) {
      return { ok: false, error: 'No se reconoció el formato de imagen' };
    }
    const supported = ['jpeg', 'jpg', 'png', 'webp', 'heif', 'avif', 'gif', 'tiff'];
    if (!supported.includes(meta.format)) {
      return { ok: false, error: `Formato "${meta.format}" no soportado` };
    }
    return { ok: true, format: meta.format };
  } catch {
    return { ok: false, error: 'El archivo no es una imagen válida' };
  }
}
