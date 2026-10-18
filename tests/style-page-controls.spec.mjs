import { test, expect } from './helpers/private-browser.mjs';
import { pathFor, readyStyleFrame, reloadStyleFrame, exerciseStyleFlow, assertUsableGeometry } from './helpers/style-page-flows.mjs';

for(const slug of ['swiss-style','editorial']) for(const locale of ['zh','en']) for(const width of [390,320]) for(const height of [900,600]) {
  test(`嵌入浮层 ${slug} ${locale} ${width}px 外窗${height}px：完整可见、点击稳定与返回`,async({page})=>{
    test.setTimeout(60000);
    await page.setViewportSize({width:1280,height});
    await page.goto(pathFor(locale,`/styles/${slug}/`));
    await expect(page.locator('header[data-track-region="header"]')).toHaveCSS('position','relative');
    const {experience,iframe,frame,scene}=await readyStyleFrame(page,slug,locale);
    await experience.locator(`[data-scene-width="${width}px"]`).click();
    for(const mode of ['default','dark','variants']) {
      await reloadStyleFrame(experience,frame,`[data-style-mode="${mode}"]`);
      await iframe.evaluate(el=>scrollBy({top:el.getBoundingClientRect().top-440,behavior:'instant'}));
      await scene.locator(`[data-scene-action="${slug==='swiss-style'?'menu':'story-0'}"]`).first().click();
      await expect.poll(async()=>{const box=await iframe.boundingBox();return box.y+box.height;}).toBeLessThanOrEqual(height);
      await expect.poll(async()=>(await iframe.boundingBox()).y).toBeGreaterThanOrEqual(0);
      if(slug==='swiss-style') {
        await scene.locator('[data-scene-dialog="menu"] [data-scene-action="nav-3"]').click();
        await expect(scene.locator('#scene-section-3')).toBeFocused();
      } else {
        const save=scene.locator('[data-scene-dialog="story"] [data-scene-action="save-story"]');
        await save.click();await expect(save).toHaveAttribute('aria-pressed','true');
        await save.click();await expect(save).toHaveAttribute('aria-pressed','false');
        await page.keyboard.press('Escape');
      }
      await expect(scene.locator('dialog[open]')).toHaveCount(0);
      // 检查完整项目/文章、关闭、搜索、收藏与返回，不用局部菜单成功代替完整流程。
      await exerciseStyleFlow(scene,slug,locale);
    }
  });
}

for(const slug of ['swiss-style','editorial']) for(const locale of ['zh','en']) for(const height of [900,600]) {
  test(`离屏模式 ${slug} ${locale} 外窗${height}px：明确操作后立即加载新文档`,async({page})=>{
    await page.setViewportSize({width:1280,height});
    await page.goto(pathFor(locale,`/styles/${slug}/`));
    const {experience,iframe,frame}=await readyStyleFrame(page,slug,locale);
    await expect(iframe).toHaveAttribute('loading','lazy');
    for(const mode of ['dark','variants','default']) {
      const control=`[data-style-mode="${mode}"]`;
      await experience.locator(control).evaluate(el=>scrollBy({top:el.getBoundingClientRect().bottom-innerHeight+4,behavior:'instant'}));
      expect((await iframe.boundingBox()).y).toBeGreaterThan(height);
      await reloadStyleFrame(experience,frame,control);
      await expect(iframe).toHaveAttribute('loading','eager');
      await expect(frame.locator('body')).toHaveAttribute('data-mode',mode);
    }
  });
}

for(const locale of ['zh','en']) {
  test(`非风格详情保留吸顶 ${locale}：首页、列表与组件`,async({page})=>{
    for(const path of ['/','/styles/','/components/button/']) {
      await page.goto(pathFor(locale,path));
      await expect(page.locator('header[data-track-region="header"]')).toHaveCSS('position','sticky');
    }
  });
  test(`Art Deco 长标题完整 ${locale}：桌面、重排临界点和手机`,async({page},testInfo)=>{
    for(const width of [1280,1088,1024,768,701,700,600,390,320]) {
      await page.setViewportSize({width,height:900});
      await page.goto(pathFor(locale,'/style-scenes/art-deco/'));
      const scene=page.locator('[data-style-scene="art-deco"]');
      await scene.evaluate(()=>document.fonts.ready);
      await assertUsableGeometry(scene,width,testInfo,`title-${width}`);
    }
  });
}

for(const locale of ['zh','en']) for(const width of [1280,390,320]) {
  for(const [slug,prefix,caption] of [['minimalism','lumo','.lumo-caption'],['neumorphism','mellow','.mellow-caption']]) {
    test(`原页分页 ${slug} ${locale} ${width}px：前后分别生效、循环与恢复`,async({page})=>{
      await page.setViewportSize({width,height:900});
      await page.goto(pathFor(locale,`/style-scenes/${slug}/`));
      const initial=await page.locator(caption).innerText();
      const count=page.locator(`[data-${prefix}-page]`);
      const next=page.locator(`[data-scene-action="${prefix}-next"]`);
      const previous=page.locator(`[data-scene-action="${prefix}-previous"]`);
      await next.click();
      await expect(count).toHaveText('02 / 03');
      expect(await page.locator(caption).innerText()).not.toBe(initial);
      await previous.click();
      await expect(count).toHaveText('01 / 03');
      await expect(page.locator(caption)).toHaveText(initial,{useInnerText:true});
      await previous.click();
      await expect(count).toHaveText('03 / 03');
      await next.click();
      await expect(count).toHaveText('01 / 03');
      await expect(page.locator(caption)).toHaveText(initial,{useInnerText:true});
      await expect(next).toBeVisible();
      await expect(previous).toBeVisible();
      if(width<600) {
        for(const control of [next,previous]) { const box=await control.boundingBox();expect(box.width).toBeGreaterThanOrEqual(44);expect(box.height).toBeGreaterThanOrEqual(44); }
      }
      await page.reload();
      await expect(count).toHaveText('01 / 03');
    });
  }
  test(`alegria Keep going ${locale} ${width}px：原入口进入实际团队任务`,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.goto(pathFor(locale,'/style-scenes/corporate-memphis/'));
    await page.locator('button.gs-team-keep').click();
    await expect(page.locator('[data-team-task-workspace]')).toBeFocused();
    await expect(page.locator('[data-team-tasks] li')).toHaveCount(5);
  });
  test(`Tasko Keep going ${locale} ${width}px：原入口进入可操作任务`,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.goto(pathFor(locale,'/style-scenes/bento-grid/'));
    await page.locator('button.tasko-keep').click();
    await expect(page.locator('#scene-section-0')).toBeFocused();
    await expect(page.locator('[data-other-form="task"]')).toBeVisible();
  });
}
