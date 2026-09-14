# wecare.gr smoke test — 2026-09-14

> Auto-generated from the polite read-only crawl (max 25 pages).
> Source: `reference/wecare/inventory/*.json` (sanitized). Raw HTML/screenshots stay local-only
> under `reference-private/` per `docs/reference/REFERENCE_POLICY.md`.

## Totals

- Discovered URLs (queue, incl. unvisited): **3342**
- Visited URLs: **25**
- Successful pages: **25**
- Failed (non-block) pages: **0**
- Blocked pages: **0**
- Redirects (final URL differs): **0**

## Page types (heuristic)

- homepage: **1**
- category: **13**
- subcategory: **1**
- blog: **1**
- informational: **1**
- brand: **8**

Classification is best-effort (URL + title/H1 patterns); see `pageTypeReason` in `pages.json`.

## Representative pages

- Homepage: https://www.wecare.gr/ ("Wecare Pharmacy: To online φαρμακείο που φροντίζει για εσάς.")
- Category-like: https://www.wecare.gr/%CE%B1%CE%BD%CF%84%CE%B7%CE%BB%CE%B9%CE%B1%CE%BA%CE%B1.htm ("Αντηλιακά Προσώπου & Σώματος | wecare.gr")
- Product-like: none observed
- Brand-like: https://www.wecare.gr/vendors.htm ("Κορυφαία Brands Φαρμακείου: CeraVe, Frezyderm & Apivita | wecare")
- Informational/content-like: https://www.wecare.gr/blog ("Blog wecare.gr: Συμβουλές Υγείας & Ομορφιάς | wecare.gr")

## Crawl configuration

- robots.txt available: **false** (https://www.wecare.gr/robots.txt)
- Sitemaps discovered: none
- Base delay between navigations: 1200 ms (+ jitter)

## Notable site sections (top-level path prefixes observed)

- `/`
- `/%CE%B1%CE%BD%CF%84%CE%B7%CE%BB%CE%B9%CE%B1%CE%BA%CE%B1.htm`
- `/%CE%B2%CE%B9%CF%84%CE%B1%CE%BC%CE%B9%CE%BD%CE%B5%CF%83-%CF%83%CF%85%CE%BC%CF%80%CE%BB%CE%B7%CF%81%CF%89%CE%BC%CE%B1%CF%84%CE%B1.htm`
- `/%CE%B3%CE%B9%CE%B1-%CF%84%CE%BF%CE%BD-%CE%B1%CE%BD%CE%B4%CF%81%CE%B1.htm`
- `/%CE%B4%CE%B5%CF%81%CE%BC%CE%BF%CE%BA%CE%B1%CE%BB%CE%BB%CF%85%CE%BD%CF%84%CE%B9%CE%BA%CE%B1.htm`
- `/%CE%B5%CF%80%CE%BF%CF%87%CE%B9%CE%B1%CE%BA%CE%B1-%CF%80%CF%81%CE%BF%CF%83%CF%86%CE%BF%CF%81%CE%B5%CF%83.htm`
- `/%CE%BC%CE%B1%CE%BA%CE%B9%CE%B3%CE%B9%CE%B1%CE%B6.htm`
- `/%CE%BC%CE%B1%CE%BB%CE%BB%CE%B9%CE%B1.htm`
- `/%CE%BC%CE%B7%CF%84%CE%B5%CF%81%CE%B1-%CF%80%CE%B1%CE%B9%CE%B4%CE%B9.htm`
- `/%CF%80%CF%81%CE%BF%CF%83%CF%89%CF%80%CE%BF.htm`
- `/%CF%83%CF%89%CE%BC%CE%B1`
- `/%CF%83%CF%89%CE%BC%CE%B1.htm`
- `/%CF%84%CE%B5%CE%BB%CE%B5%CF%85%CF%84%CE%B1%CE%B9%CE%B5%CF%83-%CE%B1%CF%86%CE%B9%CE%BE%CE%B5%CE%B9%CF%83.htm`
- `/%CF%86%CE%B1%CF%81%CE%BC%CE%B1%CE%BA%CE%B5%CE%B9%CE%BF.htm`
- `/blog`
- `/category`
- `/hot.htm`
- `/vendors`
- `/vendors.htm`

## Navigation patterns observed

- Internal discovery via same-origin anchor hrefs (BFS from homepage, deduped + canonicalized).
- Tracking params stripped; fragments stripped; sensitive paths (account/login/checkout/cart/admin/api/…) never queued.
- Non-GET requests aborted at the browser-context level as a safety net.

## Failures / blocks

- No blocked pages recorded.
- No non-block failures recorded.

## Limitations

- Capped at 25 pages: this is a smoke test, not a full sitemap.
- JavaScript-heavy or bot-protected pages may be under-observed; blocks are recorded, never evaded.
- Page-type labels are heuristic; verify against `pages.json` before using in later phases.
