import { test, expect } from './helpers/private-browser.mjs';
import { observeSettledGeometry } from './helpers/settled-geometry.mjs';
import { readFileSync } from 'node:fs';
const matrix = JSON.parse(readFileSync(new URL('../src/lib/component-style-coverage.json', import.meta.url), 'utf8'));

// 每个用例有独立的 context/page 和输出目录，按配置的 workers 上限并行执行。
// 单个用例内按注册数量逐一选择风格，保留原生聚焦/滚动及几何稳定检查。
test.describe.configure({ mode: 'parallel' });

// 实际执行结果与截图绑定到本次 CI 提交；收集定义不等于浏览器或视觉验收。
for (const [id, { styles }] of Object.entries(matrix)) {
  for (const [locale, width] of [['zh', 390], ['zh', 1280], ['en', 390], ['en', 1280]]) {
    test(`${id} ${locale} ${width}px: 已注册风格可切换，控件可聚焦且不溢出`, async ({ page }) => {
      // 25 种按钮风格逐项聚焦、滚动和截图；桌面实测也可超过 30s。
      // 保留全部风格、稳定等待与断言，给完整矩阵相同的时间预算。
      if (id === 'button') test.setTimeout(60000);
      const errors = []; page.on('pageerror', (error) => errors.push(error.message));
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${locale === 'en' ? '/en' : ''}/components/${id}`);
      const lab = page.locator('[data-solution-lab]');
      const pills = lab.locator('[data-style]');
      await expect(pills).toHaveCount(styles.length);
      const wall = lab.locator(`[data-style-wall="${id}"]`);
      if (['button', 'input', 'card', 'select', 'checkbox', 'switch'].includes(id)) {
        await expect(wall).toHaveCount(1);
        await expect(wall.locator('[data-style-wall-tile]')).toHaveCount(styles.length);
        await expect(wall.locator('[data-style-sample]')).toHaveCount(styles.length);
        if (locale === 'en') expect(await wall.innerText()).not.toMatch(/[\u4e00-\u9fff]/);
        if (locale === 'zh') {
          const file = `style-wall-${id}-${width}.png`;
          const path = test.info().outputPath(file);
          await wall.screenshot({ path, animations: 'disabled' });
          await test.info().attach(file, { path, contentType: 'image/png' });
        }
        const tile = wall.locator(`[data-style-wall-tile="${styles[0]}"]`);
        const bounds = await tile.boundingBox();
        expect(bounds.width).toBeGreaterThanOrEqual(44);
        expect(bounds.height).toBeGreaterThanOrEqual(44);
      } else await expect(wall).toHaveCount(0);
      const preview = lab.locator('.demo-content');
      for (const style of styles) {
        const pill = lab.locator(`[data-style="${style}"]`);
        // 上一控件的原生聚焦可能仍在平滑滚动；先观察停止，再正常滚动到本次点击目标。
        await observeSettledGeometry(pill);
        await pill.scrollIntoViewIfNeeded();
        await observeSettledGeometry(pill);
        if (['button', 'input', 'card', 'select', 'checkbox', 'switch'].includes(id)) {
          await pill.focus();
          await expect(pill).toBeFocused();
          await page.keyboard.press('Enter');
        } else await pill.click();
        await expect(pill).toHaveAttribute('aria-pressed', 'true');
        await expect(preview).toBeVisible();
        await expect(preview).toHaveCount(1);
        if (['button', 'input', 'card', 'select', 'checkbox', 'switch'].includes(id)) {
          await expect(preview).toHaveAttribute('data-active-style', style);
          await expect(lab.locator('[data-solution-summary]')).toContainText(await pill.locator('[data-style-label]').innerText());
        }
        const control = preview.locator('button:not([disabled]), input:not([type=hidden]):not([disabled]), select:not([disabled]), textarea:not([disabled])').first();
        await expect(control).toBeVisible(); await control.focus(); await expect(control).toBeFocused();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
        if (['button', 'input', 'card', 'tooltip'].includes(id)) {
          const file = `${id}-${style}-${locale}-${width}.png`;
          const path = test.info().outputPath(file);
          if (id === 'tooltip') {
            await expect(preview.getByRole('tooltip')).toBeInViewport({ ratio: 1 });
            if (style === 'swiss-style') await expect(preview.getByRole('tooltip')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
            await page.screenshot({ path, animations: 'disabled' });
          } else {
            await lab.locator('.demo-viewport').screenshot({ path, animations: 'disabled' });
          }
          await test.info().attach(file, { path, contentType: 'image/png' });
        }
        if (locale === 'en') expect(await preview.innerText()).not.toMatch(/[\u4e00-\u9fff]/);
      }
      expect(errors).toEqual([]);
    });
  }
}
