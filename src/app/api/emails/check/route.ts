import { NextRequest, NextResponse } from 'next/server';
import { isEmailSubscribed } from '@/lib/emails';

/**
 * Chequea si un email ya está suscripto al newsletter.
 * Usado por el form de signup para auto-tildar y deshabilitar la casilla.
 */
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email) {
    return NextResponse.json({ ok: false, subscribed: false });
  }
  const subscribed = await isEmailSubscribed(email);
  return NextResponse.json({ ok: true, subscribed });
}
