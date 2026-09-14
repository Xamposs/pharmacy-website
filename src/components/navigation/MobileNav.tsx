"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { brands, getSubcategories, getTopLevelCategories } from "@/data/taxonomy";
import { useCart } from "@/lib/cart-store";
import { useFavorites } from "@/lib/favorites-store";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

/** Off-canvas mobile navigation with expandable categories. */
export function MobileNav({ open, onClose }: MobileNavProps) {
  const { openCart } = useCart();
  const { count: favCount } = useFavorites();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [brandsExpanded, setBrandsExpanded] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const categories = getTopLevelCategories();

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const toggle = (slug: string) => setExpanded((cur) => (cur === slug ? null : slug));

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Κλείσιμο μενού"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/50"
      />
      <div role="dialog" aria-modal="true" aria-label="Μενού πλοήγησης" className="absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-surface shadow-pop">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-base font-extrabold text-white">
              Φ
            </span>
            <span className="text-base font-extrabold">Pharmacy</span>
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Κλείσιμο μενού"
            className="rounded-full px-2.5 py-1 text-2xl leading-none text-muted hover:bg-background"
          >
            ×
          </button>
        </div>

        <nav aria-label="Μενού κινητού" className="flex-1 overflow-y-auto px-2 py-2">
          <ul className="flex flex-col">
            {categories.map((c) => {
              const subs = getSubcategories(c.slug);
              const isOpen = expanded === c.slug;
              return (
                <li key={c.slug} className="border-b border-border/60">
                  <div className="flex items-center">
                    <Link
                      href={`/category/${c.slug}`}
                      onClick={onClose}
                      className="flex-1 rounded-md px-3 py-3 text-sm font-bold"
                    >
                      {c.name}
                    </Link>
                    {subs.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => toggle(c.slug)}
                        aria-expanded={isOpen}
                        aria-controls={`mnav-sub-${c.slug}`}
                        aria-label={`${isOpen ? "Απόκρυψη" : "Εμφάνιση"} υποκατηγοριών ${c.name}`}
                        className="rounded-md p-3 text-muted hover:bg-background"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </button>
                    ) : null}
                  </div>
                  {isOpen ? (
                    <ul id={`mnav-sub-${c.slug}`} className="pb-2 pl-4">
                      {subs.map((s) => (
                        <li key={s.slug}>
                          <Link
                            href={`/category/${s.slug}`}
                            onClick={onClose}
                            className="block rounded-md px-3 py-2.5 text-sm text-muted hover:bg-background hover:text-ink"
                          >
                            {s.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
            <li className="border-b border-border/60">
              <div className="flex items-center">
                <Link href="/brands" onClick={onClose} className="flex-1 rounded-md px-3 py-3 text-sm font-bold">
                  Brands
                </Link>
                <button
                  type="button"
                  onClick={() => setBrandsExpanded((v) => !v)}
                  aria-expanded={brandsExpanded}
                  aria-controls="mnav-brands"
                  aria-label={`${brandsExpanded ? "Απόκρυψη" : "Εμφάνιση"} brands`}
                  className="rounded-md p-3 text-muted hover:bg-background"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className={`transition-transform ${brandsExpanded ? "rotate-180" : ""}`}>
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </div>
              {brandsExpanded ? (
                <ul id="mnav-brands" className="pb-2 pl-4">
                  {brands.map((b) => (
                    <li key={b.slug}>
                      <Link
                        href={`/brands/${b.slug}`}
                        onClick={onClose}
                        className="block rounded-md px-3 py-2.5 text-sm text-muted hover:bg-background hover:text-ink"
                      >
                        {b.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
            <li>
              <Link
                href="/offers"
                onClick={onClose}
                className="block rounded-md px-3 py-3 text-sm font-bold text-primary"
              >
                Προσφορές
              </Link>
            </li>
          </ul>
        </nav>

        <div className="grid grid-cols-3 gap-2 border-t border-border p-3 text-center text-xs font-semibold">
          <Link href="/favorites" onClick={onClose} className="rounded-lg bg-background px-2 py-2.5 hover:underline">
            Αγαπημένα{favCount > 0 ? ` (${favCount})` : ""}
          </Link>
          <button
            type="button"
            onClick={() => {
              onClose();
              openCart();
            }}
            className="rounded-lg bg-background px-2 py-2.5 hover:underline"
          >
            Καλάθι
          </button>
          <span className="rounded-lg bg-background px-2 py-2.5 text-muted" title="Λογαριασμός (σύντομα)">
            Λογαριασμός
          </span>
        </div>
      </div>
    </div>
  );
}
