import { test, expect } from './helpers/private-browser.mjs';

// 临时诊断：保留实际尺寸与完整页面，不以隐藏溢出来掩盖布局原因。
const cases = [
  ...['zh', 'en'].flatMap(locale => ['button', 'rating', 'tree-view'].map(id => ({ locale, width: 390, route: `/components/${id}` }))),
  ...['zh', 'en'].flatMap(locale => [360, 390, 430].map(width => ({ locale, width, route: '/styles/brutalism' }))),
];

for (const { locale, width, route } of cases) {
  test(`布局诊断 ${locale} ${width}px ${route}`, async ({ page, browser }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${locale === 'en' ? '/en' : ''}${route}`);
    if (route.startsWith('/components')) {
      const pill = page.locator('[data-solution-lab] [data-style="minimalism"]');
      await expect(pill).toBeVisible();
      await pill.click();
      await expect(pill).toHaveAttribute('aria-pressed', 'true');
    } else {
      await page.locator('[data-style-interactive]').scrollIntoViewIfNeeded();
      await expect(page.locator('[data-style-interactive] .demo-content')).toBeVisible();
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
    console.log(`LAYOUT_DIAGNOSTIC ${locale} ${width} ${route} ${JSON.stringify(geometry)}`);
    await testInfo.attach('layout-geometry.json', { body: JSON.stringify(geometry, null, 2), contentType: 'application/json' });
    const screenshot = testInfo.outputPath('full-page.png');
    await page.screenshot({ path: screenshot, fullPage: true, animations: 'disabled' });
    await testInfo.attach('full-page.png', { path: screenshot, contentType: 'image/png' });
  });
}
