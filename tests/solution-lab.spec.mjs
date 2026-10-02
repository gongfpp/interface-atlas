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
  await expect(lab.locator('pre')).toContainText('只保留一条发丝下划线');
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
