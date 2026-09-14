"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getBrand } from "@/data/taxonomy";
import type { Category, Product } from "@/types/catalog";
import { ProductCard } from "@/components/commerce/ProductCard";

type SortKey = "popular" | "price-asc" | "price-desc" | "name" | "offers";

const sortLabels: Record<SortKey, string> = {
  popular: "Δημοφιλή",
  "price-asc": "Τιμή: χαμηλή → υψηλή",
  "price-desc": "Τιμή: υψηλή → χαμηλή",
  name: "Ονομασία Α–Ω",
  offers: "Προσφορές πρώτα",
};

const PAGE_SIZE = 12;

export function CategoryView({
  products,
  subcategories,
}: {
  products: Product[];
  subcategories: Category[];
}) {
  const [sort, setSort] = useState<SortKey>("popular");
  const [brandFilters, setBrandFilters] = useState<string[]>([]);
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const brandOptions = useMemo(() => {
    const slugs = [...new Set(products.map((p) => p.brandSlug))];
    return slugs
      .map((slug) => ({ slug, name: getBrand(slug)?.name ?? slug }))
      .sort((a, b) => a.name.localeCompare(b.name, "el"));
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (brandFilters.length > 0) list = list.filter((p) => brandFilters.includes(p.brandSlug));
    if (onlyOffers) list = list.filter((p) => p.originalPrice !== undefined && p.originalPrice > p.price);
    if (onlyAvailable) list = list.filter((p) => p.availability !== "out_of_stock");
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
      case "offers":
        list.sort((a, b) => Number(b.originalPrice !== undefined) - Number(a.originalPrice !== undefined));
        break;
      default:
        list.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
    }
    return list;
  }, [products, brandFilters, onlyOffers, onlyAvailable, sort]);

  const shown = filtered.slice(0, visible);

  const toggleBrand = (slug: string) =>
    setBrandFilters((prev) => {
      setVisible(PAGE_SIZE);
      return prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
    });

  const filters = (
    <div className="flex flex-col gap-5">
      <fieldset>
        <legend className="mb-2 text-sm font-extrabold">Μάρκα</legend>
        <ul className="flex flex-col gap-1.5">
          {brandOptions.map((b) => (
            <li key={b.slug}>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={brandFilters.includes(b.slug)}
                  onChange={() => toggleBrand(b.slug)}
                  className="h-4 w-4 accent-neutral-900"
                />
                {b.name}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-sm font-extrabold">Διαθεσιμότητα & τιμή</legend>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyOffers}
            onChange={(e) => {
              setOnlyOffers(e.target.checked);
              setVisible(PAGE_SIZE);
            }}
            className="h-4 w-4 accent-neutral-900"
          />
          Μόνο προσφορές
        </label>
        <label className="mt-1.5 flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => {
              setOnlyAvailable(e.target.checked);
              setVisible(PAGE_SIZE);
            }}
            className="h-4 w-4 accent-neutral-900"
          />
          Μόνο διαθέσιμα
        </label>
      </fieldset>
    </div>
  );

  return (
    <div>
      {subcategories.length > 0 ? (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {subcategories.map((s) => (
            <Link
              key={s.slug}
              href={`/category/${s.slug}`}
              className="rounded-xl bg-neutral-50 p-4 text-sm font-bold ring-1 ring-neutral-200 hover:shadow-md hover:underline"
            >
              {s.name}
            </Link>
          ))}
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p aria-live="polite" className="text-sm text-neutral-600">
          {filtered.length === 1 ? "1 προϊόν" : `${filtered.length} προϊόντα`}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            aria-expanded={filtersOpen}
            className="rounded-lg px-3 py-2 text-sm font-semibold ring-1 ring-neutral-300 lg:hidden"
          >
            Φίλτρα
          </button>
          <label htmlFor="sort" className="sr-only">
            Ταξινόμηση
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as SortKey);
              setVisible(PAGE_SIZE);
            }}
            className="rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-neutral-300"
          >
            {(Object.keys(sortLabels) as SortKey[]).map((k) => (
              <option key={k} value={k}>
                {sortLabels[k]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtersOpen ? <div className="mb-4 rounded-xl bg-neutral-50 p-4 ring-1 ring-neutral-200 lg:hidden">{filters}</div> : null}

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside aria-label="Φίλτρα" className="hidden lg:block">
          <div className="sticky top-32 rounded-xl bg-neutral-50 p-4 ring-1 ring-neutral-200">{filters}</div>
        </aside>
        <div>
          {shown.length === 0 ? (
            <p className="rounded-xl bg-neutral-50 p-8 text-center text-sm text-neutral-500 ring-1 ring-neutral-200">
              Δεν βρέθηκαν προϊόντα με αυτά τα φίλτρα (demo).
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
              {shown.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
          {visible < filtered.length ? (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="rounded-lg border border-neutral-300 px-6 py-2.5 text-sm font-bold hover:border-neutral-900"
              >
                Περισσότερα ({filtered.length - visible} ακόμη)
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
