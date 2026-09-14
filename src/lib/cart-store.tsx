"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getProduct } from "@/lib/catalog";
import type { CartLine, Product } from "@/types/catalog";

export interface CartLineView extends CartLine {
  product: Product;
}

interface CartContextValue {
  lines: CartLineView[];
  count: number;
  total: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (productSlug: string, qty?: number) => void;
  remove: (productSlug: string) => void;
  setQty: (productSlug: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Demo-only cart state (React state, no persistence, no backend).
 * Isolated here so a real commerce implementation can replace it later.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const add = useCallback((productSlug: string, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((l) => l.productSlug === productSlug);
      if (found) {
        return prev.map((l) =>
          l.productSlug === productSlug ? { ...l, qty: Math.min(l.qty + qty, 99) } : l,
        );
      }
      return [...prev, { productSlug, qty: Math.max(1, Math.min(qty, 99)) }];
    });
    setIsOpen(true);
  }, []);

  const remove = useCallback((productSlug: string) => {
    setItems((prev) => prev.filter((l) => l.productSlug !== productSlug));
  }, []);

  const setQty = useCallback((productSlug: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((l) => l.productSlug !== productSlug)
        : prev.map((l) => (l.productSlug === productSlug ? { ...l, qty: Math.min(qty, 99) } : l)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const lines: CartLineView[] = [];
    for (const l of items) {
      const product = getProduct(l.productSlug);
      if (product) lines.push({ ...l, product });
    }
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const total = lines.reduce((n, l) => n + l.qty * l.product.price, 0);
    return { lines, count, total, isOpen, openCart, closeCart, add, remove, setQty, clear };
  }, [items, isOpen, openCart, closeCart, add, remove, setQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
