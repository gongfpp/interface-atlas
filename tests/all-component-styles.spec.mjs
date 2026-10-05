import { test, expect } from './helpers/private-browser.mjs';
import { readFileSync } from 'node:fs';
const matrix = JSON.parse(readFileSync(new URL('../src/lib/component-style-coverage.json', import.meta.url), 'utf8'));

// 实际执行结果与截图绑定到本次 CI 提交；收集定义不等于浏览器或视觉验收。
for (const [id, { styles }] of Object.entries(matrix)) {
  for (const [locale, width] of [['zh', 390], ['zh', 1280], ['en', 390], ['en', 1280]]) {
    test(`${id} ${locale} ${width}px: 八套真实风格可切换，控件可聚焦且不溢出`, async ({ page }) => {
      const errors = []; page.on('pageerror', (error) => errors.push(error.message));
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${locale === 'en' ? '/en' : ''}/components/${id}`);
      const lab = page.locator('[data-solution-lab]');
      const pills = lab.locator('[data-style]');
      await expect(pills).toHaveCount(8);
      const preview = lab.locator('.demo-content');
      for (const style of styles) {
        const pill = lab.locator(`[data-style="${style}"]`);
        await pill.click(); await expect(pill).toHaveAttribute('aria-pressed', 'true');
        await expect(preview).toBeVisible();
        const control = preview.locator('button:not([disabled]), input:not([type=hidden]):not([disabled]), select:not([disabled]), textarea:not([disabled])').first();
        await expect(control).toBeVisible(); await control.focus(); await expect(control).toBeFocused();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
        if (['button', 'input', 'card', 'tooltip'].includes(id)) {
          const file = `${id}-${style}-${locale}-${width}.png`;
          const path = test.info().outputPath(file);
          await lab.locator('.demo-viewport').screenshot({ path, animations: 'disabled' });
          await test.info().attach(file, { path, contentType: 'image/png' });
        }
        if (locale === 'en') expect(await preview.innerText()).not.toMatch(/[\u4e00-\u9fff]/);
      }
      expect(errors).toEqual([]);
    });
  }
}
