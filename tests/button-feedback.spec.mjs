import { test, expect } from '@playwright/test';

const copy = {
  zh: { path: '/components/button', cancel: '取消', save: '保存更改', idle: '不会提交或保存真实数据', pending: '正在模拟保存', success: '保存模拟已完成', cancelled: '本次演示已取消', reset: '↺ 重置', variants: '形式', primary: '主要', tried: '已试用「主要」' },
  en: { path: '/en/components/button', cancel: 'Cancel', save: 'Save changes', idle: 'No real data is submitted or saved', pending: 'Simulating a save', success: 'Save simulation complete', cancelled: 'Demo cancelled', reset: '↺ Reset', variants: 'Variants', primary: 'Primary', tried: 'Primary button tried' },
};

for (const [locale, width] of [['zh', 390], ['en', 1280]]) {
  const text = copy[locale];
  for (const style of ['minimalism', 'neobrutalism', 'glassmorphism']) {
    test(`${locale} ${style}：键盘、取消、重试、换风格与重置都有真实反馈`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.clock.install();
      await page.goto(text.path);
      const lab = page.locator('[data-solution-lab]');
      await lab.locator(`[data-style="${style}"]`).click();
      const canvas = lab.locator('.demo-content');
      const primary = canvas.getByRole('button').first();
      const status = canvas.getByRole('status');
      await expect(status).toContainText(text.idle);
      await primary.focus();
      await page.keyboard.press('Space');
      await expect(primary).toBeDisabled();
      await expect(primary).toHaveAttribute('aria-busy', 'true');
      await expect(status).toContainText(text.pending);
      await canvas.getByRole('button', { name: text.cancel, exact: true }).click();
      await page.clock.fastForward(1200);
      await expect(status).toContainText(text.cancelled);
      await expect(primary).toBeEnabled();
      await primary.press('Enter');
      await page.clock.fastForward(900);
      await expect(status).toContainText(text.success);
      const other = style === 'minimalism' ? 'neobrutalism' : 'minimalism';
      await lab.locator(`[data-style="${other}"]`).click();
      await expect(status).toContainText(text.success);
      await lab.getByRole('button', { name: text.reset, exact: true }).click();
      await expect(status).toContainText(text.idle);
      await primary.click();
      await lab.locator(`[data-style="${style}"]`).click();
      await page.clock.fastForward(1200);
      await expect(status).toContainText(text.cancelled);
      await expect(primary).toBeEnabled();
      const box = await primary.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      if (locale === 'en') expect(await canvas.innerText()).not.toMatch(/[\u4e00-\u9fff]/);
    });
  }

  test(`${locale} 基础按钮：取消后不会晚报保存成功，重试保持按钮宽度`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.clock.install();
    await page.goto(text.path);
    const canvas = page.locator('.demo-content');
    const save = canvas.getByRole('button', { name: text.save, exact: true });
    const before = await save.boundingBox();
    await save.press('Enter');
    await expect(save).toBeDisabled();
    const during = await save.boundingBox();
    expect(Math.abs(before.width - during.width)).toBeLessThanOrEqual(1);
    await canvas.getByRole('button', { name: text.cancel, exact: true }).click();
    await page.clock.fastForward(1200);
    await expect(canvas.getByRole('status')).toContainText(text.cancelled);
    await save.click();
    await page.clock.fastForward(900);
    await expect(canvas.getByRole('status')).toContainText(text.success);
    if (locale === 'en') expect(await canvas.innerText()).not.toMatch(/[\u4e00-\u9fff]/);
  });

  test(`${locale} 状态样板：可操作按钮有反馈，禁用和加载态不可触发`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(text.path);
    const lab = page.locator('[data-solution-lab]');
    await lab.getByRole('button', { name: text.variants, exact: true }).click();
    const canvas = lab.locator('.demo-content');
    await canvas.getByRole('button', { name: text.primary, exact: true }).press('Enter');
    await expect(canvas.getByRole('status')).toContainText(text.tried);
    await expect(canvas.locator('button:disabled')).toHaveCount(8);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    if (locale === 'en') expect(await canvas.innerText()).not.toMatch(/[\u4e00-\u9fff]/);
  });
}
