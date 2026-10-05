import { test, expect } from './helpers/private-browser.mjs';
import { readFileSync } from 'node:fs';
const { tooltip: { styles } } = JSON.parse(readFileSync(new URL('../src/lib/component-style-coverage.json', import.meta.url), 'utf8'));

// 以实际浏览器执行结果为准；仅收集定义不代表焦点、触屏或视觉已验收。
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
    await expect(trigger).not.toBeFocused();
    // Tab 的原生滚动可能已让控件离开静止指针；先观察停止，再恢复真实悬停的前提。
    const afterTab = await observeSettledGeometry(trigger);
    await trigger.hover(); await expect(tip).toBeVisible();
    const afterHover = await observeSettledGeometry(trigger);
    await test.info().attach('native-scroll-geometry.json', { body: JSON.stringify({ afterTab, afterHover }), contentType: 'application/json' });
    await expect(trigger).not.toBeFocused();
    await expect.poll(() => trigger.evaluate(node => node.matches(':hover'))).toBe(true);
    await expect(tip).toBeVisible();
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
// 将真实页面滚到明确边缘位置，保留页面原来的平滑滚动设置与原生焦点行为。
async function placeTriggerAtEdge(trigger, edge) {
  await trigger.evaluate((node, edge) => {
    const rect = node.getBoundingClientRect();
    const delta = edge === 'bottom' ? rect.bottom - innerHeight + 8 : rect.top - 8;
    window.scrollTo({ top: scrollY + delta, behavior: 'instant' });
  }, edge);
  return observeSettledGeometry(trigger);
}
async function expectTooltipOnTopLayer(tip) {
  await expect(tip).toBeInViewport({ ratio: 1 });
  await expect.poll(() => tip.evaluate(node => {
    const rect = node.getBoundingClientRect();
    return node.contains(document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2));
  })).toBe(true);
}

for (const style of styles) for (const locale of ['zh', 'en']) {
  test(`${style}/${locale}: 视口底边悬停向上、连续移入、聚焦滚动与窄屏 resize`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const { trigger, tip } = await tooltipPreview(page, style, locale);
    await page.mouse.move(0, 0);
    const edge = await placeTriggerAtEdge(trigger, 'bottom');
    // 中文行高可产生半像素边界，而 scrollY 按 CSS 像素取整；只容许设置位置的 1px 舍入误差。
    expect(Math.abs(edge.final.y + edge.final.height - 792)).toBeLessThanOrEqual(1);
    const heightBefore = await page.evaluate(() => document.documentElement.scrollHeight);
    await trigger.hover();
    await expectTooltipOnTopLayer(tip);
    await expect(tip.locator('..')).toHaveAttribute('data-tooltip-placement', 'top');
    expect((await trigger.boundingBox()).y).toBeCloseTo(edge.final.y, 1);
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(heightBefore);
    const buttonBox = await trigger.boundingBox(), bubbleBox = await tip.boundingBox();
    // 在透明间隔中暂停，再慢速移入气泡，验证 hover 区域连续。
    await page.mouse.move(buttonBox.x + buttonBox.width / 2, (buttonBox.y + bubbleBox.y + bubbleBox.height) / 2, { steps: 5 });
    await expect(tip).toBeVisible();
    await tip.hover(); await expect(tip).toBeVisible();
    await page.keyboard.press('Escape'); await expect(tip).toHaveCount(0);
    await page.mouse.move(0, 0);
    await trigger.evaluate(node => node.focus({ preventScroll: true }));
    await expect(trigger).toBeFocused(); await expectTooltipOnTopLayer(tip);
    await placeTriggerAtEdge(trigger, 'top');
    await expect(tip.locator('..')).toHaveAttribute('data-tooltip-placement', 'bottom');
    await expectTooltipOnTopLayer(tip);
    await page.setViewportSize({ width: 320, height: 600 });
    await placeTriggerAtEdge(trigger, 'bottom');
    await expectTooltipOnTopLayer(tip);
    await expect(trigger).toBeFocused();
    await page.keyboard.press('Escape'); await expect(tip).toHaveCount(0);
    await trigger.press('Tab'); await expect(tip).toHaveCount(0);
  });
}

for (const locale of ['zh', 'en']) test(`basic/${locale}: 基础提示保留聚焦契约并在底边翻转、窄屏换行`, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${locale === 'en' ? '/en' : ''}/components/tooltip`);
  const preview = page.locator('[data-solution-lab] .demo-content');
  const trigger = preview.getByRole('button', { name: /Acme Design System/ });
  const tip = preview.getByRole('tooltip');
  await placeTriggerAtEdge(trigger, 'bottom');
  await trigger.evaluate(node => node.focus({ preventScroll: true }));
  await expect(trigger).toBeFocused(); await expect(tip).toBeInViewport({ ratio: 1 });
  await expect(tip.locator('..')).toHaveAttribute('data-tooltip-placement', 'top');
  await page.setViewportSize({ width: 320, height: 600 });
  await placeTriggerAtEdge(trigger, 'bottom');
  await expect(tip).toBeInViewport({ ratio: 1 });
  await trigger.press('Tab'); await expect(tip).toHaveCount(0);
});

test('视口外的聚焦触发器暂停浮层，滚回后恢复；resize 不制造透明覆盖区', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  const { lab, trigger, tip } = await tooltipPreview(page, 'neobrutalism', 'en');
  await placeTriggerAtEdge(trigger, 'bottom');
  await trigger.evaluate(node => node.focus({ preventScroll: true }));
  await expectTooltipOnTopLayer(tip);
  const layer = lab.locator('[data-tooltip-layer]');
  await page.setViewportSize({ width: 1280, height: 600 });
  await expect(layer).toHaveAttribute('data-tooltip-suspended', 'true');
  await expect(layer).toBeHidden(); await expect(trigger).toBeFocused();
  await placeTriggerAtEdge(trigger, 'bottom');
  await expect(layer).toHaveAttribute('data-tooltip-suspended', 'false');
  await expectTooltipOnTopLayer(tip); await expect(trigger).toBeFocused();
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await expect(layer).toBeHidden(); await expect(trigger).toBeFocused();
  await placeTriggerAtEdge(trigger, 'top');
  await expectTooltipOnTopLayer(tip); await expect(trigger).toBeFocused();
  await page.keyboard.press('Escape'); await expect(tip).toHaveCount(0);
});

async function tooltipLayoutSnapshot(page) {
  return page.evaluate(() => {
    const layer = document.querySelector('[data-solution-lab] [data-tooltip-layer]');
    const rect = layer?.getBoundingClientRect(), style = layer && getComputedStyle(layer);
    return { viewportWidth: innerWidth, viewportHeight: innerHeight, documentWidth: document.documentElement.scrollWidth, bodyWidth: document.body.scrollWidth, scrollX, scrollY,
      layer: layer && { display: style.display, inlineDisplay: layer.style.display, visibility: style.visibility, position: style.position, width: style.width, maxWidth: style.maxWidth, suspended: layer.dataset.tooltipSuspended, popoverOpen: layer.matches(':popover-open'), rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height } },
    };
  });
}
for (const locale of ['zh', 'en']) test(`${locale}/390px: 初次离屏聚焦不产生横向溢出，原生滚动恢复浮层`, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const { lab, trigger, tip } = await tooltipPreview(page, 'retro-futurism', locale);
  await page.mouse.move(0, 0);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  const initial = await observeSettledGeometry(trigger);
  expect(initial.final.y).toBeGreaterThanOrEqual(844);
  const beforeFocus = await tooltipLayoutSnapshot(page);
  expect(beforeFocus.layer).toBeNull();
  await trigger.evaluate(node => node.focus({ preventScroll: true }));
  const immediate = await tooltipLayoutSnapshot(page);
  const layer = lab.locator('[data-tooltip-layer]');
  await expect(layer).toHaveAttribute('data-tooltip-suspended', 'true');
  await observeSettledGeometry(trigger);
  const settled = await tooltipLayoutSnapshot(page);
  await test.info().attach('offscreen-focus-width.json', { body: JSON.stringify({ beforeFocus, immediate, settled }), contentType: 'application/json' });
  for (const snapshot of [beforeFocus, immediate, settled]) expect(snapshot.documentWidth, JSON.stringify(snapshot)).toBeLessThanOrEqual(snapshot.viewportWidth);
  await expect(layer).toHaveCSS('display', 'none'); await expect(trigger).toBeFocused();
  expect(settled.layer.popoverOpen).toBe(true);
  await placeTriggerAtEdge(trigger, 'bottom');
  const resumed = await tooltipLayoutSnapshot(page);
  await test.info().attach('resumed-tooltip-width.json', { body: JSON.stringify(resumed), contentType: 'application/json' });
  await expect(layer).toHaveAttribute('data-tooltip-suspended', 'false');
  await expect(layer).not.toHaveCSS('display', 'none');
  expect(resumed.layer.popoverOpen).toBe(true);
  expect(resumed.documentWidth).toBeLessThanOrEqual(resumed.viewportWidth);
  await expectTooltipOnTopLayer(tip); await expect(trigger).toBeFocused();
  await page.keyboard.press('Escape'); await expect(tip).toHaveCount(0);
});

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
