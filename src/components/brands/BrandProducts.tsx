"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/catalog";
import { ProductCard } from "@/components/commerce/ProductCard";

type SortKey = "popular" | "price-asc" | "price-desc" | "name";

const sortLabels: Record<SortKey, string> = {
  popular: "Δημοφιλή",
  "price-asc": "Τιμή: χαμηλή → υψηλή",
  "price-desc": "Τιμή: υψηλή → χαμηλή",
  name: "Ονομασία Α–Ω",
};

/** Brand product grid with sorting. */
export function BrandProducts({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortKey>("popular");

  const sorted = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name, "el"));
        break;
      default:
        list.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
    }
    return list;
  }, [products, sort]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <p aria-live="polite" className="text-sm text-muted">
          {sorted.length === 1 ? "1 προϊόν" : `${sorted.length} προϊόντα`}
        </p>
        <label className="flex items-center gap-2 text-sm">
          <span className="sr-only">Ταξινόμηση</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-10 rounded-lg bg-surface px-3 text-sm shadow-card ring-1 ring-border"
          >
            {(Object.keys(sortLabels) as SortKey[]).map((k) => (
              <option key={k} value={k}>
                {sortLabels[k]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {sorted.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
