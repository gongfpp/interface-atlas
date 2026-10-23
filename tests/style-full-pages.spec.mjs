import { readFileSync } from 'node:fs';
import { load } from 'js-yaml';
import { test, expect } from './helpers/private-browser.mjs';
import { STYLE_SLUGS, REFERENCE_STYLES, pathFor, readyStyleFrame, reloadStyleFrame, exerciseStyleFlow, assertNoOverflow, assertUsableGeometry, assertStyleInitial, assertStyleDocumentBoundary } from './helpers/style-page-flows.mjs';

const locales = ['zh', 'en'];
const widths = [1280, 390, 320];
const specs = Object.fromEntries(STYLE_SLUGS.map(slug => [slug, load(readFileSync(new URL(`../src/content/styles/${slug}.yaml`, import.meta.url), 'utf8'))]));

function observeFailures(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (new URL(response.url()).origin === 'http://127.0.0.1:4337' && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  return errors;
}

async function attachEvidence(page, testInfo, label, extra = {}) {
  const file = testInfo.outputPath(`${label}.png`);
  await page.screenshot({ path: file, fullPage: label === 'result', animations: 'disabled', scale: 'css' });
  await testInfo.attach(`${label}.png`, { path: file, contentType: 'image/png' });
  await testInfo.attach(`${label}.json`, {
    body: JSON.stringify({ url: page.url(), viewport: page.viewportSize(), engine: testInfo.project.name, candidateCommit: testInfo.config.metadata.candidateCommit || process.env.QA_CANDIDATE_SHA || 'local-uncommitted', ...extra }, null, 2),
    contentType: 'application/json',
  });
}

for (const locale of locales) for (const width of widths) for (const slug of STYLE_SLUGS) {
  test(`完整风格语义流 ${slug} ${locale} ${width}px：品牌操作、返回、重置和真实视口`, async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    const errors = observeFailures(page);
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() => {
      window.__styleStorageWrites = [];
      for (const method of ['setItem', 'removeItem', 'clear']) {
        const original = Storage.prototype[method];
        Storage.prototype[method] = function (...args) { window.__styleStorageWrites.push({ method, key: args[0] }); return original.apply(this, args); };
      }
    });
    await page.goto(pathFor(locale, `/style-scenes/${slug}/`));
    const scene = page.locator(`[data-style-scene="${slug}"][data-scene-interactive="true"]`);
    await expect(scene).toHaveAttribute('data-scene-locale', locale);
    await scene.evaluate(() => document.fonts.ready);
    // 这里是真实document viewport，而不是把1088px画布transform缩小。
    expect(await page.evaluate(() => innerWidth)).toBe(width);
    await expect(scene.locator('iframe, canvas')).toHaveCount(0);
    await expect.poll(() => scene.locator('img').evaluateAll(images => images.every(image => !image.getClientRects().length || (image.complete && image.naturalWidth > 0)))).toBe(true);
    const initial = await scene.textContent();
    const storedBefore = await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }));
    const businessRequests = [];
    const recordRequest = request => {
      const url = new URL(request.url());
      if (request.method() !== 'GET' || (url.protocol !== 'blob:' && url.origin !== 'http://127.0.0.1:4337')) businessRequests.push(`${request.method()} ${request.url()}`);
    };
    page.on('request', recordRequest);
    await assertNoOverflow(page, `${slug} ${locale} ${width} 初始`);
    await assertUsableGeometry(scene, width, testInfo, 'initial');
    await attachEvidence(page, testInfo, 'initial', { slug, locale, width });
    await exerciseStyleFlow(scene, slug, locale);
    await assertNoOverflow(page, `${slug} ${locale} ${width} 操作结果`);
    await assertUsableGeometry(scene, width, testInfo, 'result');
    await attachEvidence(page, testInfo, 'result', { slug, locale, width });
    expect(await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }))).toEqual(storedBefore);
    expect(await page.evaluate(() => window.__styleStorageWrites)).toEqual([]);
    expect(businessRequests).toEqual([]);
    page.off('request', recordRequest);
    await page.reload();
    await expect(scene).toHaveText(initial);
    await assertStyleInitial(scene, slug);
    await assertNoOverflow(page, `${slug} ${locale} ${width} reload-reset`);
    expect(errors).toEqual([]);
  });
}

for (const locale of locales) for (const slug of STYLE_SLUGS) {
  test(`完整风格详情接口 ${slug} ${locale}：单预览、390/320真实iframe、模式与重置`, async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    const errors = observeFailures(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(pathFor(locale, `/styles/${slug}/`));
    const { experience, iframe, frame, scene } = await readyStyleFrame(page, slug, locale);
    await expect(page.locator('#playground .demo-content')).toHaveCount(0);
    for (const width of [390, 320]) {
      const button = experience.locator(`[data-scene-width="${width}px"]`);
      await button.click();
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect.poll(() => frame.locator('body').evaluate(() => innerWidth)).toBe(width);
      expect((await iframe.boundingBox()).width).toBe(width);
      await assertNoOverflow(frame, `${slug} iframe ${width}`);
    }
    await experience.locator('[data-scene-width="100%"] ').click();
    await expect.poll(() => frame.locator('body').evaluate(() => innerWidth)).toBeGreaterThan(600);
    // 模式不是只改toolbar高亮，独立document必须收到mode，并可继续完成业务流程。
    const modes = await experience.locator('[data-style-mode]').evaluateAll(buttons => buttons.map(button => button.dataset.styleMode));
    expect(modes).toEqual(specs[slug].demo.modes);
    // 形式模式也会改变真实标题、按钮与可打开的弹窗；只采 section 会漏掉这些有效变化。
    // 仍仅比较 iframe 内页面，外层工具栏高亮不能让断言通过。
    const visualSignature = () => scene.evaluate(root => [root, ...root.querySelectorAll('*')].map(element => {
      const styles = getComputedStyle(element);
      return Object.fromEntries(['backgroundColor', 'backgroundImage', 'color', 'borderTopWidth', 'borderTopStyle', 'borderTopColor', 'borderRadius', 'boxShadow'].map(key => [key, styles[key]]));
    }));
    const defaultVisual = await visualSignature();
    const modeText = await scene.textContent();
    for (const mode of modes) {
      await reloadStyleFrame(experience, frame, `[data-style-mode="${mode}"]`);
      await expect(experience.locator(`[data-style-mode="${mode}"]`)).toHaveAttribute('aria-pressed', 'true');
      await expect(frame.locator('body')).toHaveAttribute('data-mode', mode);
      const standalone = new URL(await experience.locator('[data-style-open]').getAttribute('href'), page.url());
      expect(standalone.pathname).toBe(pathFor(locale, `/style-scenes/${slug}/`));
      expect(standalone.searchParams.get('mode')).toBe(mode);
      expect(standalone.href).toBe(await frame.locator('body').evaluate(() => location.href));
      if (mode !== 'default') expect(await visualSignature(), `${slug} ${mode} 必须改变实际页面样式而非只高亮按钮`).not.toEqual(defaultVisual);
      await expect(scene).toHaveText(modeText);
      await assertNoOverflow(frame, `${slug} ${mode}`);
    }
    await reloadStyleFrame(experience, frame, '[data-style-mode="default"]');
    const initial = await scene.textContent();
    await exerciseStyleFlow(scene, slug, locale);
    await reloadStyleFrame(experience, frame);
    await expect(scene).toHaveText(initial);
    await assertStyleInitial(scene, slug);
    await attachEvidence(page, testInfo, 'detail-reset', { slug, locale, modes, iframeViewport: await frame.locator('body').evaluate(() => ({ width: innerWidth, height: innerHeight })) });
    expect(errors).toEqual([]);
  });
}

const heroParts = {
  'minimalism': '.lumo-body', 'swiss-style': '.vertex-body', editorial: '.paper-body',
  glassmorphism: '.aurora-body', 'bento-grid': '.tasko-body', neumorphism: '.mellow-body',
  skeuomorphism: '.goods-body', brutalism: '.void-body', neobrutalism: '.play-body', 'retro-web': '.retro-shell',
};

async function heroSnapshot(scene, slug) {
  await scene.evaluate(() => document.fonts.ready);
  // This comparison covers the hero only; below-fold and closed-dialog images load lazily.
  await expect.poll(() => scene.locator('.scene-page img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
  return scene.evaluate((root, heroSelector) => {
    const hero = root.querySelector('.scene-page');
    const box = hero.getBoundingClientRect();
    const clean = text => text.replace(/\s+/g, ' ').trim();
    const rect = element => {
      const r = element.getBoundingClientRect();
      return { x: r.x - box.x, y: r.y - box.y, width: r.width, height: r.height };
    };
    return {
      text: clean(hero.textContent),
      // button/span标签转换是唯一允许的语义差异；嵌套结构与class仍来自同一封面源。
      structure: [...hero.querySelectorAll('*')].map(node => ({ tag: ['BUTTON', 'SPAN'].includes(node.tagName) ? 'ACTION_OR_SPAN' : node.tagName, className: node.getAttribute('class') || '' })),
      images: [...hero.querySelectorAll('img')].map(image => ({ src: image.getAttribute('src'), alt: image.alt, width: image.naturalWidth, height: image.naturalHeight })),
      geometry: ['.scene-nav', heroSelector, '.scene-title', '.scene-description', 'img'].flatMap(selector => [...hero.querySelectorAll(selector)].map(element => ({ selector, ...rect(element) }))),
      appearance: [hero, ...hero.querySelectorAll('.scene-nav,.scene-title,.scene-description,img')].map(element => {
        const styles = getComputedStyle(element);
        return Object.fromEntries(['backgroundColor','backgroundImage','color','fontFamily','fontSize','fontWeight','lineHeight','borderRadius','boxShadow','objectFit','objectPosition','mixBlendMode'].map(key => [key, styles[key]]));
      }),
      page: rect(hero),
    };
  }, heroParts[slug]);
}

for (const locale of locales) for (const slug of REFERENCE_STYLES) {
  test(`封面整页同源 ${slug} ${locale} 1088px：初始DOM、照片与构图不变`, async ({ page }, testInfo) => {
    test.setTimeout(45_000);
    await page.setViewportSize({ width: 1088, height: 900 });
    await page.goto(pathFor(locale, `/style-covers/${slug}/`));
    const cover = page.locator(`[data-style-scene="${slug}"]`);
    await expect(cover.locator('a, button, input, textarea, select, [tabindex="0"]')).toHaveCount(0);
    await expect(page.locator('script[src]')).toHaveCount(0);
    await assertStyleDocumentBoundary(page);
    const before = await heroSnapshot(cover, slug);
    await attachEvidence(page, testInfo, 'cover-1088');
    await page.goto(pathFor(locale, `/style-scenes/${slug}/`));
    await assertStyleDocumentBoundary(page);
    const after = await heroSnapshot(page.locator(`[data-style-scene="${slug}"]`), slug);
    await attachEvidence(page, testInfo, 'live-1088');
    expect(after.text).toBe(before.text);
    expect(after.structure).toEqual(before.structure);
    expect(after.images).toEqual(before.images);
    expect(after.appearance).toEqual(before.appearance);
    expect(after.geometry.map(item => item.selector)).toEqual(before.geometry.map(item => item.selector));
    const differences = after.geometry.map((item, i) => ({ selector: item.selector, delta: Object.fromEntries(['x', 'y', 'width', 'height'].map(key => [key, item[key] - before.geometry[i][key]])) }));
    await testInfo.attach('hero-geometry.json', { body: JSON.stringify({ before, after, differences }, null, 2), contentType: 'application/json' });
    for (const item of differences) for (const [key, delta] of Object.entries(item.delta)) expect(Math.abs(delta), `${slug} ${item.selector} ${key}`).toBeLessThanOrEqual(1.5);
    expect(Math.abs(after.page.height - before.page.height)).toBeLessThanOrEqual(1.5);
  });
}

// 15套既有品牌仍保留配置标题、说明、CTA，不改成同一通用演示壳。
for (const locale of locales) {
  test(`全部25封面${locale}保持零交互及原品牌文案`, async ({ page }) => {
    await page.goto(pathFor(locale, '/styles/'));
    for (const slug of STYLE_SLUGS) {
      const cover = page.locator(`[data-style-scene="${slug}"]`);
      await expect(cover).toHaveCount(1);
      await expect(cover.locator('a,button,input,textarea,select,[contenteditable="true"],[tabindex="0"]')).toHaveCount(0);
      if (!REFERENCE_STYLES.includes(slug)) {
        await expect(cover).toContainText(specs[slug].preview.brand);
        await expect(cover).toContainText(specs[slug].preview.heroTitle[locale]);
        await expect(cover).toContainText(specs[slug].preview.heroSub[locale]);
      }
    }
  });
}

const genericSlugs = STYLE_SLUGS.filter(slug => !REFERENCE_STYLES.includes(slug));

for (const locale of locales) for (const slug of genericSlugs) {
  test(`品牌标注与内部重置 ${slug} ${locale}：标注无副作用、Enter重置保留焦点`, async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    const errors = observeFailures(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(pathFor(locale, `/style-scenes/${slug}/`));
    const scene = page.locator(`[data-style-scene="${slug}"]`);
    await exerciseStyleFlow(scene, slug, locale);
    const hero = scene.locator('.generic-style-hero');
    const features = hero.locator('[data-generic-action^="feature-"]');
    const featureCount = await features.count();
    // tasko 构图展示日历/统计而非 features 文案；不能把未渲染的配置误判为卡片缺失。
    expect(featureCount).toBe(specs[slug].preview.scene === 'tasko' ? 0 : (specs[slug].preview.features?.length || 0));
    const annotations = [];
    for (let i = 0; i < featureCount; i++) annotations.push(features.nth(i));
    if (!['flat-design', 'y2k'].includes(slug)) {
      for (const label of specs[slug].preview.navExt || []) annotations.push(hero.getByText(label[locale], { exact: true }));
    }
    const workspaceState = () => scene.locator('[data-generic-content]').evaluate(content => ({
      markup: content.innerHTML,
      controls: [...content.querySelectorAll('input,textarea,select')].map(control => ({ name: control.name, value: control.value, checked: control.checked, selectedIndex: control.selectedIndex })),
    }));
    const before = await workspaceState();
    for (const annotation of annotations) {
      await expect(annotation).toHaveCount(1);
      await expect(annotation).toHaveJSProperty('tagName', 'SPAN');
      await expect(annotation).not.toHaveAttribute('data-scene-action');
      await expect(annotation.locator('button,a,input,select,textarea,[tabindex="0"],[role="button"]')).toHaveCount(0);
      await annotation.click();
      expect(await workspaceState(), `${slug} ${await annotation.innerText()} 只是设计标注，不得切换页面或修改业务值`).toEqual(before);
    }
    await testInfo.attach('annotation-state.json', { body: JSON.stringify({ slug, locale, annotations: annotations.length, state: before }, null, 2), contentType: 'application/json' });
    const reset = scene.locator('[data-command="reset"]');
    const oldReset = await reset.elementHandle();
    await reset.focus();
    await reset.press('Enter');
    await expect.poll(() => oldReset.evaluate(element => element.isConnected)).toBe(false);
    await expect(reset).toBeFocused();
    await assertStyleInitial(scene, slug);
    // 第二次Enter落在新建的按钮上，不能焦点掉到body或已被移除的旧节点。
    await reset.press('Enter');
    await expect(reset).toBeFocused();
    await assertStyleInitial(scene, slug);
    await oldReset.dispose();
    expect(errors).toEqual([]);
  });
}

function parseRgba(color) {
  if (!/^rgba?\(/.test(color)) throw new Error(`对比度回归遇到未处理的CSS颜色：${color}`);
  const values = color.match(/[\d.]+/g).map(Number);
  return [...values.slice(0, 3), values[3] ?? 1];
}

function composite(foreground, background) {
  const alpha = foreground[3] + background[3] * (1 - foreground[3]);
  return [...foreground.slice(0, 3).map((channel, index) => (channel * foreground[3] + background[index] * background[3] * (1 - foreground[3])) / alpha), alpha];
}

function luminance(color) {
  const channels = color.slice(0, 3).map(channel => channel / 255).map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

const triCardSlugs = genericSlugs.filter(slug => specs[slug].preview.scene === 'generic' && specs[slug].preview.tokens.triCards);
for (const locale of locales) for (const slug of triCardSlugs) {
  test(`三色卡文字对比 ${slug} ${locale}：封面及全部模式不低于4.5`, async ({ page }, testInfo) => {
    const evidence = [];
    await page.setViewportSize({ width: 1088, height: 900 });
    for (const mode of ['cover', ...specs[slug].demo.modes]) {
      await page.goto(pathFor(locale, mode === 'cover' ? `/style-covers/${slug}/` : `/style-scenes/${slug}/?mode=${mode}`));
      const cards = page.locator('[data-generic-action^="feature-"]');
      await expect(cards).toHaveCount(3);
      const copy = await cards.evaluateAll(elements => elements.flatMap((card, index) => [...card.querySelectorAll('*')]
        .filter(element => [...element.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()))
        .map(element => {
          const backgrounds = [];
          for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) backgrounds.push(getComputedStyle(ancestor).backgroundColor);
          return { card: index, text: element.textContent.trim(), foreground: getComputedStyle(element).color, backgrounds };
        })));
      expect(copy.length).toBeGreaterThanOrEqual(9);
      for (const item of copy) {
        const background = item.backgrounds.toReversed().reduce((under, color) => composite(parseRgba(color), under), [255, 255, 255, 1]);
        const foreground = composite(parseRgba(item.foreground), background);
        const lights = [luminance(background), luminance(foreground)].sort((a, b) => a - b);
        const ratio = (lights[1] + 0.05) / (lights[0] + 0.05);
        evidence.push({ mode, ...item, background, foreground, ratio });
      }
    }
    await testInfo.attach('tri-card-contrast.json', { body: JSON.stringify(evidence, null, 2), contentType: 'application/json' });
    for (const item of evidence) expect(item.ratio, `${slug}/${locale}/${item.mode} 卡片${item.card} ${item.text}：${item.foreground} / ${item.background}`).toBeGreaterThanOrEqual(4.5);
  });
}
