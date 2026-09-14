/**
 * Heuristic page-type classifier for the reference site.
 *
 * Best-effort only: URL patterns + title/H1 hints. Every result carries
 * a human-readable reason so downstream reports never overstate confidence.
 */
import type { DomSignals, PageType } from "./types.js";
import { isProductLikelyUrl } from "./prioritize.js";

export interface Classification {
  pageType: PageType;
  reason: string;
}

export function classifyPage(args: {
  normalizedUrl: string;
  title: string | null;
  h1: string | null;
  dom?: DomSignals | null;
}): Classification {
  let path = "";
  try {
    // URL.pathname is percent-encoded; decode so Greek-script slugs
    // (e.g. /τρόποι-αποστολής.htm) match heuristic keyword patterns.
    const rawPath = new URL(args.normalizedUrl).pathname;
    try {
      path = decodeURIComponent(rawPath).toLowerCase();
    } catch {
      path = rawPath.toLowerCase();
    }
  } catch {
    return { pageType: "unknown", reason: "unparseable-url" };
  }
  const haystack = `${args.title ?? ""} ${args.h1 ?? ""}`.toLowerCase();

  if (path === "/" || path === "") {
    return { pageType: "homepage", reason: "root-path" };
  }

  // Search pages: /search, ?q= / ?search= / ?s=
  try {
    const u = new URL(args.normalizedUrl);
    const qp = u.searchParams;
    if (
      path.includes("/search") ||
      qp.has("q") ||
      qp.has("search") ||
      qp.has("s") ||
      qp.has("keyword")
    ) {
      return { pageType: "search", reason: "search-path-or-query-param" };
    }
  } catch {
    // fall through to other heuristics
  }

  // Product pages: strongest evidence is DOM commerce structure observed
  // read-only (visible € prices + an add-to-cart control that is never clicked).
  // URL shape (`/vendors/<brand>/<slug-with-size>.htm`) is supporting evidence.
  const dom = args.dom ?? null;
  const domProduct = !!dom && dom.priceHits > 0 && dom.hasAddToCart;
  if (domProduct) {
    return { pageType: "product", reason: "dom-price-plus-addtocart-observed" };
  }
  // URL-shape product evidence (from Phase 0 inventory mining):
  // `/vendors/<brand>/<product-slug-with-size>.htm`, plus generic fallbacks.
  if (isProductLikelyUrl(args.normalizedUrl)) {
    return { pageType: "product", reason: "vendors-slug-with-size-token" };
  }
  if (
    /\/product[\/-]/i.test(path) ||
    /\/proion/i.test(path) ||
    /-p-\d+/i.test(path) ||
    /\/\d{4,}(?:[-/]|$)/.test(path)
  ) {
    return { pageType: "product", reason: "product-like-url-pattern" };
  }

  // Brand / vendor pages (incl. the site's /vendors.htm index + /vendors/<brand>/details.htm).
  if (
    /\/vendors?([/.]|$)/i.test(path) ||
    /\/brand[\/-]/i.test(path) ||
    /\/brands?[\/-]/i.test(path) ||
    /\/vendor[\/-]/i.test(path) ||
    /\/markes?[\/-]/i.test(path) ||
    /\/brands/i.test(path) ||
    /\/etair/i.test(path)
  ) {
    const segments = path.split("/").filter(Boolean);
    if (segments.length <= 1) return { pageType: "brand", reason: "brand-index-path" };
    return { pageType: "brand", reason: "brand-detail-path" };
  }

  // Informational pages: check URL keywords BEFORE the catalog-depth fallback,
  // since info pages (e.g. /category/η-υπηρεσία-μας/τρόποι-αποστολής.htm) can be nested.
  // Token-prefix matching on accent-folded slugs: avoids substring false
  // positives such as "πληρωμ" inside "συμπληρώματα" (supplements category).
  {
    const folded = path.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const tokens = folded.split(/[/\-_.]+/).filter(Boolean);
    const infoKeywords = [
      "contact",
      "epikoinonia",
      "about",
      "poioi-eimaste",
      "shipping",
      "apostol",
      "plirwmi",
      "faq",
      "syxnes",
      "terms",
      "oroi",
      "xrisis",
      "privacy",
      "aporrito",
      "epistrof",
      "stores",
      "katastimata",
      "voithia",
      "help",
      "etairia",
      "company",
      // Greek-script equivalents (accent-folded, e.g. τρόποι-αποστολής -> tropoi-apostolis tokens stay Greek).
      "αποστολ",
      "επικοινων",
      "πληρωμ",
      "επιστροφ",
      "οροι",
      "καταστημ",
      "εταιρ",
    ];
    if (tokens.some((t) => infoKeywords.some((k) => t === k || t.startsWith(k)))) {
      return { pageType: "informational", reason: "informational-url-keyword" };
    }
  }

  // Blog index vs article (covers /blog and /thecareblog pagination + posts).
  if (/\/thecareblog(\/|$)/i.test(path)) {
    const segments = path.split("/").filter(Boolean);
    const leaf = segments[segments.length - 1] ?? "";
    if (/^all$/i.test(leaf) || /^\d+\.htm$/i.test(leaf)) {
      return { pageType: "blog", reason: "thecareblog-index-or-pagination" };
    }
    return { pageType: "article", reason: "thecareblog-post-path" };
  }
  if (/\/blog(\/|$)/i.test(path)) {
    const segments = path.split("/").filter(Boolean);
    if (segments.length <= 1 || /\/blog\/?$/i.test(path)) {
      return { pageType: "blog", reason: "blog-index-path" };
    }
    return { pageType: "article", reason: "blog-sub-path" };
  }
  if (/\/news(\/|$)/i.test(path) || /\/arthro/i.test(path) || /\/nea/i.test(path)) {
    const segments = path.split("/").filter(Boolean);
    if (segments.length >= 2) return { pageType: "article", reason: "news/article-sub-path" };
    return { pageType: "blog", reason: "news-index-path" };
  }

  // Category vs subcategory by URL depth + keyword hints.
  const depth = path.split("/").filter(Boolean).length;
  if (
    /\/categor/i.test(path) ||
    /\/katigoria/i.test(path) ||
    /\/shop/i.test(path) ||
    depth === 1
  ) {
    if (depth >= 2) return { pageType: "subcategory", reason: `nested-catalog-path-depth-${depth}` };
    return { pageType: "category", reason: `top-level-catalog-path-depth-${depth}` };
  }
  if (depth >= 2) {
    // Greek pharmacy catalogs often nest category/subcategory without keywords.
    return { pageType: "subcategory", reason: `nested-path-depth-${depth}-heuristic` };
  }

  // Informational pages: contact, about, shipping, faq, terms, privacy, stores...
  if (
    /contact|epikoinonia|about|poioi-eimaste|shipping|apostol|payment|plirwmi|faq|syxnes|terms|oroi|privacy|aporrito|epistrof|stores|katastimata|blog|voithia|help/i.test(
      path,
    ) ||
    /contact|about|shipping|faq|terms|privacy|πληροφορίες/i.test(haystack)
  ) {
    return { pageType: "informational", reason: "informational-keyword" };
  }

  return { pageType: "unknown", reason: "no-pattern-matched" };
}
