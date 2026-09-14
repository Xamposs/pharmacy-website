# wecare.gr information architecture (observed, Phase 1)

> Evidence: 150 visited pages + 3,910 discovered URLs (prioritized crawl),
> tracked inventories under `reference/wecare/inventory/`. Counts below are
> observed samples, not a full sitemap. URL slugs are Greek; transliterations
> in parentheses are descriptive only.

## Top-level navigation (observed in `nav#site-main-nav`)

Brands · Νέες Αφίξεις (New arrivals) · Πρόσωπο (Face) · Αντηλιακά (Suncare) ·
Μακιγιάζ (Makeup) · Σώμα (Body) · Αδυνάτισμα (Slimming) · Αντικουνουπικά
(Mosquito repellents, seasonal) · Μαλλιά (Hair) · Βιταμίνες-Συμπληρώματα
(Vitamins/Supplements) · Μητέρα-Παιδί (Mother-Child) · Άνδρας (Men) ·
Φαρμακείο (Pharmacy) · Hot (deals) · Δερμοκαλλυντικά (Dermocosmetics)

Plus header utilities: search, account (login modal), wishlist (login-gated),
minicart, language selector, Blog link.

## Catalog URL shapes (observed)

- Top category: `/<greek-slug>.htm` (depth 1), e.g. `/σωμα.htm`.
- Subcategory: `/<cat>/<sub>.htm` (depth 2–4 nesting), e.g.
  `/σωμα/αδυνατισμα.htm`, `/σωμα/αδυνατισμα/κοιλια.htm`.
- Seasonal/promo collections: `/εποχιακα-προσφορεσ/...`, `/hot.htm`,
  `/promo/<promo-slug>.htm` (brand×campaign pages, e.g. `/promo/nuxe-promo.htm`).
- New arrivals: `/τελευταιεσ-αφιξεισ.htm`.

## Brand / vendor navigation (observed)

- Index: `/vendors.htm` ("Κορυφαία Brands": CeraVe, Frezyderm, Apivita, …).
- Brand page: `/vendors/<brand>.htm` (e.g. `/vendors/cerave.htm`) and
  `/vendors/<brand>/details.htm`.
- Brand×category: `/vendors/<brand>/<greek-slug>.htm` and deeper
  (`/vendors/<brand>/<cat>/<sub>.htm`), e.g. Altion mother-child supplements.
- Brand×campaign: `/vendors/<brand>/εποχιακα-προσφορεσ.htm`.
- Breadcrumb trail on products: Home › Εταιρίες (Companies) › Brand › product,
  so brands are a first-class navigation axis alongside categories.

## Product pages (127 observed)

- Shape: `/vendors/<brand>/<product-slug-with-size>.htm` — slug mixes latin
  product name + Greek descriptors + size (`500ml`, `30-soft-capsules`,
  `20-pads`, `1lt`, `60tablets`, `2-τεμαχια`).
- Content: gallery, brand, title+size, rating+count, SKU/Barcode, loyalty
  points, badges (Top Seller), price block, quantity, ΚΑΛΑΘΙ + wishlist,
  shipping/payment boxes, description/ingredients/usage sections, reviews,
  related-products carousel.
- No product URLs were guessed: all came from category/brand listing links
  (prioritized queue evidence in `pages.json` `priorityReason`).

## Content areas (observed)

- Blog index `/blog` (H1 "Τα άρθρα μας"), posts under `/thecareblog/...`
  (with `/all/<n>.htm` pagination); "Our Blog" cards on homepage.
- Search listings under `/search/...` (classified `search`, not deep-dived).

## Customer-facing service pages (observed under `/category/η-υπηρεσια-μασ/`)

Τρόποι αποστολής (shipping methods) · Τρόποι πληρωμής (payment methods) ·
Πολιτική αποστολών/επιστροφών (shipping/returns policies) · Φόρμα επιστροφής
(returns form — never submitted) · Όροι χρήσης/TOS · Συχνές Ερωτήσεις (FAQ) ·
Που θα μας βρείτε (stores) · Box Now pickup info. Footer mirrors these plus
phone orders (210 700 1375) and the free-shipping threshold (€65+).

## Common page types (observed counts this run)

product 127 · brand 17 · subcategory 5 · homepage 1. (Category/blog/
informational/search pages exist on the site but were deprioritized out of
the 150-page cap after seeds; Phase 0 sampled them: 13 category, 1 blog,
1 informational.)

## Takeaways for our IA

1. Two orthogonal browse axes: **categories** (need/concern) and **brands**
   (manufacturer), plus **promo collections** cutting across both.
2. Breadcrumbs always reflect the axis the visitor came through.
3. Service content is grouped under one "our service" section and mirrored
   in the footer — adopt the same grouping.
4. Product identity = brand + name + size; SKU/Barcode displayed publicly.
