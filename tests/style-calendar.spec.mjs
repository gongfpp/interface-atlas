import { test, expect } from './helpers/private-browser.mjs';
import { pathFor } from './helpers/style-page-flows.mjs';

for (const locale of ['zh','en']) for (const width of [1280,390,320]) {
  test(`Tasko 连续月份 ${locale} ${width}px：完整日期、六周排布和跨年`,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.goto(pathFor(locale,'/style-scenes/bento-grid/'));
    const calendar=page.locator('.bento-calendar');
    for(let step=1;step<=12;step++) {
      await calendar.locator('[data-scene-action="tasko-next"]').click();
      const year=2024+Math.floor((3+step)/12), month=(3+step)%12;
      const length=new Date(year,month+1,0).getDate();
      await expect(calendar.locator('.calendar-grid > button')).toHaveCount(length);
      const boxes=await calendar.evaluate(element=>{
        const box=element.getBoundingClientRect();
        return [...element.querySelectorAll('.calendar-grid > button')].map(day=>{const r=day.getBoundingClientRect();return {text:day.textContent,top:r.top-box.top,bottom:box.bottom-r.bottom,left:r.left-box.left,right:box.right-r.right};});
      });
      for(const day of boxes) for(const key of ['top','bottom','left','right']) expect(day[key],`${year}-${month+1} day ${day.text} ${key}`).toBeGreaterThanOrEqual(-1);
      await calendar.locator('.calendar-grid > button').last().click();
      await expect(calendar.locator('.calendar-grid > button').last()).toHaveAttribute('aria-pressed','true');
      await expect(page.locator('[data-tasko-selected]')).toContainText(String(year));
    }
    await expect(calendar.locator('[data-tasko-month]')).toContainText('2025');
    await expect(page.locator('[data-calendar-weeks]')).toHaveAttribute('data-calendar-weeks','5');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}
