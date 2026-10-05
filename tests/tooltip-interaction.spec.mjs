import { test, expect } from './helpers/private-browser.mjs';
import { readFileSync } from 'node:fs';
const { tooltip: { styles } } = JSON.parse(readFileSync(new URL('../src/lib/component-style-coverage.json', import.meta.url), 'utf8'));

// 待真实浏览器访问允许后执行；当前只允许收集定义，不代表焦点/触屏/视觉已验收。
async function tooltipPreview(page, style, locale) {
  await page.goto(`${locale === 'en' ? '/en' : ''}/components/tooltip`);
  const lab = page.locator('[data-solution-lab]');
  await lab.locator(`[data-style="${style}"]`).click();
  const preview = lab.locator('.demo-content');
  return { lab, trigger: preview.getByRole('button'), tip: preview.getByRole('tooltip') };
}
// 观察原生焦点滚动与实际元素几何；不修改页面滚动方式或注入焦点目标。
async function observeSettledGeometry(trigger) {
  const observation = await trigger.evaluate(node => new Promise(resolve => {
    const started = performance.now();
    let previous = null, stableSince = started, frame = 0, settled = false;
    const read = () => {
      const rect = node.getBoundingClientRect();
      return { scrollX, scrollY, x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    };
    const initial = read();
    const finish = () => {
      cancelAnimationFrame(frame);
      clearTimeout(deadline);
      resolve({ settled, elapsed: performance.now() - started, initial, final: read() });
    };
    const deadline = setTimeout(finish, 2500);
    const sample = now => {
      const current = read();
      if (!previous || Object.keys(current).some(key => Math.abs(current[key] - previous[key]) > 0.25)) stableSince = now;
      previous = current;
      if (now - stableSince >= 150) { settled = true; finish(); }
      else frame = requestAnimationFrame(sample);
    };
    frame = requestAnimationFrame(sample);
  }));
  expect(observation.settled, JSON.stringify(observation)).toBe(true);
  return observation;
}

for (const style of styles) for (const locale of ['zh', 'en']) {
  test(`${style}/${locale}: 焦点和悬停交错、悬停内容、全局 Esc 与重挂载`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    const { lab, trigger, tip } = await tooltipPreview(page, style, locale);
    await trigger.focus(); await trigger.hover(); await page.mouse.move(0, 0);
    await expect(trigger).toBeFocused(); await expect(tip).toBeVisible();
    await trigger.press('Tab'); await expect(tip).toHaveCount(0);
    await trigger.hover(); await trigger.focus(); await trigger.press('Tab');
    await expect(trigger).not.toBeFocused(); await expect(tip).toBeVisible();
    // Tab 可能仍在原生平滑滚动；观察停止后，再用真实悬停恢复指针与控件的关系。
    const afterTab = await observeSettledGeometry(trigger);
    await trigger.hover(); await expect(tip).toBeVisible();
    const afterHover = await observeSettledGeometry(trigger);
    await test.info().attach('native-scroll-geometry.json', { body: JSON.stringify({ afterTab, afterHover }), contentType: 'application/json' });
    await expect(trigger).not.toBeFocused();
    await expect(tip).toBeInViewport({ ratio: 1 });
    await tip.hover(); await expect(tip).toBeVisible();
    await page.keyboard.press('Escape'); await expect(tip).toHaveCount(0);
    await page.mouse.move(0, 0); await trigger.hover(); await expect(tip).toBeVisible();
    await trigger.focus(); await page.keyboard.press('Escape'); await expect(tip).toHaveCount(0);
    await page.mouse.move(0, 0); await trigger.hover(); await expect(tip).toHaveCount(0);
    await page.mouse.move(0, 0); await trigger.press('Tab'); await trigger.focus(); await expect(tip).toBeVisible();
    await lab.locator(`[data-style="${styles[(styles.indexOf(style) + 1) % styles.length]}"]`).click();
    await expect(tip).toHaveCount(0);
  });
}
test.describe('触屏事件顺序', () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });
  for (const style of styles) for (const locale of ['zh', 'en']) {
    test(`${style}/${locale}: 首次点按打开、二次关闭、外部点按关闭`, async ({ page }) => {
      const { lab, trigger, tip } = await tooltipPreview(page, style, locale);
      await trigger.tap(); await expect(tip).toBeVisible();
      await trigger.tap(); await expect(tip).toHaveCount(0);
      await trigger.tap(); await expect(tip).toBeVisible();
      await lab.locator('.demo-viewport').tap({ position: { x: 2, y: 2 } });
      await expect(tip).toHaveCount(0);
      await trigger.tap(); await expect(tip).toBeVisible();
    });
  }
});
