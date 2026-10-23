import { expect } from './private-browser.mjs';

export const REFERENCE_STYLES = [
  'minimalism', 'swiss-style', 'editorial', 'glassmorphism', 'bento-grid',
  'neumorphism', 'skeuomorphism', 'brutalism', 'neobrutalism', 'retro-web',
];
export const STYLE_SLUGS = [
  'art-deco', 'aurora', 'bauhaus', 'bento-grid', 'brutalism', 'claymorphism',
  'corporate-memphis', 'cyberpunk', 'editorial', 'flat-design', 'glassmorphism',
  'hand-drawn', 'liquid-glass', 'memphis', 'minimalism', 'neobrutalism',
  'neumorphism', 'organic', 'pixel-art', 'retro-futurism', 'retro-web',
  'skeuomorphism', 'swiss-style', 'vaporwave', 'y2k',
];
export const pathFor = (locale, route = '/') => `${locale === 'en' ? '/en' : ''}${route}`;
export const sceneAction = (root, action) => root.locator(`[data-scene-action="${action}"]`).first();

export async function assertStyleDocumentBoundary(page) {
  expect(await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    return { behavior: style.scrollBehavior, padding: style.scrollPaddingTop, gutter: style.scrollbarGutter };
  })).toEqual({ behavior: 'auto', padding: '0px', gutter: 'stable' });
}

export async function readyStyleFrame(page, slug, locale) {
  const experience = page.locator('[data-style-preview][data-style-interactive]');
  await expect(experience).toHaveCount(1);
  await experience.scrollIntoViewIfNeeded();
  const iframe = experience.locator('iframe[data-style-frame]');
  await expect(iframe).toHaveCount(1);
  await expect(iframe).toHaveAttribute('src', new RegExp(`${pathFor(locale, `/style-scenes/${slug}/`)}`));
  const frame = page.frameLocator('[data-style-frame]');
  const scene = frame.locator(`[data-style-scene="${slug}"][data-scene-interactive="true"]`);
  await expect(scene).toBeVisible();
  await expect(scene).toHaveAttribute('data-scene-locale', locale);
  await scene.evaluate(() => document.fonts.ready);
  // 首屏不预取屏外懒加载图片；续页图片随下面的实际滚动与阅读流程验证。
  await expect.poll(() => scene.locator('.scene-page img').evaluateAll(images => images.every(image => !image.getClientRects().length || (image.complete && image.naturalWidth > 0)))).toBe(true);
  return { experience, iframe, frame, scene };
}

export async function assertNoOverflow(pageOrRoot, label) {
  const measure = () => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth });
  const dimensions = 'locator' in pageOrRoot && typeof pageOrRoot.viewportSize === 'function'
    ? await pageOrRoot.evaluate(measure)
    : await pageOrRoot.locator('body').evaluate(measure);
  expect(dimensions.document, `${label}: ${JSON.stringify(dimensions)}`).toBeLessThanOrEqual(dimensions.viewport + 1);
  expect(dimensions.body, `${label}: ${JSON.stringify(dimensions)}`).toBeLessThanOrEqual(dimensions.viewport + 1);
}

export async function assertUsableGeometry(root, width, testInfo, label) {
  const geometry = await root.evaluate((scene, mobile) => {
    const visible = element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden';
    const rect = element => {
      const r = element.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
    };
    const identify = element => ({ tag: element.tagName, action: element.dataset.sceneAction || element.dataset.command || '', text: (element.getAttribute('aria-label') || element.textContent || '').trim().slice(0, 100) });
    // 增强选择器保留 1px 原生表单 Owner；先验证适配关系，再测真实可交互触发器。
    // 不泛排 aria-hidden / opacity:0，也不降低任何用户目标的 24px 门槛。
    const isNativeOwner = element => element.matches('select[data-scene-native-select][aria-hidden="true"]');
    const nativeOwners = [...scene.querySelectorAll('select[data-scene-native-select][aria-hidden="true"]')].filter(select => visible(select.closest('.scene-select') || select)).map(select => {
      const wrapper = select.closest('.scene-select');
      const triggers = [...(wrapper?.querySelectorAll(':scope > button[role="combobox"]') || [])].filter(visible);
      const trigger = triggers[0];
      const panelId = trigger?.getAttribute('aria-controls');
      return {
        tabIndex:select.tabIndex, ownerRendered:Boolean(visible(select)), ownerCount:wrapper?.querySelectorAll(':scope > select[data-scene-native-select]').length || 0, triggerCount:triggers.length,
        selectedLabel:select.selectedOptions[0]?.label || '', triggerLabel:trigger?.textContent?.trim(),
        panelLinked:Boolean(panelId && wrapper?.querySelector('[role="listbox"]')?.id === panelId),
        disabledSynced:trigger?.disabled === select.disabled,
        requiredSynced:trigger?.getAttribute('aria-required') === String(select.required),
        invalidSynced:trigger?.getAttribute('aria-invalid') === (select.getAttribute('aria-invalid') || 'false'),
      };
    });
    const controls = [...scene.querySelectorAll('button,input,textarea,select,a[href]')].filter(element => visible(element) && !isNativeOwner(element)).map(element => {
      const r = rect(element);
      const labelElement = element.matches('input[type=checkbox],input[type=radio]') ? element.closest('label') : null;
      const hit = labelElement ? rect(labelElement) : r;
      const clippedBy = [];
      for (let ancestor = element.parentElement; ancestor && ancestor !== document.body; ancestor = ancestor.parentElement) {
        const style = getComputedStyle(ancestor);
        const boundary = rect(ancestor);
        if (['hidden', 'clip'].includes(style.overflowX) && (r.left < boundary.left - 1 || r.right > boundary.right + 1)) clippedBy.push(ancestor.className);
        if (['hidden', 'clip'].includes(style.overflowY) && (r.top < boundary.top - 1 || r.bottom > boundary.bottom + 1)) clippedBy.push(ancestor.className);
      }
      return { ...identify(element), rect: r, hit, clippedBy, clientWidth: element.clientWidth };
    });
    const copy = [...scene.querySelectorAll('.scene-description,.gs-heading > p:last-child,.gs-panel > p,.other-section > p,.vertex-section > p,.paper-section > p,[role=status]')].filter(visible).filter(element => element.textContent.trim()).map(element => ({ ...identify(element), rect: rect(element), fontSize: parseFloat(getComputedStyle(element).fontSize), clientWidth: element.clientWidth, scrollWidth: element.scrollWidth }));
    const titles = [...scene.querySelectorAll('[data-generic-title]')].map(element => {
      const ranges = [], walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (!node.textContent.trim()) continue;
        const range = document.createRange(); range.selectNodeContents(node);
        ranges.push(...[...range.getClientRects()].map(r => ({ left:r.left, right:r.right })));
      }
      return { text:element.textContent, rect:rect(element), ranges };
    });
    const fills = [...scene.querySelectorAll('[data-generic-art][data-art-panel="photo"],[data-generic-art][data-art-panel="mountain"]')].map(panel => ({
      panel:rect(panel), fill:panel.firstElementChild ? rect(panel.firstElementChild) : null,
    }));
    return { viewport: innerWidth, mobile, nativeOwners, controls, copy, titles, fills, slug:scene.dataset.styleScene, generic:scene.hasAttribute('data-generic-style') };
  }, width <= 390);
  await testInfo.attach(`${label}-usable-geometry.json`, { body: JSON.stringify(geometry, null, 2), contentType: 'application/json' });
  for (const owner of geometry.nativeOwners) {
    expect(owner, `${label} enhanced select form owner`).toEqual({
      tabIndex:-1, ownerRendered:true, ownerCount:1, triggerCount:1, selectedLabel:owner.selectedLabel, triggerLabel:owner.selectedLabel,
      panelLinked:true, disabledSynced:true, requiredSynced:true, invalidSynced:true,
    });
  }
  for (const control of geometry.controls) {
    const context = `${label} control ${JSON.stringify(control)}`;
    expect(control.clientWidth, context).toBeGreaterThan(0);
    expect(control.rect.left, context).toBeGreaterThanOrEqual(-1);
    expect(control.rect.right, context).toBeLessThanOrEqual(geometry.viewport + 1);
    expect(control.clippedBy, context).toEqual([]);
    if (geometry.mobile) {
      expect(control.hit.width, context).toBeGreaterThanOrEqual(24);
      expect(control.hit.height, context).toBeGreaterThanOrEqual(24);
    }
  }
  expect(geometry.fills).toHaveLength(['organic','aurora','vaporwave'].includes(geometry.slug) ? 1 : 0);
  for (const {panel,fill} of geometry.fills) {
    expect(fill, `${label} illustrated panel must retain its original scene`).not.toBeNull();
    expect(fill.width).toBeGreaterThanOrEqual(panel.width - 3);
    expect(fill.height).toBeGreaterThanOrEqual(panel.height - 3);
  }
  expect(geometry.titles).toHaveLength(geometry.generic ? 1 : 0);
  for (const title of geometry.titles) for (const range of title.ranges) {
    const context = `${label} title glyphs ${JSON.stringify(title)}`;
    expect(range.left, context).toBeGreaterThanOrEqual(title.rect.left - 1);
    expect(range.right, context).toBeLessThanOrEqual(title.rect.right + 1);
  }
  for (const copy of geometry.copy) {
    const context = `${label} copy ${JSON.stringify(copy)}`;
    expect(copy.rect.left, context).toBeGreaterThanOrEqual(-1);
    expect(copy.rect.right, context).toBeLessThanOrEqual(geometry.viewport + 1);
    expect(copy.scrollWidth, context).toBeLessThanOrEqual(copy.clientWidth + 1);
    if (geometry.mobile) expect(copy.fontSize, context).toBeGreaterThanOrEqual(14);
  }
}

export async function reloadStyleFrame(experience, frame, control = '[data-style-reset]') {
  const button = experience.locator(control);
  const expectedMode = await button.getAttribute('data-style-mode')
    || await experience.locator('[data-style-mode][aria-pressed="true"]').getAttribute('data-style-mode');
  const token = `test-${Date.now()}-${Math.random()}`;
  await frame.locator('body').evaluate((_, value) => { window.__styleTestDocument = value; }, token);
  await button.click();
  await expect.poll(async () => {
    try {
      // 旧context可在evaluate过程中被导航销毁；新document、mode与fonts必须在同一次读取中就绪。
      return await frame.locator('body').evaluate(async (_, previousToken) => {
        await document.fonts.ready;
        return {
          newDocument: window.__styleTestDocument !== previousToken,
          documentToken: window.__styleTestDocument ?? null,
          readyState: document.readyState,
          mode: document.body.dataset.mode ?? null,
          urlMode: new URLSearchParams(location.search).get('mode') || 'default',
          fonts: document.fonts.status,
        };
      }, token);
    } catch (error) {
      if (/Execution context was destroyed|Cannot find context with specified id/.test(error.message)) {
        return { navigationInProgress: true };
      }
      throw error;
    }
  }).toEqual({ newDocument: true, documentToken: null, readyState: 'complete', mode: expectedMode, urlMode: expectedMode, fonts: 'loaded' });
}

async function closeDialog(root, dialog, opener) {
  await dialog.locator('[data-close-dialog]').first().click();
  await expect(dialog).not.toBeVisible();
  if (opener) await expect(opener).toBeFocused();
}

async function swissFlow(root, locale) {
  const en = locale === 'en';
  await sceneAction(root, 'primary').click();
  await expect(root.locator('#scene-section-0')).toBeFocused();
  const project = sceneAction(root, 'project-0');
  await project.click();
  const dialog = root.locator('[data-scene-dialog="project"]');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[data-project-title]')).toHaveText('NORTH / Brand identity');
  await expect(dialog.locator('[data-project-copy]')).toContainText(en ? 'street wayfinding' : '街道导视');
  await expect(dialog.locator('[data-project-copy]')).toContainText(en ? 'responsive website' : '响应式网站');
  await closeDialog(root, dialog, project);
  await sceneAction(root, 'menu').click();
  const menu = root.locator('[data-scene-dialog="menu"]');
  await expect(menu).toBeVisible();
  await sceneAction(menu, 'nav-3').click();
  await expect(menu).not.toBeVisible();
  await expect(root.locator('#scene-section-3')).toBeFocused();
  const form = root.locator('[data-scene-form="contact"]');
  await form.locator('[name="name"]').fill('Atlas regression');
  await form.locator('[name="email"]').fill('regression@example.com');
  await form.locator('[name="brief"]').fill('An accessible identity for a neighbourhood library.');
  await form.locator('[type="submit"]').click();
  await expect(form.getByRole('status')).toContainText(en ? 'Project brief for Atlas regression:' : '已整理 Atlas regression 的项目简介');
  await expect(form.getByRole('status')).toContainText('An accessible identity for a neighbourhood library.');
  await expect(form.getByRole('status')).toContainText(en ? 'No email was sent' : '未发送邮件');
}

async function editorialFlow(root, locale) {
  const en = locale === 'en';
  await sceneAction(root, 'primary').click();
  await expect(root.locator('#scene-section-0')).toBeFocused();
  for (const photo of await root.locator('.paper-list-photo').all()) {
    await photo.scrollIntoViewIfNeeded();
    await expect.poll(() => photo.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
  }
  const story = sceneAction(root, 'story-0');
  await story.click();
  const dialog = root.locator('[data-scene-dialog="story"]');
  await expect(dialog.locator('#story-title')).toHaveText(en ? 'Morning in the mountains' : '群山间的清晨');
  await expect(dialog.locator('[data-story-body]')).toContainText(en ? 'valley breeze' : '山谷里的风');
  const photo = dialog.locator('[data-story-photo]:not([hidden])');
  await photo.scrollIntoViewIfNeeded();
  await expect.poll(() => photo.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
  const save = sceneAction(dialog, 'save-story');
  await save.click();
  await expect(save).toHaveAttribute('aria-pressed', 'true');
  await closeDialog(root, dialog, story);
  await story.click();
  await expect(save).toHaveAttribute('aria-pressed', 'true');
  await save.click();
  await expect(save).toHaveAttribute('aria-pressed', 'false');
  await closeDialog(root, dialog, story);
  const searchTrigger = sceneAction(root, 'search');
  await searchTrigger.click();
  const search = root.locator('[data-scene-dialog="search"]');
  const field = search.locator('[data-story-search]');
  await field.fill('zzzz-no-story');
  await expect(search.locator('[data-search-results] button:visible')).toHaveCount(0);
  await expect(search.getByRole('status')).toHaveText(en ? 'Found 0 stories' : '找到 0 篇文章');
  await field.fill(en ? 'wandering' : '城市');
  await expect(search.locator('[data-search-results] button:visible')).toHaveCount(1);
  await search.locator('[data-search-results] button:visible').click();
  await expect(dialog.locator('#story-title')).toHaveText(en ? 'The art of wandering' : '城市漫游指南');
  await photo.scrollIntoViewIfNeeded();
  await expect.poll(() => photo.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(save).toHaveAttribute('aria-pressed', 'false');
  await closeDialog(root, dialog);
}

// 每条风格独立验证自己的业务结果，不以“存在按钮”代替交互结果。
export async function exerciseStyleFlow(root, slug, locale) {
  if (slug === 'swiss-style') return swissFlow(root, locale);
  if (slug === 'editorial') return editorialFlow(root, locale);
  if (REFERENCE_STYLES.includes(slug)) return referenceFlow(root, slug, locale);
  return genericFlow(root, slug, locale);
}

async function referenceFlow(root, slug, locale) {
  const en = locale === 'en';
  const otherDialog = name => root.locator(`[data-other-dialog="${name}"]`);
  const closeOther = async (dialog, opener) => {
    await dialog.locator('[data-other-close]').click();
    await expect(dialog).not.toBeVisible();
    if (opener) await expect(opener).toBeFocused();
  };
  if (['minimalism', 'skeuomorphism'].includes(slug)) {
    await sceneAction(root, 'primary').click();
    await expect(root.locator('#scene-section-0')).toBeFocused();
    const detail = sceneAction(root, 'goods-detail-0');
    await detail.click();
    const product = otherDialog('product');
    const title = slug === 'minimalism' ? (en ? 'Lumo Focus' : 'Lumo 专注器') : (en ? 'Classic film camera' : '经典胶片相机');
    await expect(product.locator('[data-product-title]')).toHaveText(title);
    await expect(product.locator('[data-product-description]')).toContainText(slug === 'minimalism' ? 'USB-C' : '35 mm');
    await product.locator('[data-product-finish]').selectOption({ index: 1 });
    await sceneAction(product, 'goods-add').click();
    await expect(product.locator('[data-product-status]')).toContainText(title);
    await sceneAction(product, 'goods-bag').click();
    const bag = otherDialog('bag');
    await expect(bag.locator('[data-bag-items]')).toContainText(title);
    await expect(bag.locator('[data-bag-items]')).toContainText(en ? 'Charcoal' : '深灰色');
    await bag.getByRole('button', { name: en ? 'Increase quantity' : '增加数量', exact: true }).click();
    await expect(root.locator('[data-bag-count]')).toHaveText('2');
    await expect(bag.locator('[data-bag-total]')).toContainText(slug === 'minimalism' ? '1398' : '2560');
    await sceneAction(bag, 'goods-checkout').click();
    await expect(bag.locator('[data-order-preview]')).toContainText(en ? 'No payment made' : '未扣款');
    await closeOther(bag);
    if (slug === 'minimalism') {
      await sceneAction(root, 'lumo-next').click();
      await expect(root.locator('.lumo-caption')).toContainText(en ? 'One thing at a time' : '一次一件事');
    } else {
      await sceneAction(root, 'goods-search').click();
      const search = otherDialog('goods-search');
      await search.locator('[data-goods-query]').fill(en ? 'strap' : '肩带');
      await expect(search.locator('[data-goods-results] button:visible')).toHaveCount(1);
      await search.locator('[data-goods-results] button:visible').click();
      await expect(product.locator('[data-product-title]')).toHaveText(en ? 'Handmade leather strap' : '手工皮革肩带');
      await closeOther(product);
      const names = en ? ['Classic film camera','Handmade leather strap','Oak photo frame'] : ['经典胶片相机','手工皮革肩带','橡木相框'];
      for (let i=0;i<names.length;i++) {
        const entry=sceneAction(root,`goods-collection-${i}`);
        await entry.click();
        await expect(product.locator('[data-product-title]')).toHaveText(names[i]);
        await closeOther(product,entry);
      }
    }
  } else if (slug === 'glassmorphism') {
    await sceneAction(root, 'aurora-create').click();
    const form = root.locator('[data-other-form="aurora"]');
    await form.locator('[name="topic"]').fill('Atlas after rain');
    await form.locator('[name="tone"]').selectOption('clear');
    await form.locator('[type="submit"]').click();
    const draft = root.locator('[data-aurora-draft]');
    await expect(draft).toHaveValue(/Atlas after rain/);
    await expect(draft).toHaveValue(en ? /Goal:/ : /目标：/);
    await draft.fill('An edited atlas draft.');
    await sceneAction(root, 'aurora-save').click();
    await expect(root.locator('[data-aurora-status]')).toContainText(en ? 'Page-local snapshot saved' : '已保存当前页面快照');
    await draft.fill('A different draft.');
    await sceneAction(root, 'aurora-restore').click();
    await expect(draft).toHaveValue('An edited atlas draft.');
    const downloadPromise = root.page().waitForEvent('download');
    await sceneAction(root, 'aurora-export').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('aurora-draft.txt');
    const stream = await download.createReadStream();
    let exported = '';
    for await (const chunk of stream) exported += chunk.toString('utf8');
    expect(exported).toBe('An edited atlas draft.');
    await sceneAction(root, 'aurora-feature-1').click();
    const feature = otherDialog('aurora-feature');
    await expect(feature.locator('[data-feature-copy]')).toContainText(en ? 'offline' : '不连接云端');
    await closeOther(feature);
  } else if (slug === 'bento-grid') {
    await sceneAction(root, 'primary').click();
    const form = root.locator('[data-other-form="task"]');
    await form.locator('[name="task"]').fill('Review the atlas');
    await form.locator('[type="submit"]').click();
    await expect(root.locator('[data-task-check]')).toHaveCount(6);
    await root.locator('[data-task-check="0"]').check();
    await expect(root.locator('[data-task-status]')).toContainText('1 / 6');
    await expect(root.locator('.bento-tasks > strong')).toHaveText('5');
    await sceneAction(root, 'tasko-next').click();
    await expect(root.locator('[data-tasko-month]')).toHaveText(en ? 'May 2024' : '五月 2024');
    await expect(root.locator('.calendar-grid [data-scene-action]')).toHaveCount(31);
    await sceneAction(root, 'tasko-day-20').click();
    await expect(root.locator('[data-tasko-selected]')).toContainText('20');
    await sceneAction(root, 'tasko-notes').click();
    const note = root.locator('[data-other-form="note"]');
    await note.locator('[name="note"]').fill('Leave room for a small discovery.');
    await note.locator('[type="submit"]').click();
    await expect(root.locator('[data-tasko-notes] li').first()).toHaveText('Leave room for a small discovery.');
    await expect(root.locator('.bento-notes > strong')).toHaveText('13');
    await sceneAction(root, 'tasko-tasks').click();
    await expect(root.locator('[data-task-check="0"]')).toBeChecked();
  } else if (slug === 'neumorphism') {
    await sceneAction(root, 'primary').click();
    await root.locator('[data-mellow-duration]').selectOption('1');
    await expect(root.locator('[data-focus-time]')).toHaveText('01:00');
    await sceneAction(root, 'mellow-toggle').click();
    await expect(root.locator('[data-focus-status]')).toContainText(en ? 'Focusing' : '专注中');
    await expect(root.locator('[data-focus-time]')).not.toHaveText('01:00');
    await sceneAction(root, 'mellow-toggle').click();
    await expect(root.locator('[data-focus-status]')).toContainText(en ? 'Paused' : '已暂停');
    await sceneAction(root, 'mellow-reset').click();
    await expect(root.locator('[data-focus-time]')).toHaveText('01:00');
    await sceneAction(root, 'mellow-tool-3').click();
    await root.locator('[data-mellow-name]').fill('Atlas Focus');
    await expect(root.locator('[data-mellow-profile]')).toContainText('Atlas Focus');
    await root.locator('[data-mellow-contrast]').check();
    await expect(root).toHaveClass(/mellow-high-contrast/);
    await sceneAction(root, 'mellow-tool-0').click();
    await expect(root.locator('[data-focus-time]')).toHaveText('01:00');
  } else if (slug === 'brutalism') {
    await sceneAction(root, 'primary').click();
    const project = sceneAction(root, 'void-case-1');
    await project.click();
    const dialog = otherDialog('void-case');
    await expect(dialog.locator('[data-void-title]')).toHaveText('COMMON GROUND / Digital');
    await expect(dialog.locator('[data-void-deliverables]')).toContainText(en ? 'Accessibility tests' : '无障碍测试');
    await closeOther(dialog, project);
    await sceneAction(root, 'nav-3').click();
    const form = root.locator('[data-other-form="void-contact"]');
    await form.locator('[name="name"]').fill('Atlas Studio');
    await form.locator('[name="email"]').fill('atlas@example.com');
    await form.locator('[name="brief"]').fill('A community resource map.');
    await form.locator('[type="submit"]').click();
    await expect(form.locator('[data-contact-summary]')).toContainText('A community resource map.');
    await expect(form.locator('[data-contact-summary]')).toContainText(en ? 'No email sent' : '未发送邮件');
  } else if (slug === 'neobrutalism') {
    const check = sceneAction(root, 'play-check-1');
    await check.click();
    await expect(check).toHaveAttribute('aria-pressed', 'false');
    await sceneAction(root, 'play-brief').click();
    const dialog = otherDialog('play-brief');
    await expect(dialog.locator('[data-play-brief-services]')).toContainText('Design · Create');
    await expect(dialog.locator('[data-play-brief-services]')).not.toContainText('Develop');
    const form = dialog.locator('[data-other-form="play-brief"]');
    await form.locator('[name="name"]').fill('Atlas playground');
    await form.locator('[name="goal"]').fill('Make local culture easier to discover.');
    await form.locator('[type="submit"]').click();
    await expect(dialog.locator('[data-play-summary]')).toContainText('Atlas playground');
    await expect(dialog.locator('[data-play-summary]')).toContainText('Design / Create');
    await expect(dialog.locator('[data-play-summary]')).toContainText(en ? 'Nothing was sent' : '未发送到服务器');
    await closeOther(dialog);
    await sceneAction(root, 'play-work-0').click();
    const work = otherDialog('play-work');
    await expect(work.locator('[data-play-title]')).toContainText('MOMO');
    await expect(work.getByRole('listitem')).toHaveCount(3);
    await closeOther(work);
  } else if (slug === 'retro-web') {
    await sceneAction(root, 'retro-page-4').click();
    const form = root.locator('[data-other-form="guestbook"]');
    await form.locator('[name="name"]').fill('Atlas visitor');
    await form.locator('[name="message"]').fill('Hello, early web!');
    await form.locator('[type="submit"]').click();
    await expect(root.locator('[data-guest-messages] li').first()).toHaveText('Atlas visitor: Hello, early web!');
    await sceneAction(root, 'retro-page-2').click();
    await expect(root.locator('[data-retro-heading]')).toHaveText('Projects');
    await sceneAction(root, 'retro-back').click();
    await expect(root.locator('[data-retro-heading]')).toHaveText('Guestbook');
    await expect(root.locator('[data-guest-messages]')).toContainText('Hello, early web!');
    await sceneAction(root, 'retro-forward').click();
    await expect(root.locator('[data-retro-heading]')).toHaveText('Projects');
    await sceneAction(root, 'retro-favorites').click();
    const favorites = otherDialog('retro-favorites');
    await sceneAction(favorites, 'retro-save').click();
    await expect(favorites.locator('[data-retro-bookmarks] button')).toHaveText('Projects');
    await closeOther(favorites);
    const currentUrl = await root.evaluate(() => location.href);
    await sceneAction(root, 'retro-go').click();
    const address = otherDialog('retro-address');
    await address.locator('[data-retro-route]').fill('https://outside.invalid/');
    await address.locator('[type="submit"]').click();
    await expect(address).toBeVisible();
    await expect(address.locator('[data-retro-route-status]')).toContainText(en ? 'Page not found' : '未找到站内页面');
    expect(await root.evaluate(() => location.href)).toBe(currentUrl);
    await address.locator('[data-retro-route]').fill('goodoldnet/links');
    await address.locator('[type="submit"]').click();
    await expect(address).not.toBeVisible();
    await expect(root.locator('[data-retro-heading]')).toHaveText('Links');
    await sceneAction(root, 'retro-back').click();
    await expect(root.locator('[data-retro-heading]')).toHaveText('Projects');
    const searchTrigger = sceneAction(root, 'retro-search');
    await searchTrigger.click();
    const search = otherDialog('retro-search');
    await search.locator('[data-retro-query]').fill('guest');
    await expect(search.locator('[data-retro-results] button:visible')).toHaveCount(1);
    await search.locator('[data-retro-query]').press('Escape');
    await expect(search).not.toBeVisible();
    await expect(searchTrigger).toBeFocused();
  } else throw new Error(`遗漏参考语义流：${slug}`);

  if (slug !== 'retro-web') {
    await sceneAction(root, 'nav-1').click();
    await expect(root.locator('#scene-section-1')).toBeFocused();
  }
  await sceneAction(root, 'home').click();
  await expect.poll(() => root.evaluate(() => scrollY)).toBe(0);
}

async function setRange(control, value) {
  await control.evaluate((input, next) => {
    input.value = next;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, String(value));
  await expect(control).toHaveValue(String(value));
}

async function genericFlow(root, slug, locale) {
  const en = locale === 'en';
  const command = name => root.locator(`[data-command="${name}"]`).first();
  await command('reset').click();
  await sceneAction(root, 'primary').click();
  await expect(root.locator('[data-generic-panel="0"]')).not.toHaveAttribute('hidden');
  const form = name => root.locator(`[data-generic-form="${name}"]`);
  if (slug === 'flat-design') {
    const workspace = form('workspace');
    await workspace.locator('[name="name"]').fill('Atlas launch');
    await workspace.locator('[name="plan"]').selectOption({ index: 1 });
    await workspace.locator('[type="submit"]').click();
    await expect(root.locator('[data-workspaces] li')).toHaveCount(1);
    await expect(root.locator('[data-workspaces]')).toContainText('Atlas launch');
    await expect(root.locator('[data-workspaces]')).toContainText(en ? 'Team' : '团队');
  } else if (slug === 'bauhaus') {
    const shape = root.locator('[data-command="shape"][data-value="1"]');
    await shape.click();
    await expect(shape).toHaveAttribute('aria-pressed', 'true');
    await command('place').click();
    await expect(root.locator('[data-composition] i')).toHaveCount(1);
    await expect(root.locator('[data-shape-count]')).toContainText('1 / 12');
    await command('clear-shapes').click();
    await expect(root.locator('[data-composition] i')).toHaveCount(0);
    await command('place').click();
  } else if (slug === 'y2k') {
    const member = form('member');
    await member.locator('[name="name"]').fill('AtlasDreamer');
    await member.locator('[name="outfit"]').selectOption('Bubble Dream');
    await member.locator('[type="submit"]').click();
    await expect(root.locator('[data-member-name]')).toHaveText('AtlasDreamer');
    await expect(root.locator('[data-member-outfit]')).toHaveText('Bubble Dream');
  } else if (slug === 'cyberpunk') {
    await root.locator('[data-district]').selectOption({ index: 1 });
    await expect(root.locator('[data-network-status]')).toHaveText('CONNECTED / LOCAL');
    await expect(root.locator('[data-network-route]')).toContainText('PACIFICA');
    await root.locator('[data-gear="0"]').check();
    await expect(root.locator('[data-gear-status]')).toContainText('1 / 3');
  } else if (slug === 'memphis') {
    const party = form('party');
    await party.locator('[name="name"]').fill('Atlas Friday');
    await party.locator('[name="guests"]').fill('12');
    await party.locator('[name="palette"]').selectOption('Yellow / Blue');
    await party.locator('[type="submit"]').click();
    await expect(root.locator('[data-party-name]')).toHaveText('Atlas Friday');
    await expect(root.locator('[data-party-guests]')).toContainText('12');
    await expect(root.locator('[data-invitation]')).toHaveAttribute('style', /./);
  } else if (slug === 'retro-futurism') {
    await expect(command('play')).toHaveAttribute('aria-pressed', 'true');
    await expect(root.locator('[data-radio-status]')).toContainText(en ? 'Playing' : '播放');
    await command('next').click();
    await expect(root.locator('[data-track]')).toContainText('Neon Coast');
    await command('previous').click();
    await expect(root.locator('[data-track]')).toContainText('Midnight Drive');
    await command('play').click();
    await expect(command('play')).toHaveAttribute('aria-pressed', 'false');
  } else if (slug === 'claymorphism') {
    await root.locator('[data-clay-color]').selectOption('#FFB5A5');
    await command('squeeze').click();
    await expect(root.locator('[data-squeeze-count]')).toContainText('2');
    await command('adopt').click();
    await expect(root.locator('[data-clay-cabin] li')).toHaveCount(1);
    await expect(root.locator('[data-clay-cabin]')).toContainText(en ? 'Peach' : '蜜桃');
  } else if (slug === 'aurora') {
    const before = await root.locator('[data-light-field]').getAttribute('style');
    await root.locator('[data-spectrum]').selectOption('255');
    await setRange(root.locator('[data-intensity]'), 85);
    await expect(root.locator('[data-light-values]')).toHaveText('Violet / 85%');
    await expect(root.locator('[data-light-field]')).not.toHaveAttribute('style', before || '');
    await command('save-light').click();
    await expect(root.locator('[data-light-saves] li')).toHaveCount(1);
    await expect(root.locator('[data-light-saves]')).toContainText('Violet / 85%');
  } else if (slug === 'organic') {
    for (const photo of await root.locator('.gs-panel:not([hidden]) .gs-product-photo img').all()) {
      await photo.scrollIntoViewIfNeeded();
      await expect.poll(() => photo.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
    }
    const add = root.locator('[data-command="basket"][data-value="0"]');
    await add.click();
    await add.click();
    await expect(root.locator('[data-basket]')).toContainText(en ? 'Linen cushion' : '亚麻靠垫');
    await expect(root.locator('[data-basket-total]')).toContainText('96');
    await command('clear-basket').click();
    await expect(root.locator('[data-basket] li')).toHaveCount(0);
    await add.click();
  } else if (slug === 'art-deco') {
    const reservation = form('reservation');
    await reservation.locator('[name="name"]').fill('Atlas Guest');
    await reservation.locator('[name="date"]').fill('2099-06-15');
    await reservation.locator('[name="guests"]').selectOption('4');
    await reservation.locator('[type="submit"]').click();
    await expect(root.locator('[data-reservation]')).toContainText('Atlas Guest');
    await expect(root.locator('[data-reservation]')).toContainText('2099-06-15');
    await expect(root.locator('[data-reservation]')).toContainText('4');
  } else if (slug === 'corporate-memphis') {
    await expect(root.locator('[data-team-tasks] li')).toHaveCount(5);
    await expect(root.locator('[data-team-progress]')).toContainText('0 / 5');
    await expect(root.locator('[data-team-task-count]')).toHaveText('5');
    await sceneAction(root, 'team-tasks').click();
    await expect(root.locator('[data-team-task-workspace]')).toBeFocused();
    const team = form('team');
    await team.locator('[name="task"]').fill('Ship an accessible atlas');
    await team.locator('[name="owner"]').selectOption('Jamie');
    await team.locator('[type="submit"]').click();
    await expect(root.locator('[data-team-tasks] li')).toHaveCount(6);
    const addedTask = root.locator('[data-team-tasks] li').last();
    await expect(addedTask).toContainText('Ship an accessible atlas');
    await expect(addedTask).toContainText('Jamie');
    await expect(addedTask).toContainText('2024-01-17');
    await expect(root.locator('[data-team-progress]')).toContainText('0 / 6');
    await expect(root.locator('[data-team-task-count]')).toHaveText('6');
    await addedTask.locator('input[type="checkbox"]').check();
    await expect(addedTask).toHaveAttribute('data-done', 'true');
    await expect(root.locator('[data-team-progress]')).toContainText('1 / 6');
    await expect(root.locator('[data-team-task-count]')).toHaveText('5');

    await sceneAction(root, 'team-notes').click();
    await expect(root.locator('[data-team-notes-workspace]')).toBeFocused();
    await expect(root.locator('[data-team-notes-list] li')).toHaveCount(12);
    await expect(root.locator('[data-team-note-count]')).toHaveText('12');
    await root.locator('[data-command="team-read-note"][data-value="note-2"]').click();
    await expect(root.locator('[data-team-note-title]')).toHaveText(en ? 'Brand colors' : '品牌配色');
    await expect(root.locator('[data-team-note-body]')).toContainText(en ? 'violet for key actions' : '紫色用于关键操作');
    const note = form('team-note');
    await note.locator('[name="title"]').fill('Atlas team decision');
    await note.locator('[name="body"]').fill('Keep keyboard focus visible throughout the atlas.');
    await note.locator('[type="submit"]').click();
    await expect(root.locator('[data-team-notes-list] li')).toHaveCount(13);
    await expect(root.locator('[data-team-note-count]')).toHaveText('13');
    await expect(root.locator('[data-team-note-title]')).toHaveText('Atlas team decision');
    await expect(root.locator('[data-team-note-body]')).toHaveText('Keep keyboard focus visible throughout the atlas.');
    await expect(root.locator('[data-command="team-read-note"][data-value="note-13"]')).toHaveAttribute('aria-pressed', 'true');
    await root.locator('[data-command="team-delete-note"][data-value="note-13"]').click();
    await expect(root.locator('[data-team-notes-list] li')).toHaveCount(12);
    await expect(root.locator('[data-team-note-count]')).toHaveText('12');
    await expect(root.locator('[data-team-note-title]')).not.toHaveText('Atlas team decision');
    // 留下一条新笔记，随后由外层/内部reset oracle验证真正清除，而非只核对从未变过的12条。
    await note.locator('[name="title"]').fill('Atlas reset-only note');
    await note.locator('[name="body"]').fill('Discard this page-local note on reset.');
    await note.locator('[type="submit"]').click();
    await expect(root.locator('[data-team-notes-list] li')).toHaveCount(13);
    await expect(root.locator('[data-team-note-count]')).toHaveText('13');
    await expect(root.locator('[data-team-note-body]')).toHaveText('Discard this page-local note on reset.');

    await expect(root.locator('[data-team-calendar-date]')).toHaveAttribute('data-team-calendar-date', '2024-01-17');
    await root.locator('[data-scene-action="calendar-day"][data-team-day="31"]').click();
    await expect(root.locator('[data-team-selected-date]')).toHaveText('2024-01-31');
    await expect(root.locator('[data-team-date-summary]')).toContainText(en ? '0 pending tasks' : '0 项待办任务');
    await sceneAction(root, 'calendar-next').click();
    await expect(root.locator('[data-team-month]')).toHaveText(en ? 'Feb 2024' : '二月 2024');
    await expect(root.locator('[data-team-day]')).toHaveCount(29);
    await expect(root.locator('[data-team-selected-date]')).toHaveText('2024-02-29');
    await expect(root.locator('[data-team-day="29"]')).toHaveAttribute('aria-pressed', 'true');
    await sceneAction(root, 'calendar-previous').click();
    await expect(root.locator('[data-team-month]')).toHaveText(en ? 'Jan 2024' : '一月 2024');
    await root.locator('[data-scene-action="calendar-day"][data-team-day="17"]').click();
    await expect(root.locator('[data-team-calendar-date]')).toHaveAttribute('data-team-calendar-date', '2024-01-17');
    await expect(root.locator('[data-team-selected-date]')).toHaveText('2024-01-17');
    await expect(root.locator('[data-team-date-summary]')).toContainText(en ? '5 pending tasks' : '5 项待办任务');
    await sceneAction(root, 'team-tasks').click();
    await expect(addedTask.locator('input[type="checkbox"]')).toBeChecked();
  } else if (slug === 'hand-drawn') {
    const note = form('note');
    await note.locator('[name="note"]').fill('A small atlas of everyday light.');
    await note.locator('[name="paper"]').selectOption({ index: 2 });
    await note.locator('[type="submit"]').click();
    await expect(root.locator('[data-notes] li')).toHaveCount(1);
    await expect(root.locator('[data-notes]')).toContainText('A small atlas of everyday light.');
    await root.locator('[data-note-search]').fill('zzzz-no-note');
    await expect(root.locator('[data-notes] li:visible')).toHaveCount(0);
    await root.locator('[data-note-search]').fill('everyday');
    await expect(root.locator('[data-notes] li:visible')).toHaveCount(1);
  } else if (slug === 'liquid-glass') {
    const before = await root.locator('[data-glass-specimen]').getAttribute('style');
    await root.locator('[data-glass-material]').selectOption('Frost');
    await setRange(root.locator('[data-glass-depth]'), 20);
    await setRange(root.locator('[data-glass-angle]'), 220);
    await expect(root.locator('[data-glass-values]')).toHaveText('Frost / 20px / 220°');
    await expect(root.locator('[data-glass-specimen]')).not.toHaveAttribute('style', before || '');
    await command('save-glass').click();
    await expect(root.locator('[data-glass-saves] li')).toHaveCount(1);
    await expect(root.locator('[data-glass-saves]')).toContainText('Frost / 20px / 220°');
  } else if (slug === 'pixel-art') {
    await expect(root.locator('[data-pixel-status]')).toContainText('CREDIT 1');
    await root.locator('[data-command="pixel-color"]').nth(1).click();
    const pixel = root.locator('[data-pixel="0"]');
    await pixel.click();
    await expect(pixel).toHaveAttribute('aria-pressed', 'true');
    await expect(pixel).toHaveAttribute('style', /background/);
    await pixel.press('ArrowRight');
    const next = root.locator('[data-pixel="1"]');
    await expect(next).toBeFocused();
    await next.press('Space');
    await expect(next).toHaveAttribute('aria-pressed', 'true');
    await command('clear-pixels').click();
    await expect(root.locator('[data-pixel][aria-pressed="true"]')).toHaveCount(0);
    await pixel.click();
  } else if (slug === 'vaporwave') {
    await root.locator('[data-floor]').selectOption({ index: 2 });
    await expect(root.locator('[data-floor-sign]')).toHaveText('3F');
    await expect(root.locator('[data-floor-description]')).toContainText(en ? 'sunset' : '日落');
    await command('visit').click();
    await expect(root.locator('[data-passport] li')).toHaveCount(1);
    await expect(root.locator('[data-passport]')).toContainText('SKY GARDEN');
  } else throw new Error(`遗漏品牌语义流：${slug}`);

  // 原有导航不能是假按钮：切页、收藏实际条目、返回后业务结果仍在。
  const destination = root.locator('[data-generic-tab="1"]');
  const originalNav = sceneAction(root, 'nav-0');
  if (await originalNav.isVisible()) await originalNav.click();
  else await destination.click();
  await expect(destination).toHaveAttribute('aria-selected', 'true');
  const secondary = root.locator('[data-generic-panel="1"]');
  await expect(secondary).not.toHaveAttribute('hidden');
  await expect(root.locator('[data-generic-panel="0"]')).toHaveAttribute('hidden', '');
  const keep = secondary.locator('[data-command="keep"]').first();
  const keptName = await keep.getAttribute('data-name');
  await keep.click();
  await expect(keep).toHaveAttribute('aria-pressed', 'true');
  await expect(secondary.locator('[data-shelf-list]')).toContainText(keptName);
  await command('return').click();
  await expect(root.locator('[data-generic-tab="0"]')).toHaveAttribute('aria-selected', 'true');
  await expect(root.locator('[data-generic-panel="0"]')).not.toHaveAttribute('hidden');
}

export async function assertStyleInitial(root, slug) {
  if (REFERENCE_STYLES.includes(slug)) {
    await expect(root.locator('dialog[open]')).toHaveCount(0);
    if (slug === 'editorial') {
      await sceneAction(root, 'story-0').click();
      await expect(sceneAction(root, 'save-story')).toHaveAttribute('aria-pressed', 'false');
      await root.locator('[data-scene-dialog="story"] [data-close-dialog]').click();
    }
    return;
  }
  await expect(root.locator('[data-generic-tab="0"]')).toHaveAttribute('aria-selected', 'true');
  await expect(root.locator('[data-shelf-list] li')).toHaveCount(0);
  const emptyLists = { 'flat-design': 'workspaces', bauhaus: 'composition', claymorphism: 'clay-cabin', aurora: 'light-saves', organic: 'basket', 'hand-drawn': 'notes', 'liquid-glass': 'glass-saves', vaporwave: 'passport' };
  if (emptyLists[slug]) await expect(root.locator(`[data-${emptyLists[slug]}]`).locator(slug === 'bauhaus' ? 'i' : 'li')).toHaveCount(0);
  if (slug === 'corporate-memphis') {
    await expect(root.locator('[data-team-tasks] li')).toHaveCount(5);
    await expect(root.locator('[data-team-tasks] li').first()).toContainText(/Review welcome-page copy|整理欢迎页文案/);
    await expect(root.locator('[data-team-tasks]')).not.toContainText('Ship an accessible atlas');
    await expect(root.locator('[data-team-tasks] input:checked')).toHaveCount(0);
    await expect(root.locator('[data-team-progress]')).toContainText('0 / 5');
    await expect(root.locator('[data-team-task-count]')).toHaveText('5');
    await expect(root.locator('[data-team-note-count]')).toHaveText('12');
    await expect(root.locator('[data-team-notes-list] li')).toHaveCount(12);
    await expect(root.locator('[data-command="team-read-note"][aria-pressed="true"]')).toHaveAttribute('data-value', 'note-1');
    await expect(root.locator('[data-team-note-title]')).toHaveText(/The first line of the welcome page|欢迎页的第一句话/);
    await expect(root.locator('[data-team-note-body]')).toContainText(/friendly greeting|友好的问候/);
    await expect(root.locator('[data-team-notes-list]')).not.toContainText('Atlas team decision');
    await expect(root.locator('[data-team-notes-list]')).not.toContainText('Atlas reset-only note');
    await expect(root.locator('[data-generic-form="team-note"] [name="title"]')).toHaveValue('');
    await expect(root.locator('[data-generic-form="team-note"] [name="body"]')).toHaveValue('');
    await expect(root.locator('[data-team-month]')).toHaveText(/^(Jan|一月) 2024$/);
    await expect(root.locator('[data-team-day]')).toHaveCount(31);
    await expect(root.locator('[data-team-day][aria-pressed="true"]')).toHaveAttribute('data-team-day', '17');
    await expect(root.locator('[data-team-calendar-date]')).toHaveAttribute('data-team-calendar-date', '2024-01-17');
    await expect(root.locator('[data-team-selected-date]')).toHaveText('2024-01-17');
    await expect(root.locator('[data-team-date-summary]')).toContainText(/5 pending tasks|5 项待办任务/);
  }
  if (slug === 'y2k') await expect(root.locator('[data-member-name]')).toHaveText('CyberDreamer');
  if (slug === 'cyberpunk') await expect(root.locator('[data-network-status]')).toHaveText('DISCONNECTED');
  if (slug === 'memphis') await expect(root.locator('[data-party-name]')).toHaveText('PLAY & REPEAT!');
  if (slug === 'retro-futurism') await expect(root.locator('[data-command="play"]')).toHaveAttribute('aria-pressed', 'false');
  if (slug === 'art-deco') await expect(root.locator('[data-reservation]')).not.toContainText('Atlas Guest');
  if (slug === 'pixel-art') {
    await expect(root.locator('[data-pixel-status]')).toContainText('CREDIT 0');
    await expect(root.locator('[data-pixel][aria-pressed="true"]')).toHaveCount(0);
  }
}
