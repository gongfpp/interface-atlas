import { readFileSync } from "node:fs";
import { load } from "js-yaml";
import { test, expect } from "./helpers/private-browser.mjs";
import { STYLE_SLUGS, pathFor } from "./helpers/style-page-flows.mjs";
for (const locale of ["zh", "en"])
  for (const slug of STYLE_SLUGS) {
    test(`整页能力 ${slug} ${locale}: 收藏、语言、导出`, async ({ page }) => {
      const data = load(
        readFileSync(
          new URL(`../src/content/styles/${slug}.yaml`, import.meta.url),
          "utf8",
        ),
      );
      await page.goto(pathFor(locale, `/styles/${slug}/`));
      const save = page.locator(".atlas-nav astro-island button[aria-pressed]");
      await expect(page.locator(".atlas-nav astro-island[ssr]")).toHaveCount(0);
      await save.click();
      await expect(save).toHaveAttribute("aria-pressed", "true");
      await page.reload();
      await expect(save).toHaveAttribute("aria-pressed", "true");
      const other = locale === "zh" ? "en" : "zh";
      await page.locator(`.atlas-nav a[lang=${other}]`).click();
      await expect(page.locator("html")).toHaveAttribute(
        "lang",
        other === "zh" ? "zh-CN" : "en",
      );
      await expect(save).toHaveAttribute("aria-pressed", "true");
      await save.click();
      await expect(save).toHaveAttribute("aria-pressed", "false");
      const markdown = await page.request.get(
        pathFor(locale, `/styles/${slug}.md`),
      );
      expect(markdown.ok()).toBe(true);
      expect(await markdown.text()).toContain(
        data.prompts.design[locale].trim(),
      );
      const json = await page.request.get(
        pathFor("zh", `/api/concept/styles/${slug}.json`),
      );
      expect(json.ok()).toBe(true);
      expect((await json.json()).prompts.design[locale]).toBe(
        data.prompts.design[locale],
      );
    });
  }
for (const locale of ["zh", "en"])
  test(`旧设备入口 ${locale} 保留原独立演示`, async ({ page }) => {
    await page.goto(pathFor(locale, "/viewport?concept=swiss-style&mode=dark"));
    await expect(page).toHaveURL(/style-scenes\/swiss-style\/\?mode=dark$/);
    await expect(page.locator("body")).toHaveAttribute("data-mode", "dark");
  });
