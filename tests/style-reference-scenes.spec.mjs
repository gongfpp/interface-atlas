import { test, expect } from './helpers/private-browser.mjs';
import { readyStyleFrame, reloadStyleFrame, exerciseStyleFlow } from './helpers/style-page-flows.mjs';

const STYLES = [
  'minimalism', 'swiss-style', 'editorial', 'glassmorphism', 'bento-grid',
  'neumorphism', 'skeuomorphism', 'brutalism', 'neobrutalism', 'retro-web',
];
const LOCALES = ['zh', 'en'];
const WIDTHS = [1280, 390, 320];
const pathFor = (locale, route = '') => `${locale === 'en' ? '/en' : ''}${route || '/'}`;
const styleScene = (root, slug) => root.locator(`[data-style-scene="${slug}"]`);

function observeFailures(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.url().startsWith('http://127.0.0.1:4337/') && response.status() >= 400) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });
  return errors;
}

async function assertNoOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    viewport: innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(dimensions.document, `${label}: ${JSON.stringify(dimensions)}`).toBeLessThanOrEqual(dimensions.viewport + 1);
  expect(dimensions.body, `${label}: ${JSON.stringify(dimensions)}`).toBeLessThanOrEqual(dimensions.viewport + 1);
}

async function assertSceneContentGap(scene, slug) {
  const checks = slug === 'neumorphism'
    ? [{ target: '.mellow-copy .scene-pill', boundary: '.scene-page' }]
    : slug === 'glassmorphism' ? [
      { target: '.aurora-graph > small', boundary: '.aurora-graph' },
      { target: '.aurora-features', boundary: '.scene-page' },
      { target: '.glass-feature:last-child p', boundary: '.aurora-features' },
    ] : [];
  if (!checks.length) return;
  const geometry = await scene.evaluate((element, selectors) => {
    const sceneRect = element.getBoundingClientRect();
    const rect = node => {
      const box = node.getBoundingClientRect();
      return { top: box.top, right: box.right, bottom: box.bottom, left: box.left };
    };
    return selectors.map(({ target, boundary }) => {
      const contentRect = rect(element.querySelector(target));
      const boundaryRect = rect(element.querySelector(boundary));
      return {
        target, boundary, sceneWidth: sceneRect.width, contentRect, boundaryRect,
        gap: boundaryRect.bottom - contentRect.bottom,
        minimumGap: sceneRect.width * 0.007,
      };
    });
  }, checks);
  await test.info().attach(`${slug}-content-gap.json`, { body: JSON.stringify(geometry, null, 2), contentType: 'application/json' });
  for (const item of geometry) {
    const context = `${slug} ${item.target} 应完整显示并留出至少场景宽度 0.7% 的底部间隙：${JSON.stringify(item)}`;
    expect(item.gap, context).toBeGreaterThanOrEqual(item.minimumGap - 0.5);
    expect(item.contentRect.top, context).toBeGreaterThanOrEqual(item.boundaryRect.top - 0.5);
    expect(item.contentRect.left, context).toBeGreaterThanOrEqual(item.boundaryRect.left - 0.5);
    expect(item.contentRect.right, context).toBeLessThanOrEqual(item.boundaryRect.right + 0.5);
  }
}

async function readyScene(scene, locale) {
  await expect(scene).toBeVisible();
  await scene.scrollIntoViewIfNeeded();
  const slug = await scene.getAttribute('data-style-scene');
  if (['minimalism', 'editorial', 'glassmorphism', 'bento-grid', 'skeuomorphism', 'brutalism'].includes(slug)) {
    expect(await scene.locator('img').count(), `${slug} 应保留局部照片素材`).toBeGreaterThan(0);
  }
  await expect.poll(() => scene.locator('img').evaluateAll((images) => images.every((image) => !image.getClientRects().length || (image.complete && image.naturalWidth > 0))), {
    message: '缩景中的图片应成功解码，包括延迟加载图片',
  }).toBe(true);
  // 完整 DOM 场景允许局部照片，不允许用 iframe、canvas 或整页截图取代页面结构。
  await expect(scene.locator('iframe, canvas')).toHaveCount(0);
  expect(await scene.locator('*').count()).toBeGreaterThan(8);
  await scene.evaluate(() => document.fonts.ready);
  await assertSceneContentGap(scene, slug);
  const text = await scene.innerText();
  expect(text.trim().length).toBeGreaterThan(30);
  if (locale === 'en') expect(text.replace(/EN\s*\/\s*中文/g, '')).not.toMatch(/[\u4e00-\u9fff]/);
  await expect(scene).toHaveAttribute('data-scene-locale', locale);
  // 卡片只有外层详情链接，视觉中的伪控件不能形成嵌套交互元素。
  await expect(scene.locator('a, button, input, textarea, select, [contenteditable="true"], [tabindex="0"]')).toHaveCount(0);
}

async function readyConceptActions(page) {
  const island = page.locator('article > header astro-island[component-url*="ConceptActions"]');
  await expect(island).toHaveCount(1);
  await expect.poll(() => island.evaluate((element) => element.hasAttribute('ssr'))).toBe(false);
  return island.locator('button[aria-pressed]');
}

async function capture(page, target, label, testInfo) {
  await page.evaluate(() => document.fonts.ready);
  const candidateCommit = testInfo.config.metadata.candidateCommit || process.env.QA_CANDIDATE_SHA || 'local';
  const file = `${candidateCommit}-${testInfo.project.name}-${label}.png`;
  const screenshotPath = testInfo.outputPath(file);
  const screenshotFiles = [file];
  const screenshotViewports = [{ file, viewport: page.viewportSize(), mode: label.startsWith('home-') ? 'full-page' : 'element' }];
  let viewportGeometry = null;
  let overviewGeometry = null;
  if (label.startsWith('home-')) {
    // 高于视口的区块截图会把真实 sticky 页头拍到图中段；返回页首后保留完整页面与真实页头。
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    await page.screenshot({ path: screenshotPath, fullPage: true, animations: 'disabled', scale: 'css' });
  } else {
    await target.screenshot({ path: screenshotPath, animations: 'disabled', scale: 'css' });
  }
  await testInfo.attach(file, { path: screenshotPath, contentType: 'image/png' });
  if (label.startsWith('home-')) {
    // 再记录正常滚动时的真实视口；sticky 页头保留在视口顶端，首批参考卡片位于其下方。
    await target.locator('[data-style-scene]').first().evaluate((element) => {
      const top = scrollY + element.getBoundingClientRect().top - 80;
      window.scrollTo({ top, behavior: 'instant' });
    });
    viewportGeometry = await page.evaluate(() => {
      const header = document.querySelector('body > header').getBoundingClientRect();
      const scene = document.querySelector('[data-home-styles] [data-style-scene]').getBoundingClientRect();
      return { headerTop: header.top, headerBottom: header.bottom, sceneTop: scene.top, scrollY };
    });
    expect(Math.abs(viewportGeometry.headerTop), JSON.stringify(viewportGeometry)).toBeLessThanOrEqual(0.5);
    expect(viewportGeometry.headerBottom, JSON.stringify(viewportGeometry)).toBeLessThanOrEqual(viewportGeometry.sceneTop);
    const viewportFile = `${candidateCommit}-${testInfo.project.name}-${label.replace('home-', 'home-style-viewport-')}.png`;
    const viewportPath = testInfo.outputPath(viewportFile);
    await page.screenshot({ path: viewportPath, animations: 'disabled', scale: 'css' });
    await testInfo.attach(viewportFile, { path: viewportPath, contentType: 'image/png' });
    screenshotFiles.push(viewportFile);
    screenshotViewports.push({ file: viewportFile, viewport: page.viewportSize(), mode: 'viewport' });
  }
  if (/^home-(zh|en)-1280$/.test(label)) {
    // 交付总览使用真实加高视口；不裁切、拼接或隐藏导航，之后恢复用例原来的 900px 高度。
    const originalViewport = page.viewportSize();
    const originalScroll = await page.evaluate(() => ({ x: scrollX, y: scrollY }));
    const headerHeight = await page.locator('body > header').evaluate(element => element.getBoundingClientRect().height);
    const sectionHeight = await target.evaluate(element => element.getBoundingClientRect().height);
    const overviewViewport = { width: originalViewport.width, height: Math.ceil(sectionHeight + headerHeight + 48) };
    const overviewFile = `${candidateCommit}-${testInfo.project.name}-${label.replace('home-', 'home-style-overview-')}.png`;
    const overviewPath = testInfo.outputPath(overviewFile);
    try {
      await page.setViewportSize(overviewViewport);
      await target.evaluate((element, topGap) => {
        window.scrollTo({ top: scrollY + element.getBoundingClientRect().top - topGap, behavior: 'instant' });
      }, headerHeight + 20);
      overviewGeometry = await page.evaluate(() => {
        const header = document.querySelector('body > header').getBoundingClientRect();
        const section = document.querySelector('[data-home-styles]').getBoundingClientRect();
        return { headerTop: header.top, headerBottom: header.bottom, sectionTop: section.top, sectionBottom: section.bottom, viewportWidth: innerWidth, viewportHeight: innerHeight, scrollY };
      });
      expect(Math.abs(overviewGeometry.headerTop), JSON.stringify(overviewGeometry)).toBeLessThanOrEqual(0.5);
      expect(overviewGeometry.sectionTop, JSON.stringify(overviewGeometry)).toBeGreaterThanOrEqual(overviewGeometry.headerBottom + 19);
      expect(overviewGeometry.sectionBottom, JSON.stringify(overviewGeometry)).toBeLessThanOrEqual(overviewViewport.height - 19);
      await page.screenshot({ path: overviewPath, animations: 'disabled', scale: 'css' });
      await testInfo.attach(overviewFile, { path: overviewPath, contentType: 'image/png' });
      screenshotFiles.push(overviewFile);
      screenshotViewports.push({ file: overviewFile, viewport: overviewViewport, mode: 'viewport' });
    } finally {
      await page.setViewportSize(originalViewport);
      await page.evaluate(({ x, y }) => window.scrollTo({ left: x, top: y, behavior: 'instant' }), originalScroll);
    }
  }
  await testInfo.attach(`${label}-source.json`, {
    body: JSON.stringify({
      candidateCommit, engine: testInfo.project.name, url: page.url(), viewport: page.viewportSize(), screenshotScale: 'css', screenshotFiles, screenshotViewports, viewportGeometry, overviewGeometry,
      sceneSlugs: await target.locator('[data-style-scene]').evaluateAll((elements) => elements.map((element) => element.dataset.styleScene)),
    }, null, 2),
    contentType: 'application/json',
  });
}

for (const locale of LOCALES) {
  for (const width of WIDTHS) {
    test(`参考缩景 首页 ${locale} ${width}px：十种场景完整且保持可点击详情入口`, async ({ page }, testInfo) => {
      test.setTimeout(60_000);
      const errors = observeFailures(page);
      await page.setViewportSize({ width, height: 900 });
      await page.goto(pathFor(locale));
      const home = page.locator('[data-home-styles]');
      await expect(home).toBeVisible();
      expect(await home.locator('[data-style-scene]').evaluateAll((scenes) => scenes.map((scene) => scene.dataset.styleScene).sort())).toEqual([...STYLES].sort());
      for (const slug of STYLES) {
        const scene = styleScene(home, slug);
        await readyScene(scene, locale);
        await expect(scene.locator('xpath=ancestor::a[1]')).toHaveAttribute('href', pathFor(locale, `/styles/${slug}`));
      }
      await capture(page, home, `home-${locale}-${width}`, testInfo);
      await assertNoOverflow(page, `首页 ${locale} ${width}px`);
      expect(errors).toEqual([]);
    });

    test(`参考缩景 风格列表 ${locale} ${width}px：十种参考保持对应列表入口`, async ({ page }, testInfo) => {
      test.setTimeout(60_000);
      const errors = observeFailures(page);
      await page.setViewportSize({ width, height: 900 });
      await page.goto(pathFor(locale, '/styles'));
      for (const slug of STYLES) {
        const scene = styleScene(page, slug);
        await expect(scene).toHaveCount(1);
        await readyScene(scene, locale);
        const row = scene.locator('xpath=ancestor::a[1]');
        await expect(row).toHaveAttribute('href', pathFor(locale, `/styles/${slug}`));
        // 保留整行标题和缩景，便于核对预览与文字、详情链接的对应关系。
        await capture(page, row, `list-${slug}-${locale}-${width}`, testInfo);
      }
      await assertNoOverflow(page, `风格列表 ${locale} ${width}px`);
      expect(errors).toEqual([]);
    });

    for (const slug of STYLES) {
      test(`参考缩景 ${slug} ${locale} ${width}px：详情预览、图片与原交互`, async ({ page }, testInfo) => {
        test.setTimeout(45_000);
        const errors = observeFailures(page);
        await page.setViewportSize({ width, height: 900 });
        await page.goto(pathFor(locale, `/styles/${slug}`));
        const { experience, iframe, frame, scene } = await readyStyleFrame(page, slug, locale);
        // 详情中的真控件来自同一品牌整页；原十套照片不可被无关组件demo替代。
        if (['minimalism', 'editorial', 'glassmorphism', 'bento-grid', 'skeuomorphism', 'brutalism'].includes(slug)) {
          expect(await scene.locator('.scene-page img').count(), slug).toBeGreaterThan(0);
        }
        await expect(scene.locator('iframe, canvas')).toHaveCount(0);
        expect((await scene.innerText()).trim().length).toBeGreaterThan(30);
        await capture(page, experience, `detail-${slug}-${locale}-${width}`, testInfo);
        await exerciseStyleFlow(scene, slug, locale);
        await reloadStyleFrame(experience, frame);
        await expect(scene).toBeVisible();
        await expect(iframe).toHaveAttribute('title', locale === 'en' ? 'Full-page interaction' : '完整页面交互');
        await assertNoOverflow(page, `${slug} 已加载整页 ${locale} ${width}px`);
        expect(errors).toEqual([]);
      });
    }
  }
}

for (const locale of LOCALES) {
  for (const width of [1280, 390]) {
    test(`参考缩景 ${locale} ${width}px：首页进入、语言切换、收藏恢复与列表进入`, async ({ page }) => {
      test.setTimeout(60_000);
      const errors = observeFailures(page);
      const otherLocale = locale === 'zh' ? 'en' : 'zh';
      await page.setViewportSize({ width, height: 900 });
      await page.goto(pathFor(locale));
      const homeCard = styleScene(page.locator('[data-home-styles]'), 'minimalism').locator('xpath=ancestor::a[1]');
      await homeCard.click();
      await expect(page).toHaveURL(new RegExp(`${pathFor(locale, '/styles/minimalism')}/?$`));
      const save = await readyConceptActions(page);
      await expect(save).toHaveAttribute('aria-pressed', 'false');
      await save.click();
      await expect(save).toHaveAttribute('aria-pressed', 'true');
      await page.locator(`header a[lang="${otherLocale}"]`).click();
      await expect(page).toHaveURL(new RegExp(`${pathFor(otherLocale, '/styles/minimalism')}/?$`));
      await readyStyleFrame(page, 'minimalism', otherLocale);
      await expect(await readyConceptActions(page)).toHaveAttribute('aria-pressed', 'true');
      await page.goto(pathFor(otherLocale, '/saved'));
      const savedLink = page.locator(`a[href="${pathFor(otherLocale, '/styles/minimalism')}"]`).first();
      await expect(savedLink).toBeVisible();
      await savedLink.click();
      await readyStyleFrame(page, 'minimalism', otherLocale);
      await page.goto(pathFor(locale, '/styles'));
      await styleScene(page, 'retro-web').locator('xpath=ancestor::a[1]').click();
      await expect(page).toHaveURL(new RegExp(`${pathFor(locale, '/styles/retro-web')}/?$`));
      await readyStyleFrame(page, 'retro-web', locale);
      await page.goBack();
      await expect(page).toHaveURL(new RegExp(`${pathFor(locale, '/styles')}/?$`));
      await assertNoOverflow(page, `入口往返 ${locale} ${width}px`);
      expect(errors).toEqual([]);
    });
  }
}


for (const locale of LOCALES) {
  for (const width of [1280, 390]) {
    test(`参考缩景 Retro Web ${locale} ${width}px：留言校验、键盘、往返、重复提交和清空`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(pathFor(locale, '/styles/retro-web'));
      const { experience, frame, scene: content } = await readyStyleFrame(page, 'retro-web', locale);
      const action = name => content.locator(`[data-scene-action="${name}"]`).first();
      const openGuestbook = () => action('retro-page-4').click();
      const form = content.locator('[data-other-form="guestbook"]');
      const entryList = content.getByRole('list', { name: locale === 'en' ? 'Demo messages' : '演示留言' });
      const snapshotStorage = () => frame.locator('body').evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }));
      const storedBefore = await snapshotStorage();
      await frame.locator('body').evaluate(() => {
        window.__retroStorageWrites = [];
        for (const method of ['setItem', 'removeItem', 'clear']) {
          const original = Storage.prototype[method];
          Storage.prototype[method] = function (...args) { window.__retroStorageWrites.push({ method, key: args[0] }); return original.apply(this, args); };
        }
      });
      const outgoing = [];
      const recordRequest = request => {
        const url = new URL(request.url());
        if (request.method() !== 'GET' || (url.protocol !== 'blob:' && url.origin !== 'http://127.0.0.1:4337')) outgoing.push(`${request.method()} ${request.url()}`);
      };
      page.on('request', recordRequest);
      await openGuestbook();
      const baseline = await entryList.getByRole('listitem').allTextContents();
      const submit = form.locator('[type="submit"]');
      const name = form.locator('[name="name"]');
      const message = form.getByRole('textbox', { name: locale === 'en' ? 'Your message' : '你的留言' });
      // 真正空值由原生required阻止；空白字符串由应用trim守卫阻止。
      await submit.click();
      expect(await form.evaluate(element => element.checkValidity())).toBe(false);
      await expect(entryList.getByRole('listitem')).toHaveText(baseline);
      await name.fill('Atlas visitor');
      await message.fill('   ');
      await submit.click();
      await expect(form.getByRole('status')).toHaveText(locale === 'en' ? 'Enter a nickname and message, not just spaces.' : '请填写昵称和留言，不能仅为空格。');
      await expect(entryList.getByRole('listitem')).toHaveText(baseline);
      await name.fill('  Atlas visitor  ');
      await message.fill('  Hello, early web!  ');
      await message.focus();
      await page.keyboard.press('Tab');
      await expect(submit).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(entryList.getByRole('listitem').first()).toHaveText('Atlas visitor: Hello, early web!');
      await expect(entryList.getByRole('listitem')).toHaveCount(baseline.length + 1);
      await expect(message).toHaveValue('');
      await submit.click();
      await expect(entryList.getByRole('listitem')).toHaveCount(baseline.length + 1);
      // 相同内容的两次明确提交应追加两条；空字段的重复click不能追加。
      await name.fill('Atlas visitor');
      await message.fill('Hello, early web!');
      await submit.click();
      await expect(entryList.getByRole('listitem')).toHaveCount(baseline.length + 2);
      await expect(form.getByRole('status')).toContainText(locale === 'en' ? 'page only' : '仅当前页面');
      await action('retro-page-2').click();
      await expect(content.locator('[data-retro-heading]')).toHaveText('Projects');
      await action('retro-back').click();
      await expect(content.locator('[data-retro-heading]')).toHaveText('Guestbook');
      await expect(entryList.getByRole('listitem')).toHaveCount(baseline.length + 2);
      await action('retro-forward').click();
      await expect(content.locator('[data-retro-heading]')).toHaveText('Projects');
      await openGuestbook();
      await expect(entryList.getByRole('listitem')).toHaveCount(baseline.length + 2);
      expect(await snapshotStorage()).toEqual(storedBefore);
      expect(await frame.locator('body').evaluate(() => window.__retroStorageWrites)).toEqual([]);
      expect(outgoing).toEqual([]);
      page.off('request', recordRequest);
      await capture(page, experience, `interactive-retro-web-${locale}-${width}`, testInfo);
      await reloadStyleFrame(experience, frame);
      await openGuestbook();
      await expect(entryList.getByRole('listitem')).toHaveText(baseline);
      await name.fill('Atlas visitor');
      await message.fill('Refresh clears this preview.');
      await submit.click();
      await expect(entryList.getByRole('listitem')).toHaveCount(baseline.length + 1);
      await page.reload();
      await readyStyleFrame(page, 'retro-web', locale);
      await openGuestbook();
      await expect(entryList.getByRole('listitem')).toHaveText(baseline);
      await assertNoOverflow(page, `Retro Web 留言 ${locale} ${width}px`);
    });
  }
}
