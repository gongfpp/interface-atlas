import { test, expect } from './helpers/private-browser.mjs';

for (const locale of ['zh', 'en']) {
  test(`gallery annotations identify real image regions and update their explanation (${locale})`, async ({ page }) => {
    await page.goto(`${locale === 'en' ? '/en' : ''}/gallery/input`);
    const breakdown = page.locator('[data-gallery-breakdown]');
    await expect(breakdown).toBeVisible();
    await expect(breakdown).toContainText(locale === 'zh' ? 'AI 生成的静态参考图' : 'AI-generated static reference');
    await expect(breakdown.locator('[data-annotation-panel="0"]')).toBeVisible();
    await expect(breakdown.locator('[data-annotation-region="0"]')).toBeVisible();
    const choice = breakdown.getByRole('group').getByRole('button').nth(1);
    await choice.focus();
    await page.keyboard.press('Enter');
    await expect(choice).toHaveAttribute('aria-pressed', 'true');
    await expect(breakdown.locator('[data-annotation-panel="0"]')).toBeHidden();
    await expect(breakdown.locator('[data-annotation-panel="1"]')).toBeVisible();
    await expect(breakdown.locator('[data-annotation-panel="1"]')).toContainText(locale === 'zh' ? '自动填充' : 'autofill');
    await expect(breakdown.locator('[data-annotation-region="1"]')).toBeVisible();
    await breakdown.locator('.breakdown-marker').nth(2).click();
    await expect(breakdown.locator('[data-annotation-panel="2"]')).toBeVisible();
    await expect(breakdown.locator('[data-annotation-panel="2"]')).toContainText('200%');
    const lab = breakdown.getByRole('link', { name: locale === 'zh' ? '到输入框实验室验证真实交互 →' : 'Try real interactions in the input lab →' });
    await expect(lab).toHaveAttribute('href', `${locale === 'en' ? '/en' : ''}/components/input#playground`);
    expect(await breakdown.locator('.breakdown-figure > img').evaluate((img) => img.complete && img.naturalWidth === 1536)).toBeTruthy();
  });
}

test('annotation controls and explanations fit a narrow viewport without covering the image', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/gallery/input');
  const breakdown = page.locator('[data-gallery-breakdown]');
  await breakdown.getByRole('group').getByRole('button').nth(1).click();
  await expect(breakdown.locator('[data-annotation-panel="1"]')).toBeVisible();
  const metrics = await breakdown.evaluate((root) => {
    const image = root.querySelector('.breakdown-figure > img').getBoundingClientRect();
    return { viewport: innerWidth, width: document.documentElement.scrollWidth, markersOutside: [...root.querySelectorAll('.breakdown-marker')].every((el) => el.getBoundingClientRect().right <= image.left) };
  });
  expect(metrics.width).toBeLessThanOrEqual(metrics.viewport);
  expect(metrics.markersOutside).toBeTruthy();
});
