import { test, expect } from './helpers/private-browser.mjs';
import { STYLE_SLUGS, REFERENCE_STYLES, pathFor, assertStyleDocumentBoundary } from './helpers/style-page-flows.mjs';

async function snapshot(page) {
  const hero = page.locator('.generic-style-hero');
  await hero.evaluate(() => document.fonts.ready);
  return hero.evaluate(root => {
    const origin = root.getBoundingClientRect();
    return {
      text: root.textContent.replace(/\s+/g, ' ').trim(),
      nodes: [root, ...root.querySelectorAll('*')].map(element => {
        const box = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          tag: ['SPAN','BUTTON'].includes(element.tagName) ? 'ACTION_OR_SPAN' : element.tagName,
          className: element.getAttribute('class') || '',
          geometry: [box.x-origin.x, box.y-origin.y, box.width, box.height],
          appearance: Object.fromEntries(['fontFamily','fontSize','fontWeight','lineHeight','color','backgroundColor','backgroundImage','borderRadius','boxShadow','objectFit','objectPosition'].map(key => [key, style[key]])),
          image: element.tagName === 'IMG' ? element.getAttribute('src') : null,
        };
      }),
    };
  });
}

for (const locale of ['zh','en']) for (const slug of STYLE_SLUGS.filter(slug => !REFERENCE_STYLES.includes(slug))) {
  test(`配置风格封面整页同源 ${slug} ${locale} 1088px：全部首屏结构、文字、素材与几何`, async ({ page }, testInfo) => {
    await page.setViewportSize({width:1088,height:900});
    await page.goto(pathFor(locale, `/style-covers/${slug}/`));
    await expect(page.locator('script[src]')).toHaveCount(0);
    await assertStyleDocumentBoundary(page);
    const before = await snapshot(page);
    await page.goto(pathFor(locale, `/style-scenes/${slug}/`));
    await assertStyleDocumentBoundary(page);
    const after = await snapshot(page);
    expect(after.text).toBe(before.text);
    expect(after.nodes).toHaveLength(before.nodes.length);
    const differences = [];
    after.nodes.forEach((node,index) => {
      const original = before.nodes[index];
      expect({tag:node.tag,className:node.className,appearance:node.appearance,image:node.image}).toEqual({tag:original.tag,className:original.className,appearance:original.appearance,image:original.image});
      node.geometry.forEach((value,key) => differences.push({index,key,delta:value-original.geometry[key]}));
    });
    await testInfo.attach('generic-hero-parity.json',{body:JSON.stringify({slug,locale,before,after,differences},null,2),contentType:'application/json'});
    for (const item of differences) expect(Math.abs(item.delta),`${slug} node ${item.index} geometry ${item.key}`).toBeLessThanOrEqual(1.5);
  });
}
