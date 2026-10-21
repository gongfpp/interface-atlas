import { test, expect } from './helpers/private-browser.mjs';
import { STYLE_SLUGS, FOCUS_STYLES, SELECT_STYLES, DIALOG_STYLES, openStyleStatePage, runStyleStatePath, computedState, representativeSelect } from './helpers/style-state-paths.mjs';

const widths = [1280, 390, 320];
const action = (root, name) => root.locator(`[data-scene-action="${name}"]`).first();
const rgbaAlpha = color => color.startsWith('rgba(') ? Number(color.match(/[\d.]+/g).at(-1)) : 1;

function captureIntoTest(page, root, testInfo) {
  const states = [];
  const capture = async (name, metadata = {}) => {
    const data = await computedState(root, metadata.targets || []);
    const prefix = `${String(states.length + 1).padStart(2,'0')}-${name}`;
    const screenshot = testInfo.outputPath(`${prefix}.png`);
    await page.screenshot({ path: screenshot, animations: 'disabled', scale: 'css' });
    await testInfo.attach(`${prefix}.png`, { path: screenshot, contentType: 'image/png' });
    await testInfo.attach(`${prefix}.json`, { body: JSON.stringify({ ...metadata, state: name, computed: data, note: '截图存在不是视觉通过结论；材质/语义断言见本测试。' }, null, 2), contentType: 'application/json' });
    states.push({ name, ...metadata, data });
  };
  return { states, capture };
}

async function assertFocusMaterial(root, slug, state) {
  if (slug === 'neobrutalism' && ['playlab-continuation','playlab-brief-dialog','playlab-brief-status'].includes(state)) {
    const selector = state === 'playlab-continuation' ? '.other-neobrutalism .other-cards button' : '[data-other-dialog="play-brief"] form button[type="submit"]';
    const button = root.locator(selector).first();
    await expect(button).toHaveCSS('border-top-width', '2px');
    await expect(button).toHaveCSS('border-top-color', 'rgb(17, 17, 17)');
    const style = await button.evaluate(element => { const s = getComputedStyle(element); return { padding: parseFloat(s.paddingLeft), background: s.backgroundColor, shadow: s.boxShadow }; });
    expect(style.padding, '不能被通用data-scene-action reset归零').toBeGreaterThan(0);
    expect(rgbaAlpha(style.background)).toBeGreaterThan(0);
    expect(style.shadow).not.toBe('none');
    if (state !== 'playlab-continuation') {
      await expect(root.locator('[data-other-dialog="play-brief"]')).toHaveCSS('border-top-width','3px');
    }
  }
  if (slug === 'glassmorphism' && state === 'aurora-feature-dialog') {
    const material = await root.locator('[data-other-dialog="aurora-feature"]').evaluate(element => { const s = getComputedStyle(element); return { radius: parseFloat(s.borderRadius), blur: s.backdropFilter || s.webkitBackdropFilter, background: s.backgroundColor, image: s.backgroundImage, border: s.borderTopColor }; });
    expect(material.radius).toBeGreaterThanOrEqual(16);
    expect(material.blur).toMatch(/blur\(([1-9]\d|[2-9])px\)/);
    expect(rgbaAlpha(material.background), '玻璃dialog不是不透明通用白面板').toBeLessThan(1);
    expect(material.image !== 'none' || rgbaAlpha(material.background) > 0).toBe(true);
    expect(rgbaAlpha(material.border)).toBeGreaterThan(0);
    expect(rgbaAlpha(material.border)).toBeLessThan(1);
  }
  if (slug === 'neumorphism' && state === 'mellow-active-press') {
    const toggle = action(root,'mellow-toggle');
    expect(await toggle.evaluate(element => element.matches(':active'))).toBe(true);
    await expect(toggle).toHaveCSS('box-shadow', /inset/);
  }
  if (slug === 'claymorphism' && state === 'brand-result') {
    await expect(root.locator('[data-blob]')).toHaveCSS('background-color','rgb(255, 181, 165)');
    const shadow = await root.locator('[data-blob]').evaluate(element => getComputedStyle(element).boxShadow);
    expect(shadow.match(/inset/g)?.length).toBeGreaterThanOrEqual(2);
    await expect(root.locator('[data-clay-cabin]')).toContainText(/Peach|蜜桃/);
  }
  if (slug === 'liquid-glass' && state.startsWith('lumen-material-')) {
    const material = state.slice('lumen-material-'.length);
    const specimen = root.locator('[data-glass-specimen]');
    await expect(specimen).toHaveAttribute('data-material', new RegExp(`^${material}$`, 'i'));
    const style = await specimen.evaluate(element => { const s = getComputedStyle(element); return { radius: parseFloat(s.borderRadius), blur: s.backdropFilter || s.webkitBackdropFilter, background: s.backgroundColor, image: s.backgroundImage, shadow: s.boxShadow }; });
    expect(style.radius).toBeGreaterThanOrEqual(16);
    expect(style.blur).toMatch(/blur\(/);
    expect(style.shadow).toMatch(/inset/);
    if (material === 'clear') expect(rgbaAlpha(style.background)).toBeLessThan(0.4);
    if (material === 'frost') expect(rgbaAlpha(style.background)).toBeGreaterThanOrEqual(0.4);
    if (material === 'prism') expect(style.image).toMatch(/gradient/);
  }
  if (slug === 'swiss-style' && state === 'project-dialog-open') {
    const dialog = root.locator('[data-scene-dialog="project"]');
    await expect(dialog).toHaveCSS('border-top-style','solid');
    await expect(dialog).toHaveCSS('font-family', /Arial|Helvetica|sans-serif/);
    await expect(dialog.locator('[data-project-art]')).toHaveText('N↗');
    await expect(dialog.locator('[data-project-copy]')).toContainText(/wayfinding|街道导视/);
  }
}

// 原150条整页行为矩阵仍在；新增只轮转代表视口/语言，不再复制三倍全库。
for (const [index, slug] of STYLE_SLUGS.entries()) {
  const width = widths[index % widths.length], locale = index % 2 ? 'en' : 'zh';
  test(`风格中间态 ${slug} ${locale} ${width}px：展开、反馈及品牌材质证据`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    const root = await openStyleStatePage(page, slug, locale);
    const evidence = captureIntoTest(page, root, testInfo);
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    const summary = await runStyleStatePath(page, slug, locale, async (name, metadata) => {
      await evidence.capture(name, metadata);
      await assertFocusMaterial(root, slug, name);
      if (metadata.kind === 'dialog-open') await expect(root.locator('dialog[open]')).toHaveCount(1);
    });
    if (SELECT_STYLES.includes(slug)) expect(evidence.states.some(state => state.kind === 'dom-listbox-expanded')).toBe(true);
    if (!DIALOG_STYLES.includes(slug)) {
      expect(summary.dialog).toBe('not-applicable');
      await expect(root.locator('dialog')).toHaveCount(0);
      const fonts = await root.evaluate(scene => {
        const workspace = scene.querySelector('[data-generic-content]'), styles = getComputedStyle(workspace), probe = document.createElement('span');
        const normalize = value => { probe.style.fontFamily = value; return probe.style.fontFamily; };
        return { body: styles.fontFamily, display: getComputedStyle(workspace.querySelector('h2')).fontFamily, expectedBody: normalize(styles.getPropertyValue('--gs-body-font').trim()), expectedDisplay: normalize(styles.getPropertyValue('--gs-display-font').trim()) };
      });
      expect(fonts.expectedBody).not.toBe(''); expect(fonts.expectedDisplay).not.toBe('');
      expect(fonts.body, '正文遵守该品牌body token，不机械复制展示字').toBe(fonts.expectedBody);
      expect(fonts.display, '标题遵守该品牌display token').toBe(fonts.expectedDisplay);
      if (['organic','art-deco'].includes(slug)) {
        expect(fonts.display).toMatch(/Georgia/); expect(fonts.body).toMatch(/Helvetica|sans-serif/);
      }
    }
    expect(errors).toEqual([]);
  });
}

for (const slug of FOCUS_STYLES) for (const width of widths) {
  const locale = width === 390 ? 'en' : 'zh';
  test(`重点材质 ${slug} ${locale} ${width}px：非默认中间态不能被reset覆盖`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    const root = await openStyleStatePage(page, slug, locale);
    const evidence = captureIntoTest(page, root, testInfo);
    await runStyleStatePath(page, slug, locale, async (name, metadata) => {
      await evidence.capture(name, metadata);
      await assertFocusMaterial(root, slug, name);
    });
    if (slug === 'liquid-glass') {
      const materials = evidence.states.filter(state => state.name.startsWith('lumen-material-'));
      expect(materials).toHaveLength(3);
      const signatures = materials.map(state => state.data.elements.find(element => element.material)?.styles).map(styles => JSON.stringify([styles.backgroundColor, styles.backgroundImage, styles.backdropFilter]));
      expect(new Set(signatures).size).toBe(3);
    }
  });
}

for (const [index, slug] of SELECT_STYLES.entries()) {
  const width = widths[index % widths.length], locale = index % 2 ? 'en' : 'zh';
  test(`风格选择器APG ${slug} ${locale} ${width}px：键盘、popup与native值同步`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    const root = await openStyleStatePage(page, slug, locale);
    const select = await representativeSelect(root, slug);
    const trigger = select.locator('xpath=ancestor::label[1]').locator('button[role="combobox"]');
    await expect(trigger).toHaveCount(1);
    await expect(trigger).toHaveAccessibleName(/\S/);
    await expect(select).toHaveAttribute('aria-hidden','true');
    const options = await select.locator('option').evaluateAll(elements => elements.filter(option => !option.disabled).map(option => ({ label: option.label, value: option.value })));
    expect(options.length).toBeGreaterThan(1);
    const panel = page.locator(`[role="listbox"][id="${await trigger.getAttribute('aria-controls')}"]`);
    // API focus仅定位起点；真实离开再Tab返回，验证用户键盘进入而非浏览器API焦点启发式。
    await trigger.focus();
    await page.keyboard.press('Shift+Tab');
    await expect(trigger).not.toBeFocused();
    await page.keyboard.press('Tab');
    await expect(trigger).toBeFocused();
    expect(await trigger.evaluate(element => element.matches(':focus-visible'))).toBe(true);
    await page.keyboard.press('ArrowDown');
    const focus = await trigger.evaluate(element => {
      const style = getComputedStyle(element), probe = document.createElement('span');
      probe.style.color = style.getPropertyValue('--scene-focus').trim();
      return { actual: style.outlineColor, expected: probe.style.color, width: parseFloat(style.outlineWidth), style: style.outlineStyle };
    });
    expect(focus.expected, `${slug}必须声明自己的focus token`).not.toBe('');
    expect(focus.actual, `${slug}焦点不能被全站朱砂!important覆盖`).toBe(focus.expected);
    expect(focus.width).toBeGreaterThanOrEqual(2); expect(focus.style).toBe('solid');
    await expect(trigger).toHaveAttribute('aria-expanded','true');
    await expect(panel).toBeVisible();
    await expect(panel.getByRole('option')).toHaveCount(options.length);
    const evidence = captureIntoTest(page, root, testInfo);
    await evidence.capture('apg-expanded', { kind: 'dom-listbox-expanded', expandedVerified: true });
    const box = await panel.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0); expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
    expect(box.y).toBeGreaterThanOrEqual(0); expect(box.y + box.height).toBeLessThanOrEqual(901);
    await trigger.press('End');
    await expect(page.locator(`[id="${await trigger.getAttribute('aria-activedescendant')}"]`)).toHaveText(options.at(-1).label);
    await trigger.press('Enter'); await expect(select).toHaveValue(options.at(-1).value);
    await expect(trigger).toHaveAttribute('aria-expanded','false'); await expect(trigger).toBeFocused();
    await trigger.press('Home'); await trigger.press('Enter'); await expect(select).toHaveValue(options[0].value);
    await trigger.press('ArrowDown'); await trigger.press('Escape');
    await expect(panel).not.toBeVisible(); await expect(select).toHaveValue(options[0].value); await expect(trigger).toBeFocused();
    if (['minimalism','skeuomorphism','neobrutalism'].includes(slug)) await expect(root.locator('dialog[open]')).toHaveCount(1);
    await trigger.press('Space'); await expect(panel).toBeVisible();
    await trigger.press('Tab'); await expect(panel).not.toBeVisible(); await expect(trigger).not.toBeFocused();
    // 不使用force，保证原旧测试的selectOption接口仍可运行。
    await select.selectOption(options.at(-1).value); await expect(trigger).toContainText(options.at(-1).label);
    await expect(panel.getByRole('option', { includeHidden: true }).last()).toHaveAttribute('aria-selected','true');
    if (slug === 'claymorphism') {
      await trigger.click();
      const expectedColors = ['rgb(154, 167, 255)','rgb(255, 181, 165)','rgb(151, 217, 189)'];
      const samples = await panel.getByRole('option').evaluateAll(elements => elements.map(option => [option, ...option.querySelectorAll('*')].flatMap(element => [null,'::before','::after'].map(pseudo => getComputedStyle(element, pseudo).backgroundColor))));
      for (const [i, color] of expectedColors.entries()) expect(samples[i], `色样必须显示${color}而非仅写颜色名称`).toContain(color);
      await evidence.capture('clay-real-color-options', { kind: 'dom-listbox-expanded', expandedVerified: true });
      await trigger.press('Escape');
    }
  });
}

for (const [slug, width, locale] of [['claymorphism',390,'en'],['liquid-glass',320,'zh']]) {
  test(`材质实样 ${slug} ${locale} ${width}px：popup与续页不是同款空白卡片`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    const root = await openStyleStatePage(page, slug, locale);
    const select = await representativeSelect(root, slug);
    const evidence = captureIntoTest(page, root, testInfo);
    await evidence.capture('workspace-mobile-layout', { targets:['[data-generic-panel="0"] .gs-two'] });
    const columns = root.locator('[data-generic-panel="0"] .gs-two').first().locator(':scope > *');
    const first = await columns.nth(0).boundingBox(), second = await columns.nth(1).boundingBox();
    expect(Math.abs(first.x - second.x), '手机工作区应单列，不能把控制器挤成逐词换行的窄列').toBeLessThanOrEqual(1.5);
    expect(second.y).toBeGreaterThanOrEqual(first.y + first.height - 1);
    const trigger = select.locator('xpath=ancestor::label[1]').locator('[role="combobox"]');
    await trigger.click();
    const panel = root.locator(`[id="${await trigger.getAttribute('aria-controls')}"]`);
    await expect(panel).toBeVisible();
    const samples = await panel.getByRole('option').evaluateAll(elements => elements.map(element => {
      const style = getComputedStyle(element, '::before');
      return { background: style.backgroundColor, image: style.backgroundImage, blur: style.backdropFilter || style.webkitBackdropFilter, shadow: style.boxShadow, height: parseFloat(style.height) };
    }));
    expect(samples).toHaveLength(3);
    for (const sample of samples) expect(sample.height, '每个选项有真实可见材质样本').toBeGreaterThan(0);
    if (slug === 'claymorphism') {
      expect(samples.map(sample => sample.background)).toEqual(['rgb(154, 167, 255)','rgb(255, 181, 165)','rgb(151, 217, 189)']);
      for (const sample of samples) expect(sample.shadow).toMatch(/inset/);
    } else {
      expect(samples.map(sample => Number(sample.blur.match(/blur\((\d+)px\)/)?.[1]))).toEqual([2,20,6]);
      expect(new Set(samples.map(sample => `${sample.background}/${sample.image}`)).size).toBe(3);
    }
    await evidence.capture('popup-material-samples', { kind:'dom-listbox-expanded', expandedVerified:true });
    await trigger.press('Escape');
    const section = root.locator(`[data-gs-section="${slug === 'claymorphism' ? 'shop' : 'materials'}"]`);
    await root.locator(`[id="${await section.getAttribute('aria-labelledby')}"]`).click();
    await expect(section).toBeVisible();
    const cards = section.locator('.gs-destination-card'); await expect(cards).toHaveCount(3);
    if (slug === 'claymorphism') {
      const art = cards.locator('[data-gs-art] i:first-child'); await expect(art).toHaveCount(3);
      const surfaces = await art.evaluateAll(elements => elements.map(element => ({ background:getComputedStyle(element).backgroundColor, shadow:getComputedStyle(element).boxShadow })));
      expect(surfaces.map(surface => surface.background)).toEqual(['rgb(154, 167, 255)','rgb(255, 181, 165)','rgb(151, 217, 189)']);
      for (const surface of surfaces) expect(surface.shadow.match(/inset/g)?.length).toBeGreaterThanOrEqual(2);
    } else {
      const surfaces = await cards.evaluateAll(elements => elements.map(element => { const s=getComputedStyle(element); return { background:s.backgroundColor, image:s.backgroundImage, blur:s.backdropFilter || s.webkitBackdropFilter }; }));
      expect(surfaces.map(surface => Number(surface.blur.match(/blur\((\d+)px\)/)?.[1]))).toEqual([2,24,8]);
      expect(new Set(surfaces.map(surface => `${surface.background}/${surface.image}`)).size).toBe(3);
    }
    await evidence.capture('continuation-material-samples', { targets:['.gs-destination-card','[data-gs-art] i'] });
  });
}

test('增强选择器内部重置：旧popup释放，新控件重新增强且保留native兼容', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 900 });
  const root = await openStyleStatePage(page, 'claymorphism', 'en');
  const select = await representativeSelect(root, 'claymorphism');
  let trigger = root.locator('.scene-select-trigger');
  await select.selectOption('#FFB5A5');
  await expect(trigger).toContainText('Peach');
  await trigger.click(); await expect(root.locator('[role="listbox"]:popover-open')).toHaveCount(1);
  const before = await trigger.elementHandle();
  await root.locator('[data-command="reset"]').click();
  await expect.poll(() => before.evaluate(element => element.isConnected)).toBe(false);
  trigger = root.locator('.scene-select-trigger');
  await expect(trigger).toHaveCount(1);
  await expect(trigger).toHaveAttribute('aria-expanded','false');
  await expect(root.locator('[role="listbox"]:popover-open')).toHaveCount(0);
  await expect(root.locator('select[data-clay-color]')).toHaveValue('#9AA7FF');
  await expect(trigger).toContainText('Blueberry');
  await root.locator('select[data-clay-color]').selectOption('#97D9BD');
  await expect(trigger).toContainText('Mint');
  await expect(root.locator('[data-blob]')).toHaveCSS('background-color','rgb(151, 217, 189)');
  await captureIntoTest(page, root, testInfo).capture('reset-reenhanced', { targets: ['.scene-select','[data-blob]'] });
  await before.dispose();
});

for (const [slug, width, locale] of [['corporate-memphis',390,'en'],['hand-drawn',320,'zh']]) {
  test(`提交后清空仍成功 ${slug} ${locale}：不把reset后的required空值误判失败`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    const root = await openStyleStatePage(page, slug, locale);
    await action(root,'primary').click();
    const team = slug === 'corporate-memphis';
    const form = root.locator(`[data-generic-form="${team ? 'team' : 'note'}"]`);
    const field = form.locator(`[name="${team ? 'task' : 'note'}"]`);
    const results = root.locator(team ? '[data-team-tasks] li' : '[data-notes] li');
    const initial = team ? 5 : 0;
    await expect(results).toHaveCount(initial);
    await field.fill('A saved state, with an empty next-entry field.');
    await form.locator('[type="submit"]').click();
    await expect(results).toHaveCount(initial + 1);
    await expect(results.last()).toContainText('A saved state, with an empty next-entry field.');
    await expect(field).toHaveValue('');
    await expect(form).toHaveAttribute('data-state','success');
    await expect(form.locator('[aria-invalid="true"]')).toHaveCount(0);
    await expect(root.locator('[data-generic-status][data-feedback]')).not.toHaveText('');
    await captureIntoTest(page, root, testInfo).capture('submitted-then-cleared-success', { targets: ['form[data-state="success"]','[data-generic-status]'] });
    await field.fill('   '); await form.locator('[type="submit"]').click();
    await expect(form).toHaveAttribute('data-state','invalid');
    await expect(results).toHaveCount(initial + 1);
    await field.fill('A second valid entry.'); await form.locator('[type="submit"]').click();
    await expect(results).toHaveCount(initial + 2);
    await expect(form).toHaveAttribute('data-state','success');
    await expect(field).toHaveValue('');
    await expect(form.getByRole('alert')).toHaveCount(0);
  });
}

for (const [slug, width, locale] of [['swiss-style',1280,'zh'],['neobrutalism',390,'en'],['flat-design',320,'zh']]) {
  test(`品牌表单反馈 ${slug} ${locale} ${width}px：错误、修正、成功材质`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    const root = await openStyleStatePage(page, slug, locale);
    let form, fields;
    if (slug === 'swiss-style') {
      await action(root,'nav-3').click(); form = root.locator('[data-scene-form="contact"]'); fields = { name:'State Atlas', email:'state@example.com', brief:'State material feedback.' };
    } else if (slug === 'neobrutalism') {
      await action(root,'play-brief').click(); form = root.locator('[data-other-form="play-brief"]'); fields = { name:'State Atlas', goal:'State material feedback.' };
    } else {
      await action(root,'primary').click(); form = root.locator('[data-generic-form="workspace"]'); fields = { name:'State Atlas' };
    }
    await form.locator('[type="submit"]').click();
    await expect(form).toHaveAttribute('data-state','invalid');
    expect(await form.locator('[aria-invalid="true"]').count()).toBeGreaterThan(0);
    await expect(form.getByRole('alert')).toContainText(/检查|check/i);
    const evidence = captureIntoTest(page, root, testInfo);
    await evidence.capture('form-invalid', { targets: ['form[data-state="invalid"]','[aria-invalid="true"]'] });
    for (const [name, value] of Object.entries(fields)) await form.locator(`[name="${name}"]`).fill(value);
    await form.locator('[type="submit"]').click();
    await expect(form).toHaveAttribute('data-state','success');
    await expect(form.locator('[aria-invalid="true"]')).toHaveCount(0);
    const feedback = slug === 'flat-design'
      ? root.locator('[data-generic-status][data-feedback]')
      : root.locator('[role="status"][data-feedback]').filter({ hasText: /State Atlas/ }).first();
    await expect(feedback).toBeVisible();
    if (slug === 'flat-design') await expect(root.locator('[data-workspaces]')).toContainText('State Atlas');
    await evidence.capture('form-success', { targets: ['form[data-state="success"]','[data-feedback]'] });
    const styles = await feedback.evaluate(element => { const s = getComputedStyle(element); return { padding: parseFloat(s.paddingLeft), borders: [s.borderTopWidth,s.borderRightWidth,s.borderBottomWidth,s.borderLeftWidth].map(parseFloat), shadow: s.boxShadow }; });
    expect(styles.padding > 0 || styles.borders.some(width => width > 0) || styles.shadow !== 'none', '非空反馈需要可见的品牌状态边界或表面，不是裸一行成功文字').toBe(true);
    if (slug === 'swiss-style') {
      await expect(feedback).toHaveCSS('border-top-width','3px');
      await expect(feedback).toHaveCSS('border-top-color','rgb(244, 55, 18)');
    }
  });
}

for (const [width, locale] of [[390, 'en'], [320, 'zh']]) {
  test(`VERTEX深色错误对比度 ${locale} ${width}px：真实反馈保持暖红且可读`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    const root = await openStyleStatePage(page, 'swiss-style', locale, 'dark');
    await action(root, 'nav-3').click();
    const form = root.locator('[data-scene-form="contact"]');
    await form.locator('[type="submit"]').click();
    await expect(form).toHaveAttribute('data-state', 'invalid');
    const alert = form.getByRole('alert');
    await expect(alert).toContainText(/检查|check/i);
    const material = await alert.evaluate(element => {
      const rgba = value => { const numbers = value.match(/[\d.]+/g).map(Number); return [...numbers.slice(0, 3), numbers[3] ?? 1]; };
      const layers = [];
      for (let current = element; current; current = current.parentElement) {
        const style = getComputedStyle(current);
        if (style.backgroundImage !== 'none') throw new Error('VERTEX反馈必须按真实纯色背景计算，不能忽略背景图。');
        layers.unshift(rgba(style.backgroundColor));
      }
      const background = layers.reduce((under, layer) => layer.slice(0, 3).map((channel, index) => channel * layer[3] + under[index] * (1 - layer[3])), [255, 255, 255]);
      const foreground = rgba(getComputedStyle(element).color);
      const luminance = color => color.slice(0, 3).map(channel => channel / 255).map(channel => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4).reduce((sum, channel, index) => sum + channel * [.2126, .7152, .0722][index], 0);
      const levels = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
      return { foreground, background, contrast: (levels[0] + .05) / (levels[1] + .05) };
    });
    await testInfo.attach('actual-invalid-contrast', { body: JSON.stringify(material), contentType: 'application/json' });
    expect(material.foreground[3]).toBe(1);
    expect(material.foreground[0]).toBeGreaterThan(material.foreground[1]);
    expect(material.foreground[0]).toBeGreaterThan(material.foreground[2]);
    expect(material.contrast, '14px错误正文需要至少4.5:1；不能只检查声明了红色token').toBeGreaterThanOrEqual(4.5);
    for (const [name, value] of Object.entries({ name: 'Contrast Atlas', email: 'contrast@example.com', brief: 'Readable feedback.' })) await form.locator(`[name="${name}"]`).fill(value);
    await form.locator('[type="submit"]').click();
    await expect(form).toHaveAttribute('data-state', 'success');
    await expect(form.getByRole('alert')).toHaveCount(0);
  });
}
