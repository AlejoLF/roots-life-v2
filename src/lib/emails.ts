import { getSheetRows, appendSheetRow } from './sheets';
import { generateDiscountCode } from './discount';

const EMAILS_RANGE_READ = 'emails!A2:F';
const EMAILS_RANGE_APPEND = 'emails!A1';

export type SubscribeSource = 'newsletter' | 'checkout' | 'signup';

export type SubscribeResult =
  | { ok: true; status: 'created'; discountCode: string }
  | { ok: true; status: 'already_subscribed'; discountCode: string }
  | { ok: false; error: string };

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Devuelve el registro (row) del email si existe, o null.
 * Row shape: [timestamp, email, source, discount_code, used_at, user_registered]
 */
export async function getEmailRecord(
  email: string,
): Promise<string[] | null> {
  const sheetId = process.env.PRODUCTS_SHEET_ID;
  if (!sheetId) return null;
  try {
    const rows = await getSheetRows(sheetId, EMAILS_RANGE_READ);
    const normalized = normalizeEmail(email);
    return rows.find((row) => normalizeEmail(row[1] ?? '') === normalized) ?? null;
  } catch (err) {
    console.error('[emails] getEmailRecord failed:', err);
    return null;
  }
}

export async function isEmailSubscribed(email: string): Promise<boolean> {
  return (await getEmailRecord(email)) !== null;
}

export async function subscribeEmail(
  rawEmail: string,
  source: SubscribeSource = 'newsletter',
  userRegistered = false,
  overrideCode?: string,
): Promise<SubscribeResult> {
  const email = normalizeEmail(rawEmail);

  if (!isValidEmail(email)) {
    return { ok: false, error: 'Email inválido' };
  }

  const sheetId = process.env.PRODUCTS_SHEET_ID;
  if (!sheetId) {
    return { ok: false, error: 'Sheet no configurada' };
  }

  try {
    const existing = await getEmailRecord(email);
    if (existing) {
      // Devolvemos el código ya asignado (col D = índice 3)
      const existingCode = (existing[3] ?? '').trim();
      return {
        ok: true,
        status: 'already_subscribed',
        discountCode: existingCode,
      };
    }

    const givesDiscount = source === 'newsletter' || source === 'signup';
    const discountCode = givesDiscount
      ? (overrideCode ?? generateDiscountCode())
      : '';

    await appendSheetRow(sheetId, EMAILS_RANGE_APPEND, [
      new Date().toISOString(),
      email,
      source,
      discountCode,
      '', // used_at vacío por defecto
      userRegistered ? 'TRUE' : 'FALSE',
    ]);

    return {
      ok: true,
      status: 'created',
      discountCode,
    };
  } catch (err) {
    console.error('[emails] subscribeEmail failed:', err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Error desconocido',
    };
  }
}
