"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { useFavorites } from "@/lib/favorites-store";
import { SearchBar } from "@/components/navigation/SearchBar";
import { MegaMenu } from "@/components/navigation/MegaMenu";
import { MobileNav } from "@/components/navigation/MobileNav";

export function SiteHeader() {
  const { count, openCart } = useCart();
  const { count: favCount } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-primary-ink text-white shadow">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2.5 sm:gap-3">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Άνοιγμα μενού"
          className="rounded-md p-2 hover:bg-white/10 lg:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <Link href="/" aria-label="Pharmacy — αρχική" className="flex shrink-0 items-center gap-2">
          <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-lg font-extrabold text-primary-ink">
            Φ
          </span>
          <span className="hidden text-lg font-extrabold tracking-tight min-[420px]:block">Pharmacy</span>
        </Link>
        <div className="hidden flex-1 justify-center px-2 md:flex">
          <SearchBar />
        </div>
        <nav aria-label="Συντομεύσεις" className="ml-auto flex items-center gap-0.5 sm:gap-1">
          <button
            type="button"
            onClick={() => setMobileSearchOpen((o) => !o)}
            aria-label="Αναζήτηση"
            aria-expanded={mobileSearchOpen}
            className="rounded-md p-2 hover:bg-white/10 md:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
          <Link
            href="/favorites"
            aria-label={favCount > 0 ? `Αγαπημένα, ${favCount} προϊόντα` : "Αγαπημένα"}
            title="Αγαπημένα"
            className="relative hidden rounded-md p-2 hover:bg-white/10 sm:block"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 21s-7.5-4.7-10-9.3C.4 8.6 2.4 5 5.8 5c2 0 3.4 1.1 4.2 2.3h4C14.8 6.1 16.2 5 18.2 5c3.4 0 5.4 3.6 3.8 6.7C19.5 16.3 12 21 12 21z" transform="scale(0.9)" />
            </svg>
            {favCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold">
                {favCount}
              </span>
            ) : null}
          </Link>
          <span className="hidden rounded-md p-2 text-white/70 sm:block" title="Λογαριασμός (σύντομα)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
            </svg>
          </span>
          <button
            type="button"
            onClick={openCart}
            aria-label={count > 0 ? `Άνοιγμα καλαθιού, ${count} προϊόντα` : "Άνοιγμα καλαθιού"}
            className="relative rounded-md p-2 hover:bg-white/10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 7h16l-1.5 12h-13L4 7z" />
              <path d="M8 7V6a4 4 0 0 1 8 0v1" />
            </svg>
            {count > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold">
                {count}
              </span>
            ) : null}
          </button>
        </nav>
      </div>
      {mobileSearchOpen ? (
        <div className="border-t border-white/10 px-4 py-2 md:hidden">
          <SearchBar compact />
        </div>
      ) : null}
      <MegaMenu />
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
