import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
const matrix = JSON.parse(readFileSync(new URL('../src/lib/component-style-coverage.json', import.meta.url), 'utf8'));

// 待浏览器访问允许后执行；测试定义与 collect 成功不代表视觉或浏览器验收通过。
for (const [id, { styles }] of Object.entries(matrix)) {
  for (const [locale, width] of [['zh', 390], ['en', 1280]]) {
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
        if (locale === 'en') expect(await preview.innerText()).not.toMatch(/[\u4e00-\u9fff]/);
      }
      expect(errors).toEqual([]);
    });
  }
}
