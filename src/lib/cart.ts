/**
 * Cart persistence layer — client-side via localStorage.
 * Módulo puro (no React) que expone read/write + emite events para que
 * el UI (Header badge) escuche y re-renderize.
 */

const STORAGE_KEY = 'roots-cart';
const EVENT_NAME = 'roots-cart-changed';

export type CartItem = {
  id: string; // `${slug}-${size}-${color}`
  slug: string;
  title: string;
  image: string;
  price: number;
  size?: string;
  color?: string;
  quantity: number;
};

export function readCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function addToCart(item: Omit<CartItem, 'quantity'>, qty = 1): void {
  const current = readCart();
  const existing = current.find((c) => c.id === item.id);
  if (existing) {
    existing.quantity += qty;
    writeCart([...current]);
  } else {
    writeCart([...current, { ...item, quantity: qty }]);
  }
}

export function updateQty(id: string, qty: number): void {
  const current = readCart();
  const item = current.find((c) => c.id === id);
  if (!item) return;
  item.quantity = Math.max(1, qty);
  writeCart([...current]);
}

export function removeFromCart(id: string): void {
  writeCart(readCart().filter((c) => c.id !== id));
}

export function clearCart(): void {
  writeCart([]);
}

export function getCartCount(): number {
  return readCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function onCartChange(handler: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const listener = () => handler();
  const storageListener = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) handler();
  };
  window.addEventListener(EVENT_NAME, listener);
  window.addEventListener('storage', storageListener);
  return () => {
    window.removeEventListener(EVENT_NAME, listener);
    window.removeEventListener('storage', storageListener);
  };
}
