import { test, expect } from './helpers/private-browser.mjs';

async function expectContainedHeader(page) {
  const geometry = await page.locator('article > header').evaluate(header => {
    const headerRect = header.getBoundingClientRect();
    const heading = header.querySelector('h1');
    const titleRect = heading.parentElement.getBoundingClientRect();
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const headingText = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const range = document.createRange();
      range.selectNodeContents(node);
      headingText.push(...[...range.getClientRects()].map(rect => ({ left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom })));
    }
    return {
      viewport: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      left: headerRect.left,
      right: headerRect.right,
      titleRight: titleRect.right,
      headingText,
      controls: [...header.querySelectorAll('button')].map(button => {
        const rect = button.getBoundingClientRect();
        return { name: button.textContent, left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
      }),
    };
  });
  expect(geometry.documentWidth, JSON.stringify(geometry)).toBeLessThanOrEqual(geometry.viewport);
  for (const control of geometry.controls) {
    expect(control.left, control.name).toBeGreaterThanOrEqual(geometry.left);
    expect(control.right, control.name).toBeLessThanOrEqual(geometry.right + 0.5);
  }
  for (const rect of geometry.headingText) {
    expect(rect.right, '标题文字必须在标题区域内换行').toBeLessThanOrEqual(geometry.titleRight + 0.5);
    for (const control of geometry.controls) {
      if (rect.top < control.bottom && rect.bottom > control.top) {
        expect(rect.right, `标题文字不得盖住 ${control.name}`).toBeLessThanOrEqual(control.left + 0.5);
      }
    }
  }
}

for (const locale of ['zh', 'en']) {
  for (const width of [320, 360, 390, 430]) {
    const routes = [
      ...(width >= 360 ? ['/components/button', '/styles/brutalism'] : []),
      ...(locale === 'en' && width <= 360 ? ['/styles/skeuomorphism', '/styles/neobrutalism'] : []),
    ];
    for (const route of routes) {
      test(`详情页收藏按钮 ${locale} ${width}px ${route}：收藏与撤销后仍完整可见`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`${locale === 'en' ? '/en' : ''}${route}`);
        const header = page.locator('article > header');
        await expect(header.locator('astro-island[ssr]')).toHaveCount(0);
        const bookmark = header.locator('button[aria-pressed]');
        await expect(bookmark).toHaveAttribute('aria-pressed', 'false');
        await expectContainedHeader(page);
        await bookmark.click();
        await expect(bookmark).toHaveAttribute('aria-pressed', 'true');
        await expectContainedHeader(page);
        await bookmark.click();
        await expect(bookmark).toHaveAttribute('aria-pressed', 'false');
        await expectContainedHeader(page);
      });
    }
  }

  test(`详情页收藏按钮 ${locale} 320px：存储失败说明与重试按钮可换行`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.addInitScript(() => {
      window.__atlasStorageAvailable = false;
      for (const method of ['getItem', 'setItem']) {
        const original = Storage.prototype[method];
        Storage.prototype[method] = function(key, ...args) {
          if (!window.__atlasStorageAvailable && ['ia-saved', 'ia-history'].includes(key)) {
            throw new DOMException('本次测试模拟存储不可用', 'SecurityError');
          }
          return original.call(this, key, ...args);
        };
      }
    });
    await page.goto(`${locale === 'en' ? '/en' : ''}/components/button`);
    const header = page.locator('article > header');
    const warning = header.getByRole('status');
    await expect(warning).toBeVisible();
    const bookmark = header.locator('button[aria-pressed]');
    await expectContainedHeader(page);
    await bookmark.click();
    await expect(bookmark).toHaveAttribute('aria-pressed', 'true');
    await expectContainedHeader(page);
    await page.evaluate(() => { window.__atlasStorageAvailable = true; });
    await warning.getByRole('button').click();
    await expect(warning).toHaveCount(0);
    await expect(bookmark).toHaveAttribute('aria-pressed', 'true');
    await expectContainedHeader(page);
  });
}
