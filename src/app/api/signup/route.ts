import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';
import { hashPassword, validatePasswordStrength } from '@/lib/password';
import { sendEmail } from '@/lib/resend';
import { verifyEmailTemplate } from '@/lib/email-templates';
import { subscribeEmail } from '@/lib/emails';

const SignupSchema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(100),
  email: z.string().email('Email inválido'),
  password: z.string(),
  acceptTerms: z
    .boolean()
    .refine((v) => v === true, { message: 'Debés aceptar los términos' }),
  acceptNewsletter: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = SignupSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { ok: false, error: first?.message ?? 'Datos inválidos' },
      { status: 400 },
    );
  }

  const { name, email: rawEmail, password, acceptNewsletter } = parsed.data;
  const email = rawEmail.toLowerCase().trim();

  const pwdCheck = validatePasswordStrength(password);
  if (!pwdCheck.ok) {
    return NextResponse.json(
      { ok: false, error: 'Contraseña débil: ' + pwdCheck.errors.join(', ') },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdmin();

  // Verificar dupes
  const { data: existing } = await supabase
    .from('users')
    .select('id, email_verified')
    .eq('email', email)
    .maybeSingle();

  if (existing) {
    if (existing.email_verified) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Ya existe una cuenta con este email. Iniciá sesión o recuperá tu contraseña.',
        },
        { status: 409 },
      );
    }
    // Usuario sin verificar — reenviar email (abajo)
  }

  const hashedPassword = await hashPassword(password);
  const nowIso = new Date().toISOString();
  let userId: string;

  if (existing) {
    userId = existing.id;
    await supabase
      .from('users')
      .update({
        hashed_password: hashedPassword,
        name,
        terms_accepted_at: nowIso,
        newsletter_opt_in: acceptNewsletter,
      })
      .eq('id', userId);
  } else {
    const { data: created, error: insertErr } = await supabase
      .from('users')
      .insert({
        email,
        hashed_password: hashedPassword,
        name,
        terms_accepted_at: nowIso,
        newsletter_opt_in: acceptNewsletter,
      })
      .select('id')
      .single();

    if (insertErr || !created) {
      console.error('[signup] insert failed:', insertErr);
      return NextResponse.json(
        { ok: false, error: 'No pudimos crear la cuenta. Intentá de nuevo.' },
        { status: 500 },
      );
    }
    userId = created.id;
  }

  // Token de verificación (24hs de vida)
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  // Limpiar tokens viejos del mismo identifier
  await supabase.from('verification_tokens').delete().eq('identifier', email);

  const { error: tokenErr } = await supabase
    .from('verification_tokens')
    .insert({ identifier: email, token, expires });

  if (tokenErr) {
    console.error('[signup] token insert failed:', tokenErr);
    return NextResponse.json(
      { ok: false, error: 'No pudimos generar el link de verificación.' },
      { status: 500 },
    );
  }

  // Guardar en Sheet emails si opt-in (source=signup → genera discount code)
  let discountCode: string | undefined;
  if (acceptNewsletter) {
    const sub = await subscribeEmail(email, 'signup', true).catch((err) => {
      console.error('[signup] subscribeEmail failed (non-fatal):', err);
      return null;
    });
    if (sub?.ok && 'discountCode' in sub && sub.discountCode) {
      discountCode = sub.discountCode;
    }
  }

  // Enviar email de verificación (con código de descuento si opt-in)
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.rootslife.shop';
  const verifyUrl = `${baseUrl}/verificar?token=${token}`;

  const { subject, html, text } = verifyEmailTemplate({
    name,
    verifyUrl,
    discountCode,
  });
  const emailResult = await sendEmail({ to: email, subject, html, text });

  if (!emailResult.ok) {
    console.error('[signup] email send failed:', emailResult.error);
    // No fallamos el signup si el email falla — usuario puede pedir reenvío
  }

  return NextResponse.json({
    ok: true,
    message:
      'Registro exitoso. Te enviamos un email para confirmar tu cuenta.',
  });
}
