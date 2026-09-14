"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/catalog";
import { useCart } from "@/lib/cart-store";
import { ProductImage } from "@/components/commerce/ProductImage";
import { getBrand } from "@/data/taxonomy";

/** Demo cart drawer: persisted lines, no checkout, no backend. */
export function CartDrawer() {
  const { lines, total, count, isOpen, closeCart, setQty, remove } = useCart();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Κλείσιμο καλαθιού"
        onClick={closeCart}
        className="absolute inset-0 cursor-default bg-black/50"
      />
      <aside role="dialog" aria-modal="true" aria-label="Καλάθι αγορών" className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface shadow-pop">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-base font-bold">Καλάθι ({count})</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Κλείσιμο"
            className="rounded-full px-2 py-1 text-xl leading-none text-muted hover:bg-background"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <p className="text-sm font-semibold">Το καλάθι σας είναι άδειο.</p>
              <p className="text-sm text-muted">Προσθέστε προϊόντα από τον demo κατάλογο.</p>
              <Link
                href="/categories"
                onClick={closeCart}
                className="mt-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-hover"
              >
                Περιήγηση κατηγοριών
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {lines.map(({ product, qty }) => (
                <li key={product.slug} className="flex gap-3 rounded-xl bg-surface p-2 shadow-card ring-1 ring-border">
                  <div className="w-16 shrink-0">
                    <ProductImage brandName={getBrand(product.brandSlug)?.name ?? "?"} productName={product.name} size="thumb" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link href={`/product/${product.slug}`} onClick={closeCart} className="clamp-2 text-sm font-medium hover:underline">
                      {product.name}
                    </Link>
                    <div className="mt-0.5 flex items-center justify-between text-sm">
                      <span className="font-bold">{formatPrice(product.price)}</span>
                      <span className="font-semibold text-muted">Σύνολο: {formatPrice(product.price * qty)}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 text-sm">
                        <button type="button" onClick={() => setQty(product.slug, qty - 1)} aria-label={`Μείωση ποσότητας για ${product.name}`} className="rounded px-2 py-0.5 ring-1 ring-border hover:bg-background">−</button>
                        <span aria-live="polite" aria-label={`Ποσότητα ${qty}`}>{qty}</span>
                        <button type="button" onClick={() => setQty(product.slug, qty + 1)} aria-label={`Αύξηση ποσότητας για ${product.name}`} className="rounded px-2 py-0.5 ring-1 ring-border hover:bg-background">+</button>
                      </div>
                      <button type="button" onClick={() => remove(product.slug)} className="text-xs text-muted underline hover:text-error">
                        Αφαίρεση
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {lines.length > 0 ? (
          <div className="border-t border-border px-4 py-3">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-muted">Μερικό σύνολο (demo)</span>
              <span className="text-lg font-extrabold">{formatPrice(total)}</span>
            </div>
            <Link
              href="/cart"
              onClick={closeCart}
              className="mt-2 block rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-primary-hover"
            >
              Προβολή καλαθιού
            </Link>
            <p className="mt-2 text-center text-xs text-faint">
              Demo καλάθι — αποθηκεύεται τοπικά, χωρίς ταμείο.
            </p>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
