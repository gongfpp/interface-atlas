import { test, expect } from "@playwright/test";

// 目标设备：iPhone 12–18 的常见 CSS 宽度（360 / 390 / 430）+ 安卓高分屏等效宽度。
const WIDTHS = [360, 390, 430];

const ROUTES = [
  "/",
  "/styles",
  "/styles/art-deco",
  "/styles/brutalism",
  "/components",
  "/patterns",
  "/pages",
  "/motion",
  "/foundation",
  "/a11y",
  "/gallery",
  "/gallery/input",
  "/compare",
  "/compare/overlay-container",
  "/saved",
  "/explore",
  "/search",
  "/board",
  "/components/button",
  "/patterns/wizard",
  "/motion/marquee",
  "/motion/confetti",
  "/pages/landing-page",
  "/foundation/type-scale",
  "/a11y/skip-link",
  "/en",
  "/en/styles",
  "/en/components",
  "/en/gallery/input",
  "/en/compare/overlay-container",
  "/en/explore",
];

for (const width of WIDTHS) {
  test(`no horizontal overflow at ${width}px across top-level routes`, async ({
    page,
  }) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width, height: 844 });
    for (const route of ROUTES) {
      await page.goto(route);
      await page.waitForLoadState("load").catch(() => {});
      const { scrollWidth, innerWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      expect(
        scrollWidth,
        `${route} overflows at ${width}px (scrollWidth ${scrollWidth} > ${innerWidth})`,
      ).toBeLessThanOrEqual(innerWidth + 1);
    }
  });
}
