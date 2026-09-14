# wecare.gr component map (conceptual, Phase 1)

> Each component below is a **concept** evidenced by the observed reference
> structure (see `WECARE_UI_SPEC.md`). Names are ours; they map to reusable
> blocks for our clean implementation. No reference source code is reused.

| Concept | Observed on | Structural notes |
|---|---|---|
| `SiteHeader` | all pages | Sticky dark bar: logo, menu button, search, language, blog link, wishlist/account/minicart icons |
| `SearchBar` | header | Large input + live-suggestion dropdown (`livesearch`); mobile keeps compact variant |
| `MegaMenu` / `PrimaryNav` | header (`nav#site-main-nav`) | 15 top-level categories + Brands; expander per item; multi-column sub-link panels |
| `MobileNavigation` | mobile | Hamburger → drawer with expandable category tree; sticky condensed header |
| `MiniCart` | header | Button + dropdown/panel: item list (`minicartItems`), total (`minicart-total-price`) |
| `HeroSection` | homepage | Promo-banner carousel (slick), brand + seasonal slides |
| `BrandStrip` | homepage | Dark full-bleed logo carousel with arrows |
| `OfferTiles` | homepage, category | 2×2 promo cards with CTA |
| `CategoryTile` | category (`Σώμα`) | Image card + label; grid of subcategories; slider variant on some pages |
| `ProductCarousel` | homepage, product | Heading + horizontal card carousel + "view all" link; arrows |
| `ProductCard` | everywhere | Photo, badges (HOT/ΔΩΡΟ/Top Seller), loyalty points, brand, title, rating (optional), old/new price, save badge, wishlist btn, ΚΑΛΑΘΙ CTA |
| `PriceDisplay` | card, product | Current price (+ old price + discount/save badge when promo) |
| `AvailabilityBadge` | product, card | Stock/availability label near price/CTA (labels observed; exact states vary) |
| `LoyaltyPoints` | card, product | "Cares" points line (card + PDP) |
| `FilterSidebar` | category | Faceted checkbox groups (brand observed), sidebar container; mobile → filter drawer trigger |
| `SortControl` | category | Sort `<select>`-style control |
| `LoadMore` | category | "Περισσότερα" button instead of numbered pagination |
| `Breadcrumbs` | listing, product, blog, info | `.breadcrumb-item` trail (Home › section › …) |
| `ProductGallery` | product | Vertical thumbnail strip + main image |
| `ProductInfo` | product | Brand, title, rating, SKU/Barcode, price block, quantity, CTAs, loyalty |
| `QuantitySelector` | product | Stepper input next to add-to-cart |
| `ShippingInfo` | product, footer | Shipping-methods box on PDP; threshold note (€65+) in footer |
| `PaymentInfo` | product, footer | Payment-methods box on PDP; Visa/MC/PayPal icons in footer |
| `Accordion` / `Tabs` | product | Περιγραφή / Συστατικά / Χρήση sections |
| `Reviews` | product | Aggregate rating + count, review list (name/date/stars), write-review CTA |
| `RelatedProducts` | product | "Best Sellers" carousel of `ProductCard` |
| `ArticleCard` | homepage, blog | Image + title cards; blog index H1 + grid |
| `Newsletter` | homepage, footer | Email band/form + social icons |
| `TrustBar` | footer, product | Free-shipping, phone-support, service-link blocks |
| `SiteFooter` | all pages | 4 collapsible columns (info, categories, service/usage, phone orders) + payments/couriers + legal bar |
| `CookieBanner` | all pages | Consent bar with accept/settings controls |
| `PromoBanner` | category | Full-width category campaign banner under breadcrumbs |

## Mapping notes

- `ProductCard` is the single most reused unit (homepage carousels, listing
  grids, related-items, brand pages) — implement once, reuse everywhere.
- Listing pages compose: `Breadcrumbs` + `PromoBanner` + `CategoryTile` grid
  + `FilterSidebar`/`SortControl` + card grid + `LoadMore`.
- Product pages compose: `Breadcrumbs` + `ProductGallery` + `ProductInfo`
  (with `PriceDisplay`, `QuantitySelector`, CTAs, `ShippingInfo`,
  `PaymentInfo`) + `Accordion` sections + `Reviews` + `RelatedProducts`.
- `MegaMenu`/`MobileNavigation` share one navigation data model (see
  `WECARE_INFORMATION_ARCHITECTURE.md`).
