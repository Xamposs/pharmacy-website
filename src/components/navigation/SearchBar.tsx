"use client";

import { useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { brands, categories, getBrand } from "@/data/taxonomy";
import { formatPrice, searchProducts } from "@/lib/catalog";
import { ProductImage } from "@/components/commerce/ProductImage";
import type { Brand, Category, Product } from "@/types/catalog";

interface Suggestion {
  key: string;
  href: string;
  label: string;
  kind: "product" | "brand" | "category";
  product?: Product;
  brand?: Brand;
  category?: Category;
}

const MAX_PRODUCTS = 5;
const MAX_GROUPS = 4;

function buildSuggestions(query: string): { products: Product[]; brands: Brand[]; categories: Category[] } {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return { products: [], brands: [], categories: [] };
  return {
    products: searchProducts(q).slice(0, MAX_PRODUCTS),
    brands: brands.filter((b) => b.name.toLowerCase().includes(q)).slice(0, MAX_GROUPS),
    categories: categories.filter((c) => c.name.toLowerCase().includes(q)).slice(0, MAX_GROUPS),
  };
}

/** Header search with live mock-catalog suggestions (no backend). */
export function SearchBar({ initial = "", compact = false }: { initial?: string; compact?: boolean }) {
  const router = useRouter();
  const uid = useId();
  const listId = `search-list-${uid}`;
  const [value, setValue] = useState(initial);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);

  const { products, brands: brandHits, categories: catHits } = useMemo(
    () => buildSuggestions(value),
    [value],
  );

  const flat: Suggestion[] = useMemo(
    () => [
      ...products.map((p) => ({ key: `p-${p.slug}`, href: `/product/${p.slug}`, label: p.name, kind: "product" as const, product: p })),
      ...brandHits.map((b) => ({ key: `b-${b.slug}`, href: `/brands/${b.slug}`, label: b.name, kind: "brand" as const, brand: b })),
      ...catHits.map((c) => ({ key: `c-${c.slug}`, href: `/category/${c.slug}`, label: c.name, kind: "category" as const, category: c })),
    ],
    [products, brandHits, catHits],
  );

  const hasQuery = value.trim().length >= 2;
  const empty = hasQuery && flat.length === 0;

  const go = (href: string) => {
    setOpen(false);
    setActive(-1);
    router.push(href);
  };

  const submitAll = () => {
    setOpen(false);
    setActive(-1);
    router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  };

  // Close on outside click.
  const onBlurCapture = (e: React.FocusEvent) => {
    if (!rootRef.current?.contains(e.relatedTarget as Node | null)) {
      setOpen(false);
      setActive(-1);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" && open && flat.length > 0) {
      e.preventDefault();
      setActive((a) => (a + 1) % flat.length);
    } else if (e.key === "ArrowUp" && open && flat.length > 0) {
      e.preventDefault();
      setActive((a) => (a <= 0 ? flat.length - 1 : a - 1));
    } else if (e.key === "Enter" && open && active >= 0 && flat[active]) {
      e.preventDefault();
      go(flat[active].href);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  };

  return (
    <div ref={rootRef} onBlurCapture={onBlurCapture} className={`relative w-full ${compact ? "" : "max-w-xl"}`}>
      <form
        role="search"
        aria-label="Αναζήτηση προϊόντων"
        className="flex w-full items-center overflow-hidden rounded-lg bg-white ring-1 ring-black/20 focus-within:ring-2 focus-within:ring-accent"
        onSubmit={(e) => {
          e.preventDefault();
          submitAll();
        }}
      >
        <label htmlFor={listId} className="sr-only">
          Αναζήτηση προϊόντων
        </label>
        <input
          id={listId}
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${listId}-box`}
          aria-activedescendant={active >= 0 && flat[active] ? `${listId}-opt-${active}` : undefined}
          autoComplete="off"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Αναζήτηση προϊόντων…"
          className="w-full bg-transparent px-3 py-2 text-sm text-ink placeholder:text-faint focus:outline-none"
        />
        <button type="submit" aria-label="Αναζήτηση" className="px-3 py-2 text-muted hover:text-ink">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>
      </form>

      {open && hasQuery ? (
        <div
          id={`${listId}-box`}
          role="listbox"
          aria-label="Προτάσεις αναζήτησης"
          className="absolute inset-x-0 top-full z-50 mt-1 max-h-[70vh] overflow-y-auto rounded-xl bg-surface text-ink shadow-pop ring-1 ring-border"
        >
          {empty ? (
            <p className="px-4 py-6 text-center text-sm text-muted">
              Δεν βρέθηκαν προτάσεις για «{value.trim()}». Πατήστε Enter για πλήρη αναζήτηση.
            </p>
          ) : (
            <ul className="py-2">
              {flat.map((s, i) => (
                <li key={s.key} role="option" id={`${listId}-opt-${i}`} aria-selected={i === active}>
                  {s.kind === "product" && s.product ? (
                    <Link
                      href={s.href}
                      onClick={() => go(s.href)}
                      onMouseEnter={() => setActive(i)}
                      className={`flex items-center gap-3 px-3 py-2 ${i === active ? "bg-background" : ""}`}
                    >
                      <span className="w-10 shrink-0">
                        <ProductImage
                          brandName={getBrand(s.product.brandSlug)?.name ?? "?"}
                          productName={s.product.name}
                          size="thumb"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[11px] font-semibold uppercase tracking-wide text-accent">
                          {getBrand(s.product.brandSlug)?.name}
                        </span>
                        <span className="clamp-2 block text-sm font-medium leading-snug">{s.product.name}</span>
                      </span>
                      <span className="shrink-0 text-sm font-extrabold">{formatPrice(s.product.price)}</span>
                    </Link>
                  ) : (
                    <Link
                      href={s.href}
                      onClick={() => go(s.href)}
                      onMouseEnter={() => setActive(i)}
                      className={`flex items-center gap-3 px-3 py-2 ${i === active ? "bg-background" : ""}`}
                    >
                      <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-extrabold text-primary">
                        {s.label.charAt(0)}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">{s.label}</span>
                      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-faint">
                        {s.kind === "brand" ? "Brand" : "Κατηγορία"}
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={submitAll}
            className="block w-full border-t border-border px-4 py-2.5 text-center text-sm font-bold text-primary hover:underline"
          >
            {`Αναζήτηση για «${value.trim()}»`}
          </button>
        </div>
      ) : null}
    </div>
  );
}
