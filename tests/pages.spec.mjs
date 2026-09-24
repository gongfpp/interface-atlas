import { test, expect } from "@playwright/test";
import { readdirSync } from "node:fs";

const PAGES = readdirSync("src/content/pages")
  .filter((x) => x.endsWith(".yaml"))
  .map((x) => x.slice(0, -5));

test("every page concept renders a registered interactive demo without errors", async ({
  page,
}) => {
  test.setTimeout(180_000);
  const errors = [];
  page.on("pageerror", (e) => errors.push(`${page.url()}: ${e.message}`));
  for (const id of PAGES) {
    await page.goto(`/pages/${id}`);
    const demo = page.locator("#playground");
    await demo.scrollIntoViewIfNeeded();
    await expect(demo.locator("astro-island[ssr]")).toHaveCount(0);
    await expect(demo.locator(".demo-workbench")).toBeVisible();
    await expect(demo).not.toContainText("未注册");
  }
  expect(errors).toEqual([]);
});
