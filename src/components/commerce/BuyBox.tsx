"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import type { Product } from "@/types/catalog";
import { AvailabilityBadge } from "@/components/commerce/AvailabilityBadge";
import { FavoriteButton } from "@/components/commerce/FavoriteButton";
import { PriceDisplay } from "@/components/commerce/PriceDisplay";
import { QuantitySelector } from "@/components/commerce/QuantitySelector";
import { RatingStars } from "@/components/commerce/RatingStars";

export function BuyBox({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const out = product.availability === "out_of_stock";

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-surface p-4 shadow-card ring-1 ring-border">
      <PriceDisplay product={product} large />
      <AvailabilityBadge availability={product.availability} />
      <div className="flex flex-wrap items-center gap-2">
        <QuantitySelector qty={qty} onChange={setQty} />
        <button
          type="button"
          disabled={out}
          onClick={() => add(product.slug, qty)}
          className="h-11 min-w-44 flex-1 rounded-lg bg-primary px-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-border disabled:text-muted"
        >
          {out ? "Εξαντλήθηκε" : "Προσθήκη στο καλάθι"}
        </button>
        <FavoriteButton productSlug={product.slug} size="box" />
      </div>
      {product.rating !== undefined ? (
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
      ) : null}
    </div>
  );
}
