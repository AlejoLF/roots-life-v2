import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected) {
    return NextResponse.json(
      { ok: false, error: 'REVALIDATE_SECRET not configured on server' },
      { status: 500 },
    );
  }

  if (!token || token !== expected) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    revalidateTag('products', 'max');
    revalidatePath('/', 'page');
    revalidatePath('/catalogo', 'page');
    revalidatePath('/producto/[slug]', 'page');

    return NextResponse.json({
      ok: true,
      revalidated: ['/', '/catalogo', '/producto/[slug]', 'tag:products'],
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
