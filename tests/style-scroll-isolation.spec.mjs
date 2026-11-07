import { test, expect } from "./helpers/private-browser.mjs";
import { pathFor } from "./helpers/style-page-flows.mjs";

for (const locale of ["zh", "en"]) {
  for (const width of [1280, 390, 320]) {
    test(`风格常驻首页 ${locale} ${width}: 提示词跳转后仍可见`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(pathFor(locale, "/styles/editorial/"));
      await page.locator('.atlas-nav a[href="#prompts"]').click();
      await expect(page.locator(".atlas-home")).toBeInViewport();
      const nav = await page.locator(".atlas-nav").boundingBox();
      const prompt = await page.locator("#prompts").boundingBox();
      expect(prompt.y).toBeGreaterThanOrEqual(nav.y + nav.height - 1);
      await page.locator(".atlas-home").click();
      await expect(page).toHaveURL(
        new RegExp(locale === "zh" ? "/$" : "/en/?$"),
      );
    });
  }
  test(`非风格滚动策略 ${locale}：原页面的平滑滚动与吸顶留白保持不变`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    for (const route of ["/", "/styles/", "/components/button/"]) {
      await page.goto(pathFor(locale, route));
      await expect(page.locator("html")).toHaveCSS("scroll-behavior", "smooth");
      await expect(page.locator("html")).toHaveCSS(
        "scroll-padding-top",
        "130px",
      );
      await expect(
        page.locator('header[data-track-region="header"]'),
      ).toHaveCSS("position", "sticky");
    }
  });
}
