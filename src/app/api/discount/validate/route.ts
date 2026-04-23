import { NextRequest, NextResponse } from 'next/server';
import { validateDiscountCode } from '@/lib/discount';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }
  const { code } = body as { code?: string };
  if (!code || typeof code !== 'string') {
    return NextResponse.json(
      { ok: false, error: 'Código requerido' },
      { status: 400 },
    );
  }

  const result = await validateDiscountCode(code);
  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }
  return NextResponse.json({
    ok: true,
    code: result.code,
    percentage: result.percentage,
  });
}
