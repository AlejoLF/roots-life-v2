import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

/**
 * Devuelve el HTML de la guía del cliente.
 * Protegido con el mismo Bearer token que /api/revalidate.
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected || !token || token !== expected) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401 },
    );
  }

  try {
    const path = join(process.cwd(), 'docs', 'instrucciones-cliente.html');
    const html = await readFile(path, 'utf-8');
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[admin/guia] read failed:', err);
    return NextResponse.json(
      { ok: false, error: 'No se pudo cargar la guía' },
      { status: 500 },
    );
  }
}
