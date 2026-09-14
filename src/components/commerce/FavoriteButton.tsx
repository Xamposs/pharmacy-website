"use client";

import { useFavorites } from "@/lib/favorites-store";

interface FavoriteButtonProps {
  productSlug: string;
  size?: "card" | "box";
}

/** Shared favorite toggle backed by FavoritesProvider (persisted). */
export function FavoriteButton({ productSlug, size = "card" }: FavoriteButtonProps) {
  const { has, toggle } = useFavorites();
  const active = has(productSlug);

  if (size === "box") {
    return (
      <button
        type="button"
        onClick={() => toggle(productSlug)}
        aria-pressed={active}
        aria-label={active ? "Αφαίρεση από τα αγαπημένα" : "Προσθήκη στα αγαπημένα"}
        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold ring-1 transition-colors ${
          active
            ? "bg-error-soft text-error ring-error/30"
            : "bg-surface text-muted ring-border hover:text-error"
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 21s-7.5-4.7-10-9.3C.4 8.6 2.4 5 5.8 5c2 0 3.4 1.1 4.2 2.3h4C14.8 6.1 16.2 5 18.2 5c3.4 0 5.4 3.6 3.8 6.7C19.5 16.3 12 21 12 21z" transform="scale(0.9)" />
        </svg>
        {active ? "Στα αγαπημένα" : "Αγαπημένο"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggle(productSlug)}
      aria-pressed={active}
      aria-label={active ? "Αφαίρεση από τα αγαπημένα" : "Προσθήκη στα αγαπημένα"}
      className={`absolute right-2 top-2 z-10 rounded-full p-1.5 ring-1 transition-colors ${
        active
          ? "bg-error-soft text-error ring-error/30"
          : "bg-surface/90 text-faint ring-border hover:text-error"
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 21s-7.5-4.7-10-9.3C.4 8.6 2.4 5 5.8 5c2 0 3.4 1.1 4.2 2.3h4C14.8 6.1 16.2 5 18.2 5c3.4 0 5.4 3.6 3.8 6.7C19.5 16.3 12 21 12 21z" transform="scale(0.9)" />
      </svg>
    </button>
  );
}
