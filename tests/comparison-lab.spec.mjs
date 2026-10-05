import { test, expect } from './helpers/private-browser.mjs';

async function openLab(page, path = '/compare') {
  await page.goto(path);
  const lab = page.locator('#comparison-lab');
  await lab.scrollIntoViewIfNeeded();
  await expect(lab.locator('button').first()).toBeVisible();
  await expect(page.locator('astro-island[component-export="default"][ssr]').filter({ has: lab })).toHaveCount(0);
  return lab;
}

for (const mode of ['modal', 'drawer', 'sheet']) {
  test(`${mode} filters survive close and reopen, Escape restores focus`, async ({ page }) => {
    const lab = await openLab(page);
    const card = lab.locator(`[data-comparison="${mode}"]`);
    const trigger = card.getByRole('button', { name: '筛选', exact: true });
    await trigger.click();
    const dialog = card.getByRole('dialog');
    await dialog.getByRole('combobox').selectOption('home');
    await dialog.getByRole('slider').fill('200');
    await expect(dialog.getByRole('status')).toHaveText('3 件匹配 · 立即生效');
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(dialog.getByRole('combobox')).toHaveValue('home');
    await expect(dialog.getByRole('slider')).toHaveValue('200');
    await dialog.getByRole('button', { name: '查看结果' }).click();
    await expect(card.locator('.comparison-product-grid > button')).toHaveCount(3);
    await lab.getByRole('button', { name: '重置本组' }).click();
    await card.getByRole('button', { name: '筛选', exact: true }).click();
    await expect(card.getByRole('combobox')).toHaveValue('all');
  });
}

test('pagination jumps to a record while infinite scrolling appends the same dataset', async ({ page }) => {
  const lab = await openLab(page, '/compare/scroll-loading');
  const paged = lab.locator('[data-comparison="pagination"]');
  await paged.getByRole('button', { name: '3', exact: true }).click();
  await paged.getByRole('button', { name: /设计提案 #11/ }).click();
  await paged.getByRole('button', { name: '1', exact: true }).click();
  await expect(paged.getByRole('status')).toContainText('已标记 #11');
  const infinite = lab.locator('[data-comparison="infinite"]');
  const scroller = infinite.getByRole('region');
  await scroller.evaluate(el => el.scrollTop = el.scrollHeight);
  await expect(infinite.locator('.comparison-record')).toHaveCount(8);
  await scroller.evaluate(el => el.scrollTop = el.scrollHeight);
  await expect(infinite.locator('.comparison-record')).toHaveCount(12);
  await infinite.getByRole('button', { name: /设计提案 #11/ }).click();
  await expect(infinite.getByRole('status')).toContainText('已标记 #11');
});

test('English tabs support keyboard focus and accordion can expose two sections', async ({ page }) => {
  const lab = await openLab(page, '/en/compare');
  await lab.getByRole('button', { name: 'Check a guide', exact: true }).click();
  const tabs = lab.getByRole('tab');
  await tabs.first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(lab.getByRole('tabpanel')).toContainText('14 days');
  const accordion = lab.locator('[data-comparison="accordion"]');
  await accordion.locator('summary').nth(1).click();
  await expect(accordion.locator('details[open]')).toHaveCount(2);
  await expect(accordion.getByText(/Dispatch within 2/)).toBeVisible();
  await expect(accordion.getByText(/Request a return within 14/)).toBeVisible();
});

test('comparison lab fits a phone viewport without horizontal page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const lab = await openLab(page);
  for (const task of ['筛选商品', '查找记录', '核对说明']) {
    await lab.getByRole('button', { name: task, exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});
