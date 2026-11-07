import { test, expect } from './helpers/private-browser.mjs';
import { chooseAtlasVariant } from './helpers/atlas-controls.mjs';

// 这五页的浅色阅读面板/标题曾继承旧深色面板的字色。
// 同时核对真实计算色与页面底色，不以元素可见替代文字可读。
const targets = {
  'retro-web': '.atlas-title h1, .approved-headline',
  bauhaus: '.atlas-notes h2, .atlas-intro',
  'flat-design': '.atlas-notes h2, .atlas-intro',
  organic: '.atlas-notes h2, .atlas-intro',
  claymorphism: '.atlas-title h1',
};

for (const [slug, selector] of Object.entries(targets)) for (const locale of ['zh', 'en']) for (const width of [1440, 390]) {
  test(`阅读对比度 ${slug} ${locale} ${width}：各变体保留可读标题与正文`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${locale === 'en' ? '/en' : ''}/styles/${slug}/`);
    await expect(page.locator('[data-atlas-root]')).toHaveAttribute('data-ready', 'true');
    const count = await page.locator('select[data-variant] option').count();
    for (let index = 0; index < count; index++) {
      if (index) await chooseAtlasVariant(page, index);
      const colors = await page.locator(selector).evaluateAll(nodes => {
        const rgba = value => {
          const channels = value.match(/[\d.]+/g).map(Number);
          return [...channels.slice(0, 3), channels[3] ?? 1];
        };
        const luminance = channels => channels.map(value => {
          value /= 255;
          return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
        }).reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i], 0);
        return nodes.map(node => {
          const foreground = getComputedStyle(node).color;
          // 逐层合成真实背景，遇到 organic 等不透明阅读卡片就停止，
          // 不把卡片后面的页面底色误当作文字背景。
          const layers = [];
          for (let element = node; element; element = element.parentElement) {
            const style = getComputedStyle(element);
            if (style.backgroundImage !== 'none') throw new Error('This solid-background check needs an image-aware target.');
            const layer = rgba(style.backgroundColor);
            layers.push(layer);
            if (layer[3] === 1) break;
          }
          const channels = layers.reverse().reduce((base, layer) => base.map((value, i) => layer[i] * layer[3] + value * (1 - layer[3])), [255, 255, 255]);
          const background = `rgb(${channels.join(', ')})`;
          const light = luminance(rgba(foreground).slice(0, 3)), dark = luminance(channels);
          return { text: node.textContent.trim(), foreground, background, ratio: (Math.max(light, dark) + 0.05) / (Math.min(light, dark) + 0.05) };
        });
      });
      expect(colors.length).toBeGreaterThan(0);
      for (const color of colors) expect(color.ratio, JSON.stringify({ slug, index, ...color })).toBeGreaterThanOrEqual(4.5);
    }
    if (locale === 'zh' && width === 390) {
      const region = page.locator(slug === 'retro-web' || slug === 'claymorphism' ? '.atlas-title' : '.atlas-notes');
      await testInfo.attach(`${slug}-readable.png`, { body: await region.screenshot(), contentType: 'image/png' });
    }
  });
}
