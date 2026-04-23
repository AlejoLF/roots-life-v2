import { NextRequest, NextResponse } from 'next/server';
import { subscribeEmail } from '@/lib/emails';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON' },
      { status: 400 },
    );
  }

  const data = body as { email?: string; source?: string };
  if (!data.email || typeof data.email !== 'string') {
    return NextResponse.json(
      { ok: false, error: 'Email es requerido' },
      { status: 400 },
    );
  }

  const source =
    data.source === 'checkout' || data.source === 'signup'
      ? data.source
      : 'newsletter';

  const result = await subscribeEmail(data.email, source);

  if (!result.ok) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}
