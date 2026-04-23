import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(
      new URL('/verificar/error?reason=missing_token', req.url),
    );
  }

  const supabase = getSupabaseAdmin();

  const { data: record } = await supabase
    .from('verification_tokens')
    .select('identifier, expires')
    .eq('token', token)
    .maybeSingle();

  if (!record) {
    return NextResponse.redirect(
      new URL('/verificar/error?reason=invalid_token', req.url),
    );
  }

  if (new Date(record.expires) < new Date()) {
    await supabase.from('verification_tokens').delete().eq('token', token);
    return NextResponse.redirect(
      new URL('/verificar/error?reason=expired_token', req.url),
    );
  }

  // Verificar email
  const { error } = await supabase
    .from('users')
    .update({ email_verified: new Date().toISOString() })
    .eq('email', record.identifier);

  if (error) {
    return NextResponse.redirect(
      new URL('/verificar/error?reason=update_failed', req.url),
    );
  }

  // Consumir token
  await supabase.from('verification_tokens').delete().eq('token', token);

  return NextResponse.redirect(new URL('/verificar/exito', req.url));
}
