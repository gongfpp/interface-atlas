import { test, expect } from './helpers/private-browser.mjs';

// 浏览器验收定义：仅在浏览器访问已授权的环境运行。
// 源码与服务端渲染检查不等同于浏览器验收。
const styles = {
  input: ['minimalism', 'neobrutalism', 'editorial', 'swiss-style', 'cyberpunk', 'neumorphism', 'flat-design', 'organic'],
  card: ['minimalism', 'aurora', 'bento-grid', 'editorial', 'neobrutalism', 'neumorphism', 'swiss-style', 'art-deco'],
};

async function openStyles(page, component, locale = 'en') {
  await page.goto(`${locale === 'en' ? '/en' : ''}/components/${component}`);
  const section = page.locator('#style-variants');
  await section.scrollIntoViewIfNeeded();
  await expect(section.locator('[data-style]')).toHaveCount(8);
  const select = async (style) => {
    const pill = section.locator(`[data-style="${style}"]`);
    await pill.click();
    await expect(pill).toHaveAttribute('aria-pressed', 'true');
  };
  await select(styles[component][0]);
  return { section, preview: section.locator('.demo-content'), select };
}

for (const [locale, width] of [['zh', 390], ['zh', 1280], ['en', 390], ['en', 1280]]) {
  test(`${locale} ${width}px: 八套输入框支持输入、校验、清空焦点恢复与跨风格保留`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const { preview, select } = await openStyles(page, 'input', locale);
    const field = preview.getByRole('textbox', { name: locale === 'zh' ? '邮箱地址' : 'Email address' });
    for (let index = 0; index < styles.input.length; index += 1) {
      const style = styles.input[index];
      await select(style);
      if (index > 0) await expect(field).toHaveValue('shared+long-project-reference@example.org');
      await field.fill('broken-email');
      await field.press('Tab');
      await expect(field).toHaveAttribute('aria-invalid', 'true');
      await expect(preview.getByText(locale === 'zh' ? /请输入完整邮箱/ : /Enter a complete email/)).toBeVisible();
      await field.fill('reader@example.org');
      await field.press('Enter');
      await expect(field).toHaveAttribute('aria-invalid', 'false');
      await expect(preview.getByRole('status')).toContainText(locale === 'zh' ? '格式有效' : 'Format looks valid');
      const clear = preview.getByRole('button', { name: locale === 'zh' ? '清空邮箱' : 'Clear email' });
      await clear.focus();
      await clear.press('Enter');
      await expect(field).toHaveValue('');
      await expect(field).toBeFocused();
      await expect(field).toHaveAttribute('aria-invalid', 'false');
      await expect(clear).toHaveCount(0);
      await expect(preview.getByRole('status')).toContainText(locale === 'zh' ? '已清空' : 'Cleared');
      await field.fill('shared+long-project-reference@example.org');
    }
    await select(styles.input[0]);
    await expect(field).toHaveValue('shared+long-project-reference@example.org');
  });

  test(`${locale} ${width}px: 八套卡片支持键盘展开、撤销与跨风格收藏状态`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const { preview, select } = await openStyles(page, 'card', locale);
    const bookmark = preview.getByRole('button', { name: locale === 'zh' ? '在本地演示中收藏' : 'Bookmark in this local demo' });
    const details = preview.locator('[data-card-detail-toggle]');
    for (let index = 0; index < styles.card.length; index += 1) {
      await select(styles.card[index]);
      await expect(details).toHaveAttribute('aria-expanded', index === 0 ? 'false' : 'true');
      await expect(bookmark).toHaveAttribute('aria-pressed', index === 0 ? 'false' : 'true');
      if (index > 0) {
        await details.focus();
        await details.press('Space');
        await expect(details).toHaveAttribute('aria-expanded', 'false');
        await expect(preview.getByRole('region')).toHaveCount(0);
        await bookmark.click();
        await expect(bookmark).toHaveAttribute('aria-pressed', 'false');
        await expect(preview.getByRole('status')).toContainText(locale === 'zh' ? '已取消' : 'Bookmark removed');
      }
      await details.focus();
      await details.press('Enter');
      await expect(details).toHaveAttribute('aria-expanded', 'true');
      await expect(preview.getByRole('region')).toBeVisible();
      await expect(details).toBeFocused();
      await bookmark.focus();
      await bookmark.press('Space');
      await expect(bookmark).toHaveAttribute('aria-pressed', 'true');
      await expect(preview.getByRole('status')).toContainText(locale === 'zh' ? '可再次点击撤销' : 'Select again to undo');
    }
    await select(styles.card[0]);
    await expect(bookmark).toHaveAttribute('aria-pressed', 'true');
    await details.click();
    await bookmark.click();
    await expect(details).toHaveAttribute('aria-expanded', 'false');
    await expect(bookmark).toHaveAttribute('aria-pressed', 'false');
  });
}

for (const component of Object.keys(styles)) {
  test(`${component}: 所有风格适配窄宽度并保持 44px 操作目标`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    const { preview, select } = await openStyles(page, component);
    for (const style of styles[component]) {
      await select(style);
      if (component === 'input') {
        await preview.getByRole('textbox').fill(`${'long-project-name-'.repeat(12)}@example.org`);
      } else {
        const detailToggle = preview.locator('[data-card-detail-toggle]');
        if (await detailToggle.getAttribute('aria-expanded') !== 'true') await detailToggle.click();
      }
      expect(await preview.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
      const actions = preview.getByRole('button');
      for (const action of await actions.all()) {
        const bounds = await action.boundingBox();
        expect(bounds.height).toBeGreaterThanOrEqual(44);
        expect(bounds.width).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test(`${component}: 减弱动效偏好下聚焦与按压不产生位移缩放`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const { preview, select } = await openStyles(page, component);
    await select('neobrutalism');
    const target = component === 'input' ? preview.getByRole('textbox') : preview.locator('[data-card-detail-toggle]');
    await target.focus();
    if (component === 'card') await page.keyboard.down('Space');
    const transform = await target.evaluate((node) => {
      const css = getComputedStyle(node);
      return { translate: css.translate, scale: css.scale, transform: css.transform };
    });
    expect(transform).toEqual({ translate: 'none', scale: 'none', transform: 'none' });
    if (component === 'card') await page.keyboard.up('Space');
  });
}
