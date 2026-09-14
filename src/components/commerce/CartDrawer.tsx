"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/catalog";
import { useCart } from "@/lib/cart-store";
import { ProductImage } from "@/components/commerce/ProductImage";
import { getBrand } from "@/data/taxonomy";

/** Demo cart drawer: shows in-memory lines. No checkout, no persistence. */
export function CartDrawer() {
  const { lines, total, count, isOpen, closeCart, setQty, remove } = useCart();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Καλάθι αγορών">
      <button
        type="button"
        aria-label="Κλείσιμο καλαθιού"
        onClick={closeCart}
        className="absolute inset-0 cursor-default bg-black/50"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <h2 className="text-base font-bold">Καλάθι ({count})</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Κλείσιμο"
            className="rounded-full px-2 py-1 text-xl leading-none text-neutral-500 hover:bg-neutral-100"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {lines.length === 0 ? (
            <p className="py-10 text-center text-sm text-neutral-500">
              Το καλάθι σας είναι άδειο. Προσθέστε προϊόντα από τον κατάλογο demo.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {lines.map(({ product, qty }) => (
                <li key={product.slug} className="flex gap-3 rounded-xl p-2 ring-1 ring-neutral-200">
                  <div className="w-16 shrink-0">
                    <ProductImage brandName={getBrand(product.brandSlug)?.name ?? "?"} productName={product.name} size="thumb" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link href={`/product/${product.slug}`} onClick={closeCart} className="clamp-2 text-sm font-medium hover:underline">
                      {product.name}
                    </Link>
                    <span className="text-sm font-bold">{formatPrice(product.price)}</span>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 text-sm">
                        <button type="button" onClick={() => setQty(product.slug, qty - 1)} aria-label="Μείωση ποσότητας" className="rounded px-2 py-0.5 ring-1 ring-neutral-300">−</button>
                        <span aria-live="polite">{qty}</span>
                        <button type="button" onClick={() => setQty(product.slug, qty + 1)} aria-label="Αύξηση ποσότητας" className="rounded px-2 py-0.5 ring-1 ring-neutral-300">+</button>
                      </div>
                      <button type="button" onClick={() => remove(product.slug)} className="text-xs text-neutral-500 underline hover:text-red-600">
                        Αφαίρεση
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-neutral-200 px-4 py-3">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-neutral-600">Σύνολο (demo)</span>
            <span className="text-lg font-extrabold">{formatPrice(total)}</span>
          </div>
          <p className="text-xs text-neutral-400">
            Demo καλάθι: χωρίς ταμείο, πληρωμές ή αποθήκευση.
          </p>
        </div>
      </aside>
    </div>
  );
}
