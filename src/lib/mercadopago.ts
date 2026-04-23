import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

/**
 * MercadoPago client.
 *
 * - PROD (live sales): usa MP_ACCESS_TOKEN_PROD cuando VERCEL_ENV === 'production'
 * - TEST (desarrollo / preview): usa MP_ACCESS_TOKEN_TEST en cualquier otro entorno
 *
 * Así nunca cobramos real con código de test ni al revés.
 */

/**
 * Determina si usamos credenciales TEST o PROD.
 * Override: MP_USE_TEST=1 fuerza TEST incluso en producción (útil durante QA).
 * Para ir a ventas reales: remover MP_USE_TEST en Vercel.
 */
export function useTestMode(): boolean {
  if (process.env.MP_USE_TEST === '1' || process.env.MP_USE_TEST === 'true') {
    return true;
  }
  return process.env.VERCEL_ENV !== 'production';
}

function getAccessToken(): string {
  const test = useTestMode();
  const token = test
    ? process.env.MP_ACCESS_TOKEN_TEST
    : process.env.MP_ACCESS_TOKEN_PROD;
  if (!token) {
    throw new Error(
      `Missing MercadoPago access token (${test ? 'TEST' : 'PROD'})`,
    );
  }
  return token;
}

let cachedClient: MercadoPagoConfig | null = null;

export function getMpClient(): MercadoPagoConfig {
  if (cachedClient) return cachedClient;
  cachedClient = new MercadoPagoConfig({
    accessToken: getAccessToken(),
    options: { timeout: 8000 },
  });
  return cachedClient;
}

export type PreferenceItem = {
  id: string;
  title: string;
  description?: string;
  picture_url?: string;
  category_id?: string;
  quantity: number;
  unit_price: number;
  currency_id: 'ARS';
};

export type PreferencePayer = {
  name?: string;
  surname?: string;
  email: string;
  phone?: { area_code?: string; number?: string };
  address?: {
    zip_code?: string;
    street_name?: string;
    street_number?: string;
  };
};

export async function createPreference(params: {
  items: PreferenceItem[];
  payer?: PreferencePayer;
  externalReference: string;
  backUrls: { success: string; pending: string; failure: string };
  notificationUrl: string;
  shipmentCost?: number;
  discountAmount?: number;
}): Promise<{ id: string; init_point: string; sandbox_init_point: string }> {
  const client = getMpClient();
  const preference = new Preference(client);

  const body: Record<string, unknown> = {
    items: params.items,
    payer: params.payer,
    external_reference: params.externalReference,
    back_urls: params.backUrls,
    auto_return: 'approved',
    notification_url: params.notificationUrl,
    statement_descriptor: 'ROOTS LIFE',
    binary_mode: false,
  };

  if (params.shipmentCost && params.shipmentCost > 0) {
    body.shipments = {
      cost: params.shipmentCost,
      mode: 'not_specified',
    };
  }

  // Discount: en MP se expresa como item negativo o como shipment discount.
  // Lo manejamos como un item extra negativo — compatible con Checkout Pro.
  if (params.discountAmount && params.discountAmount > 0) {
    (body.items as PreferenceItem[]).push({
      id: 'discount',
      title: 'Descuento ROOTS LIFE',
      quantity: 1,
      unit_price: -params.discountAmount,
      currency_id: 'ARS',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await preference.create({ body: body as any });

  return {
    id: result.id ?? '',
    init_point: result.init_point ?? '',
    sandbox_init_point: result.sandbox_init_point ?? '',
  };
}

export async function getPayment(paymentId: string) {
  const client = getMpClient();
  const payment = new Payment(client);
  return payment.get({ id: paymentId });
}

export function isProduction(): boolean {
  return !useTestMode();
}
