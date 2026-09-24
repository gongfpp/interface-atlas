import { test, expect } from "@playwright/test";
import { readdirSync } from "node:fs";

// 每个 src/islands/style-variants/<id>.tsx 都应有对应组件详情页上的“不同风格”画廊。
const IDS = readdirSync("src/islands/style-variants")
  .filter((f) => f.endsWith(".tsx") && f !== "types.ts")
  .map((f) => f.slice(0, -4));

test("each component style-variant set renders and switches without errors", async ({
  page,
}) => {
  test.setTimeout(300_000);
  const errors = [];
  page.on("pageerror", (e) => errors.push(`${page.url()}: ${e.message}`));
  for (const id of IDS) {
    await page.goto(`/components/${id}`);
    const section = page.locator("#style-variants");
    await section.scrollIntoViewIfNeeded();
    await expect(section, `${id} missing gallery`).toBeVisible();
    const group = section.getByRole("group", { name: /风格变体|Style variants/ });
    const pills = group.getByRole("button");
    await expect(pills, `${id} needs >=2 styles`).not.toHaveCount(0, { timeout: 10_000 });
    const count = await pills.count();
    expect(count, `${id} needs >=2 styles`).toBeGreaterThanOrEqual(2);
    await pills.nth(Math.min(1, count - 1)).click();
    await expect(pills.nth(Math.min(1, count - 1))).toHaveAttribute("aria-pressed", "true");
  }
  expect(errors).toEqual([]);
});
