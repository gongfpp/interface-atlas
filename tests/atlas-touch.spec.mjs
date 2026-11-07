import { test, expect } from './helpers/private-browser.mjs';
import { STYLE_SLUGS } from './helpers/style-page-flows.mjs';

test.use({ hasTouch: true });

for (const slug of STYLE_SLUGS) {
  test(`触屏点按 ${slug} 390：菜单、当前案例、关闭与复选框`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/styles/${slug}/`);
    await expect(page.locator('[data-atlas-root]')).toHaveAttribute('data-ready', 'true');
    // tap 使用浏览器触摸输入路径，不以鼠标 click 冒充手机点按。
    await page.locator('[data-variant-trigger]').tap();
    const menu = page.locator('[data-variant-list]');
    await expect(menu).toBeVisible();
    const bounds = await menu.boundingBox();
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(391);
    await page.locator('[data-variant-option="1"]').tap();
    await expect(page.locator('select[data-variant]')).toHaveValue('1');
    await expect(menu).toBeHidden();
    await page.locator('.approved-buttons [data-current-example]').tap();
    const dialog = page.locator('[data-example-dialog]');
    await expect(dialog).toBeVisible();
    await expect(page.locator('[data-example-preview]')).toHaveAttribute('data-preview-variant', '1');
    await dialog.locator('[data-close-dialog]').tap();
    await expect(dialog).toBeHidden();
    const check = page.locator('[data-demo-check]');
    const label = page.locator('.approved-check').filter({ has: check });
    await label.tap();
    await expect(check).toBeChecked();
    await label.tap();
    await expect(check).not.toBeChecked();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
    expect(errors).toEqual([]);
  });
}
