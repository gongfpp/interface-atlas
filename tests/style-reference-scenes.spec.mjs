import { test, expect } from './helpers/private-browser.mjs';

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

async function capture(page, target, label, testInfo) {
  await page.evaluate(() => document.fonts.ready);
  const candidateCommit = testInfo.config.metadata.candidateCommit || process.env.QA_CANDIDATE_SHA || 'local';
  const file = `${candidateCommit}-${testInfo.project.name}-${label}.png`;
  const screenshotPath = testInfo.outputPath(file);
  const screenshotFiles = [file];
  let viewportGeometry = null;
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
  }
  await testInfo.attach(`${label}-source.json`, {
    body: JSON.stringify({
      candidateCommit, engine: testInfo.project.name, url: page.url(), viewport: page.viewportSize(), screenshotScale: 'css', screenshotFiles, viewportGeometry,
      sceneSlugs: await target.locator('[data-style-scene]').evaluateAll((elements) => elements.map((element) => element.dataset.styleScene)),
    }, null, 2),
    contentType: 'application/json',
  });
}

async function exerciseOriginalDemo(interactive, slug, locale) {
  const content = interactive.locator('.demo-content');
  if (slug === 'minimalism') {
    await content.getByRole('textbox').fill('scene@example.com');
    await expect(content.getByRole('textbox')).toHaveValue('scene@example.com');
    await content.getByRole('button', { name: /FOLLOW$/ }).click();
    await expect(content.getByRole('button', { name: /FOLLOWING/ })).toBeVisible();
  } else if (slug === 'swiss-style') {
    await content.getByRole('textbox').fill('Typography');
    await expect(content.getByRole('textbox')).toHaveValue('Typography');
  } else if (slug === 'editorial') {
    await content.getByRole('button', { name: /Continue/ }).click();
    await expect(content.getByRole('button', { name: /Fold/ })).toBeVisible();
    await expect(content).toContainText('A well-set column');
  } else if (slug === 'glassmorphism') {
    await content.locator('input').first().fill('scene@example.com');
    await expect(content.locator('input').first()).toHaveValue('scene@example.com');
  } else if (slug === 'bento-grid') {
    const save = content.getByRole('button', { name: /收藏/ });
    await save.click();
    await expect(save).toContainText('♡ 收藏');
    await save.click();
    await expect(save).toContainText('♥ 已收藏');
  } else if (slug === 'neumorphism') {
    await content.getByRole('button', { name: locale === 'en' ? 'Play preview' : '播放预览' }).click();
    await expect(content.getByRole('status')).toContainText(locale === 'en' ? 'playing' : '播放中');
    await content.getByRole('button', { name: locale === 'en' ? 'Next track' : '下一首' }).click();
    await expect(content).toContainText('A quiet place');
  } else if (slug === 'skeuomorphism') {
    await content.getByRole('button', { name: 'POWER ON' }).click();
    await expect(content.getByRole('button', { name: 'POWER OFF' })).toBeVisible();
    await content.getByRole('textbox', { name: 'volume' }).fill('42');
    await expect(content).toContainText('CH-42');
  } else if (slug === 'brutalism') {
    await content.getByRole('button', { name: locale === 'en' ? 'HIT 0' : '拍一下 0', exact: true }).click();
    await expect(content.getByRole('button', { name: locale === 'en' ? 'HIT 1' : '拍一下 1', exact: true })).toBeVisible();
  } else if (slug === 'retro-web') {
    await content.getByRole('button', { name: locale === 'en' ? /Sign the guestbook/ : /在留言簿写一句话/ }).click();
    await content.getByRole('textbox', { name: locale === 'en' ? 'Your message' : '你的留言' }).fill('Hello, early web!');
    await content.getByRole('button', { name: locale === 'en' ? 'Add message' : '添加留言', exact: true }).click();
    await expect(content.getByRole('list', { name: locale === 'en' ? 'Demo messages' : '演示留言' })).toContainText('Hello, early web!');
    await expect(content.getByRole('status')).toContainText(locale === 'en' ? 'Added to this preview only.' : '已加入当前预览。');
  } else if (slug === 'neobrutalism') {
    await content.getByRole('button', { name: /点赞 128/ }).click();
    await expect(content.getByRole('button', { name: /点赞 129/ })).toBeVisible();
  }
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
        const preview = page.locator('[data-style-preview]');
        const scene = styleScene(preview, slug);
        await readyScene(scene, locale);
        await capture(page, preview, `detail-${slug}-${locale}-${width}`, testInfo);
        await assertNoOverflow(page, `${slug} 静态详情 ${locale} ${width}px`);
        const interactive = page.locator('[data-style-interactive]');
        await interactive.scrollIntoViewIfNeeded();
        await expect(interactive.locator('.demo-workbench')).toBeVisible();
        const previewBox = await preview.boundingBox();
        const interactiveBox = await interactive.boundingBox();
        expect(previewBox.y + previewBox.height).toBeLessThan(interactiveBox.y);
        await expect(interactive.locator('.demo-content')).toBeVisible();
        // 320px 负责极窄布局；390px 和桌面执行既有交互、模式切换及重置。
        if (width >= 390) {
          await exerciseOriginalDemo(interactive, slug, locale);
          const dark = interactive.getByRole('button', { name: locale === 'en' ? 'Dark' : '深色', exact: true });
          if (await dark.count()) {
            await dark.click();
            await expect(dark).toHaveAttribute('aria-pressed', 'true');
            await interactive.getByRole('button', { name: locale === 'en' ? 'Default' : '默认', exact: true }).click();
          }
          const narrow = interactive.getByRole('button', { name: locale === 'en' ? 'Narrow container' : '窄容器', exact: true });
          await narrow.click();
          await expect(narrow).toHaveAttribute('aria-pressed', 'true');
          await expect.poll(() => interactive.locator('.demo-viewport').evaluate((element) => element.getBoundingClientRect().width)).toBeLessThanOrEqual(360);
          await interactive.getByRole('button', { name: locale === 'en' ? /Reset/ : /重置/ }).click();
          await expect(interactive.locator('.demo-content')).toBeVisible();
        }
        await assertNoOverflow(page, `${slug} 已加载交互 ${locale} ${width}px`);
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
      const save = page.locator('article > header').getByRole('button', { name: locale === 'zh' ? '☆ 收藏' : '☆ Save', exact: true });
      await save.click();
      await expect(page.locator('article > header').getByRole('button', { name: locale === 'zh' ? '★ 已收藏' : '★ Saved', exact: true })).toHaveAttribute('aria-pressed', 'true');
      await page.locator(`header a[lang="${otherLocale}"]`).click();
      await expect(page).toHaveURL(new RegExp(`${pathFor(otherLocale, '/styles/minimalism')}/?$`));
      await readyScene(styleScene(page.locator('[data-style-preview]'), 'minimalism'), otherLocale);
      await expect(page.locator('article > header').getByRole('button', { name: otherLocale === 'zh' ? '★ 已收藏' : '★ Saved', exact: true })).toHaveAttribute('aria-pressed', 'true');
      await page.goto(pathFor(otherLocale, '/saved'));
      const savedLink = page.locator(`a[href="${pathFor(otherLocale, '/styles/minimalism')}"]`).first();
      await expect(savedLink).toBeVisible();
      await savedLink.click();
      await expect(styleScene(page.locator('[data-style-preview]'), 'minimalism')).toBeVisible();
      await page.goto(pathFor(locale, '/styles'));
      await styleScene(page, 'retro-web').locator('xpath=ancestor::a[1]').click();
      await expect(page).toHaveURL(new RegExp(`${pathFor(locale, '/styles/retro-web')}/?$`));
      await expect(styleScene(page.locator('[data-style-preview]'), 'retro-web')).toBeVisible();
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
      const interactive = page.locator('[data-style-interactive]');
      await interactive.scrollIntoViewIfNeeded();
      const content = interactive.locator('.demo-content');
      const openGuestbook = () => content.getByRole('button', { name: locale === 'en' ? /Sign the guestbook/ : /在留言簿写一句话/ }).click();
      const entryList = content.getByRole('list', { name: locale === 'en' ? 'Demo messages' : '演示留言' });
      await expect(content).toBeVisible();
      const storedBefore = await page.evaluate(() => ({ ...localStorage }));
      const outgoing = [];
      const recordRequest = request => {
        if (request.method() !== 'GET' || !request.url().startsWith('http://127.0.0.1:4337/')) outgoing.push(`${request.method()} ${request.url()}`);
      };
      page.on('request', recordRequest);
      await openGuestbook();
      const submit = content.getByRole('button', { name: locale === 'en' ? 'Add message' : '添加留言', exact: true });
      await submit.click();
      await expect(content.getByRole('status')).toHaveText(locale === 'en' ? 'Write a message first.' : '请先写一句话。');
      const message = content.getByRole('textbox', { name: locale === 'en' ? 'Your message' : '你的留言' });
      await message.fill('  Hello, early web!  ');
      await message.focus();
      await page.keyboard.press('Tab');
      await expect(submit).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(entryList.getByRole('listitem')).toHaveText(['Hello, early web!']);
      await expect(message).toHaveValue('');
      await submit.click();
      await expect(entryList.getByRole('listitem')).toHaveCount(1);
      await content.getByRole('navigation', { name: locale === 'en' ? 'Demo pages' : '演示页面' }).getByRole('button', { name: locale === 'en' ? '▷ Projects' : '▷ 项目', exact: true }).click();
      await expect(content.getByRole('heading', { level: 3 })).toHaveText(locale === 'en' ? 'Projects' : '项目');
      await content.getByRole('navigation', { name: locale === 'en' ? 'Demo pages' : '演示页面' }).getByRole('button', { name: locale === 'en' ? '▷ Guestbook' : '▷ 留言簿', exact: true }).click();
      await expect(entryList.getByRole('listitem')).toHaveText(['Hello, early web!']);
      expect(await page.evaluate(() => ({ ...localStorage }))).toEqual(storedBefore);
      expect(outgoing).toEqual([]);
      page.off('request', recordRequest);
      await capture(page, interactive, `interactive-retro-web-${locale}-${width}`, testInfo);
      await interactive.getByRole('button', { name: locale === 'en' ? /Reset/ : /重置/ }).click();
      await openGuestbook();
      await expect(entryList.getByRole('listitem')).toHaveCount(0);
      await message.fill('Refresh clears this preview.');
      await submit.click();
      await expect(entryList.getByRole('listitem')).toHaveCount(1);
      await page.reload();
      await interactive.scrollIntoViewIfNeeded();
      await openGuestbook();
      await expect(entryList.getByRole('listitem')).toHaveCount(0);
      await assertNoOverflow(page, `Retro Web 留言 ${locale} ${width}px`);
    });
  }
}
