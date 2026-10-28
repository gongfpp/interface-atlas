import { test, expect } from './helpers/private-browser.mjs';
import { observeSettledGeometry } from './helpers/settled-geometry.mjs';

const monitor = async page => page.addInitScript(() => {
  window.addEventListener('pagereveal', event => {
    if (!event.viewTransition) return;
    event.viewTransition.ready.then(() => {
      sessionStorage.setItem('motion-observed', JSON.stringify({path:location.pathname,durations:document.getAnimations().map(a=>a.effect?.getComputedTiming().duration)}));
    }).catch(()=>{});
  });
});

test('标题栏八个功能页连续过渡并保持导航、返回与语言切换', async ({ page }) => {
  await monitor(page);
  await page.goto('/');
  const mechanism = await page.locator('html').getAttribute('data-page-motion');
  for (const route of ['styles','components','patterns','motion','pages','foundation','a11y','gallery']) {
    await page.locator(`header nav:visible a[href="/${route}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${route}/?$`));
    await expect(page.locator(`header nav:visible a[href="/${route}"]`)).toHaveAttribute('aria-current','page');
    await expect(page.locator('h1')).toBeVisible();
    if (mechanism === 'native') await expect.poll(()=>page.evaluate(()=>JSON.parse(sessionStorage.getItem('motion-observed')||'{}').path)).toMatch(new RegExp(`/${route}/?$`));
    else await expect.poll(()=>page.locator('#main').evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
  }
  await page.goBack();
  await expect(page).toHaveURL(/\/a11y\/?$/);
  await expect(page.locator('#main')).toHaveCSS('opacity','1');
  await page.locator('[data-track-label="language-switch"]').click();
  await expect(page).toHaveURL(/\/en\/a11y\/?$/);
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  // Page scripts still initialize after document navigation.
  const theme = page.locator('#theme-toggle');
  const before = await theme.getAttribute('aria-pressed');
  await theme.click();
  await expect(theme).toHaveAttribute('aria-pressed',String(before !== 'true'));
});

test('手机菜单展开、栏目过渡与键盘按钮反馈', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  await page.locator('header summary').click();
  await expect(page.locator('header details')).toHaveAttribute('open','');
  await page.locator('header details a[href="/components"]').click();
  await expect(page).toHaveURL(/\/components\/?$/);
  const theme = page.locator('#theme-toggle');
  await page.evaluate(async () => { await Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))); });
  await theme.evaluate(el=>el.addEventListener('click',()=>{
    window.__buttonMotion=el.getAnimations().some(a=>a.playState==='running'&&a.effect.getKeyframes().some(frame=>frame.filter==='brightness(0.78)'));
  },{once:true}));
  await theme.focus(); await page.keyboard.press('Enter');
  await expect.poll(()=>page.evaluate(()=>window.__buttonMotion)).toBe(true);
  await expect.poll(()=>theme.evaluate(el=>getComputedStyle(el).filter)).toBe('none');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('不支持跨文档过渡时，快速点击以最后目标为准且返回后恢复不透明', async ({ page }) => {
  await page.addInitScript(()=>{ delete window.CSSViewTransitionRule; });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-page-motion','fallback');
  await page.evaluate(()=>{
    document.querySelector('header nav a[href="/styles"]').click();
    document.querySelector('header nav a[href="/components"]').click();
  });
  await expect(page).toHaveURL(/\/components\/?$/);
  await page.goBack();
  await expect(page.locator('#main')).toHaveCSS('opacity','1');
  await page.waitForTimeout(200);
  await expect(page).toHaveURL(/\/$/);
  await page.evaluate(()=>{
    document.querySelector('header nav a[href="/styles"]').click();
    document.querySelector('a[href="#main"]').click();
  });
  await page.waitForTimeout(250);
  await expect(page).toHaveURL(/\/#main$/);
  await expect(page.locator('#main')).toHaveCSS('opacity','1');
});

test('杂志弹窗关闭时可见渐隐，结束后归还焦点', async ({ page }) => {
  await page.goto('/style-scenes/editorial/');
  const search=page.locator('[data-scene-action="search"]').first();
  await search.click();
  const dialog=page.locator('[data-scene-dialog="search"]');
  await expect(dialog).toBeVisible();
  await dialog.evaluate(async el=>{await Promise.all(el.getAnimations().map(a=>a.finished.catch(()=>{})));});
  await dialog.evaluate(el=>el.addEventListener('keydown',event=>{
    if(event.key==='Escape') setTimeout(()=>{ window.__exitFrame={open:el.open,opacity:Number(getComputedStyle(el).opacity)}; },60);
  },{once:true}));
  await page.keyboard.press('Escape');
  await expect.poll(()=>page.evaluate(()=>window.__exitFrame)).toBeTruthy();
  const frame=await page.evaluate(()=>window.__exitFrame);
  expect(frame.open).toBe(true); expect(frame.opacity).toBeGreaterThan(0); expect(frame.opacity).toBeLessThan(1);
  await expect(dialog).not.toHaveAttribute('open');
  await expect(search).toBeFocused();
});

test('减少动态模式保留全部操作但不播放按钮、内容及跨页动画', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await monitor(page); await page.goto('/styles/');
  await page.locator('#theme-toggle').click();
  expect(await page.locator('#theme-toggle').evaluate(el=>el.getAnimations().filter(a=>a.effect.getComputedTiming().duration>1).length)).toBe(0);
  await page.locator('header nav:visible a[href="/components"]').click();
  await expect(page).toHaveURL(/\/components\/?$/);
  expect(await page.evaluate(()=>sessionStorage.getItem('motion-observed'))).toBeNull();
  await page.goto('/style-scenes/bauhaus/');
  await page.locator('[data-generic-tab="1"]').click();
  await expect(page.locator('[data-generic-panel="1"]')).toBeVisible();
  expect(await page.locator('[data-generic-panel="1"]').evaluate(el=>el.getAnimations().filter(a=>a.playState==='running'&&a.effect.getComputedTiming().duration>1).length)).toBe(0);
});

test('样板导航以滚动和入场到达内容，快速切换没有旧面板回写', async ({ page }) => {
  await page.goto('/style-scenes/bauhaus/');
  const nav=page.locator('.generic-style-hero [data-generic-action="nav-0"]');
  await nav.click();
  const panel=page.locator('[data-generic-panel="1"]');
  await expect(panel).toBeVisible();
  await observeSettledGeometry(panel);
  const box=await panel.boundingBox(); expect(box.y).toBeLessThan(page.viewportSize().height-100);
  expect((await page.locator('[data-generic-content]').boundingBox()).y).toBeLessThanOrEqual(1);
  await page.evaluate(()=>{
    document.querySelector('[data-generic-tab="2"]').click();
    document.querySelector('[data-generic-tab="0"]').click();
  });
  await expect(page.locator('[data-generic-panel="0"]')).toBeVisible();
  await expect(page.locator('[data-generic-panel="2"]')).toBeHidden();
  await expect.poll(()=>page.locator('[data-generic-panel="0"]').evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
});
