/**
 * Runtime configuration for the reference crawler.
 *
 * Precedence: CLI args > environment variables > defaults.
 * Supported CLI args: --max-pages=25 --delay-ms=1200 --base-url=... --timeout-ms=30000
 * Supported env vars: REFERENCE_BASE_URL, REFERENCE_MAX_PAGES, REFERENCE_DELAY_MS, REFERENCE_TIMEOUT_MS
 */
import * as path from "node:path";
import type { CrawlerConfig } from "./types.js";

export const DEFAULT_BASE_URL = "https://www.wecare.gr";
export const DEFAULT_MAX_PAGES = 25;
export const DEFAULT_DELAY_MS = 1200;
export const DEFAULT_TIMEOUT_MS = 30000;

export const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/126.0.0.0 Safari/537.36 PharmacyWebsite-Phase0-ReferenceCrawler (polite research crawl; +local only)";

function parseCliArg(name: string): string | undefined {
  const prefix = `--${name}=`;
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith(prefix)) return arg.slice(prefix.length);
    // Support `--max-pages 25` (space-separated) form.
    if (arg === `--${name}`) {
      const idx = process.argv.indexOf(arg);
      const next = process.argv[idx + 1];
      if (next && !next.startsWith("--")) return next;
    }
  }
  return undefined;
}

function parsePositiveInt(raw: string | undefined, fallback: number): number {
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function loadConfig(projectRoot: string = process.cwd()): CrawlerConfig {
  const baseUrl =
    parseCliArg("base-url") ?? process.env["REFERENCE_BASE_URL"] ?? DEFAULT_BASE_URL;
  const maxPages = parsePositiveInt(
    parseCliArg("max-pages") ?? process.env["REFERENCE_MAX_PAGES"],
    DEFAULT_MAX_PAGES,
  );
  const delayMs = parsePositiveInt(
    parseCliArg("delay-ms") ?? process.env["REFERENCE_DELAY_MS"],
    DEFAULT_DELAY_MS,
  );
  const timeoutMs = parsePositiveInt(
    parseCliArg("timeout-ms") ?? process.env["REFERENCE_TIMEOUT_MS"],
    DEFAULT_TIMEOUT_MS,
  );

  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const baseOrigin = new URL(normalizedBase).origin;

  return {
    baseUrl: normalizedBase,
    baseOrigin,
    maxPages,
    delayMs,
    timeoutMs,
    userAgent: USER_AGENT,
    outputHtmlDir: path.join(projectRoot, "reference-private", "wecare", "html"),
    outputScreenshotsDir: path.join(projectRoot, "reference-private", "wecare", "screenshots"),
    outputMetadataDir: path.join(projectRoot, "reference-private", "wecare", "metadata"),
    outputLogsDir: path.join(projectRoot, "reference-private", "wecare", "logs"),
  };
}
