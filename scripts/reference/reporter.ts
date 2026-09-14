/**
 * Reporter: builds TRACKED, sanitized derivatives from local-only raw captures.
 *
 * Reads:  reference-private/wecare/metadata/pages-raw.json + crawl-meta.json
 * Writes: reference/wecare/inventory/{pages,page-types,internal-links}.json
 *         reference/wecare/reports/smoke-test.md
 *
 * Never copies HTML bodies, screenshots, or runtime internals into tracked files.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import type { CrawlMeta, PageRecord } from "./types.js";

const projectRoot = process.cwd();
const rawPagesPath = path.join(projectRoot, "reference-private", "wecare", "metadata", "pages-raw.json");
const rawMetaPath = path.join(projectRoot, "reference-private", "wecare", "metadata", "crawl-meta.json");
const inventoryDir = path.join(projectRoot, "reference", "wecare", "inventory");
const reportsDir = path.join(projectRoot, "reference", "wecare", "reports");

function loadRaw(): { pages: PageRecord[]; meta: CrawlMeta | null } {
  if (!fs.existsSync(rawPagesPath)) {
    console.error(`no raw crawl data at ${rawPagesPath} — run \`npm run reference:crawl\` first`);
    process.exit(1);
  }
  const pages = JSON.parse(fs.readFileSync(rawPagesPath, "utf8")) as PageRecord[];
  let meta: CrawlMeta | null = null;
  if (fs.existsSync(rawMetaPath)) {
    try {
      meta = (JSON.parse(fs.readFileSync(rawMetaPath, "utf8")) as { meta: CrawlMeta }).meta;
    } catch {
      meta = null;
    }
  }
  return { pages, meta };
}

function main(): void {
  const { pages, meta } = loadRaw();
  fs.mkdirSync(inventoryDir, { recursive: true });
  fs.mkdirSync(reportsDir, { recursive: true });

  const sorted = [...pages].sort((a, b) => (a.normalizedUrl < b.normalizedUrl ? -1 : 1));

  // --- pages.json: sanitized metadata only (no HTML, no runtime internals) ---
  const pagesInventory = sorted.map((p) => ({
    url: p.normalizedUrl,
    finalUrl: p.finalUrl,
    status: p.status,
    ok: p.ok,
    success: p.success,
    redirected: p.redirected,
    blocked: p.blocked,
    blockReason: p.blockReason,
    errorReason: p.errorReason,
    title: p.title,
    h1: p.h1,
    lang: p.lang,
    pageType: p.pageType,
    pageTypeReason: p.pageTypeReason,
    priorityScore: p.priorityScore ?? null,
    breadcrumbs: p.domSignals?.breadcrumbs ?? [],
    priceHits: p.domSignals?.priceHits ?? null,
    hasAddToCart: p.domSignals?.hasAddToCart ?? null,
    internalLinksCount: p.internalLinksCount,
    timestamp: p.timestamp,
  }));
  fs.writeFileSync(path.join(inventoryDir, "pages.json"), JSON.stringify(pagesInventory, null, 2) + "\n", "utf8");

  // --- page-types.json: counts + representative URLs per type ---
  const byType: Record<string, string[]> = {};
  for (const p of sorted) {
    if (!p.success) continue;
    byType[p.pageType] ??= [];
    byType[p.pageType]?.push(p.normalizedUrl);
  }
  const pageTypes = {
    generatedAt: new Date().toISOString(),
    note: "heuristic classification; see pageTypeReason per page in pages.json",
    counts: Object.fromEntries(Object.entries(byType).map(([t, urls]) => [t, urls.length])),
    urlsByType: Object.fromEntries(
      Object.entries(byType).map(([t, urls]) => [t, [...urls].sort().slice(0, t === "product" ? 150 : 50)]),
    ),
  };
  fs.writeFileSync(path.join(inventoryDir, "page-types.json"), JSON.stringify(pageTypes, null, 2) + "\n", "utf8");

  // --- internal-links.json: deduped out-edges, capped ---
  const EDGE_CAP = 5000;
  const rawEdges: Array<{ from: string; to: string }> = [];
  for (const p of sorted) {
    if (!p.success) continue;
    const seen = new Set<string>();
    for (const to of p.internalLinksSample) {
      if (to === p.normalizedUrl || seen.has(to)) continue;
      seen.add(to);
      rawEdges.push({ from: p.normalizedUrl, to });
      if (rawEdges.length >= EDGE_CAP) break;
    }
    if (rawEdges.length >= EDGE_CAP) break;
  }
  rawEdges.sort((a, b) => (a.from === b.from ? (a.to < b.to ? -1 : 1) : a.from < b.from ? -1 : 1));
  const internalLinks = {
    generatedAt: new Date().toISOString(),
    note: "capped sample of same-origin out-edges (max 5000); per-page samples capped at 100 links",
    edgeCount: rawEdges.length,
    edges: rawEdges,
  };
  fs.writeFileSync(
    path.join(inventoryDir, "internal-links.json"),
    JSON.stringify(internalLinks, null, 2) + "\n",
    "utf8",
  );

  // --- smoke-test.md: human-readable summary of ACTUAL observations ---
  const success = sorted.filter((p) => p.success);
  const failed = sorted.filter((p) => !p.success && !p.blocked);
  const blocked = sorted.filter((p) => p.blocked);
  const redirected = sorted.filter((p) => p.redirected);
  const repFor = (types: string[]): string => {
    const hit = success.find((p) => types.includes(p.pageType));
    return hit ? `${hit.normalizedUrl} ("${hit.title ?? "untitled"}")` : "none observed";
  };
  const sections = [...new Set(success.map((p) => {
    try {
      const segs = new URL(p.normalizedUrl).pathname.split("/").filter(Boolean);
      return segs.length > 0 ? `/${segs[0]}` : "/";
    } catch {
      return "(unparseable)";
    }
  }))].sort();

  const md = `# wecare.gr reference crawl — ${new Date().toISOString().slice(0, 10)}

> Auto-generated from the polite read-only crawl (max ${meta?.maxPages ?? "?"} pages, prioritized queue).
> Source: \`reference/wecare/inventory/*.json\` (sanitized). Raw HTML/screenshots stay local-only
> under \`reference-private/\` per \`docs/reference/REFERENCE_POLICY.md\`.

## Totals

- Discovered URLs (queue, incl. unvisited): **${meta?.discoveredCount ?? "unknown"}**
- Visited URLs: **${sorted.length}**
- Successful pages: **${success.length}**
- Failed (non-block) pages: **${failed.length}**
- Blocked pages: **${blocked.length}**
- Redirects (final URL differs): **${redirected.length}**

## Page types (heuristic)

${Object.keys(byType).length > 0 ? Object.entries(pageTypes.counts).map(([t, c]) => `- ${t}: **${c}**`).join("\n") : "- none (no successful pages)"}

Classification is best-effort (URL + title/H1 patterns); see \`pageTypeReason\` in \`pages.json\`.

## Representative pages

- Homepage: ${repFor(["homepage"])}
- Category-like: ${repFor(["category", "subcategory"])}
- Product-like: ${repFor(["product"])}
- Brand-like: ${repFor(["brand"])}
- Informational/content-like: ${repFor(["informational", "article", "blog"])}

## Product pages observed

${(() => {
    const products = success.filter((p) => p.pageType === "product");
    if (products.length === 0) return "- none observed within the crawl cap.";
    return products.map((p) => `- ${p.normalizedUrl} ("${p.title ?? "untitled"}")`).join("\n");
  })()}

## Crawl configuration

- robots.txt available: **${meta ? String(meta.robotsAvailable) : "unknown"}**${meta?.robotsUrl ? ` (${meta.robotsUrl})` : ""}
- Sitemaps discovered: ${meta && meta.sitemapsDiscovered.length > 0 ? meta.sitemapsDiscovered.join(", ") : "none"}
- Base delay between navigations: ${meta?.delayMs ?? "unknown"} ms (+ jitter)

## Notable site sections (top-level path prefixes observed)

${sections.length > 0 ? sections.map((s) => `- \`${s}\``).join("\n") : "- none observed"}

## Navigation patterns observed

- Internal discovery via same-origin anchor hrefs (prioritized queue: product-likely first, deduped + canonicalized).
- Tracking params stripped; fragments stripped; sensitive paths (account/login/checkout/cart/admin/api/…) never queued.
- Non-GET requests aborted at the browser-context level as a safety net.

## Failures / blocks

${blocked.length > 0 ? blocked.map((p) => `- BLOCKED ${p.normalizedUrl} — ${p.blockReason ?? p.errorReason}`).join("\n") : "- No blocked pages recorded."}
${failed.length > 0 ? failed.map((p) => `- FAILED ${p.normalizedUrl} — ${p.errorReason ?? "unknown"}`).join("\n") : "- No non-block failures recorded."}

## Limitations

- Capped at ${meta?.maxPages ?? "?"} pages: this is a targeted sample, not a full sitemap.
- JavaScript-heavy or bot-protected pages may be under-observed; blocks are recorded, never evaded.
- Page-type labels are heuristic; verify against \`pages.json\` before using in later phases.
`;

  fs.writeFileSync(path.join(reportsDir, "smoke-test.md"), md, "utf8");
  console.log(`inventory + report written (${sorted.length} pages: ${success.length} ok, ${failed.length} failed, ${blocked.length} blocked)`);
}

main();
