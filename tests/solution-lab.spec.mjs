import { test, expect } from '@playwright/test';

async function openLab(page, path = '/components/input') {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  const lab = page.locator('[data-solution-lab]');
  await expect(lab).toBeVisible();
  return lab;
}

test('Use current solution returns from generic scope and follows the visible style', async ({ page }) => {
  const lab = await openLab(page);
  await lab.getByRole('button', { name: '通用概念说明', exact: true }).click();
  await lab.getByRole('button', { name: '极简主义', exact: true }).click();
  await lab.getByRole('button', { name: /使用当前方案/ }).click();
  await expect(lab.getByRole('button', { name: '当前方案', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(lab.locator('[data-solution-summary]')).toContainText('极简主义');
  await expect(lab.locator('pre')).toContainText('发丝下划线');
});

test('a solution saved from the lab restores style, form, width and exact requirements', async ({ page }) => {
  const lab = await openLab(page);
  await lab.getByRole('button', { name: '新粗野主义', exact: true }).click();
  await lab.getByRole('button', { name: '窄容器', exact: true }).click();
  const forms = lab.getByRole('combobox', { name: /实现形式/ });
  await forms.selectOption({ index: 1 });
  const expectedForm = await forms.inputValue();
  await lab.getByRole('checkbox', { name: '支持深色模式', exact: true }).uncheck();
  await lab.getByRole('checkbox', { name: '不新增依赖', exact: true }).uncheck();
  await lab.getByRole('textbox', { name: '项目分组', exact: true }).fill('恢复回归');
  await lab.getByRole('textbox', { name: '为什么选它', exact: true }).fill('首页表单');
  const expectedPrompt = await lab.locator('pre').innerText();
  await lab.getByRole('button', { name: '保存方案', exact: true }).click();
  await expect(lab.getByText('方案已保存到项目参考册。', { exact: true })).toBeVisible();
  await lab.getByRole('link', { name: /打开项目参考册/ }).click();
  await expect(page.getByText('首页表单', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: /恢复方案/ }).click();
  const restored = page.locator('[data-solution-lab]');
  await expect(restored.getByRole('button', { name: '新粗野主义', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(restored.getByRole('button', { name: '窄容器', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(restored.getByRole('combobox', { name: /实现形式/ })).toHaveValue(expectedForm);
  await expect(restored.getByRole('checkbox', { name: '支持深色模式', exact: true })).not.toBeChecked();
  await expect(restored.getByRole('checkbox', { name: '不新增依赖', exact: true })).not.toBeChecked();
  await expect(restored.locator('pre')).toHaveText(expectedPrompt);
});

test('clipboard failure in English exposes readable manual copy content and can retry', async ({ page }) => {
  await page.addInitScript(() => {
    let count = 0;
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { if (count++ === 0) throw new Error('Blocked'); } } });
  });
  const lab = await openLab(page, '/en/components/input');
  await lab.getByRole('button', { name: 'Minimalism', exact: true }).click();
  await lab.getByRole('button', { name: /Copy prompt/ }).click();
  await expect(lab.getByText('Clipboard unavailable. Select the text below to copy manually.', { exact: true })).toBeVisible();
  await expect(lab.locator('pre')).toContainText('Current solution: Input · Minimalism');
  await lab.getByRole('button', { name: /Copy prompt/ }).click();
  await expect(lab.getByText('Copied. Paste it into your project.', { exact: true })).toBeVisible();
});

test('device preview uses its own viewport independently of the narrow parent', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const lab = await openLab(page);
  await lab.getByRole('button', { name: '设备视口', exact: true }).click();
  const frame = lab.frameLocator('iframe');
  await expect(frame.getByRole('textbox', { name: '工作邮箱' })).toBeVisible();
  await expect.poll(() => frame.locator('html').evaluate(() => window.innerWidth)).toBe(390);
  await lab.getByRole('combobox', { name: '视口宽度', exact: true }).selectOption('768');
  await expect.poll(() => frame.locator('html').evaluate(() => window.innerWidth)).toBe(768);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('supported input state persists across styles and reset clears it', async ({ page }) => {
  const lab = await openLab(page);
  await lab.getByRole('button', { name: '极简主义', exact: true }).click();
  await lab.locator('.demo-content').getByRole('textbox').fill('shared@example.com');
  await lab.getByRole('button', { name: '新粗野主义', exact: true }).click();
  await expect(lab.locator('.demo-content').getByRole('textbox')).toHaveValue('shared@example.com');
  await lab.getByRole('button', { name: /重置/ }).click();
  await expect(lab.locator('.demo-content').getByRole('textbox')).not.toHaveValue('shared@example.com');
});

test('select style changes preserve the same plan rather than falling back to the first option', async ({ page }) => {
  const lab = await openLab(page, '/components/select');
  const select = lab.locator('.demo-content').getByRole('combobox', { name: '项目套餐', exact: true });
  await lab.getByRole('button', { name: '瑞士风格', exact: true }).click();
  await select.selectOption('team');
  await lab.getByRole('button', { name: '包豪斯', exact: true }).click();
  await expect(select).toHaveValue('team');
  await lab.getByRole('button', { name: '液态玻璃', exact: true }).click();
  await expect(select).toHaveValue('team');
  await select.selectOption('basic');
  await lab.getByRole('button', { name: '瑞士风格', exact: true }).click();
  await expect(select).toHaveValue('basic');
});

for (const scenario of [
  { path: '/components/input', value: 'filled', summary: '填充', choose: async lab => lab.locator('.demo-content').getByRole('button', { name: '填充', exact: true }).click(), verify: async lab => expect(lab.locator('.demo-content').getByRole('button', { name: '填充', exact: true })).toHaveAttribute('aria-pressed', 'true') },
  { path: '/components/tabs', value: 'card', summary: '卡片', choose: async lab => lab.getByRole('combobox', { name: '标签页外观', exact: true }).selectOption('card'), verify: async lab => expect(lab.getByRole('combobox', { name: '标签页外观', exact: true })).toHaveValue('card') },
  { path: '/pages/dashboard', value: 'topnav', summary: '顶部导航仪表盘', choose: async lab => lab.locator('.demo-content').getByRole('button', { name: '顶栏', exact: true }).click(), verify: async lab => expect(lab.locator('.demo-content aside')).toHaveCount(0) },
]) {
  test(`${scenario.path} internal appearance becomes the saved and restored current solution`, async ({ page }) => {
    const lab = await openLab(page, scenario.path);
    await scenario.choose(lab);
    await expect(lab.getByRole('combobox', { name: /预览形式/ })).toHaveValue(scenario.value);
    await expect(lab.locator('[data-solution-summary]')).toContainText(scenario.summary);
    await expect(lab.locator('pre')).toContainText(`form=${scenario.value}`);
    if (scenario.value === 'card') await expect(lab.locator('pre')).not.toContainText('2px 底部强调色横线');
    await lab.getByRole('button', { name: /使用当前方案/ }).click();
    const prompt = await lab.locator('pre').innerText();
    await lab.getByRole('button', { name: '保存方案', exact: true }).click();
    await expect(lab.getByRole('button', { name: /已保存方案/ })).toBeDisabled();
    await lab.getByRole('link', { name: /打开项目参考册/ }).click();
    const restore = page.getByRole('link', { name: /恢复方案/ });
    await expect(restore).toHaveAttribute('href', new RegExp(`form=${scenario.value}`));
    await restore.click();
    const restored = page.locator('[data-solution-lab]');
    await scenario.verify(restored);
    await expect(restored.getByRole('combobox', { name: /预览形式/ })).toHaveValue(scenario.value);
    await expect(restored.locator('pre')).toHaveText(prompt);
    await restored.getByRole('button', { name: '设备视口', exact: true }).click();
    await expect(restored.locator('iframe')).toHaveAttribute('src', new RegExp(`form=${scenario.value}`));
    const frame = restored.frameLocator('iframe');
    if (scenario.value === 'filled') await expect(frame.getByRole('button', { name: '填充', exact: true })).toHaveAttribute('aria-pressed', 'true');
    if (scenario.value === 'card') await expect(frame.getByRole('combobox', { name: '标签页外观', exact: true })).toHaveValue('card');
    if (scenario.value === 'topnav') {
      await expect(frame.getByRole('button', { name: '顶栏', exact: true })).toBeVisible();
      await expect(frame.locator('aside')).toHaveCount(0);
    }
  });
}

test('a failed demo module can recover by reloading after the network is restored', async ({ page }) => {
  const demoChunk = /\/(?:src\/islands\/demos\/input\.tsx|_astro\/input\.[^/]+\.js)(?:\?.*)?$/;
  let aborted = 0;
  await page.route(demoChunk, route => { aborted++; return route.abort('failed'); });
  await page.goto('/components/input', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('alert').filter({ hasText: '实验室加载失败' })).toBeVisible();
  expect(aborted).toBeGreaterThan(0);
  await page.unroute(demoChunk);
  await page.getByRole('button', { name: '重新加载页面', exact: true }).click();
  await expect(page.locator('[data-solution-lab]')).toBeVisible();
  await expect(page.locator('.demo-content').getByRole('textbox', { name: '工作邮箱', exact: true })).toBeVisible();
});

test('list empty state widens the category and carries the exact query into global search', async ({ page }) => {
  await page.goto('/components');
  await page.locator('[data-list-cat="Navigation"]').click();
  await page.locator('[data-list-search]').fill('按钮');
  await expect(page.locator('[data-list-empty]')).toBeVisible();
  await page.getByRole('button', { name: '清除分类', exact: true }).click();
  await expect(page.locator('[data-list-empty]')).toBeHidden();
  await page.locator('[data-list-search]').fill('全站测试 & 空结果');
  await page.getByRole('link', { name: '在全站搜索这句话', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('combobox')).toHaveValue('全站测试 & 空结果');
});

test('lab reports failed persistence without claiming the reference is saved', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new DOMException('blocked', 'SecurityError'); };
  });
  const lab = await openLab(page);
  await lab.getByRole('button', { name: '保存方案', exact: true }).click();
  await expect(lab.getByText('浏览器未能持久保存。请现在复制上方说明；刷新或离开此页可能丢失。', { exact: true })).toBeVisible();
  await expect(lab.getByRole('button', { name: '保存方案', exact: true })).toBeEnabled();
  await expect(lab.locator('pre')).toContainText('当前方案');
});

test('同一方案多次保存失败后恢复，参考册与刷新结果只有一条', async ({ page }) => {
  const lab = await openLab(page);
  await page.evaluate(() => {
    window.__atlasSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = () => { throw new DOMException('full', 'QuotaExceededError'); };
  });
  const save = lab.getByRole('button', { name: '保存方案', exact: true });
  await save.click();
  await expect(lab.getByText('浏览器未能持久保存。请现在复制上方说明；刷新或离开此页可能丢失。', { exact: true })).toBeVisible();
  await save.click();
  await page.evaluate(() => { Storage.prototype.setItem = window.__atlasSetItem; delete window.__atlasSetItem; });
  await save.click();
  await expect(lab.getByRole('button', { name: /已保存方案/ })).toBeDisabled();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ia-solutions-v1')).length)).toBe(1);
  await lab.getByRole('link', { name: /打开项目参考册/ }).click();
  await expect(page.getByRole('article')).toHaveCount(1);
  await page.reload();
  await expect(page.getByRole('article')).toHaveCount(1);
});

test('旧复制失败晚到，界面仍保留最近一次成功的反馈', async ({ page }) => {
  const lab = await openLab(page);
  await page.evaluate(() => {
    window.__atlasCopies = [];
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: () => new Promise((resolve, reject) => window.__atlasCopies.push({ resolve, reject })),
    } });
  });
  const copy = lab.getByRole('button', { name: /复制 Prompt/ });
  await copy.click(); await copy.click();
  await page.evaluate(() => window.__atlasCopies[1].resolve());
  await expect(lab.getByRole('button', { name: /已复制/ })).toBeVisible();
  await page.evaluate(() => window.__atlasCopies[0].reject(new Error('old denial')));
  await expect(lab.getByRole('button', { name: /已复制/ })).toBeVisible();
  await expect(lab.getByText('无法访问剪贴板，请选中下方文本手动复制。', { exact: true })).toHaveCount(0);
});

for (const width of [390, 1280]) {
  test(`附加形式不冒充已预览效果，并可保存恢复原预览（${width}px）`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    // 普通恢复链接只有 form，不能依赖用户先点击一次已实现形式来保存预览状态。
    const lab = await openLab(page, '/components/input?form=filled');
    const forms = lab.getByRole('combobox', { name: /预览形式/ });
    await forms.selectOption('with-addons');
    await expect(lab.locator('.demo-content').getByRole('button', { name: '填充', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(lab.locator('[data-solution-summary]')).toContainText('附加形式（未预览）：带前后缀');
    const prompt = await lab.locator('pre').innerText();
    expect(prompt).toContain('实际预览形式：填充');
    expect(prompt).toContain('以附加形式要求为准');
    expect(prompt).toContain('form=with-addons');
    expect(prompt).toContain('preview=filled');
    await lab.getByRole('button', { name: '设备视口', exact: true }).click();
    await expect(lab.locator('iframe')).toHaveAttribute('src', /form=filled/);
    await expect(lab.frameLocator('iframe').getByRole('button', { name: '填充', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await lab.getByRole('button', { name: '保存方案', exact: true }).click();
    await lab.getByRole('link', { name: /打开项目参考册/ }).click();
    await expect(page.getByRole('article')).toContainText('附加形式（未预览）：带前后缀');
    await expect(page.getByRole('article')).toContainText('实际预览形式：填充');
    await page.getByRole('link', { name: /恢复方案/ }).click();
    const restored = page.locator('[data-solution-lab]');
    await expect(restored.getByRole('combobox', { name: /预览形式/ })).toHaveValue('with-addons');
    await expect(restored.locator('.demo-content').getByRole('button', { name: '填充', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(restored.locator('pre')).toHaveText(prompt);
    await restored.locator('.demo-content').getByRole('button', { name: '下划线', exact: true }).click();
    await expect(restored.locator('[data-solution-summary]')).toContainText('已预览形式：下划线');
    await expect(restored.locator('pre')).not.toContainText('附加形式（未预览）：');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

test('风格方案的附加形式在英文输出中明确覆盖预览，而不是声称已经演示', async ({ page }) => {
  const lab = await openLab(page, '/en/components/input');
  await lab.getByRole('button', { name: 'Minimalism', exact: true }).click();
  await lab.getByRole('combobox', { name: /Implementation variant/ }).selectOption('filled');
  await expect(lab.locator('[data-solution-summary]')).toContainText('Additional variant (not previewed)');
  await expect(lab.locator('pre')).toContainText('additional variant takes precedence');
  await expect(lab.locator('pre')).toContainText('must be verified separately');
  await lab.getByRole('button', { name: 'Device viewport', exact: true }).click();
  await expect(lab.locator('iframe')).not.toHaveAttribute('src', /form=filled/);
  await lab.getByRole('button', { name: 'Base example', exact: true }).click();
  await expect(lab.locator('[data-solution-summary]')).toContainText('Previewed variant');
  await expect(lab.locator('pre')).not.toContainText('Additional variant (not previewed)');
});

for (const [locale, width] of [['zh', 390], ['en', 1280]]) {
  for (const [component, style] of [['button', 'cyberpunk'], ['input', 'swiss-style'], ['card', 'neumorphism']]) {
    test(`${locale} 新增 ${component}/${style} 风格能完整保存、恢复并复制当前方案`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const lab = await openLab(page, `${locale === 'en' ? '/en' : ''}/components/${component}`);
      await expect(lab.locator('[data-style]')).toHaveCount(6);
      await lab.locator(`[data-style="${style}"]`).click();
      const text = await lab.locator('pre').innerText();
      expect(text).toContain(`style=${style}`);
      await lab.getByRole('button', { name: locale === 'zh' ? '保存方案' : 'Save solution', exact: true }).click();
      await lab.getByRole('link', { name: locale === 'zh' ? /打开项目参考册/ : /Open project notebook/ }).click();
      await page.getByRole('link', { name: locale === 'zh' ? /恢复方案/ : /Restore solution/ }).click();
      const restored = page.locator('[data-solution-lab]');
      await expect(restored.locator(`[data-style="${style}"]`)).toHaveAttribute('aria-pressed', 'true');
      await expect(restored.locator('pre')).toHaveText(text);
      await restored.getByRole('button', { name: locale === 'zh' ? '设备视口' : 'Device viewport', exact: true }).click();
      await expect(restored.locator('iframe')).toHaveAttribute('src', new RegExp(`style=${style}`));
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });
  }
}
