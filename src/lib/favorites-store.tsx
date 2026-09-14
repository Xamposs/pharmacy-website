"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getProduct } from "@/lib/catalog";

const STORAGE_KEY = "pharmacy:favorites:v1";

interface FavoritesContextValue {
  slugs: string[];
  count: number;
  hydrated: boolean;
  has: (productSlug: string) => boolean;
  toggle: (productSlug: string) => void;
  remove: (productSlug: string) => void;
  clear: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function readStored(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Keep only slugs that still exist in the demo catalog.
    return parsed.filter((s): s is string => typeof s === "string" && getProduct(s) !== undefined);
  } catch {
    return [];
  }
}

/**
 * Demo favorites state: shared across cards/product page/header, persisted to
 * localStorage. Hydration-safe: renders empty on the server and first client
 * paint, then loads stored slugs in an effect (no SSR mismatch).
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSlugs(readStored());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    } catch {
      // storage unavailable (private mode) — favorites simply don't persist
    }
  }, [slugs, hydrated]);

  const toggle = useCallback((productSlug: string) => {
    setSlugs((prev) =>
      prev.includes(productSlug) ? prev.filter((s) => s !== productSlug) : [...prev, productSlug],
    );
  }, []);

  const remove = useCallback((productSlug: string) => {
    setSlugs((prev) => prev.filter((s) => s !== productSlug));
  }, []);

  const clear = useCallback(() => setSlugs([]), []);

  const value = useMemo<FavoritesContextValue>(() => {
    const has = (productSlug: string) => slugs.includes(productSlug);
    return { slugs, count: slugs.length, hydrated, has, toggle, remove, clear };
  }, [slugs, hydrated, toggle, remove, clear]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside <FavoritesProvider>");
  return ctx;
}
