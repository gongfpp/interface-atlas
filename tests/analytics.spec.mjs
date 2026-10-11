import { test, expect } from '@playwright/test';

async function capture(page, { late = false, disabled = false } = {}) {
  await page.addInitScript(({ late, disabled }) => {
    if (disabled) localStorage.setItem('umami.disabled', '1');
    window.__analytics = [];
    window.__installTracker = () => {
      window.umami = { track(name, data) {
        const item = { name, data };
        window.__analytics.push(item);
        const history = JSON.parse(sessionStorage.getItem('analytics-test') || '[]');
        sessionStorage.setItem('analytics-test', JSON.stringify([...history, item]));
        return Promise.resolve();
      } };
      window.dispatchEvent(new Event('ia:analytics-ready'));
    };
    if (!late) window.__installTracker();
  }, { late, disabled });
}

const events = page => page.evaluate(() => window.__analytics);

test('首页链接记录入口、去向，下一页到达记录实际来源', async ({ page }) => {
  await capture(page);
  await page.goto('/');
  await expect.poll(async () => (await events(page)).some(e => e.name === 'page-arrival')).toBe(true);
  await page.locator('.home-organic').click();
  await expect(page).toHaveURL(/\/styles\/organic/);
  await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('analytics-test')).filter(e => e.name === 'page-arrival').length)).toBe(2);
  const history = await page.evaluate(() => JSON.parse(sessionStorage.getItem('analytics-test')));
  const nav = history.find(e => e.name === 'home-navigation');
  expect(nav.data).toMatchObject({ page: '/', destination: '/styles/organic', region: 'home-hero', kind: 'internal', new_tab: false });
  expect(history.filter(e => e.name === 'page-leave')).toHaveLength(1);
  expect(new Set(history.map(e => e.data.session_id)).size).toBe(1);
  expect(history.filter(e => e.name === 'page-arrival').map(e => e.data.page_step)).toEqual([1, 2]);
  expect(history.map(e => e.data.session_sequence)).toEqual(history.map((_, i) => i + 1));
  expect(history.filter(e => e.name === 'page-arrival').at(-1).data).toMatchObject({ from: '/', page: '/styles/organic' });
});

test('完整匿名路径包含外部来源、Agent 复制、粘贴位置与最后页面，正文不上报', async ({ page }) => {
  await capture(page);
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => {} } }));
  await page.goto('/', { referer: 'https://example.org/article?private=secret' });
  await page.locator('.home-mini').click();
  await expect(page).toHaveURL(/\/components\/tabs/);
  const copy = page.locator('[data-track-label^="copy-prompt-"]');
  await expect(copy).toBeVisible();
  await copy.click();
  await expect.poll(async () => (await events(page)).some(e => e.name === 'prompt-copy')).toBe(true);
  await page.evaluate(() => {
    const input = document.createElement('input');
    input.dataset.trackLabel = 'test-field';
    input.value = 'private.person@example.com';
    document.querySelector('main').appendChild(input);
    const clipboardData = new DataTransfer();
    clipboardData.setData('text/plain', 'private clipboard body 13800138000');
    input.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, clipboardData }));
    window.dispatchEvent(new PageTransitionEvent('pagehide'));
  });
  const history = await page.evaluate(() => JSON.parse(sessionStorage.getItem('analytics-test')));
  expect(new Set(history.map(e => e.data.session_id)).size).toBe(1);
  const copied = history.find(e => e.name === 'prompt-copy');
  expect(copied.data).toMatchObject({ page: '/components/tabs', layer: 'agent', outcome: 'success', entry_source: 'example.org', entry_page: '/' });
  expect(history.find(e => e.name === 'clipboard-paste').data.label).toBe('test-field');
  expect(history.filter(e => e.name === 'page-leave').at(-1).data.page).toBe('/components/tabs');
  expect(JSON.stringify(history)).not.toMatch(/private\.person|13800138000|private clipboard body|article\?private/);
});

test('图库成功复制同时记录具体图集与 Prompt 语言', async ({ page }) => {
  await capture(page);
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => {} } }));
  await page.goto('/gallery/input');
  await page.locator('#copy-prompt-en').click();
  await expect.poll(async () => (await events(page)).some(e => e.name === 'prompt-copy')).toBe(true);
  const event = (await events(page)).find(e => e.name === 'prompt-copy');
  expect(event.data).toMatchObject({ concept: 'gallery:/gallery/input', layer: 'image', prompt_locale: 'en', source: 'gallery-prompt', outcome: 'success' });
  expect(event.data.session_id).toBeTruthy();
  expect(event.data.visit_id).toBeTruthy();
});

test('新页面在会话过期后换匿名编号，存储受限时仍可正常操作', async ({ page }) => {
  await capture(page);
  await page.goto('/');
  await expect.poll(async () => (await events(page)).some(e => e.name === 'page-arrival')).toBe(true);
  const first = (await events(page))[0].data.session_id;
  await page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide'));
    const key = 'ia:analytics:session:v2';
    const state = JSON.parse(sessionStorage.getItem(key));
    state.last = Date.now() - 31 * 60 * 1000;
    sessionStorage.setItem(key, JSON.stringify(state));
  });
  await page.goto('/en/');
  await expect.poll(async () => (await events(page)).some(e => e.name === 'page-arrival')).toBe(true);
  expect((await events(page))[0].data.session_id).not.toBe(first);
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('unavailable'); };
    Storage.prototype.setItem = () => { throw new Error('unavailable'); };
    window.umami = { track(name, data) { window.__analytics.push({ name, data }); } };
  });
  await page.goto('/');
  await page.locator('#theme-toggle').click();
  await expect.poll(async () => (await events(page)).some(e => e.name === 'ui-click')).toBe(true);
});

test('可见与活跃时长分开统计，隐藏不计时，离开仅结算一次', async ({ page }) => {
  await capture(page);
  await page.clock.install();
  await page.goto('/');
  await expect.poll(async () => (await events(page)).length).toBeGreaterThan(0);
  await page.clock.runFor(61_000);
  let report = (await events(page)).filter(e => e.name === 'page-engagement').at(-1).data;
  expect(report.visible_ms).toBeGreaterThanOrEqual(60_000);
  expect(report.active_ms).toBeLessThanOrEqual(30_000);
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  const hidden = (await events(page)).find(e => e.name === 'page-hidden').data;
  await page.clock.runFor(60_000);
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.locator('#theme-toggle').click();
  await page.clock.runFor(5000);
  await page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide'));
    window.dispatchEvent(new PageTransitionEvent('pagehide'));
  });
  const leaves = (await events(page)).filter(e => e.name === 'page-leave');
  expect(leaves).toHaveLength(1);
  report = leaves[0].data;
  expect(report.visible_ms - hidden.visible_ms).toBeGreaterThanOrEqual(5000);
  expect(report.visible_ms - hidden.visible_ms).toBeLessThan(6000);
  expect(report.elapsed_ms - report.visible_ms).toBeGreaterThanOrEqual(60_000);
  expect(report.active_ms).toBeLessThan(report.visible_ms);
});

test('滚动里程碑仅上报一次，点击包含控件及页面坐标', async ({ page }) => {
  await capture(page);
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(async () => (await events(page)).some(e => e.name === 'scroll-depth' && e.data.depth === 100)).toBe(true);
  await page.evaluate(() => { window.scrollTo(0, 0); });
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.locator('#theme-toggle').click();
  const recorded = await events(page);
  expect(recorded.filter(e => e.name === 'scroll-depth' && e.data.depth === 100)).toHaveLength(1);
  const click = recorded.find(e => e.name === 'ui-click' && e.data.label === 'theme-toggle');
  expect(click.data).toMatchObject({ region: 'header', control: 'button', pointer: 'pointer' });
  expect(click.data.target).toContain('button:nth-of-type');
  expect(click.data.x_pct).toBeGreaterThanOrEqual(0);
});

test('搜索输入不上传原文，回车选结果记录排名和首页去向', async ({ page }) => {
  await capture(page);
  await page.goto('/');
  const input = page.locator('.home-hero input[role="combobox"]');
  await input.fill('private.person@example.com 13800138000');
  await expect.poll(async () => (await events(page)).some(e => e.name === 'search')).toBe(true);
  expect(JSON.stringify(await events(page))).not.toContain('private.person');
  expect(JSON.stringify(await events(page))).not.toContain('13800138000');
  await input.fill('tabs');
  await expect(page.locator('#hero-opt-components-tabs[aria-selected="true"]')).toBeVisible();
  await input.press('Enter');
  await expect(page).toHaveURL(/\/components\/tabs/);
  const history = await page.evaluate(() => JSON.parse(sessionStorage.getItem('analytics-test')));
  const selected = history.find(e => e.name === 'search-result').data;
  expect(selected).toMatchObject({ destination: '/components/tabs', source: 'hero-search' });
  expect(selected.rank).toBe(1);
  expect(history.find(e => e.name === 'home-navigation').data.source).toBe('hero-search');
});

test('BFCache 恢复重新计时，保留一份监听器', async ({ page }) => {
  await capture(page);
  await page.goto('/');
  await expect.poll(async () => (await events(page)).length).toBeGreaterThan(0);
  const first = (await events(page))[0].data.visit_id;
  await page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  await page.locator('#theme-toggle').click();
  const recorded = await events(page);
  const restored = recorded.find(e => e.name === 'page-arrival' && e.data.restored);
  expect(restored.data.visit_id).not.toBe(first);
  expect(recorded.filter(e => e.name === 'ui-click')).toHaveLength(1);
});

test('匿名排除设置与预览页停止事件采集', async ({ page }) => {
  await capture(page, { disabled: true });
  await page.goto('/');
  await page.locator('#theme-toggle').click();
  expect(await events(page)).toEqual([]);
  await page.evaluate(() => localStorage.removeItem('umami.disabled'));
  await page.route('**/*', async route => {
    if (route.request().resourceType() !== 'document') return route.continue();
    const response = await route.fetch();
    await route.fulfill({ response, body: (await response.text()).replace('<html ', '<html data-analytics-preview="true" ') });
  });
  await page.goto('/en/');
  await page.locator('#theme-toggle').click();
  expect(await events(page)).toEqual([]);
});

test('统计脚本延迟加载保留到达和早期点击，失败不阻塞交互', async ({ page }) => {
  await capture(page, { late: true });
  await page.route('**/*', async route => {
    if (route.request().resourceType() !== 'document') return route.continue();
    const response = await route.fetch();
    await route.fulfill({ response, body: (await response.text()).replace('</head>', '<script data-website-id="test"></script></head>') });
  });
  await page.goto('/');
  await page.locator('#theme-toggle').click();
  expect(await events(page)).toEqual([]);
  await page.evaluate(() => window.__installTracker());
  await expect.poll(async () => (await events(page)).length).toBeGreaterThanOrEqual(2);
  expect((await events(page))[0].name).toBe('page-arrival');
  await page.evaluate(() => { window.umami.track = () => Promise.reject(new Error('offline')); });
  const wasDark = await page.locator('html').evaluate(el => el.classList.contains('dark'));
  await page.locator('#theme-toggle').click();
  expect(await page.locator('html').evaluate(el => el.classList.contains('dark'))).toBe(!wasDark);
});
