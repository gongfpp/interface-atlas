import { test, expect } from './helpers/private-browser.mjs';

// 回归真实业务复位与 label 默认激活；不能只验证首次展开/生成成功。
for (const slug of ['minimalism', 'skeuomorphism']) {
  test(`${slug}: 换商品后可见款式、原生值与购物袋一致`, async ({ page }) => {
    await page.goto(`/style-scenes/${slug}/`);
    const root = page.locator('[data-style-scene]');
    await root.locator('[data-scene-action="goods-detail-0"]').first().click();
    const dialog = root.locator('[data-other-dialog="product"]');
    const owner = dialog.locator('[data-product-finish]');
    const initial = await owner.locator('option').first().textContent();
    const trigger = dialog.getByRole('combobox');
    await trigger.click();
    await dialog.getByRole('option').nth(1).click();
    await expect(trigger).toBeFocused();
    await page.keyboard.press('Escape');
    await root.locator('[data-scene-action="goods-detail-1"]').first().click();
    await expect(owner).toHaveJSProperty('selectedIndex', 0);
    await expect(trigger).toHaveText(initial);
    await dialog.locator('[data-scene-action="goods-add"]').click();
    await expect(dialog.locator('[data-product-status]')).toContainText(initial);
    await page.keyboard.press('Escape');
    await root.locator('[data-scene-action="goods-bag"]').first().click();
    await expect(root.locator('[data-bag-items]')).toContainText(initial);
  });
}

for (const touch of [false, true]) {
  test.describe(touch ? '触屏选择后焦点' : '鼠标选择后焦点', () => {
    test.use({ hasTouch: touch, viewport: { width: 390, height: 844 } });
    for (const slug of ['glassmorphism', 'claymorphism']) {
      test(`${slug}: option 不激活 aria-hidden 原生 owner`, async ({ page }) => {
        await page.goto(`/style-scenes/${slug}/`);
        const root = page.locator('[data-style-scene]');
        await root.locator(slug === 'glassmorphism' ? '[data-scene-action="aurora-create"]' : '[data-generic-action="primary"]').first().click();
        const wrapper = root.locator('.scene-select:visible').first();
        const trigger = wrapper.getByRole('combobox');
        if (touch) await trigger.tap(); else await trigger.click();
        await expect(trigger).toBeFocused();
        const option = wrapper.getByRole('option').nth(1);
        if (touch) await option.tap(); else await option.click();
        await expect(trigger).toBeFocused();
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
        await expect(wrapper.locator('select')).toHaveJSProperty('selectedIndex', 1);
        await expect(wrapper.locator('select')).not.toBeFocused();
      });
    }
  });
}

for (const slug of ['minimalism', 'glassmorphism', 'neumorphism']) {
  test(`${slug}: reload 不沿用浏览器恢复的款式或时长，回到声明初态`, async ({ page }) => {
    await page.goto(`/style-scenes/${slug}/`);
    const root = page.locator('[data-style-scene]');
    if (slug === 'minimalism') await root.locator('[data-scene-action="goods-detail-0"]').first().click();
    const owner = root.locator('select').first();
    const initial = await owner.locator('option').first().textContent();
    await owner.selectOption({ index: 1 });
    await expect(owner).toHaveJSProperty('selectedIndex', 1);
    await expect(owner.locator('xpath=parent::*').getByRole('combobox')).toHaveText(await owner.locator('option').nth(1).textContent());
    await page.reload();
    await expect(owner).toHaveJSProperty('selectedIndex', 0);
    await expect(owner.locator('xpath=parent::*').locator('button[role="combobox"]')).toHaveText(initial);
  });
}

test('原生 form.reset 后增强标签同步，且不产生 observer 循环', async ({ page }) => {
  await page.goto('/style-scenes/glassmorphism/');
  await page.locator('[data-scene-action="aurora-create"]').first().click();
  const form = page.locator('[data-other-form="aurora"]');
  const owner = form.locator('select');
  const initial = await owner.locator('option').first().textContent();
  await form.getByRole('combobox').click();
  await form.getByRole('option').nth(1).click();
  await form.evaluate(node => node.reset());
  await expect(owner).toHaveJSProperty('selectedIndex', 0);
  await expect(form.getByRole('combobox')).toHaveText(initial);
  await form.locator('[name="topic"]').fill('Reset remains usable');
  await form.locator('button[type="submit"]').click();
  await expect(form).toHaveAttribute('data-state', 'success');
});

test('Aurora 空白校验后，灵感预填可以直接生成而不残留 customError', async ({ page }) => {
  await page.goto('/style-scenes/glassmorphism/');
  await page.locator('[data-scene-action="aurora-create"]').first().click();
  const form = page.locator('[data-other-form="aurora"]');
  const topic = form.locator('[name="topic"]');
  await topic.fill('   ');
  await form.locator('button[type="submit"]').click();
  await expect(form).toHaveAttribute('data-state', 'invalid');
  await expect.poll(() => topic.evaluate(node => node.validity.customError)).toBe(true);
  await page.locator('[data-scene-action="aurora-prompt-0"]').click();
  await expect(topic).toHaveValue('清晨的第一束光');
  await expect.poll(() => topic.evaluate(node => node.validity.customError)).toBe(false);
  await form.locator('button[type="submit"]').click();
  await expect(form).toHaveAttribute('data-state', 'success');
  await expect(page.locator('[data-aurora-draft]')).toHaveValue(/清晨的第一束光/);
});

test('Retro 空白校验后重新 Go，合法预填地址可直接访问', async ({ page }) => {
  await page.goto('/style-scenes/retro-web/');
  await page.locator('[data-scene-action="retro-go"]').click();
  const dialog = page.locator('[data-other-dialog="retro-address"]');
  const form = dialog.locator('[data-other-form="retro-address"]');
  const address = form.locator('[name="address"]');
  await address.fill('   ');
  await form.locator('button[type="submit"]').click();
  await expect.poll(() => address.evaluate(node => node.validity.customError)).toBe(true);
  await dialog.locator('[data-other-close]').click();
  await page.locator('[data-scene-action="retro-go"]').click();
  await expect(address).toHaveValue('goodoldnet/home');
  await expect.poll(() => address.evaluate(node => node.validity.customError)).toBe(false);
  await form.locator('button[type="submit"]').click();
  await expect(dialog).not.toBeVisible();
});

for (const [locale, width] of [['zh', 1280], ['en', 390]]) {
  test(`Retro ${locale}: 原生空值与共享空白校验保留留言簿具体反馈，可修正再提交`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${locale === 'en' ? '/en' : ''}/style-scenes/retro-web/`);
    await page.locator('[data-scene-action="retro-page-4"]').first().click();
    const form = page.locator('[data-other-form="guestbook"]');
    const submit = form.locator('button[type="submit"]');
    const entries = page.locator('[data-guest-messages] li');
    const baseline = await entries.count();
    const expected = locale === 'en' ? 'Enter a nickname and message, not just spaces.' : '请填写昵称和留言，不能仅为空格。';
    await submit.click();
    await expect(form).toHaveAttribute('data-state', 'invalid');
    await expect(form.getByRole('status')).toHaveText(expected);
    await form.locator('[name="name"]').fill('Atlas visitor');
    await form.locator('[name="message"]').fill('   ');
    await submit.click();
    await expect(form.getByRole('status')).toHaveText(expected);
    await expect(entries).toHaveCount(baseline);
    await form.locator('[name="message"]').fill('  Hello, early web!  ');
    await submit.click();
    await expect(form).toHaveAttribute('data-state', 'success');
    await expect(entries.first()).toHaveText('Atlas visitor: Hello, early web!');
    await expect(entries).toHaveCount(baseline + 1);
    await submit.click();
    await expect(form.getByRole('status')).toHaveText(expected);
    await expect(entries).toHaveCount(baseline + 1);
  });
}

test('Retro 未知地址不能伪装成成功反馈，可修正后继续访问', async ({ page }) => {
  await page.goto('/style-scenes/retro-web/');
  await page.locator('[data-scene-action="retro-go"]').click();
  const form = page.locator('[data-other-form="retro-address"]');
  await form.locator('[name="address"]').fill('https://outside.example/');
  await form.locator('button[type="submit"]').click();
  await expect(form).toHaveAttribute('data-state', 'invalid');
  await expect(page.locator('[data-retro-route-status]')).toContainText('未找到');
  await form.locator('[name="address"]').fill('guestbook');
  await form.locator('button[type="submit"]').click();
  await expect(page.locator('[data-retro-heading]')).toContainText('Guestbook');
});

test('PlayLab 没有选择服务时为业务 invalid，而非 native valid 即 success', async ({ page }) => {
  await page.goto('/style-scenes/neobrutalism/');
  for (let i = 0; i < 3; i++) await page.locator(`[data-scene-action="play-check-${i}"]`).click();
  await page.locator('[data-scene-action="play-brief"]').first().click();
  const form = page.locator('[data-other-form="play-brief"]');
  await form.locator('[name="name"]').fill('Studio');
  await form.locator('[name="goal"]').fill('Local brief');
  await form.locator('button[type="submit"]').click();
  await expect(form).toHaveAttribute('data-state', 'invalid');
  await expect(page.locator('[data-play-summary]')).toContainText('至少选择一项服务');
});

// 材质的静态样本不能覆盖主工作区厚度；用真实 range 键盘操作验证最终计算样式。
for (const [material, scale, offset] of [['Clear', 1, 0], ['Frost', 1, 8], ['Prism', .5, 0]]) {
  test(`Lumen ${material}: 厚度滑杆改变可见材质，不只是更新标签`, async ({ page }) => {
    await page.goto('/style-scenes/liquid-glass/');
    await page.locator('[data-generic-action="primary"]').first().click();
    await page.getByRole('combobox').click();
    await page.getByRole('option').filter({ hasText: material }).click();
    const depth = page.locator('[data-glass-depth]');
    const specimen = page.locator('[data-glass-specimen]');
    for (const value of [4, 20]) {
      await depth.focus();
      await page.keyboard.press('Home');
      for (let step = 0; step < value; step++) await page.keyboard.press('ArrowRight');
      await expect(depth).toHaveValue(String(value));
      await expect(page.locator('[data-glass-values]')).toContainText(`${material} / ${value}px`);
      await expect.poll(() => specimen.evaluate(node => getComputedStyle(node).backdropFilter)).toContain(`blur(${value * scale + offset}px)`);
    }
  });
}

for (const mode of ['default', 'dark', 'variants']) {
  test(`Flatly ${mode}: 提示文字沿用品牌 muted，浅色与深色表面均可读`, async ({ page }) => {
    await page.goto(`/style-scenes/flat-design/?mode=${mode}`);
    await page.locator('[data-generic-action="primary"]').first().click();
    const field = page.locator('.generic-style-content input[placeholder]').first();
    await expect(field).toBeVisible();
    const colors = await field.evaluate(node => {
      const hint = getComputedStyle(node, '::placeholder');
      return { foreground: hint.color, opacity: hint.opacity, background: getComputedStyle(node).backgroundColor };
    });
    expect(colors.opacity).toBe('1');
    const foreground = colors.foreground.match(/[\d.]+/g).map(Number);
    const background = colors.background.match(/[\d.]+/g).map(Number);
    expect(background[3] ?? 1).toBe(1);
    const luminance = rgb => rgb.slice(0, 3).map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
    const a = luminance(foreground), b = luminance(background);
    expect((Math.max(a, b) + .05) / (Math.min(a, b) + .05)).toBeGreaterThanOrEqual(4.5);
  });
}

const genericStyles = ['flat-design','bauhaus','y2k','cyberpunk','memphis','retro-futurism','claymorphism','aurora','organic','art-deco','corporate-memphis','hand-drawn','liquid-glass','pixel-art','vaporwave'];
for (const slug of genericStyles) {
  test(`${slug}: hero 真实 Tab 焦点使用品牌 token，不落回 currentColor 或统一蓝`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/style-scenes/${slug}/`);
    const primary = page.locator('[data-generic-action="primary"]').first();
    for (let step = 0; step < 16; step++) {
      await page.keyboard.press('Tab');
      if (await primary.evaluate(node => node === document.activeElement)) break;
    }
    await expect(primary).toBeFocused();
    const focus = await primary.evaluate(node => {
      const root = node.closest('[data-style-scene]');
      const token = getComputedStyle(root).getPropertyValue('--scene-focus').trim();
      const probe = document.createElement('i'); probe.style.color = token; root.append(probe);
      const expected = getComputedStyle(probe).color; probe.remove();
      const actual = getComputedStyle(node);
      return { token, expected, actual: actual.outlineColor, width: parseFloat(actual.outlineWidth), style: actual.outlineStyle };
    });
    expect(focus.token).not.toBe('');
    expect(focus.actual).toBe(focus.expected);
    expect(focus.width).toBeGreaterThanOrEqual(2);
    expect(focus.style).toBe('solid');
  });
}
