"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/lib/cart-store";
import { FavoritesProvider } from "@/lib/favorites-store";

/** Client-side interactive state (demo cart + favorites). Server layout stays clean. */
export function StoreProviders({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </CartProvider>
  );
}
