"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { brands, getSubcategories, getTopLevelCategories } from "@/data/taxonomy";

const CLOSE_DELAY_MS = 160;

const linkBase =
  "block whitespace-nowrap px-3 py-2.5 text-sm font-semibold transition-colors";
const linkIdle = "text-white/90 hover:bg-white/10 hover:text-white";

/** Desktop primary navigation with hover/focus mega panels (keyboard safe). */
export function MegaMenu() {
  const pathname = usePathname();
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const categories = getTopLevelCategories();

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenSlug(null), CLOSE_DELAY_MS);
  };

  useEffect(() => {
    setOpenSlug(null);
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenSlug(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const renderPanel = (slug: string) => {
    if (slug === "__brands") {
      return (
        <div className="grid grid-cols-3 gap-1 p-4">
          {brands.map((b) => (
            <Link
              key={b.slug}
              href={`/brands/${b.slug}`}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-ink hover:bg-background"
            >
              {b.name}
            </Link>
          ))}
          <Link
            href="/brands"
            className="col-span-3 mt-1 rounded-lg bg-background px-3 py-2.5 text-center text-sm font-bold text-primary hover:underline"
          >
            Όλα τα brands
          </Link>
        </div>
      );
    }
    const subs = getSubcategories(slug);
    return (
      <div className="grid grid-cols-2 gap-1 p-4">
        {subs.length === 0 ? (
          <p className="col-span-2 px-3 py-2 text-sm text-muted">Περιηγηθείτε σε όλα τα προϊόντα της κατηγορίας.</p>
        ) : (
          subs.map((s) => (
            <Link
              key={s.slug}
              href={`/category/${s.slug}`}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-ink hover:bg-background"
            >
              {s.name}
            </Link>
          ))
        )}
        <Link
          href={`/category/${slug}`}
          className="col-span-2 mt-1 rounded-lg bg-background px-3 py-2.5 text-center text-sm font-bold text-primary hover:underline"
        >
          Προβολή όλων
        </Link>
      </div>
    );
  };

  return (
    <nav ref={navRef} aria-label="Κύρια πλοήγηση" className="relative hidden border-t border-white/10 lg:block">
      <ul className="mx-auto flex max-w-7xl items-stretch px-4">
        <li onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
          <Link
            href="/brands"
            aria-expanded={openSlug === "__brands"}
            onMouseEnter={() => {
              cancelClose();
              setOpenSlug("__brands");
            }}
            onFocus={() => setOpenSlug("__brands")}
            className={`${linkBase} ${isActive("/brands") ? "bg-white/15 text-white" : linkIdle}`}
          >
            Brands
          </Link>
          {openSlug === "__brands" ? (
            <div className="absolute inset-x-0 top-full z-40">
              <div className="mx-auto max-w-7xl px-4">
                <div className="rounded-b-2xl bg-surface text-ink shadow-pop ring-1 ring-border">
                  {renderPanel("__brands")}
                </div>
              </div>
            </div>
          ) : null}
        </li>

        {categories.map((c) => {
          const href = `/category/${c.slug}`;
          const active = isActive(href);
          const open = openSlug === c.slug;
          return (
            <li key={c.slug} onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
              <Link
                href={href}
                aria-expanded={open}
                aria-current={active ? "page" : undefined}
                onMouseEnter={() => {
                  cancelClose();
                  setOpenSlug(c.slug);
                }}
                onFocus={() => setOpenSlug(c.slug)}
                className={`${linkBase} flex items-center gap-1 ${active ? "bg-white/15 text-white" : linkIdle} ${open ? "bg-white/10 text-white" : ""}`}
              >
                {c.name}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </Link>
              {open ? (
                <div className="absolute inset-x-0 top-full z-40">
                  <div className="mx-auto max-w-7xl px-4">
                    <div className="rounded-b-2xl bg-surface text-ink shadow-pop ring-1 ring-border">
                      {renderPanel(c.slug)}
                    </div>
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}

        <li onMouseEnter={cancelClose} onMouseLeave={scheduleClose} className="ml-auto">
          <Link
            href="/offers"
            onFocus={() => setOpenSlug(null)}
            className={`${linkBase} font-bold ${isActive("/offers") ? "bg-white/15 text-amber-300" : "text-amber-300 hover:bg-white/10"}`}
          >
            Προσφορές
          </Link>
        </li>
      </ul>
    </nav>
  );
}
