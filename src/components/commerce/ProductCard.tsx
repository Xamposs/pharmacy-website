"use client";

import Link from "next/link";
import { getBrand } from "@/data/taxonomy";
import { discountPercent } from "@/lib/catalog";
import { useCart } from "@/lib/cart-store";
import type { Product } from "@/types/catalog";
import { AvailabilityBadge } from "@/components/commerce/AvailabilityBadge";
import { FavoriteButton } from "@/components/commerce/FavoriteButton";
import { PriceDisplay } from "@/components/commerce/PriceDisplay";
import { ProductImage } from "@/components/commerce/ProductImage";
import { RatingStars } from "@/components/commerce/RatingStars";

const badgeStyles: Record<string, string> = {
  hot: "bg-error text-white",
  gift: "bg-teal-600 text-white",
  top: "bg-ink text-white",
  new: "bg-accent text-white",
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
  const brand = getBrand(product.brandSlug);
  const out = product.availability === "out_of_stock";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-surface shadow-card ring-1 ring-border transition-shadow hover:shadow-pop">
      <div className="absolute left-2 top-2 z-10 flex flex-col items-start gap-1">
        {(product.badges ?? []).slice(0, 2).map((b) => (
          <span
            key={b}
            className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold ${badgeStyles[b] ?? "bg-background text-muted"}`}
          >
            {badgeLabel(b, product)}
          </span>
        ))}
      </div>
      <FavoriteButton productSlug={product.slug} />
      <Link
        href={`/product/${product.slug}`}
        className="block p-3"
        aria-label={product.name}
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProductImage brandName={brand?.name ?? "?"} productName={product.name} />
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-3 pt-0">
        {brand ? (
          <Link href={`/brands/${brand.slug}`} className="w-fit text-xs font-semibold uppercase tracking-wide text-accent hover:underline">
            {brand.name}
          </Link>
        ) : null}
        <h3 className="clamp-2 min-h-10 text-sm font-medium leading-snug">
          <Link href={`/product/${product.slug}`} className="text-ink hover:text-primary hover:underline">
            {product.name}
          </Link>
        </h3>
        {product.rating !== undefined ? (
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        ) : (
          <span className="text-xs text-faint">Χωρίς αξιολογήσεις</span>
        )}
        <div className="mt-auto flex flex-col gap-2 pt-1">
          <PriceDisplay product={product} />
          <AvailabilityBadge availability={product.availability} />
          <button
            type="button"
            disabled={out}
            onClick={() => add(product.slug, 1)}
            className="h-10 w-full rounded-lg bg-primary px-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-border disabled:text-muted"
          >
            {out ? "Εξαντλήθηκε" : "Προσθήκη στο καλάθι"}
          </button>
        </div>
      </div>
    </article>
  );
}
