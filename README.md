# Pharmacy Website

Self-hosted Greek pharmacy e-commerce platform (in preparation).

> **Current phase: Phase 0 — Reference Analysis & Project Foundation.**
> No storefront, product, cart, checkout, auth, database, ERP, payment,
> courier, Skroutz, AI, or admin code exists yet — and none is created in
> this phase. Phase 0 only establishes project structure and read-only
> tooling for analysing the public structure of a reference site.

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

## Repository layout (Phase 0)

```text
docs/
  architecture/        # system sketches (future phases)
  decisions/           # Architecture Decision Records (ADRs)
  reference/           # reference-site policy & analysis notes (tracked)
reference/
  wecare/
    inventory/         # sanitized, tracked page/link/type metadata (JSON)
    reports/           # human-readable tracked reports (Markdown)
reference-private/     # RAW captures: HTML, screenshots, runtime metadata (GIT-IGNORED)
scripts/
  reference/           # Phase 0 crawler + reporter source (TypeScript + Playwright)
```

## Developer setup (Phase 0 reference tools)

Prerequisites:

- Node.js 22+ (`node --version`)
- npm 10+ (on Windows PowerShell with restricted execution policy, use `cmd /c npm ...`)
- Windows 10/11, macOS, or Linux

Install:

```cmd
cmd /c npm install
cmd /c npx playwright install chromium
```

Run the reference smoke test (max 25 pages, polite read-only crawl):

```cmd
cmd /c npm run reference:crawl -- --max-pages=25
cmd /c npm run reference:report
```

Other useful commands:

```cmd
cmd /c npm run typecheck
```

Configuration via environment variables (see [`.env.example`](.env.example)):

| Variable | Default | Description |
|---|---|---|
| `REFERENCE_BASE_URL` | `https://www.wecare.gr` | Crawl origin (do not change in Phase 0) |
| `REFERENCE_MAX_PAGES` | `25` | Max pages to visit |
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
