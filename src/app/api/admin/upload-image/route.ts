import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';
import { processProductImage, validateImage, type ProcessMode } from '@/lib/image-processing';
import { uploadProductImage } from '@/lib/storage';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB de entrada (antes de procesar)

/**
 * Recibe UNA imagen (cualquier formato), la procesa a WebP 4:5 normalizado,
 * la sube a Supabase Storage y devuelve la URL pública.
 *
 * Body: multipart/form-data
 *   - file: la imagen
 *   - slug: slug del producto (para organizar el path)
 *   - mode: 'contain' | 'cover' (opcional, default contain)
 */
export async function POST(req: NextRequest) {
  const authError = checkAdminAuth(req);
  if (authError) {
    return NextResponse.json({ ok: false, error: authError }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Body inválido (se espera multipart/form-data)' },
      { status: 400 },
    );
  }

  const file = form.get('file');
  const slug = (form.get('slug') as string | null)?.trim();
  const mode = (form.get('mode') as ProcessMode | null) ?? 'contain';

  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: 'Falta el archivo' },
      { status: 400 },
    );
  }
  if (!slug) {
    return NextResponse.json(
      { ok: false, error: 'Falta el slug del producto' },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: 'La imagen es muy pesada (máximo 15 MB)' },
      { status: 400 },
    );
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer());

  const valid = await validateImage(inputBuffer);
  if (!valid.ok) {
    return NextResponse.json({ ok: false, error: valid.error }, { status: 400 });
  }

  try {
    const processed = await processProductImage(
      inputBuffer,
      mode === 'cover' ? 'cover' : 'contain',
    );

    // Nombre único: timestamp + random para evitar colisiones y cache stale
    const stamp = Date.now().toString(36);
    const rand = Math.round(Math.random() * 1e6).toString(36);
    const filename = `${stamp}-${rand}.webp`;

    const url = await uploadProductImage(slug, processed, filename);

    return NextResponse.json({
      ok: true,
      url,
      sizeKb: Math.round(processed.length / 1024),
      format: valid.format,
    });
  } catch (err) {
    console.error('[upload-image] failed:', err);
    return NextResponse.json(
      { ok: false, error: 'No pudimos procesar la imagen. Probá con otra.' },
      { status: 500 },
    );
  }
}
