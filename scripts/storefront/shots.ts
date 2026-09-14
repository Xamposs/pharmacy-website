/**
 * Development screenshots of OUR storefront (mock catalog, no backend).
 * Output: reference-private/our-storefront/{desktop,mobile}/*.png (git-ignored).
 *
 * Prerequisite: `npm run build` once. This script starts `next start`,
 * waits for readiness, captures, then stops the server.
 */
import { execSync, spawn, type ChildProcess } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { chromium } from "playwright";

const PORT = 3120;
const BASE = `http://localhost:${PORT}`;
const OUT = path.join(process.cwd(), "reference-private", "our-storefront");

const pages: Array<{ name: string; url: string }> = [
  { name: "homepage", url: "/" },
  { name: "category", url: "/category/soma" },
  { name: "product", url: "/product/solcare-antiliako-prosopou-spf50-50ml" },
  { name: "brands", url: "/brands" },
  { name: "search", url: "/search?q=vitamin" },
  { name: "favorites", url: "/favorites" },
  { name: "cart", url: "/cart" },
];

const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
] as const;

/** Best-effort: free PORT so we never capture from a stale server. */
function freePort(): void {
  if (process.platform !== "win32") return;
  try {
    const out = execSync(`netstat -ano | findstr ":${PORT}" | findstr "LISTENING"`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const pids = new Set<string>();
    for (const line of out.split("\n")) {
      const m = line.trim().match(/(\d+)\s*$/);
      if (m?.[1] && m[1] !== "0") pids.add(m[1]);
    }
    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /T /F`, { stdio: "ignore" });
        console.log(`freed stale listener pid ${pid} on :${PORT}`);
      } catch {
        // already gone
      }
    }
  } catch {
    // nothing listening
  }
}

/** Kill the whole spawned tree (cmd -> npm -> node); plain kill() orphans node. */
function killTree(server: ChildProcess): void {
  try {
    if (server.pid !== undefined && process.platform === "win32") {
      execSync(`taskkill /PID ${server.pid} /T /F`, { stdio: "ignore" });
      return;
    }
  } catch {
    // fall through
  }
  try {
    server.kill();
  } catch {
    // already stopped
  }
}

function waitForServer(timeoutMs: number): Promise<void> {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(BASE);
        if (res.ok) return resolve();
      } catch {
        // not ready yet
      }
      if (Date.now() - start > timeoutMs) return reject(new Error("server did not start"));
      setTimeout(tick, 1000);
    };
    tick();
  });
}

async function main(): Promise<void> {
  for (const v of viewports) fs.mkdirSync(path.join(OUT, v.name), { recursive: true });

  const server: ChildProcess = spawn("cmd", ["/c", `npm run start -- --port ${PORT}`], {
    cwd: process.cwd(),
    stdio: "ignore",
    detached: false,
  });
  const kill = () => {
    try {
      server.kill();
    } catch {
      // already stopped
    }
  };
  process.on("exit", kill);

  try {
    await waitForServer(90_000);
    const browser = await chromium.launch({ headless: true });
    try {
      for (const v of viewports) {
        const ctx = await browser.newContext({
          viewport: { width: v.width, height: v.height },
        });
        const pg = await ctx.newPage();
        for (const p of pages) {
          await pg.goto(BASE + p.url, { waitUntil: "domcontentloaded", timeout: 30_000 });
          await pg.waitForTimeout(800);
          await pg.screenshot({ path: path.join(OUT, v.name, `${p.name}.png`), fullPage: true });
          console.log(`shot ${v.name}/${p.name}`);
        }
        await ctx.close();
      }
    } finally {
      await browser.close();
    }
  } finally {
    kill();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
