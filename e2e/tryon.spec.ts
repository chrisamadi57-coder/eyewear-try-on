import { expect, test } from "@playwright/test";
import path from "node:path";

test("privacy-first upload flow shows frame choices and keeps photo controls available", async ({
  page,
}) => {
  const remoteRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== "http://127.0.0.1:3000")
      remoteRequests.push(request.url());
  });
  await page.goto("/try/");
  await page
    .locator("label")
    .filter({ hasText: "Upload photo" })
    .locator('input[type="file"]')
    .setInputFiles(path.join(import.meta.dirname, "fixtures", "face.svg"));
  await expect(
    page.getByRole("button", { name: "Delete photo" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Aviator Classic" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Delete photo" }),
  ).toBeEnabled();
  await page.waitForTimeout(1500);
  expect(remoteRequests).toEqual([]);
});
