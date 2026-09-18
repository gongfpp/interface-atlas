import { expect, test } from '@playwright/test';

/**
 * 最小 smoke（审计 P0-C）：核心闭环"打开搜索 → 输入口语 → 命中概念 → 跳转详情"。
 */
test('search: open, type colloquial query, navigate to concept', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#search-open')).toBeVisible();
  await page.locator('#search-open').click();

  const input = page.getByRole('dialog').getByRole('textbox');
  await expect(input).toBeVisible();

  // 口语化查询：黄金测试集同款
  await input.fill('加载的时候灰色一闪一闪');
  const firstResult = page
    .getByRole('dialog')
    .getByRole('button')
    .filter({ hasText: /骨架屏|Skeleton/ })
    .first();
  await expect(firstResult).toBeVisible({ timeout: 15_000 });
  await firstResult.click();

  // 跳转到 Skeleton Loading 详情页
  await expect(page).toHaveURL(/\/patterns\/skeleton-loading/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/骨架屏|Skeleton/);
});

test('⌘K opens search after hydration', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#search-open')).toBeVisible();
  // 等待 island 水合完成后再按快捷键
  await page.waitForTimeout(1200);
  await page.keyboard.press('ControlOrMeta+k');
  await expect(page.getByRole('dialog').getByRole('textbox')).toBeVisible();
});

test('styles page renders style scenes', async ({ page }) => {
  await page.goto('/styles');
  await expect(page.getByRole('link', { name: /极简主义/ }).first()).toBeVisible();
});

test('homepage shows style wall and gallery', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('先看风格')).toBeVisible();
  await expect(
    page.getByRole('link', { name: /导航栏参考图集|Navbar Reference Sheets/ }).first(),
  ).toBeVisible();
});

test('compare: index lists groups, group page renders comparison table', async ({ page }) => {
  await page.goto('/compare');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('概念对比');
  await page.locator('a[href="/compare/navigation-overlay"]').click();
  await expect(page).toHaveURL(/\/compare\/navigation-overlay/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('命令面板');
  await expect(page.getByRole('table')).toBeVisible();
});

test('explore: type filter narrows the grid', async ({ page }) => {
  await page.goto('/explore');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('随机探索');
  await expect(page.locator('[data-explore-item]').first()).toBeVisible();
  await page.locator('.explore-chip[data-filter="motion"]').click();
  await expect(page.locator('[data-explore-item]:not(.hidden)')).toHaveCount(20);
  await page.locator('.explore-chip[data-filter="all"]').click();
  await expect(page.locator('[data-explore-item]:not(.hidden)')).toHaveCount(90);
});
