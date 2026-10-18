import { test, expect } from './helpers/private-browser.mjs';
import { pathFor, sceneAction, assertNoOverflow } from './helpers/style-page-flows.mjs';

for (const slug of ['flat-design', 'hand-drawn', 'corporate-memphis', 'organic']) {
  for (const locale of ['zh', 'en']) for (const width of [1280, 390, 320]) {
    test(`键盘移除 ${slug} ${locale} ${width}px：相邻条目与空表入口保持焦点`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(pathFor(locale, `/style-scenes/${slug}/`));
      const root = page.locator(`[data-style-scene="${slug}"]`);
      await sceneAction(root, 'primary').click();
      let list;
      let fallback;
      if (slug === 'organic') {
        await root.locator('[data-command="basket"][data-value="0"]').click();
        await root.locator('[data-command="basket"][data-value="1"]').click();
        list = root.locator('[data-basket]');
        fallback = root.locator('[data-command="basket"][data-value="0"]');
      } else {
        const names = {
          'flat-design': ['workspace', 'name', 'data-workspaces'],
          'hand-drawn': ['note', 'note', 'data-notes'],
          'corporate-memphis': ['team', 'task', 'data-team-tasks'],
        };
        const [formName, fieldName, listName] = names[slug];
        const form = root.locator(`[data-generic-form="${formName}"]`);
        fallback = form.locator(`[name="${fieldName}"]`);
        list = root.locator(`[${listName}]`);
        if (slug !== 'corporate-memphis') for (const text of ['Alpha atlas', 'Beta atlas']) {
          await fallback.fill(text);
          await form.locator('[type="submit"]').click();
        }
      }
      const items = list.locator(':scope > li');
      const removes = list.locator(':scope > li > button');
      let count = await items.count();
      expect(count).toBeGreaterThanOrEqual(2);
      await removes.first().focus();
      await removes.first().press('Enter');
      await expect(items).toHaveCount(--count);
      await expect(removes.first()).toBeFocused();
      while (count > 0) {
        await removes.last().focus();
        await removes.last().press('Enter');
        await expect(items).toHaveCount(--count);
        if (count > 0) await expect(removes.last()).toBeFocused();
      }
      await expect(fallback).toBeFocused();
      await expect(fallback).toBeInViewport({ ratio: 1 });
      await assertNoOverflow(page, 'keyboard-empty-list');
    });
  }
}
