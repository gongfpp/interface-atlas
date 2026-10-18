import { readFileSync, readdirSync } from 'node:fs';
import { load } from 'js-yaml';
import { test, expect } from './helpers/private-browser.mjs';

const referenceSlugs = new Set([
  'minimalism', 'swiss-style', 'editorial', 'glassmorphism', 'bento-grid',
  'neumorphism', 'skeuomorphism', 'brutalism', 'neobrutalism', 'retro-web',
]);
const styles = readdirSync(new URL('../src/content/styles/', import.meta.url))
  .filter(file => file.endsWith('.yaml'))
  .map(file => ({
    slug: file.replace(/\.yaml$/, ''),
    data: load(readFileSync(new URL(`../src/content/styles/${file}`, import.meta.url), 'utf8')),
  }))
  .filter(({ data }) => data.status === 'published' && data.preview);

async function assertEnglishScene(scene, slug) {
  await expect(scene).toHaveAttribute('data-scene-locale', 'en');
  // 检查隐藏导航与辅助文案，避免只验证当前视口可见的文字。
  const content = await scene.textContent();
  // 品牌身份原样保留，例如 organic 的 “mori / 森”；仅豁免当前条目的完整品牌字符串。
  const brand = styles.find(style => style.slug === slug).data.preview.brand;
  const localizedCopy = content.replaceAll(brand, '').replace(/EN\s*\/\s*中文/g, '');
  // 双语语言选择器可以保留中文语言名称；周围条目标签的中文别名不属于样张文案。
  expect(localizedCopy, slug).not.toMatch(/\p{Script=Han}/u);
  expect(content, slug).not.toMatch(/\[object Object\]|undefined/);
  expect(content.trim().length, slug).toBeGreaterThan(30);
}

for (const width of [1280, 390]) {
  test(`全部25套风格列表预览使用英文文案 ${width}px，条目中文别名保留`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/en/styles/');
    for (const { slug, data } of styles) {
      const scene = page.locator(`[data-style-scene="${slug}"]`);
      await expect(scene).toHaveCount(1);
      await assertEnglishScene(scene, slug);
      // 列表标题主动展示中英文术语，不能把这个别名误判成样张未本地化。
      await expect(scene.locator('xpath=ancestor::a[1]')).toContainText(data.name.zh);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
  });
}

for (const { slug, data } of styles) {
  test(`英文整页预览 ${slug}：动态文案与完整预览均本地化`, async ({ page }) => {
    await page.goto(`/en/styles/${slug}/`);
    const preview = page.locator('[data-style-preview]');
    await preview.scrollIntoViewIfNeeded();
    const scene = page.frameLocator('[data-style-frame]').locator(`[data-style-scene="${slug}"]`);
    await expect(scene).toBeVisible();
    await assertEnglishScene(scene, slug);
    if (!referenceSlugs.has(slug)) {
      await expect(scene).toContainText(data.preview.heroTitle.en);
      await expect(scene).toContainText(data.preview.heroSub.en);
      await expect(scene).toContainText(data.preview.cta.en.replace(/\s*→$/, ''));
    }
  });
}

test('旧15套中文预览保留标题和说明，切换语言不会丢失原文', async ({ page }) => {
  await page.goto('/styles/');
  for (const { slug, data } of styles.filter(({ slug }) => !referenceSlugs.has(slug))) {
    const scene = page.locator(`[data-style-scene="${slug}"]`);
    await expect(scene).toHaveAttribute('data-scene-locale', 'zh');
    await expect(scene).toContainText(data.preview.heroTitle.zh);
    await expect(scene).toContainText(data.preview.heroSub.zh);
  }
});
