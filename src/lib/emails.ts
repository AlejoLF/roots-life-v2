import { getSheetRows, appendSheetRow } from './sheets';

export const DISCOUNT_CODE = 'ROOTS10';
const EMAILS_RANGE_READ = 'emails!A2:B';
const EMAILS_RANGE_APPEND = 'emails!A1';

export type SubscribeSource = 'newsletter' | 'checkout' | 'signup';

export type SubscribeResult =
  | { ok: true; status: 'created'; discountCode: string }
  | { ok: true; status: 'already_subscribed' }
  | { ok: false; error: string };

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function isEmailSubscribed(email: string): Promise<boolean> {
  const sheetId = process.env.PRODUCTS_SHEET_ID;
  if (!sheetId) return false;
  try {
    const rows = await getSheetRows(sheetId, EMAILS_RANGE_READ);
    const normalized = normalizeEmail(email);
    return rows.some((row) => normalizeEmail(row[1] ?? '') === normalized);
  } catch (err) {
    console.error('[emails] isEmailSubscribed failed:', err);
    return false;
  }
}

export async function subscribeEmail(
  rawEmail: string,
  source: SubscribeSource = 'newsletter',
  userRegistered = false,
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
    const existing = await isEmailSubscribed(email);
    if (existing) {
      return { ok: true, status: 'already_subscribed' };
    }

    await appendSheetRow(sheetId, EMAILS_RANGE_APPEND, [
      new Date().toISOString(),
      email,
      source,
      source === 'newsletter' ? DISCOUNT_CODE : '',
      userRegistered ? 'TRUE' : 'FALSE',
    ]);

    return {
      ok: true,
      status: 'created',
      discountCode: source === 'newsletter' ? DISCOUNT_CODE : '',
    };
  } catch (err) {
    console.error('[emails] subscribeEmail failed:', err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Error desconocido',
    };
  }
}
