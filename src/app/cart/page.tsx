"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/catalog";
import { useCart } from "@/lib/cart-store";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { ProductImage } from "@/components/commerce/ProductImage";
import { getBrand } from "@/data/taxonomy";

const FREE_SHIPPING_THRESHOLD = 65;
const FLAT_SHIPPING = 3.9;

export default function CartPage() {
  const { lines, total, count, hydrated, setQty, remove, clear } = useCart();
  const shipping = lines.length === 0 || total >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumbs items={[{ label: "Αρχική", href: "/" }, { label: "Καλάθι" }]} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Καλάθι {count > 0 ? `(${count})` : ""}
        </h1>
        {lines.length > 0 ? (
          <button type="button" onClick={clear} className="text-sm font-semibold text-muted underline hover:text-error">
            Άδειασμα καλαθιού
          </button>
        ) : null}
      </div>

      {!hydrated ? (
        <p className="text-sm text-muted" aria-live="polite">Φόρτωση καλαθιού…</p>
      ) : lines.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface px-6 py-14 text-center shadow-card ring-1 ring-border">
          <h2 className="text-lg font-bold">Το καλάθι σας είναι άδειο</h2>
          <p className="max-w-sm text-sm text-muted">
            Προσθέστε προϊόντα από τον κατάλογο. Το demo καλάθι αποθηκεύεται τοπικά στη συσκευή σας.
          </p>
          <Link href="/categories" className="mt-1 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-hover">
            Περιήγηση κατηγοριών
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <ul className="flex flex-col gap-3" aria-label="Είδη καλαθιού">
            {lines.map(({ product, qty }) => (
              <li key={product.slug} className="flex gap-3 rounded-xl bg-surface p-3 shadow-card ring-1 ring-border">
                <div className="w-20 shrink-0 sm:w-24">
                  <ProductImage brandName={getBrand(product.brandSlug)?.name ?? "?"} productName={product.name} size="thumb" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <Link href={`/product/${product.slug}`} className="clamp-2 text-sm font-semibold hover:underline">
                    {product.name}
                  </Link>
                  <span className="text-sm text-muted">{formatPrice(product.price)} / τεμ.</span>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-2 text-sm">
                      <button type="button" onClick={() => setQty(product.slug, qty - 1)} aria-label={`Μείωση ποσότητας για ${product.name}`} className="rounded px-2.5 py-1 ring-1 ring-border hover:bg-background">−</button>
                      <span aria-live="polite" aria-label={`Ποσότητα ${qty}`} className="w-6 text-center font-bold">{qty}</span>
                      <button type="button" onClick={() => setQty(product.slug, qty + 1)} aria-label={`Αύξηση ποσότητας για ${product.name}`} className="rounded px-2.5 py-1 ring-1 ring-border hover:bg-background">+</button>
                    </div>
                    <span className="text-sm font-extrabold">{formatPrice(product.price * qty)}</span>
                  </div>
                  <button type="button" onClick={() => remove(product.slug)} className="w-fit text-xs text-muted underline hover:text-error">
                    Αφαίρεση
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <aside aria-label="Σύνοψη παραγγελίας" className="h-fit rounded-2xl bg-surface p-5 shadow-card ring-1 ring-border lg:sticky lg:top-40">
            <h2 className="text-base font-extrabold">Σύνοψη (demo)</h2>
            <dl className="mt-3 flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Μερικό σύνολο</dt>
                <dd className="font-semibold">{formatPrice(total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Μεταφορικά (εκτίμηση)</dt>
                <dd className="font-semibold">{shipping === 0 ? "Δωρεάν" : formatPrice(shipping)}</dd>
              </div>
              {shipping > 0 ? (
                <p className="text-xs text-muted">
                  Δωρεάν μεταφορικά για παραγγελίες άνω των {formatPrice(FREE_SHIPPING_THRESHOLD)}.
                </p>
              ) : null}
              <div className="mt-1 flex justify-between border-t border-border pt-2 text-base">
                <dt className="font-bold">Σύνολο</dt>
                <dd className="font-extrabold">{formatPrice(total + shipping)}</dd>
              </div>
            </dl>
            <button
              type="button"
              disabled
              title="Το ταμείο δεν είναι διαθέσιμο σε demo"
              aria-disabled="true"
              className="mt-4 w-full cursor-not-allowed rounded-lg bg-border px-4 py-3 text-sm font-bold uppercase tracking-wide text-muted"
            >
              Ταμείο — σύντομα (demo)
            </button>
            <p className="mt-2 text-center text-xs text-faint">
              Ανάπτυξη/demo: δεν γίνεται επεξεργασία πληρωμής.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
