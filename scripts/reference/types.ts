/**
 * Shared types for the reference crawler (Phase 0 foundation, Phase 1 extensions).
 *
 * Read-only inspection of public pages on wecare.gr. No form submits,
 * no cart/checkout/account actions, no state-changing requests.
 */

/** Read-only DOM commerce signals observed on a visited page (never interacted with). */
export interface DomSignals {
  /** Count of visible €-price-like strings (e.g. "12,90 €"). */
  priceHits: number;
  /** A visible add-to-cart control exists (observed only, never clicked). */
  hasAddToCart: boolean;
  /** A product image gallery region exists. */
  hasGallery: boolean;
  /** Breadcrumb items observed (text only, capped). */
  breadcrumbs: string[];
}

export type PageType =
  | "homepage"
  | "category"
  | "subcategory"
  | "product"
  | "brand"
  | "search"
  | "blog"
  | "article"
  | "informational"
  | "unknown";

export interface CrawlerConfig {
  baseUrl: string;
  baseOrigin: string;
  maxPages: number;
  delayMs: number;
  timeoutMs: number;
  userAgent: string;
  outputHtmlDir: string;
  outputScreenshotsDir: string;
  outputMetadataDir: string;
  outputLogsDir: string;
}

export interface PageRecord {
  originalUrl: string;
  normalizedUrl: string;
  finalUrl: string;
  status: number | null;
  ok: boolean;
  success: boolean;
  errorReason: string | null;
  blocked: boolean;
  blockReason: string | null;
  redirected: boolean;
  title: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  h1: string | null;
  lang: string | null;
  internalLinksCount: number;
  /** Capped sample of discovered normalized internal links (out-edges). */
  internalLinksSample: string[];
  timestamp: string;
  pageType: PageType;
  pageTypeReason: string;
  htmlPath: string | null;
  screenshotDesktopPath: string | null;
  screenshotMobilePath: string | null;
  /** Phase 1: queue priority score/reason at visit time (lower = earlier). */
  priorityScore: number | null;
  priorityReason: string | null;
  /** Phase 1: read-only DOM commerce signals (evidence for product classification). */
  domSignals: DomSignals | null;
}

export interface CrawlMeta {
  baseUrl: string;
  startedAt: string;
  finishedAt: string;
  maxPages: number;
  delayMs: number;
  visitedCount: number;
  successCount: number;
  failedCount: number;
  blockedCount: number;
  discoveredCount: number;
  robotsAvailable: boolean;
  robotsUrl: string | null;
  robotsSitemaps: string[];
  sitemapsDiscovered: string[];
  sitemapsFetched: string[];
  seedUrls: string[];
}
