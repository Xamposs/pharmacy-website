/**
 * Targeted screenshot capture for already-inventoried public URLs.
 *
 * Read-only GET navigation only; never submits forms, never clicks
 * state-changing controls. Used to fill representative screenshot gaps
 * without re-running a full crawl.
 *
 * Usage:
 *   tsx scripts/reference/shots.ts --url=<url> --label=<label> [--url=... --label=...]
 *
 * Screenshots land in reference-private/wecare/screenshots/{desktop,mobile}/
 * and are never tracked by Git.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { chromium } from "playwright";
import { loadConfig } from "./config.js";
import { filenameForUrl, isSkippablePath, normalizeUrl } from "./urls.js";

function takeCliPairs(): Array<{ url: string; label: string }> {
  const urls: string[] = [];
  const labels: string[] = [];
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith("--url=")) urls.push(arg.slice("--url=".length));
    else if (arg.startsWith("--label=")) labels.push(arg.slice("--label=".length));
  }
  return urls.map((url, i) => ({ url, label: labels[i] ?? `extra-${i + 1}` }));
}

async function main(): Promise<void> {
  const config = loadConfig();
  const pairs = takeCliPairs();
  if (pairs.length === 0) {
    console.error("usage: tsx scripts/reference/shots.ts --url=<url> --label=<label> [...]");
    process.exit(1);
  }
  for (const dir of [
    path.join(config.outputScreenshotsDir, "desktop"),
    path.join(config.outputScreenshotsDir, "mobile"),
  ]) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  try {
    for (const { url, label } of pairs) {
      const normalized = normalizeUrl(url, config.baseOrigin);
      if (!normalized) {
        console.log(`skip (off-origin/unparseable): ${url}`);
        continue;
      }
      if (isSkippablePath(normalized).skip) {
        console.log(`skip (sensitive path): ${normalized}`);
        continue;
      }
      const fileBase = filenameForUrl(normalized);
      // Save a rendered HTML snapshot too (local-only raw capture, git-ignored).
      {
        const ctx = await browser.newContext({ userAgent: config.userAgent, locale: "el-GR" });
        const htmlPage = await ctx.newPage();
        try {
          await htmlPage.goto(normalized, { waitUntil: "domcontentloaded", timeout: config.timeoutMs });
          const html = await htmlPage.content();
          fs.mkdirSync(config.outputHtmlDir, { recursive: true });
          fs.writeFileSync(path.join(config.outputHtmlDir, `${fileBase}.html`), html, "utf8");
          console.log(`html snapshot: ${normalized}`);
        } catch (err) {
          console.log(`html snapshot failed: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
          await ctx.close();
        }
      }
      for (const variant of [
        { name: "desktop", width: 1440, height: 1000 },
        { name: "mobile", width: 390, height: 844 },
      ] as const) {
        const ctx = await browser.newContext({
          userAgent: config.userAgent,
          locale: "el-GR",
          viewport: { width: variant.width, height: variant.height },
        });
        const shotPage = await ctx.newPage();
        try {
          await shotPage.goto(normalized, { waitUntil: "domcontentloaded", timeout: config.timeoutMs });
          await new Promise((r) => setTimeout(r, 1500));
          const dest = path.join(config.outputScreenshotsDir, variant.name, `${fileBase}-${label}.png`);
          await shotPage.screenshot({ path: dest, fullPage: true });
          console.log(`shot ${variant.name}/${label}: ${normalized}`);
        } catch (err) {
          console.log(`shot failed ${variant.name}/${label}: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
          await ctx.close();
        }
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(`shots failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
