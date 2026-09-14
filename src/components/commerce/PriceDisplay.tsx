import { discountPercent, formatPrice } from "@/lib/catalog";
import type { Product } from "@/types/catalog";

export function PriceDisplay({ product, large = false }: { product: Product; large?: boolean }) {
  const discount = discountPercent(product);
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      {product.originalPrice !== undefined && product.originalPrice > product.price ? (
        <span className="text-sm text-faint line-through">
          {formatPrice(product.originalPrice)}
        </span>
      ) : null}
      <span className={large ? "text-3xl font-extrabold text-ink" : "text-lg font-extrabold text-ink"}>
        {formatPrice(product.price)}
      </span>
      {discount !== null ? (
        <span className="rounded-md bg-error px-1.5 py-0.5 text-xs font-bold text-white">
          -{discount}%
        </span>
      ) : null}
    </div>
  );
}
