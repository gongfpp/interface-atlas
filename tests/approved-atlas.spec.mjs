import { chooseAtlasVariant } from './helpers/atlas-controls.mjs';
import { test, expect } from './helpers/private-browser.mjs';
import { STYLE_SLUGS as slugs } from './helpers/style-page-flows.mjs';
for (const locale of ['zh', 'en']) for (const width of [1440, 390, 320]) for (const slug of slugs) {
  test(`审批版 ${slug} ${locale} ${width}：导航、输入、弹层与回退`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const prefix = locale === 'en' ? '/en' : '';
    await page.goto(`${prefix}/styles/${slug}/`);
    await expect(page.locator('.atlas-approved')).toHaveAttribute('data-ready', 'true');
    await page.evaluate(() => document.fonts.ready);
    for (const [selector, path] of [['.atlas-home', prefix || '/'], ['.atlas-return', `${prefix}/styles`]]) {
      const link = page.locator(selector);
      await expect(link).toHaveAttribute('href', path);
      await expect(link).toBeInViewport();
      const box = await link.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    await expect.poll(() => page.locator('.approved-composition img').evaluateAll(images => images.every(i => i.complete && i.naturalWidth > 0))).toBe(true);
    await testInfo.attach(`${slug}-${locale}-${width}.png`, { body: await page.screenshot({ fullPage: true, animations: 'disabled' }), contentType: 'image/png' });
    await page.locator('[data-specimen-input]').fill('A live specimen');
    await expect(page.locator('[data-specimen-preview]')).toHaveText('A live specimen');
    // Custom materials must retain native keyboard interaction and visible feedback.
    const check = page.locator('[data-demo-check]');
    await check.focus();
    await page.keyboard.press('Space');
    await expect(check).toBeChecked();
    await page.locator('.approved-check').filter({ has: check }).click();
    await expect(check).not.toBeChecked();
    const range = page.locator('[data-art-range]');
    if (await range.count()) {
      await range.focus();
      await page.keyboard.press('Home');
      await page.keyboard.press('ArrowRight');
      await expect(range).toHaveValue('1');
      await expect(page.locator('[data-range-output]')).toHaveText(slug === 'neumorphism' ? '4°' : '1');
    }
    await expect(page.locator('.approved-buttons button:disabled')).toBeDisabled();
    const opener = page.locator('[data-approved-guide]');
    await opener.click();
    await expect(page.locator('[data-guide]')).toBeVisible();
    await page.goBack();
    await expect(page.locator('[data-guide]')).not.toBeVisible();
    await expect(opener).toBeFocused();
    await page.goForward();
    await expect(page.locator('[data-guide]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-guide]')).not.toBeVisible();
    await chooseAtlasVariant(page, 1);
    await expect(page.locator('.atlas-approved')).toHaveAttribute('data-variant', '1');
    await page.locator('[data-prompt-output]').fill('My own prompt');
    await chooseAtlasVariant(page, 0);
    await expect(page.locator('[data-prompt-output]')).toHaveValue('My own prompt');
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await expect(page.locator('.atlas-home')).toBeInViewport();
    await expect(page.locator('.atlas-return')).toBeInViewport();
    await page.locator('.atlas-return').click();
    await expect(page).toHaveURL(new RegExp(`${prefix}/styles/?$`));
    expect(errors).toEqual([]);
  });
}
test('拟物电源、贴纸与两批页面的范围边界', async ({ page }) => {
  await page.goto('/styles/skeuomorphism/');
  await page.locator('[data-instrument-power]').uncheck();
  await expect(page.locator('.atlas-approved')).toHaveAttribute('data-powered', 'false');
  await page.goto('/styles/neobrutalism/');
  await page.locator('[data-sticker]').click();
  await expect(page.locator('[data-stickers]')).toHaveText('★');
  await expect(page.locator('.atlas-extended')).toHaveCount(0);
  await page.goto('/styles/flat-design/');
  await expect(page.locator('.atlas-extended')).toHaveCount(1);
  await expect(page.locator('.approved-composition')).toBeVisible();
});
