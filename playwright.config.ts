import { defineConfig } from "@playwright/test";

/**
 * E2E smoke tests for OUR storefront only (mock catalog, no backend).
 * Never targets wecare.gr — see scripts/reference/ for read-only analysis tooling.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3110",
    viewport: { width: 1440, height: 1000 },
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  webServer: {
    command: "cmd /c npm run dev -- --port 3110",
    url: "http://localhost:3110",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "pipe",
  },
});
