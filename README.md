# Pharmacy Website

Self-hosted Greek pharmacy e-commerce platform.

> **Phase 0 — complete.** Reference analysis foundation + read-only tooling.
> **Phase 1 — complete.** Targeted reference analysis (150 pages, 127 product
> pages) + storefront foundation with demo catalog. No backend commerce yet:
> no auth, checkout, payments, database, ERP, admin, or AI.

## What this repository will eventually contain

Planned high-level areas (future phases, **not implemented yet**):

- **Storefront** — public catalogue, homepage, landing pages
- **Product catalog** — categories, brands, product pages, variants
- **Search / filtering** — full-text search, facets, sorting
- **Customer accounts** — registration, login, profiles, order history
- **Cart and checkout** — cart, shipping, payment orchestration
- **Admin** — catalogue/order/content management
- **ERP integration** — product/stock/price sync from the pharmacy's own ERP/vendor/manufacturer sources
- **Payments** — card / bank transfer / cash-on-delivery providers
- **Courier integrations** — shipping labels, tracking, rates
- **Skroutz integration** — product feed / marketplace sync
- **AI shopping assistant** — guided product discovery over our own catalogue
- **Local Linux production deployment** — self-hosted Docker/systemd deployment

## Reference site policy (short version)

The public website `https://www.wecare.gr/` is used **only** as a UX/UI/feature
reference. Captured third-party material is **reference-only**, stays
**local-only** under `reference-private/`, and is **never** shipped as
production source code. The production site will be a clean implementation
built from scratch. Full policy: [`docs/reference/REFERENCE_POLICY.md`](docs/reference/REFERENCE_POLICY.md).

## Repository layout

```text
src/                   # production storefront (Next.js App Router, clean implementation)
  app/                 # routes: /, /category/[slug], /product/[slug], /brands, /brands/[slug], /search
  components/          # layout/, navigation/, commerce/, home/, shared/
  data/                # typed DEMO catalog (invented products; no real vendor data)
  lib/                 # catalog queries + isolated demo cart store
  types/               # catalog types
docs/
  architecture/        # STOREFRONT_ARCHITECTURE.md + future system notes
  decisions/           # Architecture Decision Records (ADRs)
  reference/           # reference-site policy + WECARE_* analysis docs (tracked)
reference/
  wecare/
    inventory/         # sanitized, tracked page/link/type metadata (JSON)
    reports/           # human-readable tracked reports (Markdown)
reference-private/     # RAW captures: HTML, screenshots, runtime metadata (GIT-IGNORED)
scripts/
  reference/           # crawler + reporter + shots + analyze (TypeScript + Playwright)
```

## Developer setup

Prerequisites:

- Node.js 22+ (`node --version`)
- npm 10+ (on Windows PowerShell with restricted execution policy, use `cmd /c npm ...`)
- Windows 10/11, macOS, or Linux

Install:

```cmd
cmd /c npm install
cmd /c npx playwright install chromium
```

Storefront:

```cmd
cmd /c npm run dev        :: local development
cmd /c npm run build      :: production build
cmd /c npm run start      :: serve production build
cmd /c npm run typecheck  :: TypeScript check (app + tooling)
```

Reference analysis (read-only, polite; raw captures stay in git-ignored `reference-private/`):

```cmd
cmd /c npm run reference:crawl -- --max-pages=150
cmd /c npm run reference:report
cmd /c npm run reference:shots -- --url=<url> --label=<label>
cmd /c npm run reference:analyze
```

Configuration via environment variables (see [`.env.example`](.env.example)):

| Variable | Default | Description |
|---|---|---|
| `REFERENCE_BASE_URL` | `https://www.wecare.gr` | Crawl origin (reference only) |
| `REFERENCE_MAX_PAGES` | `25` | Max pages to visit (Phase 1 deep run used `--max-pages=150`) |
| `REFERENCE_DELAY_MS` | `1200` | Base delay between navigations (ms) |
| `REFERENCE_TIMEOUT_MS` | `30000` | Per-navigation timeout (ms) |

## Safety rules

- Inspect **only** publicly accessible pages.
- `GET` / navigation only. **Never** submit forms, add to cart, check out,
  log in/out, modify accounts, or call state-changing endpoints.
- Do not attempt to bypass authentication, CAPTCHA, bot protection,
  Cloudflare protections, access controls, paywalls, or rate limits.
- If blocked, record the block and stop/continue safely — never evade.
- Raw captures under `reference-private/` are never committed (enforced by `.gitignore`).
- Do not push or commit unless explicitly instructed; the maintainer handles GitHub pushes manually.
