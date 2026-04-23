import { randomBytes } from 'crypto';
import { getSupabaseAdmin } from './supabase';
import { getSheetRows, updateSheetCell } from './sheets';

/**
 * Sistema de códigos de descuento únicos por usuario.
 *
 * Formato: ROOTS10-XXXXXX (6 chars hex uppercase).
 * Single-use: al consumirse queda marcado con used_at.
 */

export const DISCOUNT_PERCENTAGE = 10;
const PREFIX = 'ROOTS10';

export function generateDiscountCode(): string {
  const random = randomBytes(3).toString('hex').toUpperCase();
  return `${PREFIX}-${random}`;
}

export function isValidDiscountCodeFormat(code: string): boolean {
  return /^ROOTS10-[0-9A-F]{6}$/i.test(code.trim());
}

export type ValidateDiscountResult =
  | {
      ok: true;
      source: 'users' | 'sheet';
      code: string;
      percentage: number;
      userId?: string;
      sheetRowIndex?: number;
    }
  | { ok: false; error: string };

/**
 * Valida un código de descuento:
 * - Existe en users.welcome_code O en la Sheet emails
 * - No fue usado todavía (welcome_code_used_at null / used_at empty)
 * Devuelve info suficiente para marcarlo como usado después.
 */
export async function validateDiscountCode(
  rawCode: string,
): Promise<ValidateDiscountResult> {
  const code = rawCode.trim().toUpperCase();

  if (!isValidDiscountCodeFormat(code)) {
    return { ok: false, error: 'Formato de código inválido.' };
  }

  // 1) Buscar en users (prioridad)
  const supabase = getSupabaseAdmin();
  const { data: user } = await supabase
    .from('users')
    .select('id, welcome_code, welcome_code_used_at')
    .eq('welcome_code', code)
    .maybeSingle();

  if (user) {
    if (user.welcome_code_used_at) {
      return { ok: false, error: 'Este código ya fue usado.' };
    }
    return {
      ok: true,
      source: 'users',
      code,
      percentage: DISCOUNT_PERCENTAGE,
      userId: user.id,
    };
  }

  // 2) Buscar en Sheet emails
  const sheetId = process.env.PRODUCTS_SHEET_ID;
  if (!sheetId) return { ok: false, error: 'Código no encontrado.' };

  try {
    const rows = await getSheetRows(sheetId, 'emails!A2:F');
    const idx = rows.findIndex(
      (r) => (r[3] ?? '').trim().toUpperCase() === code,
    );
    if (idx === -1) {
      return { ok: false, error: 'Código no encontrado.' };
    }
    const usedAt = (rows[idx][4] ?? '').trim();
    if (usedAt) {
      return { ok: false, error: 'Este código ya fue usado.' };
    }
    return {
      ok: true,
      source: 'sheet',
      code,
      percentage: DISCOUNT_PERCENTAGE,
      sheetRowIndex: idx + 2, // +2: header row + 0-indexed → 1-indexed
    };
  } catch {
    return { ok: false, error: 'No pudimos validar el código.' };
  }
}

/**
 * Marca un código como usado. Llamar SOLO cuando la compra se concreta
 * (webhook de MP con status approved).
 */
export async function markDiscountCodeUsed(
  validated: Extract<ValidateDiscountResult, { ok: true }>,
): Promise<void> {
  const nowIso = new Date().toISOString();

  if (validated.source === 'users' && validated.userId) {
    const supabase = getSupabaseAdmin();
    await supabase
      .from('users')
      .update({ welcome_code_used_at: nowIso })
      .eq('id', validated.userId);
    return;
  }

  if (validated.source === 'sheet' && validated.sheetRowIndex) {
    const sheetId = process.env.PRODUCTS_SHEET_ID;
    if (!sheetId) return;
    try {
      await updateSheetCell(
        sheetId,
        `emails!E${validated.sheetRowIndex}`,
        nowIso,
      );
    } catch (err) {
      console.error('[discount] markDiscountCodeUsed sheet failed:', err);
    }
  }
}
