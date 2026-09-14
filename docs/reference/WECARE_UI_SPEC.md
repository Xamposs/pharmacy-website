# wecare.gr UI specification (observed, Phase 1)

> Evidence: polite read-only crawl of 150 public pages (127 product, 17 brand,
> 5 subcategory, 1 homepage; 0 blocked), 14 desktop+mobile screenshots, and DOM
> structure extraction (`scripts/reference/analyze.ts` → local-only
> `reference-private/wecare/metadata/structure.json`).
> This document describes **UX structure and design language only**. No branding,
> copy, images, or source code are carried into production. See
> [`REFERENCE_POLICY.md`](REFERENCE_POLICY.md).

## Global layout

- Sticky dark (near-black) header on all pages: logo left, "Προϊόντα"-style menu
  button, large centered search field with live suggestions (`livesearch`),
  language selector, Blog link, wishlist / account / minicart icon buttons.
- Single primary nav (`nav#site-main-nav`): Brands, Νέες Αφίξεις, Πρόσωπο,
  Αντηλιακά, Μακιγιάζ, Σώμα, Αδυνάτισμα, Αντικουνουπικά, Μαλλιά,
  Βιταμίνες-Συμπληρώματα, Μητέρα-Παιδί, Άνδρας, Φαρμακείο, Hot,
  Δερμοκαλλυντικά. Each item has an expander ("Menu"); panels group
  sub-links (CSS class markers for multi-column panels observed).
- Page container: centered, wide (content spans ~1200–1280 px at 1440 px
  viewport; full-bleed dark bands used for brand strip / loyalty sections).
- Background: white page, very light gray section alternation; footer light
  gray band above a white legal strip.
- Border radius: cards ~8–12 px, pills for badges/CTA (~6–8 px), inputs ~6 px.
- Color roles: white surfaces; near-black primary buttons and header;
  bold black display headings; blue accent (links, "ΔΙΑΦΗΜΙΖΟΜΕΝΟ" tags,
  loyalty band); red/pink HOT + gift badges; teal ΔΩΡΟ gift badges;
  amber star ratings. (Approximate roles, not brand values.)
- Typography: heavy condensed display headings for section titles (often with
  horizontal rules on both sides), regular sans for body, small caps-ish
  uppercase kickers (e.g. "EXTRA GIFTS", "Best Sellers"); Greek + English mixed.
- Buttons: full-width black rectangular CTA with white uppercase label
  (ΚΑΛΑΘΙ); secondary outline buttons (wishlist heart is a filled blue square
  w/ white heart on product page); quantity steppers on product page.
- Product grid: 4 columns desktop, 2 columns mobile (observed in screenshots);
  "load more" button ("Περισσότερα") instead of numbered pagination on
  sampled listing pages.
- Breakpoints (inferred from screenshots, not source): ≥1024 px desktop
  4-col grid + sidebar filters; ~390 px mobile single-column header,
  hamburger menu, 2-col product grid, stacked product layout.

## Header (observed)

- No separate announcement bar text captured on sampled pages; service info
  (free shipping over €65, phone 210 700 1375) lives in footer + product boxes.
- Logo: image with alt text; left aligned.
- Search: header input (name `search`-like) with live-suggestion dropdown.
- Account: login modal trigger ("User login"); wishlist ("View wishlist",
  `#` link → login-gated); minicart button with item list + total price
  (`minicartItems`, `minicart-total-price` markup observed).
- Mobile: hamburger opens menu drawer containing the same category tree;
  search remains visible in header; sticky header on scroll.

## Homepage (observed order)

1. Hero promo-banner carousel (slick-based, ~8 slider refs; brand + seasonal
   banners, e.g. La Roche Posay / Minions promo).
2. Brand strip: dark full-bleed band, logo carousel with arrows
   (Vichy, Avène, Korres, …).
3. Promo offer tiles (2×2 cards).
4. "Trending Now" product carousel.
5. "EXTRA GIFTS" gift-item (ΔΩΡΟ) carousel.
6. Themed product carousels (suncare prep, hair color, inner hydration…),
   each: display heading + 4-card product carousel + "ΔΕΙΤΕ ΤΑ ΟΛΑ" link.
7. Loyalty band ("Your Care Points", light-blue, CTA).
8. "MakeUp Station" carousel.
9. "Our Blog" article cards (image + title).
10. Newsletter band + social icons, then footer.

## Category page (observed: Σώμα + promo listings)

- Breadcrumb (`Online Φαρμακείο / Σώμα`, `.breadcrumb-item`).
- Category promo banner, H1 with side rules, short description.
- Subcategory tile grid (image cards with labels, e.g. Ενυδάτωση/Καθαρισμός
  Σώματος; `.product-cat-slider-container` on some pages).
- "Προϊόντα κατηγορίας" product grid (21 cards on Σώμα sample).
- Filter sidebar: faceted checkboxes (`checkbox` ×95, `sidebar`, `brand` ×160
  refs), sort control (`sort` ×9, `<select>` ×56 page-wide); sampled promo
  pages show fewer/none — filters are strongest on true category pages.
- "Load more" button; no numbered pagination observed on samples.
- Product card: photo, HOT/ΔΩΡΟ/Top-Seller badges, loyalty points
  ("Cares"), brand + 2-line title, `price-final` + `price-no-discount` +
  save-amount badge, full-width black ΚΑΛΑΘΙ button, wishlist control.

## Product page (observed: 3 Avène samples)

- Breadcrumb: Home › Εταιρίες (brands) › Brand › product.
- Gallery left: vertical thumbnail strip + large main image (12 imgs on sample).
- Info right: brand link, H1 (name + size, e.g. 150 ml), star rating + review
  count, SKU (`Κωδικός: 42917`), Barcode line, loyalty points ("+112 Cares"),
  "Top Seller" badge, price block ("Τιμή wecare" current price; old price +
  discount where applicable), quantity stepper, black ΚΑΛΑΘΙ CTA + wishlist
  heart, shipping-info box (payment/shipping methods), payment-info box.
- Content sections: Περιγραφή (description + Οφέλη bullets), Συστατικά
  (ingredients), Χρήση (usage) — tab/accordion headings.
- Reviews: Αξιολογήσεις block (aggregate 5★, count, per-review name/date/stars,
  "write a review" CTA).
- Related: "Best Sellers" carousel of product cards (Cares points, gift
  badges, prices).

## Blog / article (observed)

- Blog index H1 "Τα άρθρα μας", breadcrumbs Αρχική › Blog, article cards
  (image + title); post pages under `/thecareblog/...`.

## Informational (observed: Τρόποι Αποστολής)

- Breadcrumb Home › Η υπηρεσία μας › page; H1; prose content; same
  header/footer chrome as shop pages.

## Mobile (observed via 390×844 screenshots)

- Condensed sticky header (logo, search icon/field, cart icon, hamburger).
- Drawer menu with expandable category tree.
- 2-column product grid; full-width CTAs; stacked gallery-over-info on
  product pages; sticky add-to-cart behavior not conclusively observed —
  verify in later analysis if needed.
- Footer columns collapse into toggles (`.footer-mod-toggle`).

## Footer (observed)

- Newsletter band ("ΕΓΓΡΑΦΕΙΤΕ ΣΤΟ NEWSLETTER"), FOLLOW US social icons
  (Facebook, Instagram, YouTube, TikTok).
- Service blocks: free shipping threshold (€65+), phone support hours +
  number (210 700 1375).
- 4 collapsible columns: Πληροφορίες (contact, why-us), Κατηγορίες (nav
  mirror), ΤΡΟΠΟΙ ΧΡΗΣΗΣ (FAQ, stores, payment/shipping methods, Box Now,
  returns + returns form, terms/TOS/privacy), ΤΗΛΕΦΩΝΙΚΕΣ ΠΑΡΑΓΓΕΛΙΕΣ
  (phone number).
- Payment icons (Visa, Mastercard, PayPal) + courier icons (Box Now, …),
  platform credit line, copyright bar, cookie-settings control.

## Explicitly NOT observed on sampled pages

- Numbered pagination (load-more used instead); star-rating input (only
  display + review CTA); checkout/account flows (out of scope, never visited).
