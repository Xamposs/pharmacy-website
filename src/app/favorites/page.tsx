"use client";

import Link from "next/link";
import { getProduct } from "@/lib/catalog";
import { useFavorites } from "@/lib/favorites-store";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { ProductCard } from "@/components/commerce/ProductCard";

export default function FavoritesPage() {
  const { slugs, hydrated, clear } = useFavorites();
  const products = slugs
    .map((s) => getProduct(s))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumbs items={[{ label: "Αρχική", href: "/" }, { label: "Αγαπημένα" }]} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Αγαπημένα</h1>
        {products.length > 0 ? (
          <button
            type="button"
            onClick={clear}
            className="text-sm font-semibold text-muted underline hover:text-error"
          >
            Καθαρισμός λίστας
          </button>
        ) : null}
      </div>

      {!hydrated ? (
        <p className="text-sm text-muted" aria-live="polite">Φόρτωση λίστας…</p>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface px-6 py-14 text-center shadow-card ring-1 ring-border">
          <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-full bg-error-soft text-error">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-7.5-4.7-10-9.3C.4 8.6 2.4 5 5.8 5c2 0 3.4 1.1 4.2 2.3h4C14.8 6.1 16.2 5 18.2 5c3.4 0 5.4 3.6 3.8 6.7C19.5 16.3 12 21 12 21z" transform="scale(0.9)" />
            </svg>
          </span>
          <h2 className="text-lg font-bold">Δεν έχετε αγαπημένα ακόμη</h2>
          <p className="max-w-sm text-sm text-muted">
            Πατήστε την καρδιά σε οποιοδήποτε προϊόν για να το αποθηκεύσετε εδώ.
          </p>
          <Link
            href="/categories"
            className="mt-1 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-hover"
          >
            Περιήγηση κατηγοριών
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted" aria-live="polite">
            {products.length === 1 ? "1 προϊόν" : `${products.length} προϊόντα`} στη λίστα σας.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
