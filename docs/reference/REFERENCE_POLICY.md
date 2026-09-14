# Reference policy — wecare.gr

This document governs all use of `https://www.wecare.gr/` in this repository.

## 1. Purpose

- `wecare.gr` is a **public UX/UI/functionality reference only**.
- We study its public-facing information architecture, navigation patterns,
  page types, and user flows so later phases can design an equivalent —
  but independently implemented — pharmacy e-commerce experience.
- Captured material **is not application source code** and must never be
  imported, copied, or shipped as part of the production website.

## 2. What is reference-only

- Raw HTML, rendered DOM snapshots, screenshots, images, CSS, JavaScript,
  fonts, banners, logos, branding assets, analytics IDs, tracking snippets,
  credentials, customer information, and any other third-party private data
  encountered during inspection.
- All such material lives **local-only** under `reference-private/` and is
  **never committed to Git** (enforced via `.gitignore`).
- Only sanitized derivatives may be tracked: page metadata inventories
  (`reference/wecare/inventory/*.json`) and human-readable reports
  (`reference/wecare/reports/*.md`), containing URLs, titles, page-type
  labels, and aggregate statistics — never full HTML or binary assets.

## 3. Clean rebuild commitment

- The production website **will be rebuilt from scratch** with our own code,
  copy, design tokens, and product data.
- Proprietary logos, branding, banners, analytics IDs, credentials, customer
  information, tracking configuration, and third-party private data must
  **not** be copied into production.
- Product data will eventually come from the pharmacy's own
  **ERP / vendor / manufacturer sources**, not scraped from the reference site.

## 4. Access rules (mandatory)

1. Inspect **only publicly accessible pages**.
2. Use **GET / browser navigation only**. Never `POST`/`PUT`/`PATCH`/`DELETE`,
   never submit forms, never add products to a cart, never initiate checkout,
   never call destructive or state-changing endpoints.
3. **No authentication bypassing** and **no anti-bot circumvention**:
   no stealth plugins, no CAPTCHA solvers, no Cloudflare bypasses,
   no header/cookie forgery, no credential use.
4. Crawlers are **read-only**: they must not click "add to cart", "buy",
   "login", "register", "logout", "checkout", account-modification, or
   payment actions.
5. Respect `robots.txt` where applicable; discover and honour public sitemaps.
6. Crawl **politely and slowly** (default ~1200 ms between navigations with
   jitter); stay on the `wecare.gr` origin; follow only public internal links.
7. If access is blocked or rate-limited: record the block (status, URL,
   timestamp, reason) and continue safely or terminate cleanly. **Do not evade.**

## 5. Storage rules

- Raw captures: `reference-private/wecare/{html,screenshots,metadata,logs}/` — ignored by Git.
- Tracked derivatives: `reference/wecare/{inventory,reports}/` and `docs/reference/` — reviewed, sanitized, deterministic JSON/Markdown.
- Run `git status --ignored` before staging anything to confirm no raw
  third-party files leak into commits.
