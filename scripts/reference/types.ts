/**
 * Shared types for the Phase 0 reference crawler.
 *
 * Read-only inspection of public pages on wecare.gr. No form submits,
 * no cart/checkout/account actions, no state-changing requests.
 */

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
