import { test, expect } from './helpers/private-browser.mjs';
import { pathFor, readyStyleFrame } from './helpers/style-page-flows.mjs';

for (const locale of ['zh', 'en']) {
  for (const slug of ['swiss-style', 'editorial', 'corporate-memphis']) {
    for (const width of ['100%', '390px', '320px']) {
      test(`风格滚动边界 ${slug} ${locale} ${width}：不继承吸顶偏移或焦点平滑滚动`, async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 600 });
        await page.goto(pathFor(locale, `/styles/${slug}/`));
        const { experience, iframe, frame } = await readyStyleFrame(page, slug, locale);
        await experience.locator(`[data-scene-width="${width}"]`).click();
        await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
        await expect(page.locator('html')).toHaveCSS('scroll-padding-top', '0px');
        await expect(iframe).toHaveCSS('scroll-margin-top', '0px');
        await expect(frame.locator('html')).toHaveCSS('scroll-behavior', 'auto');
        await expect(frame.locator('html')).toHaveCSS('scroll-padding-top', '0px');
        if (width !== '100%') await expect.poll(() => frame.locator('body').evaluate(() => innerWidth)).toBe(parseInt(width));
      });
    }
  }
  test(`非风格滚动策略 ${locale}：原页面的平滑滚动与吸顶留白保持不变`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    for (const route of ['/', '/styles/', '/components/button/']) {
      await page.goto(pathFor(locale, route));
      await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'smooth');
      await expect(page.locator('html')).toHaveCSS('scroll-padding-top', '130px');
      await expect(page.locator('header[data-track-region="header"]')).toHaveCSS('position', 'sticky');
    }
  });
}
