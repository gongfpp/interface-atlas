import { readFileSync } from 'node:fs';
import { load } from 'js-yaml';
import { test, expect } from './helpers/private-browser.mjs';
import { STYLE_SLUGS, pathFor, readyStyleFrame } from './helpers/style-page-flows.mjs';

for (const locale of ['zh','en']) for (const slug of STYLE_SLUGS) {
  test(`风格外层能力 ${slug} ${locale}：收藏、主题隔离、复制与导出同源`, async ({ page }) => {
    const data = load(readFileSync(new URL(`../src/content/styles/${slug}.yaml`,import.meta.url),'utf8'));
    await page.addInitScript(() => {
      Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__styleCopiedPrompt=text;}}});
    });
    await page.goto(pathFor(locale,`/styles/${slug}/`));
    const actions = page.locator('article > header astro-island[component-url*="ConceptActions"]');
    await expect.poll(()=>actions.evaluate(element=>element.hasAttribute('ssr'))).toBe(false);
    const save = actions.locator('button[aria-pressed]');
    await expect(save).toHaveAttribute('aria-pressed','false');
    await save.click();
    await expect(save).toHaveAttribute('aria-pressed','true');
    const { frame, scene } = await readyStyleFrame(page,slug,locale);
    const signature=()=>scene.evaluate(root=>{const s=getComputedStyle(root.querySelector('.scene-page,.generic-style-hero'));return [s.backgroundColor,s.color,document.body.dataset.mode];});
    const initial = await signature();
    await page.locator('#theme-toggle').click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    expect(await signature()).toEqual(initial);
    await page.locator('#theme-toggle').click();
    await expect(frame.locator('body')).toHaveAttribute('data-mode','default');
    const prompt = page.locator('#prompts');
    await prompt.scrollIntoViewIfNeeded();
    await expect(prompt.locator('astro-island[ssr]')).toHaveCount(0);
    await prompt.locator('[data-track-label="copy-prompt-agent"]').click();
    await expect.poll(()=>page.evaluate(()=>window.__styleCopiedPrompt)).toContain(data.prompts.agent[locale].trim());
    await prompt.locator('[data-track-label="prompt-layer-implementation"]').click();
    await prompt.locator('[data-track-label="copy-prompt-implementation"]').click();
    await expect.poll(()=>page.evaluate(()=>window.__styleCopiedPrompt)).toContain(data.prompts.implementation[locale].trim());
    const json = await page.request.get(`/api/concept/styles/${slug}.json`);
    expect(json.ok()).toBe(true);
    const exported = await json.json();
    expect(exported.prompts.agent[locale]).toBe(data.prompts.agent[locale]);
    expect(exported.prompts.implementation[locale]).toBe(data.prompts.implementation[locale]);
    const markdown = await page.request.get(pathFor(locale,`/styles/${slug}.md`));
    expect(markdown.ok()).toBe(true);
    expect(await markdown.text()).toContain(data.prompts.agent[locale].trim());
    await page.reload();
    await expect.poll(()=>actions.evaluate(element=>element.hasAttribute('ssr'))).toBe(false);
    await expect(save).toHaveAttribute('aria-pressed','true');
    await save.click();
    await expect(save).toHaveAttribute('aria-pressed','false');
  });
}

for (const locale of ['zh','en']) {
  test(`原页语言入口 ${locale}：独立打开跟随当前完整页面语言`,async({page})=>{
    await page.goto(pathFor(locale,'/styles/swiss-style/'));
    const {experience,frame}=await readyStyleFrame(page,'swiss-style',locale);
    await frame.locator('[data-scene-action="language"]').click();
    const other=locale==='zh'?'en':'zh';
    await expect(frame.locator('[data-style-scene="swiss-style"]')).toHaveAttribute('data-scene-locale',other);
    await expect(experience.locator('[data-style-open]')).toHaveAttribute('href',new RegExp(`${pathFor(other,'/style-scenes/swiss-style/')}\\?mode=default$`));
    expect(await page.locator('html').getAttribute('lang')).toBe(locale==='zh'?'zh-CN':'en');
  });
  test(`旧风格设备入口 ${locale} 继续进入同品牌完整深色页面`,async({page})=>{
    await page.goto(pathFor(locale,'/viewport?concept=swiss-style&mode=dark'));
    await expect(page).toHaveURL(new RegExp(`${pathFor(locale,'/style-scenes/swiss-style/')}\\?mode=dark$`));
    await expect(page.locator('[data-style-scene="swiss-style"] .scene-brand')).toHaveText('VERTEX');
    await expect(page.locator('body')).toHaveAttribute('data-mode','dark');
  });
}
