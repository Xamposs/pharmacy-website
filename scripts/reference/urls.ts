/**
 * URL normalization, filtering, and robots.txt helpers.
 *
 * Rules:
 * - same-origin only
 * - strip fragments
 * - drop tracking params (utm_*, gclid, fbclid, ...)
 * - sort remaining query params for canonical dedupe
 * - skip non-read-only paths (account/login/checkout/cart-mutation/admin/api...)
 */
import { createHash } from "node:crypto";

const TRACKING_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
  "igshid",
  "mc_cid",
  "mc_eid",
  "_openstat",
]);

/** Path fragments that indicate non-read-only or out-of-scope areas. Never crawled. */
const SKIP_PATH_PATTERNS: RegExp[] = [
  /\/customer([/.]|$)/i, // account area: /customer/login.htm, /customer/register.htm, ...
  /\/order([/.]|$)/i, // cart/checkout area: /order/cart.htm, ...
  /\/account([/.]|$)/i,
  /\/(login|signin)([/.]|$)/i,
  /\/logout([/.]|$)/i,
  /\/(register|signup)([/.]|$)/i,
  /\/checkout([/.]|$)/i,
  /\/(cart|basket)([/.]|$)/i,
  /\/payment([/.]|$)/i,
  /\/payments?[-_]?callback/i,
  /\/preview_?order/i,
  /\/recover[_-]?password/i,
  /\/forgot[_-]?password/i,
  /\/reset[_-]?password/i,
  /\/(google|facebook|apple)login/i, // OAuth entry points (lead off-origin)
  /\/admin([/.]|$)/i,
  /\/api([/.]|$)/i,
  /\/wp-admin/i,
  /\/wishlist([/.]|$)/i,
];

/** File extensions that are not HTML pages — skip during link discovery. */
const NON_HTML_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".ico",
  ".pdf", ".zip", ".rar", ".mp4", ".mp3", ".avi", ".mov",
  ".css", ".js", ".woff", ".woff2", ".ttf", ".eot", ".otf",
  ".xml", ".txt", ".json",
]);

export function normalizeUrl(raw: string, baseOrigin: string): string | null {
  let url: URL;
  try {
    url = new URL(raw, baseOrigin);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  // Force same origin (after redirect targets are checked elsewhere; here filter discovery).
  if (url.origin !== baseOrigin) return null;

  // Strip fragment.
  url.hash = "";

  // Drop tracking params, sort the rest for stable canonical form.
  const kept: Array<[string, string]> = [];
  url.searchParams.forEach((value, key) => {
    if (!TRACKING_PARAMS.has(key.toLowerCase())) kept.push([key, value]);
  });
  kept.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : 1));
  url.search = "";
  for (const [k, v] of kept) url.searchParams.append(k, v);

  // Lowercase hostname; strip default ports; collapse trailing slash (except root).
  url.hostname = url.hostname.toLowerCase();
  if ((url.protocol === "https:" && url.port === "443") || (url.protocol === "http:" && url.port === "80")) {
    url.port = "";
  }
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
  }
  return url.toString();
}

export function isSkippablePath(normalizedUrl: string): { skip: boolean; reason?: string } {
  let pathname = "";
  try {
    pathname = new URL(normalizedUrl).pathname;
  } catch {
    return { skip: true, reason: "unparseable-url" };
  }
  for (const re of SKIP_PATH_PATTERNS) {
    if (re.test(pathname)) return { skip: true, reason: `skipped-sensitive-path:${re.source}` };
  }
  const lower = pathname.toLowerCase();
  const dot = lower.lastIndexOf(".");
  if (dot !== -1) {
    const ext = lower.slice(dot);
    if (NON_HTML_EXTENSIONS.has(ext)) return { skip: true, reason: `skipped-non-html:${ext}` };
  }
  return { skip: false };
}

/** Safe local filename (without extension) derived from URL hash + short slug. */
export function filenameForUrl(normalizedUrl: string): string {
  const hash = createHash("sha1").update(normalizedUrl).digest("hex").slice(0, 16);
  let slug = "";
  try {
    const u = new URL(normalizedUrl);
    slug = (u.pathname || "/")
      .split("/")
      .filter(Boolean)
      .join("-")
      .normalize("NFKD")
      // biome-ignore lint: strip combining marks for filesystem safety
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\u0370-\u03FF-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60);
  } catch {
    slug = "page";
  }
  if (!slug) slug = "page";
  return `${slug}-${hash}`;
}

export interface RobotsState {
  available: boolean;
  url: string;
  raw: string;
  disallows: string[];
  sitemaps: string[];
}

function patternToRegExp(pattern: string): RegExp | null {
  // Minimal robots wildcard support: `*` -> `.*`, `$` end anchor.
  try {
    let anchoredEnd = false;
    if (pattern.endsWith("$")) {
      anchoredEnd = true;
      pattern = pattern.slice(0, -1);
    }
    const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
    return new RegExp(`^${escaped}${anchoredEnd ? "$" : ""}`);
  } catch {
    return null;
  }
}

export function isDisallowedByRobots(pathnameWithQuery: string, robots: RobotsState | null): boolean {
  if (!robots || !robots.available || robots.disallows.length === 0) return false;
  for (const pattern of robots.disallows) {
    if (pattern === "" || pattern === "/") {
      if (pattern === "/") return true; // disallow-all
      continue;
    }
    const re = patternToRegExp(pattern);
    if (re && re.test(pathnameWithQuery)) return true;
  }
  return false;
}

export async function fetchRobots(baseOrigin: string, timeoutMs: number): Promise<RobotsState> {
  const url = `${baseOrigin}/robots.txt`;
  const state: RobotsState = { available: false, url, raw: "", disallows: [], sitemaps: [] };
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), Math.min(timeoutMs, 15000));
    try {
      const res = await fetch(url, {
        signal: ctrl.signal,
        headers: { "User-Agent": "PharmacyWebsite-Phase0-ReferenceCrawler (polite research crawl)" },
      });
      if (!res.ok) return state;
      state.raw = await res.text();
      state.available = true;
    } finally {
      clearTimeout(timer);
    }
  } catch {
    return state;
  }

  // Parse only the `User-agent: *` (and unspecified-agent) section.
  let inGlobalSection = false;
  let seenAnyAgent = false;
  for (const line of state.raw.split(/\r?\n/)) {
    const cleaned = line.split("#")[0]?.trim() ?? "";
    if (!cleaned) continue;
    const colon = cleaned.indexOf(":");
    if (colon === -1) continue;
    const field = cleaned.slice(0, colon).trim().toLowerCase();
    const value = cleaned.slice(colon + 1).trim();
    if (field === "user-agent") {
      seenAnyAgent = true;
      inGlobalSection = value === "*";
    } else if (field === "disallow") {
      if (!seenAnyAgent || inGlobalSection) state.disallows.push(value);
    } else if (field === "sitemap") {
      if (value) state.sitemaps.push(value);
    }
  }
  return state;
}

/** Candidate sitemap URLs to probe when robots.txt advertises none. */
export function defaultSitemapCandidates(baseOrigin: string): string[] {
  return [
    `${baseOrigin}/sitemap.xml`,
    `${baseOrigin}/sitemap_index.xml`,
    `${baseOrigin}/sitemap-index.xml`,
  ];
}

export async function probeSitemaps(
  candidates: string[],
  timeoutMs: number,
): Promise<{ discovered: string[]; fetched: string[] }> {
  const discovered: string[] = [];
  const fetched: string[] = [];
  for (const candidate of candidates) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), Math.min(timeoutMs, 15000));
      try {
        const res = await fetch(candidate, { signal: ctrl.signal });
        if (res.ok) {
          const text = await res.text();
          if (text.includes("<url") || text.includes("<sitemap")) {
            discovered.push(candidate);
            fetched.push(candidate);
          }
        }
      } finally {
        clearTimeout(timer);
      }
    } catch {
      // Ignore probe failures — sitemaps are best-effort discovery.
    }
  }
  return { discovered, fetched };
}
