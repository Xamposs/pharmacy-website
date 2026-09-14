# Storefront architecture (Phase 1)

> Stack: Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + TypeScript.
> Data: typed in-memory demo catalog (`src/data/`). No backend, database,
> auth, checkout, payments, ERP, search engine, or AI — all deferred.

## Structure

```text
src/
  app/                    # routes (server components by default)
    layout.tsx            # <html lang="el">, TopBar/Header/Footer, CartProvider, CartDrawer
    page.tsx              # homepage: hero, categories, offers, brands, popular, new, trust, newsletter
    globals.css           # Tailwind v4 import + theme font + .clamp-2 utility
    category/[slug]/      # category template (server) + CategoryView (client filters/sort)
    product/[slug]/       # product template (server) + BuyBox (client)
    brands/               # brand index (server)
    brands/[slug]/        # brand page (server)
    search/               # ?q= mock search (server)
    not-found.tsx         # Greek 404
  components/
    layout/               # TopBar, SiteHeader (client: menu/search/cart), Newsletter, TrustBar, SiteFooter
    navigation/           # Breadcrumbs, SearchBar (client)
    commerce/             # ProductCard, PriceDisplay, AvailabilityBadge, RatingStars,
                          # ProductImage (CSS placeholder), QuantitySelector, BuyBox, CartDrawer, CategoryView
    home/                 # HeroSection, CategoryTiles, ProductCarousel, BrandStrip
    shared/               # SectionHeading
  data/                   # products.ts (24 invented demo products), taxonomy.ts (10 categories, 6 brands)
  lib/                    # catalog.ts (queries, search, price formatting), cart-store.tsx (demo cart context)
  types/                  # catalog.ts (Product, Category, Brand, CartLine)
scripts/reference/        # read-only wecare.gr analysis tooling (unchanged contract)
```

## Conventions

- Server components by default; `"use client"` only for: cart state/drawer,
  search input, mobile menu, filters/sort, quantity, newsletter form,
  favorite toggles.
- Greek UI copy (`lang="el"`); EUR prices formatted `14,90 €`.
- Product visuals are local CSS placeholders (`ProductImage`) — no remote images.
- Demo identifiers (`DEMO-xxxxxx`) are fictional; no real SKUs/EANs.

## Current boundaries (what Phase 1 does NOT do)

- No real cart persistence (React state only, resets on reload).
- No checkout, payments, couriers, ERP sync, search engine, admin, accounts, AI.
- Mock search is substring matching over the demo catalog.

## Future integration points (explicitly deferred)

| Concern | Integration point |
|---|---|
| Commerce backend | Replace `src/data/*` + `src/lib/catalog.ts` with fetchers; keep component props stable |
| Cart persistence | Replace `src/lib/cart-store.tsx` internals (context API stays) |
| ERP (products/stock/prices) | Feed into the catalog layer; `demoCode` → real SKU/EAN mapping |
| Search engine | Replace `searchProducts()`; keep `/search?q=` contract |
| Payments / couriers | New checkout route + `ShippingInfo`/`PaymentInfo` blocks (reference IA mapped) |
| AI assistant | New route/component consuming the same catalog queries |
| Production deploy | `next build` + `next start` (or standalone output) on local Linux host |
