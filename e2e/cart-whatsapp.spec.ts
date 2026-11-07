import { test, expect } from "@playwright/test";
test("customer can add a frame and send a WhatsApp order", async ({ page }) => {
  await page.goto("/p/aviator-classic/");
  await page.getByRole("button", { name: "Add to bag" }).click();
  await page
    .getByRole("dialog", { name: "Your bag" })
    .getByRole("link", { name: /Send to WhatsApp/ })
    .waitFor();
  const href = await page
    .getByRole("link", { name: /Send to WhatsApp/ })
    .getAttribute("href");
  expect(href).toContain("wa.me/2348165469043");
  expect(decodeURIComponent(href ?? "")).toContain("Aviator Classic");
});
