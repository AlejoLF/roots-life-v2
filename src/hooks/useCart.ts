'use client';

import { useEffect, useState } from 'react';
import { readCart, getCartCount, onCartChange, type CartItem } from '@/lib/cart';

export function useCart(): { items: CartItem[]; count: number; isReady: boolean } {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    setIsReady(true);
    const off = onCartChange(sync);
    return off;
  }, []);

  return {
    items,
    count: isReady ? items.reduce((sum, i) => sum + i.quantity, 0) : 0,
    isReady,
  };
}

export function useCartCount(): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(getCartCount());
    const off = onCartChange(() => setCount(getCartCount()));
    return off;
  }, []);
  return count;
}
