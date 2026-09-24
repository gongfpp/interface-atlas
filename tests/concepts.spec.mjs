import { test, expect } from "@playwright/test";
import { readdirSync } from "node:fs";

const TYPES = ["components", "patterns", "styles", "pages", "motion", "foundation", "a11y"];

test("every concept renders a registered interactive demo without page errors", async ({
  page,
}) => {
  test.setTimeout(300_000);
  const errors = [];
  page.on("pageerror", (e) => errors.push(`${page.url()}: ${e.message}`));
  for (const type of TYPES) {
    const ids = readdirSync(`src/content/${type}`)
      .filter((x) => x.endsWith(".yaml"))
      .map((x) => x.slice(0, -5));
    for (const id of ids) {
      await page.goto(`/${type}/${id}`);
      const demo = page.locator("#playground");
      await demo.scrollIntoViewIfNeeded();
      await expect(demo.locator("astro-island[ssr]"), `${type}/${id}`).toHaveCount(0);
      await expect(demo.locator(".demo-workbench"), `${type}/${id}`).toBeVisible();
      await expect(demo, `${type}/${id}`).not.toContainText("未注册");
    }
  }
  expect(errors).toEqual([]);
});
