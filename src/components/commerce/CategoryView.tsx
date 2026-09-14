"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { getBrand } from "@/data/taxonomy";
import type { Category, Product } from "@/types/catalog";
import { ProductCard } from "@/components/commerce/ProductCard";

type SortKey = "popular" | "price-asc" | "price-desc" | "name" | "offers" | "rating";

const sortLabels: Record<SortKey, string> = {
  popular: "Δημοφιλή",
  rating: "Βαθμολογία",
  "price-asc": "Τιμή: χαμηλή → υψηλή",
  "price-desc": "Τιμή: υψηλή → χαμηλή",
  name: "Ονομασία Α–Ω",
  offers: "Προσφορές πρώτα",
};

const PAGE_SIZE = 12;

interface Filters {
  brands: string[];
  onlyOffers: boolean;
  onlyAvailable: boolean;
  maxPrice: number | null;
  minRating: number | null;
}

const EMPTY: Filters = { brands: [], onlyOffers: false, onlyAvailable: false, maxPrice: null, minRating: null };

function isFiltered(f: Filters): boolean {
  return f.brands.length > 0 || f.onlyOffers || f.onlyAvailable || f.maxPrice !== null || f.minRating !== null;
}

export function CategoryView({
  products,
  subcategories,
}: {
  products: Product[];
  subcategories: Category[];
}) {
  const [sort, setSort] = useState<SortKey>("popular");
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const priceBounds = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 0 };
    const prices = products.map((p) => p.price);
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [products]);

  const brandOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products) counts.set(p.brandSlug, (counts.get(p.brandSlug) ?? 0) + 1);
    return [...counts.entries()]
      .map(([slug, count]) => ({ slug, name: getBrand(slug)?.name ?? slug, count }))
      .sort((a, b) => a.name.localeCompare(b.name, "el"));
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (filters.brands.length > 0) list = list.filter((p) => filters.brands.includes(p.brandSlug));
    if (filters.onlyOffers) list = list.filter((p) => p.originalPrice !== undefined && p.originalPrice > p.price);
    if (filters.onlyAvailable) list = list.filter((p) => p.availability !== "out_of_stock");
    if (filters.maxPrice !== null) list = list.filter((p) => p.price <= (filters.maxPrice as number));
    if (filters.minRating !== null) list = list.filter((p) => (p.rating ?? 0) >= (filters.minRating as number));
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
      case "rating":
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      default:
        list.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
    }
    return list;
  }, [products, filters, sort]);

  const shown = filtered.slice(0, visible);
  const resetVisible = () => setVisible(PAGE_SIZE);

  const patch = (p: Partial<Filters>) => {
    setFilters((f) => ({ ...f, ...p }));
    resetVisible();
  };

  const toggleBrand = (slug: string) =>
    setFilters((f) => {
      resetVisible();
      return { ...f, brands: f.brands.includes(slug) ? f.brands.filter((s) => s !== slug) : [...f.brands, slug] };
    });

  const chips: Array<{ label: string; clear: () => void }> = [
    ...filters.brands.map((slug) => ({
      label: getBrand(slug)?.name ?? slug,
      clear: () => toggleBrand(slug),
    })),
    ...(filters.onlyOffers ? [{ label: "Προσφορές", clear: () => patch({ onlyOffers: false }) }] : []),
    ...(filters.onlyAvailable ? [{ label: "Διαθέσιμα", clear: () => patch({ onlyAvailable: false }) }] : []),
    ...(filters.maxPrice !== null ? [{ label: `Έως ${filters.maxPrice} €`, clear: () => patch({ maxPrice: null }) }] : []),
    ...(filters.minRating !== null ? [{ label: `${filters.minRating}★ και άνω`, clear: () => patch({ minRating: null }) }] : []),
  ];

  // Mobile drawer: Escape + scroll lock + initial focus.
  useEffect(() => {
    if (!drawerOpen) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  const filterBody = (
    <div className="flex flex-col gap-5">
      <fieldset>
        <legend className="mb-2 text-sm font-extrabold">Μάρκα</legend>
        <ul className="flex flex-col gap-1.5">
          {brandOptions.map((b) => (
            <li key={b.slug}>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(b.slug)}
                  onChange={() => toggleBrand(b.slug)}
                  className="h-4 w-4 accent-primary"
                />
                <span className="flex-1">{b.name}</span>
                <span className="rounded-full bg-background px-1.5 text-xs text-muted ring-1 ring-border">{b.count}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-sm font-extrabold">Τιμή έως</legend>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            step={1}
            value={filters.maxPrice ?? priceBounds.max}
            onChange={(e) => patch({ maxPrice: Number(e.target.value) >= priceBounds.max ? null : Number(e.target.value) })}
            aria-label="Μέγιστη τιμή"
            className="w-full accent-primary"
          />
          <span className="w-16 shrink-0 text-right text-sm font-bold" aria-live="polite">
            {filters.maxPrice !== null ? `${filters.maxPrice} €` : "Όλες"}
          </span>
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-sm font-extrabold">Αξιολόγηση</legend>
        <div className="flex gap-1.5">
          {[4, 4.5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => patch({ minRating: filters.minRating === r ? null : r })}
              aria-pressed={filters.minRating === r}
              className={`rounded-lg px-2.5 py-1.5 text-sm font-bold ring-1 ${
                filters.minRating === r ? "bg-primary text-white ring-primary" : "bg-surface ring-border hover:ring-primary"
              }`}
            >
              {r}★+
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-sm font-extrabold">Διαθεσιμότητα & τιμή</legend>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.onlyOffers}
            onChange={(e) => patch({ onlyOffers: e.target.checked })}
            className="h-4 w-4 accent-primary"
          />
          Μόνο προσφορές
        </label>
        <label className="mt-1.5 flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.onlyAvailable}
            onChange={(e) => patch({ onlyAvailable: e.target.checked })}
            className="h-4 w-4 accent-primary"
          />
          Μόνο διαθέσιμα
        </label>
      </fieldset>
      {isFiltered(filters) ? (
        <button
          type="button"
          onClick={() => {
            setFilters(EMPTY);
            resetVisible();
          }}
          className="rounded-lg px-3 py-2 text-sm font-bold text-error ring-1 ring-error/30 hover:bg-error-soft"
        >
          Καθαρισμός φίλτρων
        </button>
      ) : null}
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
              className="rounded-xl bg-surface p-4 text-sm font-bold shadow-card ring-1 ring-border hover:shadow-pop hover:underline"
            >
              {s.name}
            </Link>
          ))}
        </div>
      ) : null}

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p aria-live="polite" className="text-sm text-muted">
          {filtered.length === 1 ? "1 προϊόν" : `${filtered.length} προϊόντα`}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-haspopup="dialog"
            className="rounded-lg bg-surface px-3 py-2 text-sm font-bold shadow-card ring-1 ring-border lg:hidden"
          >
            Φίλτρα{isFiltered(filters) ? " •" : ""}
          </button>
          <label htmlFor="sort" className="sr-only">
            Ταξινόμηση
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as SortKey);
              resetVisible();
            }}
            className="h-10 rounded-lg bg-surface px-3 text-sm shadow-card ring-1 ring-border"
          >
            {(Object.keys(sortLabels) as SortKey[]).map((k) => (
              <option key={k} value={k}>
                {sortLabels[k]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {chips.length > 0 ? (
        <ul aria-label="Ενεργά φίλτρα" className="mb-3 flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <li key={chip.label}>
              <button
                type="button"
                onClick={chip.clear}
                aria-label={`Αφαίρεση φίλτρου ${chip.label}`}
                className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary-ink hover:ring-1 hover:ring-primary"
              >
                {chip.label}
                <span aria-hidden="true">×</span>
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => {
                setFilters(EMPTY);
                resetVisible();
              }}
              className="rounded-full px-2.5 py-1 text-xs font-bold text-muted underline hover:text-error"
            >
              Καθαρισμός όλων
            </button>
          </li>
        </ul>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[230px_1fr]">
        <aside aria-label="Φίλτρα" className="hidden lg:block">
          <div className="sticky top-36 rounded-2xl bg-surface p-4 shadow-card ring-1 ring-border">{filterBody}</div>
        </aside>
        <div>
          {shown.length === 0 ? (
            <div className="rounded-2xl bg-surface p-10 text-center shadow-card ring-1 ring-border">
              <h2 className="text-base font-bold">Δεν βρέθηκαν προϊόντα</h2>
              <p className="mt-1 text-sm text-muted">Δοκιμάστε να αφαιρέσετε κάποια φίλτρα.</p>
              <button
                type="button"
                onClick={() => {
                  setFilters(EMPTY);
                  resetVisible();
                }}
                className="mt-3 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-hover"
              >
                Καθαρισμός φίλτρων
              </button>
            </div>
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
                className="rounded-lg bg-surface px-6 py-2.5 text-sm font-bold shadow-card ring-1 ring-border hover:ring-primary"
              >
                Περισσότερα ({filtered.length - visible} ακόμη)
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Κλείσιμο φίλτρων" onClick={() => setDrawerOpen(false)} className="absolute inset-0 cursor-default bg-black/50" />
          <div role="dialog" aria-modal="true" aria-label="Φίλτρα προϊόντων" className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-surface p-4 shadow-pop">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-extrabold">Φίλτρα</h2>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Κλείσιμο φίλτρων"
                className="rounded-full px-2.5 py-1 text-2xl leading-none text-muted hover:bg-background"
              >
                ×
              </button>
            </div>
            {filterBody}
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="mt-4 w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary-hover"
            >
              {`Εμφάνιση ${filtered.length === 1 ? "1 προϊόντος" : `${filtered.length} προϊόντων`}`}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
