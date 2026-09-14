"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import type { Product } from "@/types/catalog";
import { AvailabilityBadge } from "@/components/commerce/AvailabilityBadge";
import { PriceDisplay } from "@/components/commerce/PriceDisplay";
import { QuantitySelector } from "@/components/commerce/QuantitySelector";
import { RatingStars } from "@/components/commerce/RatingStars";

export function BuyBox({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const out = product.availability === "out_of_stock";

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-neutral-50 p-4 ring-1 ring-neutral-200">
      <PriceDisplay product={product} large />
      <AvailabilityBadge availability={product.availability} />
      <div className="flex flex-wrap items-center gap-2">
        <QuantitySelector qty={qty} onChange={setQty} />
        <button
          type="button"
          disabled={out}
          onClick={() => add(product.slug, qty)}
          className="flex-1 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          {out ? "Εξαντλήθηκε" : "Προσθήκη στο καλάθι"}
        </button>
        <button
          type="button"
          onClick={() => setFavorite((f) => !f)}
          aria-pressed={favorite}
          aria-label={favorite ? "Αφαίρεση από τα αγαπημένα" : "Προσθήκη στα αγαπημένα"}
          className={`rounded-lg p-2.5 ring-1 transition-colors ${
            favorite ? "bg-red-50 text-red-600 ring-red-200" : "bg-white text-neutral-500 ring-neutral-300 hover:text-red-500"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 21s-7.5-4.7-10-9.3C.4 8.6 2.4 5 5.8 5c2 0 3.4 1.1 4.2 2.3h4C14.8 6.1 16.2 5 18.2 5c3.4 0 5.4 3.6 3.8 6.7C19.5 16.3 12 21 12 21z" transform="scale(0.9)" />
          </svg>
        </button>
      </div>
      {product.rating !== undefined ? (
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
      ) : null}
    </div>
  );
}
