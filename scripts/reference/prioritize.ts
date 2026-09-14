/**
 * Phase 1 queue prioritization.
 *
 * Evidence-based URL scoring derived from the Phase 0 inventory
 * (`reference/wecare/inventory/internal-links.json`):
 *
 * - Genuine product pages live at `/vendors/<brand>/<product-slug>.htm`
 *   (depth 3), where the slug carries a size/quantity token such as
 *   `500ml`, `30-soft-capsules`, `20-pads`, `30ml`.
 *   Examples: `/vendors/altion/altion-tonovit-senior-multivitamin-30-soft-capsules.htm`
 * - Brand subcategory listings share the same depth but have plain Greek
 *   slugs without size tokens (e.g. `/vendors/apivita/αντηλιακά.htm`).
 * - Brand pages end in `/details.htm` or `/vendors/<brand>.htm`.
 * - Catalog categories are depth-1 Greek `.htm` slugs; subcategories nest deeper.
 *
 * Priority order (lower score = visited earlier):
 *   product-likely > vendor-subcategory > brand > category/subcategory >
 *   homepage > search > blog/article > informational > other
 *
 * Anchor-text hints (captured read-only from the linking page) can promote a
 * URL: an anchor containing a € price or a size token strongly suggests the
 * target is a product card link. URLs are never guessed — only discovered
 * links are scored.
 */

export interface Priority {
  score: number;
  reason: string;
}

/** Size/quantity units observed in genuine product slugs (decoded, lowercased). */
const SIZE_UNITS = [
  "ml",
  "ltr",
  "lt",
  "g",
  "gr",
  "kg",
  "mg",
  "mcg",
  "iu",
  "caps",
  "capsules",
  "caplets",
  "tabs",
  "tablets",
  "softgels",
  "patches",
  "pads",
  "sachets",
  "sticks",
  "vials",
  "ampoules",
  "amp",
  "spray",
  "drops",
  "τεμ",
  "pcs",
];

const SIZE_TOKEN_RE = new RegExp(
  String.raw`\d+[.,]?\d*\s?(?:${SIZE_UNITS.join("|")})(?:\b|$)`,
  "i",
);
const COUNT_PACK_RE = /\b\d+\s?x\s?\d+\b/i;
const PRICE_HINT_RE = /€|\beur\b/i;

/**
 * Size/quantity signal in hyphenated slugs or free text.
 * Handles attached (`500ml`, `30caps`), spaced (`30 caps`), and split
 * (`30-soft-capsules` → digit part + unit part) forms.
 */
export function hasSizeToken(text: string): boolean {
  const t = text.toLowerCase();
  if (SIZE_TOKEN_RE.test(t) || COUNT_PACK_RE.test(t)) return true;
  const parts = t.split(/[-_.\s]+/);
  const hasDigitPart = parts.some((p) => /^\d+([.,]\d+)?$/.test(p));
  if (!hasDigitPart) return false;
  return parts.some((p) => SIZE_UNITS.includes(p));
}

function decodedPath(normalizedUrl: string): string {
  try {
    const raw = new URL(normalizedUrl).pathname;
    try {
      return decodeURIComponent(raw).toLowerCase();
    } catch {
      return raw.toLowerCase();
    }
  } catch {
    return "";
  }
}

/** True when the URL matches the observed genuine-product shape. No guessing. */
export function isProductLikelyUrl(normalizedUrl: string): boolean {
  const path = decodedPath(normalizedUrl);
  if (!path.endsWith(".htm")) return false;
  const segments = path.split("/").filter(Boolean);
  if (segments.length < 3) return false;
  if (segments[0] !== "vendors") return false;
  const leaf = segments[segments.length - 1] ?? "";
  if (leaf === "details.htm") return false;
  return hasSizeToken(leaf);
}

/** True for brand subcategory listings (`/vendors/<brand>/<greek-slug>.htm`). */
export function isVendorSubcategoryUrl(normalizedUrl: string): boolean {
  const path = decodedPath(normalizedUrl);
  if (!path.endsWith(".htm")) return false;
  const segments = path.split("/").filter(Boolean);
  if (segments.length < 3 || segments[0] !== "vendors") return false;
  const leaf = segments[segments.length - 1] ?? "";
  if (leaf === "details.htm") return false;
  return !isProductLikelyUrl(normalizedUrl);
}

export function anchorSuggestsProduct(anchorText: string): boolean {
  const t = anchorText.slice(0, 200);
  return PRICE_HINT_RE.test(t) || hasSizeToken(t);
}

export function scoreUrl(normalizedUrl: string, anchorText = ""): Priority {
  if (anchorText && anchorSuggestsProduct(anchorText)) {
    return { score: 0, reason: "anchor-has-price-or-size-hint" };
  }
  if (isProductLikelyUrl(normalizedUrl)) {
    return { score: 0, reason: "product-likely-vendors-slug-with-size" };
  }

  const path = decodedPath(normalizedUrl);
  if (path === "/" || path === "") return { score: 4, reason: "homepage" };

  const segments = path.split("/").filter(Boolean);

  if (isVendorSubcategoryUrl(normalizedUrl)) {
    return { score: 1, reason: "vendor-subcategory-links-to-products" };
  }
  if (
    segments[0] === "vendors" ||
    segments[0] === "brands" ||
    segments[0] === "brand" ||
    /\/details\.htm$/i.test(path)
  ) {
    return { score: 2, reason: "brand-page-links-to-products" };
  }
  if (path.includes("/search") || segments[0] === "search") {
    return { score: 5, reason: "search-listing" };
  }
  if (
    segments[0] === "blog" ||
    segments[0] === "thecareblog" ||
    segments[0] === "news"
  ) {
    return { score: 6, reason: "blog-content" };
  }

  // Informational keyword check (accent-folded token prefixes, mirroring classify.ts).
  {
    const folded = path.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const tokens = folded.split(/[/\-_.]+/).filter(Boolean);
    const infoKeywords = [
      "contact", "epikoinonia", "shipping", "apostol", "plirwmi", "faq",
      "terms", "oroi", "privacy", "aporrito", "epistrof", "katastimata",
      "voithia", "etairia", "αποστολ", "επικοινων", "πληρωμ",
      "επιστροφ", "οροι", "καταστημ", "εταιρ",
    ];
    if (tokens.some((t) => infoKeywords.some((k) => t === k || t.startsWith(k)))) {
      return { score: 7, reason: "informational" };
    }
  }

  // Catalog category / subcategory (depth-1 Greek .htm slugs, nested paths).
  if (path.endsWith(".htm") || segments.length >= 1) {
    return { score: 3, reason: "catalog-category-links-to-products" };
  }

  return { score: 8, reason: "other" };
}

export interface QueueEntry {
  url: string;
  score: number;
  seq: number;
}

/** Minimal stable priority queue: lowest score first, FIFO within a score. */
export class PriorityQueue {
  private items: QueueEntry[] = [];
  private seqCounter = 0;

  get size(): number {
    return this.items.length;
  }

  push(url: string, score: number): void {
    this.items.push({ url, score, seq: this.seqCounter++ });
  }

  pop(): string | undefined {
    if (this.items.length === 0) return undefined;
    let best = 0;
    for (let i = 1; i < this.items.length; i++) {
      const a = this.items[i] as QueueEntry;
      const b = this.items[best] as QueueEntry;
      if (a.score < b.score || (a.score === b.score && a.seq < b.seq)) best = i;
    }
    const [entry] = this.items.splice(best, 1);
    return (entry as QueueEntry).url;
  }
}
