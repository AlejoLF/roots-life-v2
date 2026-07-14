import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';
import { listAdminProducts } from '@/lib/products-admin';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const authError = checkAdminAuth(req);
  if (authError) {
    return NextResponse.json({ ok: false, error: authError }, { status: 401 });
  }

  try {
    const products = await listAdminProducts();
    return NextResponse.json({
      ok: true,
      products: products.map((p) => ({
        slug: p.slug,
        title: p.title,
        capsuleId: p.capsuleId,
        active: p.active,
        images: p.images,
      })),
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Error' },
      { status: 500 },
    );
  }
}
