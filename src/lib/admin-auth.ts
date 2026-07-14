import { NextRequest } from 'next/server';

/**
 * Valida el Bearer token de rutas admin contra REVALIDATE_SECRET.
 * Devuelve null si es válido, o un mensaje de error si no.
 */
export function checkAdminAuth(req: NextRequest): string | null {
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected) return 'Server auth not configured';
  if (!token || token !== expected) return 'Unauthorized';
  return null;
}
