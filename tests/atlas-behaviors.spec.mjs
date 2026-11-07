import { test, expect } from './helpers/private-browser.mjs';
import { STYLE_SLUGS } from './helpers/style-page-flows.mjs';
import { chooseAtlasVariant } from './helpers/atlas-controls.mjs';
import { observeSettledGeometry } from './helpers/settled-geometry.mjs';

for (const width of [1440, 390]) for (const slug of STYLE_SLUGS) {
  test(`真实行为 ${slug} ${width}：错误修正、材质菜单、可操作详情`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/styles/${slug}/`);
    const root = page.locator('[data-atlas-root]');
    await expect(root).toHaveAttribute('data-ready', 'true');
    const project = page.locator('[name=project]');
    await project.fill('   ');
    await page.locator('[data-prompt-form] button[type=submit]').click();
    await expect(project).toBeFocused();
    await expect(project).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#atlas-project-error')).toBeVisible();
    await testInfo.attach('field-error.png', { body: await page.locator('.atlas-prompt').screenshot(), contentType: 'image/png' });
    await project.fill('A real project');
    await expect(page.locator('#atlas-project-error')).toBeHidden();
    await page.locator('[data-prompt-form] button[type=submit]').click();
    await expect(page.locator('[data-prompt-output]')).toHaveValue(/A real project/);
    await expect(page.locator('[data-prompt-form]')).toHaveAttribute('data-state', 'success');
    await page.locator('[data-prompt-output]').fill('Keep my edited prompt');

    const trigger = page.locator('[data-variant-trigger]');
    await trigger.click();
    const menu = page.locator('[data-variant-list]');
    await expect(menu).toBeVisible();
    const box = await menu.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThanOrEqual(901);
    await testInfo.attach('open-menu.png', { body: await menu.screenshot(), contentType: 'image/png' });
    await trigger.press('ArrowDown');
    await trigger.press('Enter');
    await expect(page.locator('select[data-variant]')).toHaveValue('1');
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(page.locator('[data-prompt-output]')).toHaveValue('Keep my edited prompt');
    const selectedId = await root.getAttribute('data-variant-id');

    const opener = page.locator('.atlas-example-list [data-example="0"]');
    await opener.click();
    const dialog = page.locator('[data-example-dialog]');
    await expect(dialog).toBeVisible();
    const input = page.locator('[data-preview-input]');
    await input.fill(' ');
    await page.locator('[data-preview-form] button[type=submit]').click();
    await expect(input).toBeFocused();
    await expect(page.locator('#atlas-preview-error')).toBeVisible();
    await input.fill('My specimen');
    await page.locator('[data-preview-form] button[type=submit]').click();
    await expect(page.locator('[data-preview-heading]')).toHaveText('My specimen');
    await expect(page.locator('#atlas-preview-error')).toBeHidden();
    await page.locator('[data-preview-help-toggle]').uncheck();
    await expect(page.locator('[data-preview-help]')).toBeHidden();
    const material = () => page.locator('[data-example-preview]').evaluate(el => {
      const s = getComputedStyle(el);
      return [s.background, s.border, s.boxShadow, el.dataset.previewLayout].join('|');
    });
    const first = await material();
    // Pause synchronously after activation so even the 140ms styles have a real midpoint capture.
    const animated = await page.locator('[data-example-next]').evaluate(button => {
      button.click();
      const preview = document.querySelector('[data-example-preview]');
      for (const a of preview.getAnimations()) { a.pause(); a.currentTime = Number(a.effect.getTiming().duration) / 2; }
      return preview.getAnimations().length;
    });
    await expect(page.locator('[data-example-preview]')).toHaveAttribute('data-preview-variant', '1');
    expect(await material()).not.toBe(first);
    await expect(root).toHaveAttribute('data-variant-id', selectedId);
    // Capture an actual transition midpoint instead of only checking that an animation exists.
    if (!['swiss-style', 'brutalism', 'retro-web', 'bauhaus'].includes(slug)) expect(animated).toBeGreaterThan(0);
    await testInfo.attach('detail-mid-transition.png', { body: await dialog.screenshot({ animations: 'allow' }), contentType: 'image/png' });
    await page.locator('[data-example-preview]').evaluate(el => el.getAnimations().forEach(a => a.finish()));
    await page.locator('[data-example-prev]').click();
    await expect(page.locator('[data-preview-heading]')).toHaveText('My specimen');
    await expect(page.locator('[data-preview-help-toggle]')).not.toBeChecked();
    await page.locator('[data-example-apply]').click();
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
    await expect(page.locator('select[data-variant]')).toHaveValue('0');
    await expect(page.locator('[data-prompt-output]')).toHaveValue('Keep my edited prompt');
    await page.goForward();
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
  });
}

for (const width of [1440, 390]) test(`实际画面 ${width}：扁平重排、玻璃透光、黏土局部受压`, async ({ page }, testInfo) => {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('/styles/flat-design/');
  const scene = page.locator('[data-flat-scene]');
  const before = await scene.boundingBox();
  await page.locator('[data-flat-layout=vertical]').click();
  await expect(scene).toHaveAttribute('viewBox', '0 0 420 600');
  expect((await scene.boundingBox()).height).toBeGreaterThan(before.height);
  expect(await page.locator('.clarity-sign').evaluate(el => getComputedStyle(el).transform)).not.toBe('none');
  await testInfo.attach('flat-vertical.png', { body: await scene.screenshot(), contentType: 'image/png' });
  await page.locator('[data-flat-layout=horizontal]').click();
  await expect(scene).toHaveAttribute('viewBox', '0 0 720 340');

  await page.goto('/styles/glassmorphism/');
  const glass = page.locator('.approved-composition > .atlas-controls');
  const diffusion = () => glass.evaluate(el => [getComputedStyle(el).backdropFilter, getComputedStyle(el).backgroundColor, getComputedStyle(el).boxShadow]);
  const frost = await diffusion();
  await chooseAtlasVariant(page, 1);
  const clear = await diffusion();
  await chooseAtlasVariant(page, 2);
  const tinted = await diffusion();
  expect(parseFloat(clear[0].slice(5))).toBeLessThan(parseFloat(frost[0].slice(5)));
  expect(new Set([frost[1], clear[1], tinted[1]]).size).toBe(3);
  expect(clear[2]).not.toBe(frost[2]);
  await page.locator('[data-glass-clear]').check();
  await expect(glass).toHaveCSS('backdrop-filter', 'blur(0px)');

  await page.goto('/styles/claymorphism/');
  const press = page.locator('[data-squish]');
  await press.scrollIntoViewIfNeeded();
  const piece = page.locator('[data-clay-object]');
  const photo = page.locator('.atlas-photo img');
  const photoBefore = await photo.evaluate(el => ({ transform: getComputedStyle(el).transform, width: el.getBoundingClientRect().width }));
  await press.focus();
  await page.keyboard.down('Space');
  await expect(piece).toHaveAttribute('data-pressed', 'true');
  expect(await piece.evaluate(el => getComputedStyle(el).transform)).not.toBe('none');
  expect(await photo.evaluate(el => ({ transform: getComputedStyle(el).transform, width: el.getBoundingClientRect().width }))).toEqual(photoBefore);
  await testInfo.attach('clay-held.png', { body: await page.locator('.clay-touch-stage').screenshot({ animations: 'allow' }), contentType: 'image/png' });
  await page.keyboard.up('Space');
  await expect(piece).toHaveAttribute('data-pressed', 'false');
  await expect(piece).toHaveCSS('transform', 'none');
});

test('备用页面跳转与返回恢复；减少动态效果时无详情动画', async ({ page }) => {
  await page.addInitScript(() => { delete window.CSSViewTransitionRule; delete window.onpagereveal; });
  await page.goto('/styles/editorial/');
  await expect(page.locator('html')).toHaveAttribute('data-page-motion', 'fallback');
  await page.locator('.atlas-pagination a[rel=next]').click();
  await expect(page).toHaveURL(/glassmorphism/);
  await page.goBack();
  await expect(page).toHaveURL(/editorial/);
  await expect(page.locator('.approved-composition')).toHaveCSS('opacity', '1');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('.approved-buttons [data-current-example]').click();
  await page.locator('[data-example-next]').click();
  expect(await page.locator('[data-example-preview]').evaluate(el => el.getAnimations().length)).toBe(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-example-dialog]')).toBeHidden();
});

test('调节参数进入提示词，手写内容和变体错误草稿保持完整', async ({ page }) => {
  await page.goto('/styles/glassmorphism/');
  const range = page.locator('[data-art-range]');
  await range.focus();
  await range.press('End');
  const prompt = page.locator('[data-prompt-output]');
  await expect(prompt).toHaveValue(/100\/100/);
  await page.locator('[data-glass-clear]').check();
  await expect(prompt).toHaveValue(/查看清晰背景: 开启/);
  await prompt.fill('手写内容，请保留');
  await range.focus(); await range.press('Home');
  await expect(prompt).toHaveValue('手写内容，请保留');
  await page.locator('[data-reset-prompt]').click();
  await expect(prompt).toHaveValue(/0\/100/);
  await page.locator('.approved-buttons [data-current-example]').click();
  await page.locator('[data-preview-input]').fill('   ');
  await page.locator('[data-preview-form] button[type=submit]').click();
  await page.locator('[data-example-next]').click();
  await page.locator('[data-example-prev]').click();
  await expect(page.locator('[data-preview-input]')).toHaveValue('   ');
  await expect(page.locator('[data-preview-input]')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#atlas-preview-error')).toBeVisible();
});

test('像素画布连续绘制，只有一个 Tab 入口，方向键与清空有效', async ({ page }) => {
  await page.goto('/styles/pixel-art/');
  const cells = page.locator('[data-pixel]');
  await cells.first().scrollIntoViewIfNeeded();
  const a = await cells.nth(0).boundingBox(), b = await cells.nth(7).boundingBox();
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 3 });
  await page.mouse.up();
  await expect(page.locator('[data-pixel][aria-pressed=true]')).toHaveCount(8);
  await cells.first().focus(); await page.keyboard.press('ArrowDown');
  await expect(cells.nth(8)).toBeFocused();
  await page.keyboard.press('Space');
  await expect(cells.nth(8)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-pixel][tabindex="0"]')).toHaveCount(1);
  await page.locator('[data-clear-pixels]').click();
  await expect(page.locator('[data-pixel][aria-pressed=true]')).toHaveCount(0);
  expect(await page.evaluate(async () => { await document.fonts.load('24px AtlasPixel', '界面图谱'); return document.fonts.check('24px AtlasPixel', '界面图谱'); })).toBe(true);
});

for (const slug of ['retro-futurism', 'pixel-art']) test(`具象变体 ${slug}：主画面、预览和应用分别保持状态`, async ({ page }) => {
  await page.goto(`/styles/${slug}/`);
  const ids = slug === 'retro-futurism' ? ['atompunk', 'cassette', 'synth'] : ['eight-bit', 'modern-pixel', 'isometric'];
  const art = page.locator('.atlas-variant-hero [data-variant-art]:not([hidden])');
  for (let i = 0; i < ids.length; i++) {
    await chooseAtlasVariant(page, i);
    await expect(art).toHaveCount(1);
    await expect(art).toHaveAttribute('data-variant-art', ids[i]);
  }
  await page.locator('.approved-buttons [data-current-example]').click();
  await expect(page.locator('[data-example-preview] [data-variant-art]:not([hidden])')).toHaveAttribute('data-variant-art', ids[2]);
  await page.locator('[data-example-prev]').click();
  await page.locator('[data-example-prev]').click();
  await expect(art).toHaveAttribute('data-variant-art', ids[2]);
  await page.locator('[data-example-apply]').click();
  await expect(art).toHaveAttribute('data-variant-art', ids[0]);
});

test('菜单不带动页面滚动，快速开合后仍能选择，极光按钮即时反馈', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/styles/aurora/');
  const trigger = page.locator('[data-variant-trigger]');
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const menu = page.locator('[data-variant-list]');
  await expect(menu).toBeVisible();
  await page.setViewportSize({ width: 390, height: 800 });
  await expect(menu).toBeVisible();
  const scroll = await page.evaluate(() => scrollY);
  await trigger.press('End');
  expect(await page.evaluate(() => scrollY)).toBe(scroll);
  await trigger.press('Escape');
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await trigger.press('Home'); await trigger.press('Enter');
  await expect(menu).toBeHidden();
  await expect(page.locator('select[data-variant]')).toHaveValue('0');
  const button = page.locator('.approved-buttons .approved-primary');
  const durations = await button.evaluate(el => getComputedStyle(el).transitionDuration.split(',').map(v => parseFloat(v)));
  expect(Math.max(...durations)).toBeLessThanOrEqual(.16);
});

test('深色变体的提示文字和焦点跟随材质；关闭弹窗后恢复页面滚动', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/styles/claymorphism/');
  const input = page.locator('[name=project]');
  const placeholder = () => input.evaluate(el => getComputedStyle(el, '::placeholder').color);
  const light = await placeholder();
  await chooseAtlasVariant(page, 2);
  expect(await placeholder()).not.toBe(light);
  await input.focus();
  const colors = await input.evaluate(el => { const s = getComputedStyle(el); return [s.color, s.caretColor, s.outlineColor]; });
  expect(colors[1]).toBe(colors[0]);
  expect(colors[2]).toBe(colors[0]);
  await page.locator('.approved-buttons [data-current-example]').click();
  const dialog = page.locator('[data-example-dialog]');
  await expect(dialog).toBeVisible();
  await expect(page.locator('html')).toHaveCSS('overflow-y', 'hidden');
  await expect(dialog).toHaveCSS('overscroll-behavior-y', 'contain');
  // 原生焦点与弹窗入场完成后，再比较滚轮前后的背景位置。
  const before = (await observeSettledGeometry(dialog)).final.scrollY;
  await page.mouse.move(2, 500); await page.mouse.wheel(0, 600);
  expect((await observeSettledGeometry(dialog)).final.scrollY).toBe(before);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.locator('html')).not.toHaveCSS('overflow-y', 'hidden');
});

for (const width of [1440, 390]) test(`滑杆实际样本 ${width}：留白、字体、间距、图案和角度`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  for (const [slug, target, property] of [
    ['minimalism', '.atlas-controls', 'padding-top'],
    ['swiss-style', '.approved-type-sample', 'font-size'],
    ['editorial', '.atlas-intro', 'font-size'],
    ['brutalism', '.approved-type-sample', 'font-size'],
    ['bento-grid', '.approved-composition', 'gap'],
    ['memphis', '.atlas-memphis-art', 'background-size'],
    ['neumorphism', '.atlas-dial-tick', 'transform'],
  ]) {
    await page.goto(`/styles/${slug}/`);
    const range = page.locator('[data-art-range]');
    const set = value => range.evaluate((el, value) => { el.value = String(value); el.dispatchEvent(new Event('input', { bubbles: true })); }, value);
    const read = () => page.locator(target).evaluate((el, property) => getComputedStyle(el).getPropertyValue(property), property);
    await set(25); const before = await read();
    await set(75); await expect.poll(read, { message: `${slug} ${property} must respond` }).not.toBe(before);
    if (slug === 'neumorphism') {
      await expect(range).toHaveAttribute('aria-valuetext', '270°');
      await expect(page.locator('[data-dial-value]')).toHaveText('270°');
      await expect(page.locator('[data-range-output]')).toHaveText('270°');
      await expect(page.locator('[data-prompt-output]')).toHaveValue(/旋钮角度: 270°/);
      await chooseAtlasVariant(page, 1);
      const dial = page.locator('.atlas-dial');
      const soft = await dial.evaluate(el => getComputedStyle(el).boxShadow);
      await page.locator('input[data-soft-light]').uncheck();
      await expect.poll(() => dial.evaluate(el => getComputedStyle(el).boxShadow)).not.toBe(soft);
    }
    if (slug === 'bento-grid') {
      const loose = await read();
      const padding = await page.locator('.atlas-controls').evaluate(el => getComputedStyle(el).paddingTop);
      await page.locator('input[data-compact]').check();
      expect(await read()).not.toBe(loose);
      await expect.poll(() => page.locator('.atlas-controls').evaluate(el => getComputedStyle(el).paddingTop)).not.toBe(padding);
    }
  }
});
