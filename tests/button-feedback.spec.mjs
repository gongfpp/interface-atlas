import { test, expect } from './helpers/private-browser.mjs';

const copy = {
  zh: { path: '/components/button', cancel: '取消', save: '保存更改', idle: '不会提交或保存真实数据', pending: '正在模拟保存', success: '保存模拟已完成', cancelled: '本次演示已取消', reset: '↺ 重置', variants: '形式', primary: '主要', tried: '已试用「主要」' },
  en: { path: '/en/components/button', cancel: 'Cancel', save: 'Save changes', idle: 'No real data is submitted or saved', pending: 'Simulating a save', success: 'Save simulation complete', cancelled: 'Demo cancelled', reset: '↺ Reset', variants: 'Variants', primary: 'Primary', tried: 'Primary button tried' },
};

for (const [locale, width] of [['zh', 390], ['zh', 1280], ['en', 390], ['en', 1280]]) {
  const text = copy[locale];
  for (const style of ['minimalism', 'neobrutalism', 'glassmorphism', 'swiss-style', 'cyberpunk', 'neumorphism', 'flat-design', 'pixel-art']) {
    test(`${locale} ${width}px ${style}：键盘、取消、重试、换风格与重置都有真实反馈`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
      await page.goto(text.path);
      // 固定演示计时，避免滚动与点击等待消耗 900ms 后误把已完成视为取消失败。
      await page.clock.pauseAt(new Date('2026-01-01T01:00:00Z'));
      const lab = page.locator('[data-solution-lab]');
      await lab.locator(`[data-style="${style}"]`).click();
      const canvas = lab.locator('.demo-content');
      const primary = canvas.getByRole('button').first();
      const status = canvas.getByRole('status');
      await expect(status).toContainText(text.idle);
      if (style === 'glassmorphism') {
        const colors = await canvas.locator('button, p').evaluateAll(nodes => nodes.map(node => getComputedStyle(node).color));
        expect(colors.length).toBeGreaterThan(0);
        expect(colors.every(color => color === 'rgb(8, 5, 17)')).toBe(true);
      }
      // 时钟暂停时，先把操作区稳定在真实视口内，避免 WebKit 焦点平滑滚动与指针坐标竞争。
      // 真实时钟和浏览器自动滚动另由下面的原生点击用例覆盖。
      await canvas.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await primary.focus();
      await page.keyboard.press('Space');
      await expect(primary).toBeDisabled();
      await expect(primary).toHaveAttribute('aria-busy', 'true');
      await expect(status).toContainText(text.pending);
      await canvas.getByRole('button', { name: text.cancel, exact: true }).click();
      await expect(status).toContainText(text.cancelled);
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
      await canvas.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await primary.click();
      await expect(primary).toBeDisabled();
      await expect(status).toContainText(text.pending);
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

  test(`${locale} ${width}px 基础按钮：取消后不会晚报保存成功，重试保持按钮宽度`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
    await page.goto(text.path);
    // 固定演示计时，避免滚动与点击等待消耗 900ms 后误把已完成视为取消失败。
    await page.clock.pauseAt(new Date('2026-01-01T01:00:00Z'));
    const canvas = page.locator('.demo-content');
    const save = canvas.getByRole('button', { name: text.save, exact: true });
    await canvas.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    const before = await save.boundingBox();
    await save.press('Enter');
    await expect(save).toBeDisabled();
    const during = await save.boundingBox();
    expect(Math.abs(before.width - during.width)).toBeLessThanOrEqual(1);
    await canvas.getByRole('button', { name: text.cancel, exact: true }).click();
    await expect(canvas.getByRole('status')).toContainText(text.cancelled);
    await page.clock.fastForward(1200);
    await expect(canvas.getByRole('status')).toContainText(text.cancelled);
    await save.click();
    await page.clock.fastForward(900);
    await expect(canvas.getByRole('status')).toContainText(text.success);
    if (locale === 'en') expect(await canvas.innerText()).not.toMatch(/[\u4e00-\u9fff]/);
  });

  test(`${locale} ${width}px 状态样板：可操作按钮有反馈，禁用和加载态不可触发`, async ({ page }) => {
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

for (const style of ['neobrutalism', 'flat-design']) {
  test(`en 390px ${style}：真实时钟原生取消不被延迟成功覆盖`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto(copy.en.path);
    const lab = page.locator('[data-solution-lab]');
    await lab.locator(`[data-style="${style}"]`).click();
    const canvas = lab.locator('.demo-content');
    const status = canvas.getByRole('status');
    await expect(status).toContainText(copy.en.idle);
    // 保留原生时钟、正常平滑滚动及 Playwright 的真实指针操作，不瞬移、不强制派发事件。
    await page.evaluate(() => {
      window.__buttonInputEvidence = [];
      for (const type of ['pointerdown', 'pointerup', 'click']) document.addEventListener(type, event => {
        const button = event.target.closest?.('.demo-content button');
        if (button) window.__buttonInputEvidence.push({ type, target: button.textContent, time: Date.now(), x: event.clientX, y: event.clientY, scrollY });
      }, true);
    });
    try {
      await canvas.getByRole('button').first().click();
      await expect(status).toContainText(copy.en.pending);
      await canvas.getByRole('button', { name: copy.en.cancel, exact: true }).click();
      await expect(status).toContainText(copy.en.cancelled);
      // 控制器的真实延迟是 900ms；等待超过该边界验证旧回调不能覆盖取消结果。
      await page.waitForTimeout(1100);
      await expect(status).toContainText(copy.en.cancelled);
      await expect(canvas.getByRole('button').first()).toBeEnabled();
    } finally {
      await testInfo.attach('native-button-input.json', {
        body: JSON.stringify(await page.evaluate(() => ({ events: window.__buttonInputEvidence, status: document.querySelector('.demo-content [role="status"]')?.textContent, scrollY })), null, 2),
        contentType: 'application/json',
      });
    }
  });
}
