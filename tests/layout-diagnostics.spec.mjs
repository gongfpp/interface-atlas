import { test, expect } from './helpers/private-browser.mjs';

// 保存溢出回归的几何与截图证据，区分页面越界与有意的局部滚动。
const cases = [
  ...['zh', 'en'].flatMap(locale => ['button', 'rating', 'tree-view'].map(id => ({ locale, width: 390, route: `/components/${id}` }))),
  ...['zh', 'en'].flatMap(locale => [360, 390, 430].map(width => ({ locale, width, route: '/styles/brutalism' }))),
];

for (const { locale, width, route } of cases) {
  test(`窄屏布局回归 ${locale} ${width}px ${route}`, async ({ page, browser }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${locale === 'en' ? '/en' : ''}${route}`);
    if (route.startsWith('/components')) {
      const pill = page.locator('[data-solution-lab] [data-style="minimalism"]');
      await expect(pill).toBeVisible();
      await pill.click();
      await expect(pill).toHaveAttribute('aria-pressed', 'true');
    } else {
      await page.locator('[data-style-interactive]').scrollIntoViewIfNeeded();
      const frame = page.frameLocator('[data-style-frame]');
      await expect(frame.locator('[data-style-scene="brutalism"]')).toBeVisible();
      const frameGeometry = await frame.locator('body').evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
      expect(frameGeometry.document, '整页iframe文档不得横向溢出').toBeLessThanOrEqual(frameGeometry.viewport + 1);
      await testInfo.attach('style-frame-geometry.json', { body: JSON.stringify(frameGeometry), contentType: 'application/json' });
    }
    await page.evaluate(() => document.fonts.ready);
    const geometry = await page.evaluate(() => {
      const vw = innerWidth;
      const describe = el => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return {
          tag: el.tagName, id: el.id, className: el.getAttribute('class'),
          text: el.textContent?.trim().slice(0, 200),
          rect: { left: r.left, right: r.right, top: r.top + scrollY, width: r.width, height: r.height },
          scrollWidth: el.scrollWidth, clientWidth: el.clientWidth,
          outsideViewport: r.right > vw + 0.5 || r.left < -0.5,
          clippingAncestors: (() => {
            const ancestors = [];
            for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
              const overflow = getComputedStyle(p).overflowX;
              if (['auto', 'scroll', 'hidden', 'clip'].includes(overflow)) ancestors.push({ tag: p.tagName, className: p.getAttribute('class'), overflowX: overflow });
            }
            return ancestors;
          })(),
          styles: Object.fromEntries(['display', 'width', 'minWidth', 'maxWidth', 'overflowX', 'whiteSpace', 'overflowWrap', 'wordBreak', 'flexShrink', 'flexWrap', 'gridTemplateColumns', 'fontSize', 'fontFamily', 'paddingLeft', 'paddingRight', 'marginLeft', 'marginRight'].map(k => [k, s[k]])),
        };
      };
      const overflowing = [...document.querySelectorAll('body *')].filter(el => {
        const r = el.getBoundingClientRect();
        return r.width && r.height && (r.right > vw + 0.5 || r.left < -0.5 || el.scrollWidth > el.clientWidth + 1);
      });
      return {
        viewport: vw, documentWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth,
        overflowing: overflowing.map(el => ({ ...describe(el), ancestors: [el.parentElement, el.parentElement?.parentElement].filter(Boolean).map(describe) })),
      };
    });
    geometry.browserVersion = browser.version();
    geometry.browserName = browser.browserType().name();
    console.log(`LAYOUT_GEOMETRY ${locale} ${width} ${route} document=${geometry.documentWidth} viewport=${geometry.viewport} ${geometry.browserName}=${geometry.browserVersion}`);
    await testInfo.attach('layout-geometry.json', { body: JSON.stringify(geometry, null, 2), contentType: 'application/json' });
    const screenshot = testInfo.outputPath('full-page.png');
    await page.screenshot({ path: screenshot, fullPage: true, animations: 'disabled' });
    await testInfo.attach('full-page.png', { path: screenshot, contentType: 'image/png' });
    expect(geometry.documentWidth, `${locale} ${route} 页面不得横向溢出`).toBeLessThanOrEqual(geometry.viewport);
    const header = page.locator('article > header');
    const headerRect = await header.boundingBox();
    const bookmarkRect = await header.locator('button[aria-pressed]').boundingBox();
    expect(headerRect).not.toBeNull();
    expect(bookmarkRect).not.toBeNull();
    expect(bookmarkRect.x + bookmarkRect.width).toBeLessThanOrEqual(headerRect.x + headerRect.width + 0.5);
  });
}
