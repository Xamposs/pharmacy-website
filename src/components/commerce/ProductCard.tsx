"use client";

import { useState } from "react";
import Link from "next/link";
import { getBrand } from "@/data/taxonomy";
import { discountPercent } from "@/lib/catalog";
import { useCart } from "@/lib/cart-store";
import type { Product } from "@/types/catalog";
import { AvailabilityBadge } from "@/components/commerce/AvailabilityBadge";
import { PriceDisplay } from "@/components/commerce/PriceDisplay";
import { ProductImage } from "@/components/commerce/ProductImage";
import { RatingStars } from "@/components/commerce/RatingStars";

const badgeStyles: Record<string, string> = {
  hot: "bg-red-600 text-white",
  gift: "bg-teal-500 text-white",
  top: "bg-neutral-900 text-white",
  new: "bg-sky-600 text-white",
};

function badgeLabel(badge: string, product: Product): string {
  if (badge === "hot") return "HOT";
  if (badge === "gift") return "ΔΩΡΟ";
  if (badge === "top") return "Top Seller";
  if (badge === "new") return "ΝΕΟ";
  if (badge === "offer") {
    const d = discountPercent(product);
    return d !== null ? `-${d}%` : "Προσφορά";
  }
  return badge;
}

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [favorite, setFavorite] = useState(false);
  const brand = getBrand(product.brandSlug);
  const out = product.availability === "out_of_stock";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-white ring-1 ring-neutral-200 transition-shadow hover:shadow-lg">
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
        {(product.badges ?? []).slice(0, 2).map((b) => (
          <span
            key={b}
            className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold ${badgeStyles[b] ?? "bg-neutral-200 text-neutral-700"}`}
          >
            {badgeLabel(b, product)}
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setFavorite((f) => !f)}
        aria-pressed={favorite}
        aria-label={favorite ? "Αφαίρεση από τα αγαπημένα" : "Προσθήκη στα αγαπημένα"}
        className={`absolute right-2 top-2 z-10 rounded-full p-1.5 ring-1 transition-colors ${
          favorite
            ? "bg-red-50 text-red-600 ring-red-200"
            : "bg-white/90 text-neutral-400 ring-neutral-200 hover:text-red-500"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 21s-7.5-4.7-10-9.3C.4 8.6 2.4 5 5.8 5c2 0 3.4 1.1 4.2 2.3h4C14.8 6.1 16.2 5 18.2 5c3.4 0 5.4 3.6 3.8 6.7C19.5 16.3 12 21 12 21z" transform="scale(0.9)" />
        </svg>
      </button>
      <Link
        href={`/product/${product.slug}`}
        className="block p-3"
        aria-label={product.name}
      >
        <ProductImage brandName={brand?.name ?? "?"} productName={product.name} />
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-3 pt-0">
        {brand ? (
          <Link href={`/brands/${brand.slug}`} className="text-xs font-semibold uppercase tracking-wide text-sky-700 hover:underline">
            {brand.name}
          </Link>
        ) : null}
        <Link href={`/product/${product.slug}`} className="clamp-2 min-h-10 text-sm font-medium leading-snug text-neutral-900 hover:underline">
          {product.name}
        </Link>
        {product.rating !== undefined ? (
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        ) : null}
        <div className="mt-auto flex flex-col gap-2 pt-1">
          <PriceDisplay product={product} />
          <AvailabilityBadge availability={product.availability} />
          <button
            type="button"
            disabled={out}
            onClick={() => add(product.slug, 1)}
            className="w-full rounded-lg bg-neutral-900 px-3 py-2 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {out ? "Εξαντλήθηκε" : "Προσθήκη στο καλάθι"}
          </button>
        </div>
      </div>
    </article>
  );
}
