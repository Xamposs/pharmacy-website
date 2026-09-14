"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar({ initial = "", compact = false }: { initial?: string; compact?: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);

  return (
    <form
      role="search"
      aria-label="Αναζήτηση προϊόντων"
      className={`flex w-full items-center overflow-hidden rounded-lg bg-white ring-1 ring-neutral-700 focus-within:ring-2 focus-within:ring-sky-500 ${compact ? "" : "max-w-xl"}`}
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(value.trim())}`);
      }}
    >
      <label htmlFor={compact ? "site-search-mobile" : "site-search"} className="sr-only">
        Αναζήτηση προϊόντων
      </label>
      <input
        id={compact ? "site-search-mobile" : "site-search"}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Αναζήτηση προϊόντων…"
        className="w-full bg-transparent px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
      />
      <button type="submit" aria-label="Αναζήτηση" className="px-3 py-2 text-neutral-700 hover:text-neutral-900">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>
    </form>
  );
}
