import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';
import { auth } from '@/lib/auth';
import {
  createPreference,
  isProduction,
  type PreferenceItem,
} from '@/lib/mercadopago';
import { validateDiscountCode, DISCOUNT_PERCENTAGE } from '@/lib/discount';

const ItemSchema = z.object({
  slug: z.string(),
  title: z.string(),
  image: z.string().optional(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  size: z.string().optional(),
  color: z.string().optional(),
});

const ShippingSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(6),
  street: z.string().min(1),
  streetNumber: z.string().min(1),
  apartment: z.string().optional().default(''),
  city: z.string().min(1),
  province: z.string().min(1),
  zip: z.string().min(4),
  notes: z.string().optional().default(''),
});

const CheckoutSchema = z.object({
  items: z.array(ItemSchema).min(1),
  shipping: ShippingSchema,
  shippingCost: z.number().nonnegative().default(0),
  discountCode: z.string().optional(),
});

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

  const parsed = CheckoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos' },
      { status: 400 },
    );
  }
  const { items, shipping, shippingCost, discountCode } = parsed.data;

  // Session opcional (guest checkout también válido)
  const session = await auth();
  const userId = session?.user?.id ?? null;

  // Totales
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  let discountAmount = 0;
  let validatedDiscount:
    | { code: string; source: 'users' | 'sheet'; userId?: string; sheetRowIndex?: number }
    | null = null;

  if (discountCode) {
    const validation = await validateDiscountCode(discountCode);
    if (!validation.ok) {
      return NextResponse.json(
        { ok: false, error: validation.error },
        { status: 400 },
      );
    }
    discountAmount = Math.round(subtotal * (DISCOUNT_PERCENTAGE / 100));
    validatedDiscount = {
      code: validation.code,
      source: validation.source,
      userId: validation.userId,
      sheetRowIndex: validation.sheetRowIndex,
    };
  }

  const total = subtotal + shippingCost - discountAmount;

  // Insert pre-order en Supabase (status=pending)
  const supabase = getSupabaseAdmin();
  const { data: order, error: insertErr } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      guest_email: userId ? null : shipping.email,
      guest_name: userId ? null : `${shipping.firstName} ${shipping.lastName}`,
      guest_phone: userId ? null : shipping.phone,
      status: 'pending',
      items: items.map((i) => ({
        slug: i.slug,
        title: i.title,
        image: i.image,
        price: i.price,
        quantity: i.quantity,
        size: i.size,
        color: i.color,
      })),
      shipping_address: {
        firstName: shipping.firstName,
        lastName: shipping.lastName,
        email: shipping.email,
        phone: shipping.phone,
        street: shipping.street,
        streetNumber: shipping.streetNumber,
        apartment: shipping.apartment,
        city: shipping.city,
        province: shipping.province,
        zip: shipping.zip,
        notes: shipping.notes,
      },
      shipping_method: 'mercado_envios',
      subtotal,
      shipping_cost: shippingCost,
      discount: discountAmount,
      discount_code: validatedDiscount?.code ?? null,
      total,
    })
    .select('id, tracking_token')
    .single();

  if (insertErr || !order) {
    console.error('[checkout] order insert failed:', insertErr);
    return NextResponse.json(
      { ok: false, error: 'No pudimos crear el pedido. Intentá de nuevo.' },
      { status: 500 },
    );
  }

  // Crear preference en MP
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.rootslife.shop';

  const mpItems: PreferenceItem[] = items.map((i) => ({
    id: i.slug,
    title: i.title,
    description: [i.color, i.size].filter(Boolean).join(' · ') || undefined,
    quantity: i.quantity,
    unit_price: i.price,
    currency_id: 'ARS',
  }));

  try {
    const preference = await createPreference({
      items: mpItems,
      payer: {
        name: shipping.firstName,
        surname: shipping.lastName,
        email: shipping.email,
        phone: { number: shipping.phone },
        address: {
          zip_code: shipping.zip,
          street_name: shipping.street,
          street_number: shipping.streetNumber,
        },
      },
      externalReference: order.id,
      backUrls: {
        success: `${baseUrl}/gracias?order=${order.tracking_token}`,
        pending: `${baseUrl}/gracias?order=${order.tracking_token}&status=pending`,
        failure: `${baseUrl}/checkout?error=payment_failed`,
      },
      notificationUrl: `${baseUrl}/api/mp/webhook`,
      shipmentCost: shippingCost,
      discountAmount,
    });

    // Guardar mp_preference_id en la orden
    await supabase
      .from('orders')
      .update({ mp_preference_id: preference.id })
      .eq('id', order.id);

    const checkoutUrl = isProduction()
      ? preference.init_point
      : preference.sandbox_init_point;

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      trackingToken: order.tracking_token,
      preferenceId: preference.id,
      checkoutUrl,
    });
  } catch (err) {
    console.error('[checkout] MP preference failed:', err);
    // Revertir status si falla
    await supabase
      .from('orders')
      .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
      .eq('id', order.id);
    return NextResponse.json(
      {
        ok: false,
        error:
          'No pudimos conectar con MercadoPago. Intentá de nuevo o elegí otro medio de pago.',
      },
      { status: 500 },
    );
  }
}
