import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(
  plain: string,
  hashed: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export function validatePasswordStrength(password: string): {
  ok: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (password.length < 8) errors.push('Mínimo 8 caracteres');
  if (!/[a-z]/.test(password)) errors.push('Debe incluir minúscula');
  if (!/[A-Z]/.test(password)) errors.push('Debe incluir mayúscula');
  if (!/[0-9]/.test(password)) errors.push('Debe incluir un número');
  return { ok: errors.length === 0, errors };
}
