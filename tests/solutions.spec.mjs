import { test, expect } from './helpers/private-browser.mjs';
import { readFile } from 'node:fs/promises';

const solution = {
  id: 'test-button', conceptId: 'button', conceptType: 'components', name: '主要按钮',
  locale: 'zh', styleId: 'glassmorphism', styleName: '玻璃拟态', mode: 'dark', variant: 'primary',
  requirements: ['键盘操作', '减少动效'], prompt: '实现主要按钮，支持键盘操作。\n```text\n保留完整内容\n```',
  group: '个人网站', note: '用于首页主操作', url: '/components/button?style=glassmorphism&mode=dark', createdAt: 1,
};
async function seed(page, items) {
  await page.goto('/saved');
  await page.evaluate((value) => localStorage.setItem('ia-solutions-v1', JSON.stringify(value)), items);
  await page.reload();
  await expect(page.getByRole('heading', { name: '项目参考册' })).toBeVisible();
}

test('notebook retains configuration, edits project notes and exports the selected project', async ({ page }) => {
  await seed(page, [solution, { ...solution, id: 'other', name: '次要按钮', group: '管理后台' }]);
  await expect(page.getByRole('link', { name: '恢复方案' }).first()).toHaveAttribute('href', solution.url);
  const card = page.getByRole('article').filter({ has: page.getByRole('heading', { name: '主要按钮', exact: true }) });
  await card.getByRole('button', { name: '编辑分组与理由' }).click();
  await card.getByRole('textbox', { name: '项目分组' }).fill('作品集');
  await card.getByRole('textbox', { name: '选择理由' }).fill('首页强调主要行动');
  await card.getByRole('button', { name: '保存修改' }).click();
  await expect(page.getByRole('status').filter({ hasText: '方案已更新' })).toBeVisible();
  await page.reload();
  await expect(page.getByText('首页强调主要行动')).toBeVisible();
  await page.getByRole('combobox', { name: '项目分组' }).selectOption('group:作品集');
  await expect(page.getByRole('article')).toHaveCount(1);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载 Markdown' }).click();
  const download = await downloadPromise;
  const markdown = await readFile(await download.path(), 'utf8');
  expect(markdown).toContain('## 作品集');
  expect(markdown).toContain('首页强调主要行动');
  expect(markdown).toContain(solution.prompt);
  expect(markdown).toContain('````text');
  expect(markdown).not.toContain('次要按钮');
  await page.getByRole('button', { name: '移除方案 主要按钮', exact: true }).click();
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: '次要按钮', exact: true })).toBeVisible();
});

test('notebook ignores malformed entries and unsafe restore URLs', async ({ page }) => {
  await seed(page, [null, 4, {}, { ...solution, url: 'javascript:alert(1)' }, { ...solution, id: 'external', url: 'https://example.com' }, solution, solution]);
  await expect(page.getByRole('article')).toHaveCount(1);
  await page.evaluate(() => localStorage.setItem('ia-solutions-v1', '{broken'));
  await page.reload();
  await expect(page.getByText('在组件实验室选好效果', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: '去挑选一个方案' })).toHaveAttribute('href', '/components');
});

test('notebook synchronizes removals and storage clear across tabs', async ({ page, context }) => {
  await seed(page, [solution]);
  const other = await context.newPage();
  await other.goto('/saved');
  await expect(other.getByRole('article')).toHaveCount(1);
  await page.getByRole('button', { name: '移除方案 主要按钮', exact: true }).click();
  await expect(other.getByRole('article')).toHaveCount(0);
  await page.evaluate((item) => localStorage.setItem('ia-solutions-v1', JSON.stringify([item])), solution);
  await expect(other.getByRole('article')).toHaveCount(1);
  await page.evaluate(() => localStorage.clear());
  await expect(other.getByRole('article')).toHaveCount(0);
});

test('failed persistence keeps new edits in memory with an export warning', async ({ page }) => {
  await seed(page, [solution]);
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException('full', 'QuotaExceededError'); }; });
  await page.getByRole('button', { name: '编辑分组与理由' }).click();
  await page.getByRole('textbox', { name: '选择理由' }).fill('本次会话里的修改');
  await page.getByRole('button', { name: '保存修改' }).click();
  await expect(page.getByRole('alert').filter({ hasText: '本地存储不可用' })).toBeVisible();
  await expect(page.getByText('本次会话里的修改', { exact: true })).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载 Markdown' }).click();
  const download = await downloadPromise;
  expect(await readFile(await download.path(), 'utf8')).toContain('本次会话里的修改');
  await page.reload();
  await expect(page.getByText('用于首页主操作', { exact: true })).toBeVisible();
});

test('clipboard failure exposes a selectable Markdown fallback', async ({ page }) => {
  await seed(page, [solution]);
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('denied'); } } }));
  await page.getByRole('button', { name: '复制 Markdown' }).click();
  await expect(page.getByRole('textbox', { name: '手动复制 Markdown' })).toContainText('主要按钮');
});
