"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { brands } from "@/data/taxonomy";
import { getProductsByBrand } from "@/lib/catalog";

/** Brand index with text filter + first-letter grouping. */
export function BrandsIndex() {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState<string | null>(null);

  const letters = useMemo(() => {
    const set = new Set(brands.map((b) => b.name.charAt(0).toUpperCase()));
    return [...set].sort((a, b) => a.localeCompare(b, "el"));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return brands.filter(
      (b) =>
        (letter === null || b.name.toUpperCase().startsWith(letter)) &&
        (q === "" || b.name.toLowerCase().includes(q)),
    );
  }, [query, letter]);

  const groups = useMemo(() => {
    const map = new Map<string, typeof brands>();
    for (const b of filtered) {
      const l = b.name.charAt(0).toUpperCase();
      if (!map.has(l)) map.set(l, []);
      map.get(l)?.push(b);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0], "el"));
  }, [filtered]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label htmlFor="brand-filter" className="sr-only">
          Φίλτρο brands
        </label>
        <input
          id="brand-filter"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Αναζήτηση brand…"
          className="h-11 w-full max-w-sm rounded-lg bg-surface px-3 text-sm shadow-card ring-1 ring-border placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Φίλτρο ανά αρχικό γράμμα">
          <button
            type="button"
            onClick={() => setLetter(null)}
            aria-pressed={letter === null}
            className={`h-9 min-w-9 rounded-lg px-2 text-sm font-bold ring-1 ${
              letter === null ? "bg-primary text-white ring-primary" : "bg-surface ring-border hover:ring-primary"
            }`}
          >
            Όλα
          </button>
          {letters.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLetter((cur) => (cur === l ? null : l))}
              aria-pressed={letter === l}
              className={`h-9 min-w-9 rounded-lg px-2 text-sm font-bold ring-1 ${
                letter === l ? "bg-primary text-white ring-primary" : "bg-surface ring-border hover:ring-primary"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {groups.length === 0 ? (
        <p className="rounded-xl bg-surface p-8 text-center text-sm text-muted shadow-card ring-1 ring-border">
          Δεν βρέθηκαν brands (demo).
        </p>
      ) : (
        groups.map(([l, list]) => (
          <section key={l} aria-label={`Brands με αρχικό ${l}`}>
            <h2 className="mb-2 flex items-center gap-3 text-lg font-extrabold">
              <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-sm font-extrabold text-primary">
                {l}
              </span>
              {l}
            </h2>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {list.map((b) => {
                const count = getProductsByBrand(b.slug).length;
                return (
                  <li key={b.slug}>
                    <Link
                      href={`/brands/${b.slug}`}
                      className="block rounded-xl bg-surface p-5 shadow-card ring-1 ring-border transition-shadow hover:shadow-pop"
                    >
                      <span className="block text-lg font-extrabold">{b.name}</span>
                      <span className="mt-1 block text-sm text-muted">
                        {count === 1 ? "1 προϊόν" : `${count} προϊόντα`}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
