import { expect, test } from "@playwright/test";

const PRODUCT = "/product/solcare-antiliako-prosopou-spf50-50ml";
const PRODUCT_NAME = "SolCare Αντηλιακό Προσώπου SPF50 50ml";

test("homepage loads with hero, categories and offers", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Έτοιμοι για τον ήλιο" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Κατηγορίες" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Προσφορές" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Brands|Προσφορές/ }).first()).toBeVisible();
});

test("mega menu opens on hover and exposes brand panel", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Κύρια πλοήγηση" });
  await nav.getByRole("link", { name: "Brands", exact: true }).hover();
  await expect(nav.getByRole("link", { name: "Όλα τα brands" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "MediDerm" })).toBeVisible();
});

test("category page loads and brand filter narrows results", async ({ page }) => {
  await page.goto("/category/prosopo");
  await expect(page.getByRole("heading", { name: "Πρόσωπο", exact: true })).toBeVisible();
  const count = page.getByText(/προϊόντα$/).first();
  await expect(count).toBeVisible();
  const before = await count.textContent();
  await page.getByRole("checkbox", { name: /MediDerm/ }).check();
  await expect(page.getByRole("button", { name: /Αφαίρεση φίλτρου MediDerm/ })).toBeVisible();
  const after = await count.textContent();
  expect(after).not.toEqual(before);
  await expect(page.getByRole("button", { name: "Καθαρισμός όλων" })).toBeVisible();
});

test("search suggestions appear and search navigation works", async ({ page }) => {
  await page.goto("/");
  const box = page.getByRole("combobox", { name: "Αναζήτηση προϊόντων" }).first();
  await box.fill("mediderm");
  const listbox = page.getByRole("listbox", { name: "Προτάσεις αναζήτησης" });
  await expect(listbox).toBeVisible();
  await expect(listbox.getByRole("option").first()).toBeVisible();
  await expect(listbox.getByText("MediDerm", { exact: false }).first()).toBeVisible();
  await box.press("Enter");
  await expect(page).toHaveURL(/\/search\?q=mediderm/);
  await expect(page.getByRole("heading", { name: /Αποτελέσματα για/ })).toBeVisible();
});

test("product page loads with gallery, buy box and reviews", async ({ page }) => {
  await page.goto(PRODUCT);
  await expect(page.getByRole("heading", { name: PRODUCT_NAME })).toBeVisible();
  await expect(page.getByRole("tablist", { name: /Εικόνες προϊόντος/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Προσθήκη στο καλάθι" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Αξιολογήσεις" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Σχετικά προϊόντα" })).toBeVisible();
});

test("product can be added to cart; count changes; drawer opens", async ({ page }) => {
  await page.goto(PRODUCT);
  await page.getByRole("button", { name: "Προσθήκη στο καλάθι" }).first().click();
  await expect(page.getByRole("button", { name: /Άνοιγμα καλαθιού, 1 προϊόντα/ })).toBeVisible();
  const dialog = page.getByRole("dialog", { name: "Καλάθι αγορών" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(PRODUCT_NAME)).toBeVisible();
  await dialog.getByRole("button", { name: "Κλείσιμο" }).click();
  await expect(dialog).toBeHidden();
  await page.goto("/cart");
  await expect(page.getByRole("heading", { name: /Καλάθι/ })).toBeVisible();
  await expect(page.getByText("Σύνολο", { exact: true })).toBeVisible();
});

test("favorite can be added and persists to favorites page", async ({ page }) => {
  await page.goto("/category/prosopo");
  const fav = page.getByRole("button", { name: "Προσθήκη στα αγαπημένα" }).first();
  await fav.click();
  await expect(page.getByRole("button", { name: "Αφαίρεση από τα αγαπημένα" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Αγαπημένα, 1 προϊόντα/ })).toBeVisible();
  await page.goto("/favorites");
  await expect(page.getByRole("heading", { name: "Αγαπημένα" })).toBeVisible();
  await page.reload();
  await expect(page.getByText(/στη λίστα σας/)).toBeVisible();
});

test("mobile navigation opens with expandable categories", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Άνοιγμα μενού" }).click();
  const dialog = page.getByRole("dialog", { name: "Μενού πλοήγησης" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: /υποκατηγοριών Πρόσωπο/ }).click();
  await expect(dialog.getByRole("link", { name: "Καθαρισμός Προσώπου" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});
