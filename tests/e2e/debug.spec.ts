import { expect, test } from "@playwright/test";

test("debug footer computed style", async ({ page }) => {
  await page.goto("/category/soma");
  const info = await page.locator("footer details").first().locator("div").first().evaluate((el) => {
    const cs = window.getComputedStyle(el);
    return { display: cs.display, cls: el.className, vw: window.innerWidth };
  });
  console.log("content div:", JSON.stringify(info));
  expect(true).toBe(true);
});
