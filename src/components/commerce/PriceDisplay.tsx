import { discountPercent, formatPrice } from "@/lib/catalog";
import type { Product } from "@/types/catalog";

export function PriceDisplay({ product, large = false }: { product: Product; large?: boolean }) {
  const discount = discountPercent(product);
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      {product.originalPrice !== undefined && product.originalPrice > product.price ? (
        <span className="text-sm text-neutral-400 line-through">
          {formatPrice(product.originalPrice)}
        </span>
      ) : null}
      <span className={large ? "text-3xl font-extrabold text-neutral-900" : "text-lg font-extrabold text-neutral-900"}>
        {formatPrice(product.price)}
      </span>
      {discount !== null ? (
        <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
          -{discount}%
        </span>
      ) : null}
    </div>
  );
}
