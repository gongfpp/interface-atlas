import { test, expect } from './helpers/private-browser.mjs';

const routes = [
  { registry: 'SolutionLab', url: '/components/input', ready: '[data-solution-lab] .demo-content input' },
  { registry: 'ViewportPreview', url: '/viewport?concept=input&mode=default', ready: 'input[type=email]' },
  { registry: 'DemoMount', url: '/styles/skeuomorphism', activate: '[data-style-interactive]', ready: '[data-style-interactive] .demo-content' },
];

for (const route of routes) for (const delayMs of [0, 120]) for (const sample of [1, 2, 3]) {
  test(`preload waterfall ${route.registry} delay=${delayMs} sample=${sample}`, async ({ page }, testInfo) => {
    const failures = [], errors = [], requests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => failures.push({ url: request.url(), error: request.failure()?.errorText }));
    page.on('request', request => { if (request.resourceType() === 'script') requests.push({ url: request.url(), at: Date.now() }); });
    if (delayMs) await page.route(/\.js(?:\?.*)?$/, async request => {
      if (new URL(request.request().url()).origin === 'http://127.0.0.1:4337') await new Promise(resolve => setTimeout(resolve, delayMs));
      await request.fallback();
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(route.url, { waitUntil: 'domcontentloaded' });
    const activationAt = await page.evaluate(() => performance.now());
    if (route.activate) await page.locator(route.activate).scrollIntoViewIfNeeded();
    await expect(page.locator(route.ready).first()).toBeVisible();
    const timing = await page.evaluate(() => ({
      readyAt: performance.now(),
      timeOrigin: performance.timeOrigin,
      resources: performance.getEntriesByType('resource').filter(entry => /\.js(?:\?|$)/.test(entry.name)).map(entry => ({
        url: entry.name, initiatorType: entry.initiatorType, startTime: entry.startTime, responseEnd: entry.responseEnd, duration: entry.duration, transferSize: entry.transferSize, encodedBodySize: entry.encodedBodySize,
      })),
      modulepreloads: [...document.querySelectorAll('link[rel=modulepreload]')].map(link => link.href),
    }));
    await testInfo.attach('preload-waterfall.json', { body: JSON.stringify({ registry: route.registry, url: route.url, syntheticScriptDelayMs: delayMs, sample, activationAt, ...timing, requests, failures, errors }), contentType: 'application/json' });
    expect(errors).toEqual([]);
  });
}
