/**
 * Phase 0 read-only reference crawler for https://www.wecare.gr.
 *
 * Safety contract (see docs/reference/REFERENCE_POLICY.md):
 * - GET / browser navigation only; never submits forms.
 * - Never clicks add-to-cart / buy / login / register / logout / checkout / account / payment.
 * - Same-origin only; skips sensitive paths; respects robots.txt disallows.
 * - Polite delay (~1200 ms + jitter) between navigations; capped page count.
 * - No stealth plugins, no CAPTCHA/anti-bot bypass. Blocks are recorded, never evaded.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { chromium, type Page } from "playwright";
import { loadConfig } from "./config.js";
import { classifyPage } from "./classify.js";
import {
  fetchRobots,
  filenameForUrl,
  isDisallowedByRobots,
  isSkippablePath,
  normalizeUrl,
  probeSitemaps,
  defaultSitemapCandidates,
} from "./urls.js";
import type { CrawlMeta, PageRecord } from "./types.js";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function delayWithJitter(baseMs: number): Promise<void> {
  const jitter = Math.floor(Math.random() * 400); // 0–400 ms
  return sleep(baseMs + jitter);
}

function detectBlock(args: { status: number | null; title: string | null; html: string }): string | null {
  const { status, title, html } = args;
  if (status === 403) return "http-403-forbidden";
  if (status === 429) return "http-429-rate-limited";
  if (status === 503 || status === 520 || status === 521 || status === 522 || status === 523 || status === 524) {
    return `http-${status}-edge-protection-suspected`;
  }
  const t = (title ?? "").toLowerCase();
  if (
    t.includes("just a moment") ||
    t.includes("attention required") ||
    t.includes("verify you are human") ||
    t.includes("security verification")
  ) {
    return "bot-challenge-title-detected";
  }
  // NOTE: bare "captcha"/"recaptcha" strings are NOT a block signal — the site
  // legitimately loads Google reCAPTCHA for its own forms. Only Cloudflare
  // challenge-platform markers count.
  const bodyProbe = html.slice(0, 50000).toLowerCase();
  if (
    bodyProbe.includes("cf-challenge") ||
    bodyProbe.includes("challenge-platform") ||
    bodyProbe.includes("__cf_chl_") ||
    (bodyProbe.includes("attention required") && bodyProbe.includes("cloudflare"))
  ) {
    return "challenge-marker-in-html";
  }
  return null;
}

/**
 * NOTE: the extraction snippet is passed as a *string* (not a TS closure)
 * because tsx/esbuild's keepNames transform injects a `__name` helper into
 * closures, which breaks Playwright's function serialization
 * (`page.evaluate(fn)` stringifies the function for the browser context).
 * A plain string evaluates cleanly in the page context.
 */
const EXTRACT_JS = `(() => {
  const pick = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const text = (el.innerText !== undefined && el.innerText !== null ? el.innerText : el.textContent) || "";
    const trimmed = String(text).trim().replace(/\\s+/g, " ");
    return trimmed ? trimmed.slice(0, 500) : null;
  };
  const meta = document.querySelector('meta[name="description"]');
  const canonical = document.querySelector('link[rel="canonical"]');
  const anchors = Array.from(document.querySelectorAll("a[href]"));
  const hrefs = [];
  for (const a of anchors) {
    const href = a.getAttribute("href");
    if (href) hrefs.push(href);
    if (hrefs.length >= 2000) break;
  }
  return {
    title: document.title ? document.title.trim().slice(0, 500) : null,
    metaDescription: meta && meta.getAttribute("content") ? meta.getAttribute("content").trim().slice(0, 1000) : null,
    canonicalUrl: canonical && canonical.getAttribute("href") ? canonical.getAttribute("href").trim() : null,
    h1: pick("h1"),
    lang: document.documentElement.getAttribute("lang"),
    hrefs,
  };
})()`;

async function extractPageData(page: Page): Promise<{
  title: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  h1: string | null;
  lang: string | null;
  hrefs: string[];
}> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (await page.evaluate(EXTRACT_JS)) as any;
}

async function main(): Promise<void> {
  const config = loadConfig();
  const startedAt = new Date().toISOString();

  for (const dir of [
    config.outputHtmlDir,
    config.outputScreenshotsDir,
    path.join(config.outputScreenshotsDir, "desktop"),
    path.join(config.outputScreenshotsDir, "mobile"),
    config.outputMetadataDir,
    config.outputLogsDir,
  ]) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const logLines: string[] = [];
  const log = (msg: string) => {
    const line = `[${new Date().toISOString()}] ${msg}`;
    logLines.push(line);
    console.log(line);
  };

  log(`Phase 0 reference crawl starting: ${config.baseUrl} (maxPages=${config.maxPages}, delayMs=${config.delayMs})`);

  // --- robots.txt + sitemap discovery (best effort) ---
  const robots = await fetchRobots(config.baseOrigin, config.timeoutMs);
  log(
    robots.available
      ? `robots.txt found (${robots.disallows.length} disallow rules, ${robots.sitemaps.length} sitemap hints)`
      : "robots.txt not available or not fetchable - continuing with conservative defaults",
  );
  const sitemapCandidates = robots.sitemaps.length > 0 ? robots.sitemaps : defaultSitemapCandidates(config.baseOrigin);
  const { discovered: sitemapsDiscovered, fetched: sitemapsFetched } = await probeSitemaps(
    sitemapCandidates.slice(0, 10),
    config.timeoutMs,
  );
  if (sitemapsDiscovered.length > 0) log(`sitemaps discovered: ${sitemapsDiscovered.join(", ")}`);
  else log("no sitemaps discovered via robots/probe");

  // --- browser setup: honest, stock Chromium, no stealth ---
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: config.userAgent,
    locale: "el-GR",
    viewport: { width: 1440, height: 1000 },
    acceptDownloads: false,
  });
  // Extra safety: block any accidental state-changing requests if ever triggered.
  await context.route("**/*", async (route) => {
    if (route.request().method() !== "GET") {
      await route.abort();
      return;
    }
    await route.continue();
  });
  const page = await context.newPage();

  const seedNormalized = normalizeUrl(config.baseUrl, config.baseOrigin);
  const queue: string[] = seedNormalized ? [seedNormalized] : [];
  const enqueued = new Set(queue);
  const visited = new Set<string>();
  const records: PageRecord[] = [];
  const discoveredSet = new Set<string>(queue);

  let blockedCount = 0;

  while (queue.length > 0 && visited.size < config.maxPages) {
    const originalUrl = queue.shift() as string;
    const normalized = normalizeUrl(originalUrl, config.baseOrigin);
    if (!normalized || visited.has(normalized)) continue;

    const skip = isSkippablePath(normalized);
    if (skip.skip) {
      log(`skip ${normalized} (${skip.reason})`);
      continue;
    }
    try {
      const pathnameWithQuery = new URL(normalized).pathname + new URL(normalized).search;
      if (isDisallowedByRobots(pathnameWithQuery, robots)) {
        log(`skip ${normalized} (robots-disallowed)`);
        continue;
      }
    } catch {
      continue;
    }

    visited.add(normalized);
    if (visited.size > 1) await delayWithJitter(config.delayMs);

    const timestamp = new Date().toISOString();
    log(`[${visited.size}/${config.maxPages}] GET ${normalized}`);

    const record: PageRecord = {
      originalUrl,
      normalizedUrl: normalized,
      finalUrl: normalized,
      status: null,
      ok: false,
      success: false,
      errorReason: null,
      blocked: false,
      blockReason: null,
      redirected: false,
      title: null,
      metaDescription: null,
      canonicalUrl: null,
      h1: null,
      lang: null,
      internalLinksCount: 0,
      internalLinksSample: [],
      timestamp,
      pageType: "unknown",
      pageTypeReason: "not-classified",
      htmlPath: null,
      screenshotDesktopPath: null,
      screenshotMobilePath: null,
    };

    try {
      const response = await page.goto(normalized, {
        waitUntil: "domcontentloaded",
        timeout: config.timeoutMs,
      });
      record.status = response?.status() ?? null;
      record.ok = response?.ok() ?? false;
      record.finalUrl = page.url();
      record.redirected = record.finalUrl !== normalized;

      // Only analyse same-origin landings; cross-origin redirects are recorded, not followed.
      if (new URL(record.finalUrl).origin !== config.baseOrigin) {
        record.success = false;
        record.errorReason = `off-origin-redirect:${record.finalUrl}`;
        log(`  off-origin redirect -> ${record.finalUrl} (recorded, not followed)`);
        records.push(record);
        continue;
      }

      const data = await extractPageData(page);
      record.title = data.title;
      record.metaDescription = data.metaDescription;
      record.canonicalUrl = data.canonicalUrl;
      record.h1 = data.h1;
      record.lang = data.lang;

      // Save rendered HTML (raw, local-only).
      const html = await page.content();
      const fileBase = filenameForUrl(normalized);
      const htmlRel = path.join("html", `${fileBase}.html`);
      fs.writeFileSync(path.join(config.outputHtmlDir, `${fileBase}.html`), html, "utf8");
      record.htmlPath = htmlRel.replace(/\\/g, "/");

      const blockReason = detectBlock({ status: record.status, title: record.title, html });
      if (blockReason) {
        record.blocked = true;
        record.blockReason = blockReason;
        record.success = false;
        record.errorReason = blockReason;
        blockedCount += 1;
        log(`  BLOCKED (${blockReason}) status=${record.status}`);
        records.push(record);
        continue;
      }

      if (!record.ok) {
        record.success = false;
        record.errorReason = `http-${record.status ?? "no-response"}`;
        log(`  non-OK status=${record.status}`);
        records.push(record);
        continue;
      }

      // Discover internal links (read-only: hrefs only, never clicked).
      const internal: string[] = [];
      for (const href of data.hrefs) {
        let resolved: string;
        try {
          resolved = new URL(href, record.finalUrl).toString();
        } catch {
          continue;
        }
        const norm = normalizeUrl(resolved, config.baseOrigin);
        if (!norm) continue; // off-origin or non-http(s)
        if (isSkippablePath(norm).skip) continue;
        internal.push(norm);
        discoveredSet.add(norm);
        if (!enqueued.has(norm) && !visited.has(norm)) {
          enqueued.add(norm);
          queue.push(norm);
        }
      }
      const uniqueInternal = [...new Set(internal)].sort();
      record.internalLinksCount = uniqueInternal.length;
      record.internalLinksSample = uniqueInternal.slice(0, 100);

      const classification = classifyPage({
        normalizedUrl: record.finalUrl,
        title: record.title,
        h1: record.h1,
      });
      record.pageType = classification.pageType;
      record.pageTypeReason = classification.reason;
      record.success = true;
      log(`  OK status=${record.status} type=${record.pageType} links=${record.internalLinksCount} title=${record.title ?? "-"}`);
    } catch (err) {
      record.success = false;
      record.errorReason = err instanceof Error ? err.message.slice(0, 500) : String(err).slice(0, 500);
      log(`  ERROR ${record.errorReason}`);
    }
    records.push(record);
  }

  // --- representative screenshots (desktop + mobile, full page) ---
  const pickFirst = (types: string[]): PageRecord | undefined =>
    records.find((r) => r.success && types.includes(r.pageType));
  const representatives: Array<{ label: string; record: PageRecord | undefined }> = [
    { label: "homepage", record: pickFirst(["homepage"]) ?? records.find((r) => r.success) },
    { label: "category", record: pickFirst(["category", "subcategory"]) },
    { label: "product", record: pickFirst(["product"]) },
    { label: "brand", record: pickFirst(["brand"]) },
    { label: "informational", record: pickFirst(["informational", "article", "blog"]) },
  ];
  log("capturing representative screenshots (desktop 1440x1000, mobile 390x844)...");
  for (const { label, record } of representatives) {
    if (!record) {
      log(`  no ${label} page discovered - skipping screenshots`);
      continue;
    }
    const fileBase = filenameForUrl(record.normalizedUrl);
    for (const variant of [
      { name: "desktop", width: 1440, height: 1000 },
      { name: "mobile", width: 390, height: 844 },
    ] as const) {
      const shotCtx = await browser.newContext({
        userAgent: config.userAgent,
        locale: "el-GR",
        viewport: { width: variant.width, height: variant.height },
      });
      const shotPage = await shotCtx.newPage();
      try {
        await shotPage.goto(record.finalUrl || record.normalizedUrl, {
          waitUntil: "domcontentloaded",
          timeout: config.timeoutMs,
        });
        await delayWithJitter(600);
        const rel = path.join("screenshots", variant.name, `${fileBase}-${label}.png`).replace(/\\/g, "/");
        await shotPage.screenshot({
          path: path.join(config.outputScreenshotsDir, variant.name, `${fileBase}-${label}.png`),
          fullPage: true,
        });
        if (variant.name === "desktop") record.screenshotDesktopPath = rel;
        else record.screenshotMobilePath = rel;
        log(`  screenshot ${variant.name}/${label}: ${record.normalizedUrl}`);
      } catch (err) {
        log(`  screenshot failed ${variant.name}/${label}: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        await shotCtx.close();
      }
    }
  }

  const finishedAt = new Date().toISOString();
  const meta: CrawlMeta = {
    baseUrl: config.baseUrl,
    startedAt,
    finishedAt,
    maxPages: config.maxPages,
    delayMs: config.delayMs,
    visitedCount: records.length,
    successCount: records.filter((r) => r.success).length,
    failedCount: records.filter((r) => !r.success && !r.blocked).length,
    blockedCount,
    discoveredCount: discoveredSet.size,
    robotsAvailable: robots.available,
    robotsUrl: robots.url,
    robotsSitemaps: robots.sitemaps,
    sitemapsDiscovered,
    sitemapsFetched,
    seedUrls: seedNormalized ? [seedNormalized] : [],
  };

  fs.writeFileSync(
    path.join(config.outputMetadataDir, "pages-raw.json"),
    JSON.stringify(records, null, 2),
    "utf8",
  );
  fs.writeFileSync(
    path.join(config.outputMetadataDir, "crawl-meta.json"),
    JSON.stringify({ meta, robots: { available: robots.available, disallows: robots.disallows } }, null, 2),
    "utf8",
  );
  fs.writeFileSync(path.join(config.outputLogsDir, "crawl.log"), logLines.join("\n") + "\n", "utf8");

  await browser.close();
  log(
    `done: visited=${meta.visitedCount} success=${meta.successCount} failed=${meta.failedCount} ` +
      `blocked=${meta.blockedCount} discovered=${meta.discoveredCount}`,
  );
  log("next: run `npm run reference:report` to generate tracked inventory + report");
}

main().catch((err) => {
  console.error(`crawler failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
