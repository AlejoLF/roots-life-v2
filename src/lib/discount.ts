import { randomBytes } from 'crypto';

/**
 * Sistema de códigos de descuento únicos por usuario.
 *
 * Formato: ROOTS10-XXXXXX (6 chars hex uppercase).
 * Espacio: 16.7M combinaciones → cero colisiones prácticas.
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
