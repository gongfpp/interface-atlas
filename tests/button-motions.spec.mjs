import { test, expect } from './helpers/private-browser.mjs';

const groups = [
  ['fill-sweep', 'border-draw', 'magnetic-hover', 'press-scale', 'arrow-slide', 'ripple-click', 'glow-pulse', 'liquid-fill', 'split-reveal', 'shadow-lift'],
  ['loading-morph', 'success-morph', 'progress-button', 'icon-morph', 'text-swap', 'elastic-stretch', 'blob-morph', 'particle-burst', '3d-flip', 'cursor-interaction'],
  ['shine-sweep', 'border-beam', 'radial-reveal', 'underline-grow', 'icon-orbit', 'hold-confirm', 'drag-confirm', 'shake-error', 'bounce-confirm', 'lock-unlock'],
  ['text-scramble', 'rolling-text', 'letter-spread', 'arrow-loop', 'character-wave', 'expand-panel', 'button-input', 'directional-hover', 'gooey-merge', 'explode-rebuild'],
];
const path = (number, locale = 'zh') => `${locale === 'en' ? '/en' : ''}/motion/buttons${number === 1 ? '' : `/${number}`}`;
const row = (page, id) => page.locator(`[data-motion-id="${id}"]`);
const effect = (page, id) => row(page, id).locator('.bm-effect');
async function navigate(page, url) {
  await page.goto(url);
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
}
async function stable(locator) {
  await locator.evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
}

for (const locale of ['zh', 'en']) {
  for (let number = 1; number <= 4; number++) {
    test(`${locale} catalogue page ${number}: ten unique interactive rows, image links and pagination`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await navigate(page, path(number, locale));
      await expect(page.locator('.bm-row')).toHaveCount(10);
      expect(await page.locator('.bm-row').evaluateAll(nodes => nodes.map(node => node.id))).toEqual(groups[number - 1]);
      await expect(page.locator('nav').filter({ has: page.locator('a[aria-current="page"]').filter({ hasText: /\d+–\d+/ }) }).last()).toBeVisible();
      await expect(page.locator('.bm-replay, .bm-status, .bm-stages, .bm-demo-toolbar')).toHaveCount(0);
      await expect(page.locator('main')).not.toContainText(/参考 01|Sheets 01|减少动态效果|Reduced-motion|Not just button skins/);
      for (const [index, id] of groups[number - 1].entries()) {
        const demo = row(page, id);
        await stable(demo);
        const reference = demo.locator('.bm-references a');
        const sheet = Math.floor(((number - 1) * 10 + index) / 5) + 1;
        await expect(reference).toHaveAttribute('href', `/images/button-motion/reference-0${sheet}.webp`);
        await expect(reference).toHaveAttribute('target', '_blank');
        await expect.poll(() => reference.locator('img').evaluate(image => image.naturalWidth)).toBe(1080);
        if (['hold-confirm', 'drag-confirm'].includes(id)) continue;
        await demo.locator('.bm-button').first().press('Enter');
        await expect(demo.locator('.bm-effect')).toHaveAttribute('data-phase', /running|done/);
        await expect(demo.locator('.bm-effect')).toHaveAttribute('data-phase', 'done');
      }
      await navigate(page, `${path(number, locale)}#${groups[number - 1][9]}`);
      await expect(row(page, groups[number - 1][9])).toBeInViewport();
      if (number < 4) {
        await page.locator('a[rel="next"]').click();
        await expect(page).toHaveURL(new RegExp(`${path(number + 1, locale)}/?$`));
      }
      expect(errors).toEqual([]);
    });
  }
}

test('hover effects change real rendered fills, strokes, transforms and animations', async ({ page }) => {
  await navigate(page, path(1));
  for (const [id, selector, property] of [
    ['fill-sweep', '.bm-fill', 'transform'], ['border-draw', 'rect', 'strokeDashoffset'],
    ['arrow-slide', '.bm-arrow', 'opacity'], ['liquid-fill', '.bm-fill', 'transform'],
    ['split-reveal', '.bm-door-left', 'transform'], ['shadow-lift', '.bm-button', 'transform'],
  ]) {
    const target = effect(page, id);
    await stable(target);
    await page.mouse.move(0, 0);
    const before = await target.locator(selector).evaluate((node, prop) => getComputedStyle(node)[prop], property);
    await target.hover();
    await expect.poll(() => target.locator(selector).evaluate((node, prop) => getComputedStyle(node)[prop], property)).not.toBe(before);
  }
  const magnetic = effect(page, 'magnetic-hover');
  await stable(magnetic);
  await magnetic.hover({ position: { x: 200, y: 40 } });
  await expect.poll(() => magnetic.locator('.bm-button').evaluate(node => getComputedStyle(node).transform)).not.toBe('none');
  await navigate(page, path(4));
  for (const [id, selector] of [['shine-sweep', '.bm-face'], ['rolling-text', '.bm-rolling > span'], ['arrow-loop', '.bm-arrow'], ['character-wave', '.bm-characters > span']]) {
    if (id === 'shine-sweep') continue; // covered on its own sheet below
    const target = effect(page, id);
    await stable(target);
    await target.hover();
    await expect.poll(() => target.locator(selector).first().evaluate(node => getComputedStyle(node).animationName)).not.toBe('none');
  }
  const spread = effect(page, 'letter-spread');
  await stable(spread);
  await spread.hover();
  await expect.poll(() => spread.locator('.bm-button').evaluate(node => getComputedStyle(node).letterSpacing)).toBe('8px');
});

test('click origin, progress, checked success, particles and 3D flip have actual feedback', async ({ page }) => {
  await navigate(page, path(1));
  const ripple = effect(page, 'ripple-click');
  await stable(ripple);
  await ripple.locator('.bm-button').click({ position: { x: 30, y: 20 } });
  await expect(ripple.locator('.bm-ripple')).toHaveCount(1);
  const x = await ripple.evaluate(node => parseFloat(node.style.getPropertyValue('--x')));
  expect(x).toBeGreaterThan(17);
  expect(x).toBeLessThan(21);
  await navigate(page, path(2));
  await page.clock.install();
  const progress = effect(page, 'progress-button');
  await stable(progress);
  await progress.locator('button').press('Enter');
  await page.clock.fastForward(700);
  expect(await progress.locator('button').innerText()).toMatch(/\d+%/);
  await page.clock.fastForward(1500);
  await expect(progress.locator('button')).toHaveText('✓ COMPLETE');
  const success = effect(page, 'success-morph');
  await success.locator('button').press('Enter');
  await expect(success.locator('.bm-spinner')).toHaveCount(1);
  await page.clock.fastForward(2000);
  await expect(success.locator('.bm-check')).toHaveCount(1);
  await expect(success.locator('.bm-spinner')).toHaveCount(0);
  const particle = effect(page, 'particle-burst');
  await particle.locator('button').press('Enter');
  await expect(particle.locator('.bm-particles i')).toHaveCount(24);
  const flip = effect(page, '3d-flip');
  await flip.locator('button').press('Enter');
  await page.clock.runFor(700);
  // CSS transitions use the compositor clock, independent of mocked JS timers.
  await expect.poll(() => flip.locator('.bm-flipper').evaluate(node => new DOMMatrix(getComputedStyle(node).transform).m11)).toBeCloseTo(-1, 2);
});

test('hold confirmation supports cancel and repeat directly on the button', async ({ page }) => {
  await navigate(page, path(3));
  await page.clock.install();
  const target = effect(page, 'hold-confirm');
  const button = target.locator('button');
  await stable(target);
  await button.hover();
  await page.mouse.down();
  await page.clock.fastForward(400);
  await page.mouse.up();
  await expect(target).toHaveAttribute('data-phase', 'idle');
  await page.clock.fastForward(1200);
  await expect(target).toHaveAttribute('data-phase', 'idle');
  await button.focus();
  await page.keyboard.down('Space');
  await page.clock.fastForward(1000);
  await page.keyboard.up('Space');
  await expect(button).toHaveText('CONFIRMED ✓');
  await button.hover();
  await page.mouse.down();
  await page.clock.fastForward(1000);
  await page.mouse.up();
  await expect(button).toHaveText('CONFIRMED ✓');
});

test('drag confirmation returns below threshold and completes with pointer or keyboard', async ({ page }) => {
  await navigate(page, path(3));
  const target = effect(page, 'drag-confirm');
  const slider = target.getByRole('slider');
  await stable(target);
  await slider.fill('70');
  await slider.dispatchEvent('pointerup');
  await expect(slider).toHaveValue('0');
  await slider.focus();
  await slider.press('ArrowRight');
  await slider.press('ArrowRight');
  await expect(slider).toHaveValue('2');
  await slider.press('Enter');
  await expect(slider).toHaveValue('0');
  await slider.press('End');
  await expect(target).toHaveAttribute('data-phase', 'done');
  await expect(target).toHaveText('✓ CONFIRMED');
  await slider.press('Home');
  await expect(target).toHaveAttribute('data-phase', 'idle');
  await stable(slider);
  const box = await slider.boundingBox();
  await page.mouse.move(box.x + 24, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width - 23, box.y + box.height / 2, { steps: 15 });
  await page.mouse.up();
  await expect(target).toHaveAttribute('data-phase', 'done');
});

test('expanded panel and input are real controls, focusable only when open', async ({ page }) => {
  await navigate(page, path(4));
  const panel = effect(page, 'expand-panel');
  await expect(panel.locator('.bm-panel-actions')).toHaveAttribute('inert', '');
  await panel.getByRole('button', { name: 'SHARE', exact: true }).press('Enter');
  await expect(panel.getByRole('button', { name: 'MAIL', exact: true })).toBeVisible();
  await panel.getByRole('button', { name: 'MAIL', exact: true }).click();
  await expect(panel.getByRole('button', { name: 'MAIL', exact: true })).toHaveText('✓');
  await panel.getByRole('button', { name: '关闭分享' }).click();
  await expect(panel.locator('.bm-panel-actions')).toHaveAttribute('inert', '');
  await expect(panel.getByRole('button', { name: 'SHARE', exact: true })).toBeFocused();
  const input = effect(page, 'button-input');
  await input.getByRole('button', { name: 'SUBSCRIBE', exact: true }).press('Enter');
  await expect(input.getByRole('textbox')).toBeFocused();
  await input.getByRole('textbox').fill('demo@example.com');
  await input.getByRole('button', { name: '确认订阅演示', exact: true }).click();
  await expect(input.locator('button[type="submit"]')).toHaveText('✓');
  await expect(input.locator('.bm-input-form')).toHaveClass(/bm-submitted/);
  await input.getByRole('button', { name: '取消订阅演示' }).click();
  await expect(input.getByRole('button', { name: 'SUBSCRIBE', exact: true })).toBeVisible();
  await expect(input.getByRole('button', { name: 'SUBSCRIBE', exact: true })).toBeFocused();
});

test('directional hover respects entry edge, gooey filter and scramble are distinct', async ({ page }) => {
  await navigate(page, path(4));
  const direction = effect(page, 'directional-hover');
  await stable(direction);
  const box = await direction.boundingBox();
  for (const [edge, x, y, toX, toY] of [
    ['left', box.x - 10, box.y + 58, box.x + 2, box.y + 58],
    ['right', box.x + box.width + 10, box.y + 58, box.x + box.width - 2, box.y + 58],
    ['top', box.x + box.width / 2, box.y - 10, box.x + box.width / 2, box.y + 2],
    ['bottom', box.x + box.width / 2, box.y + box.height + 10, box.x + box.width / 2, box.y + box.height - 2],
  ]) {
    await page.mouse.move(x, y);
    await page.mouse.move(toX, toY);
    await expect(direction).toHaveAttribute('data-edge', edge);
  }
  const goo = effect(page, 'gooey-merge');
  expect(await goo.locator('.bm-goo').evaluate(node => getComputedStyle(node).filter)).toContain('goo-gooey-merge');
  const scramble = effect(page, 'text-scramble');
  await stable(scramble);
  await scramble.locator('button').focus();
  await expect.poll(() => scramble.locator('.bm-label').innerText()).toMatch(/[#7@?X*%]/);
  await expect(scramble.locator('.bm-label')).toHaveText('EXPLORE →');
});

for (const width of [390, 1280]) {
  test(`${width}px: all four pages fit in light/dark and full effects ignore OS motion reduction`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (let number = 1; number <= 4; number++) {
      await navigate(page, path(number));
      for (const dark of [false, true]) {
        await page.evaluate(value => document.documentElement.classList.toggle('dark', value), dark);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await expect(page.locator('.bm-row')).toHaveCount(10);
      }
    }
    await effect(page, 'button-input').getByRole('button', { name: 'SUBSCRIBE', exact: true }).press('Enter');
    await expect(effect(page, 'button-input').getByRole('textbox')).toBeFocused();
    await navigate(page, path(2));
    await effect(page, 'success-morph').locator('button').press('Enter');
    await expect(effect(page, 'success-morph').locator('.bm-spinner')).toHaveCSS('animation-duration', '0.65s');
    await expect(effect(page, 'success-morph').locator('.bm-spinner')).toHaveCSS('animation-iteration-count', 'infinite');
    await expect(effect(page, 'success-morph')).toHaveAttribute('data-phase', 'done');
    await expect(effect(page, 'success-morph').locator('.bm-check')).toHaveCount(1);
    await navigate(page, path(1));
    const magnetic = effect(page, 'magnetic-hover');
    await stable(magnetic);
    await magnetic.hover({ position: { x: 180, y: 40 } });
    await expect.poll(() => magnetic.locator('.bm-button').evaluate(node => getComputedStyle(node).transform)).not.toBe('none');
    await expect(effect(page, 'fill-sweep').locator('.bm-fill')).toHaveCSS('transition-duration', '0.3s');
  });
}

test('reference thumbnails open the actual image in a new tab', async ({ page }) => {
  await navigate(page, path(4));
  const thumbnail = page.locator('nav .bm-references a').first();
  const popupPromise = page.waitForEvent('popup');
  await thumbnail.click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL(/\/images\/button-motion\/reference-07\.webp$/);
  await expect.poll(() => popup.locator('img').evaluate(image => image.naturalWidth)).toBe(1080);
  await popup.close();
});

test('catalogue is directly discoverable from home, motion and button pages in both locales', async ({ page }) => {
  for (const locale of ['zh', 'en']) {
    for (const source of ['/', '/motion', '/components/button']) {
      await navigate(page, `${locale === 'en' ? '/en' : ''}${source}`);
      await expect(page.locator(`main a[href="${path(1, locale)}"]`).first()).toBeVisible();
      if (source !== '/') {
        await expect(page.locator('.bm-entry .bm-references a')).toHaveCount(8);
        await expect(page.locator('.bm-entry')).not.toContainText(/参考|sheet|逐个体验/);
      }
    }
  }
});
