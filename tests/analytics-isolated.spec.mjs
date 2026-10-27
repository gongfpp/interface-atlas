import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import ts from 'typescript';

// 所有请求都由浏览器路由返回合成内容；不访问站点或生产统计端点。
const root=new URL('../',import.meta.url);
const compile=path=>ts.transpileModule(readFileSync(new URL(path,root),'utf8').replaceAll('import.meta.env.PUBLIC_LOG_API',"'off'"),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText
  .replaceAll("'@/lib/track'","'/track.js'").replaceAll("'@/lib/i18n'","'/i18n.js'").replaceAll("'@/lib/analytics-identity'","'/identity.js'");
const identityModule={exports:{}};
new Function('module','exports',ts.transpileModule(readFileSync(new URL('src/lib/analytics-identity.ts',root),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText)(identityModule,identityModule.exports);
const identityScript=identityModule.exports.analyticsIdentityScript;
const layout=readFileSync(new URL('src/layouts/BaseLayout.astro',root),'utf8');
const privacyScript=layout.match(/<script is:inline>\s*([\s\S]*?iaAnalyticsBeforeSend[\s\S]*?)<\/script>/)[1];
const fixture='https://stats.gongfpp.icu/_qa/analytics-20261027/fixture/';
async function setup(page,{late=false,gpc=false}={}){
 await page.addInitScript(({late,gpc})=>{
  Object.defineProperty(navigator,'globalPrivacyControl',{configurable:true,value:gpc});
  window.__events=[];window.__install=()=>{window.umami={track(name,data){window.__events.push({name,data});return Promise.resolve();}};window.dispatchEvent(new Event('ia:analytics-ready'));};
  if(!late)window.__install();
 },{late,gpc});
 await page.route('**/*',async route=>{
  const url=new URL(route.request().url());
  if(url.origin!==new URL(fixture).origin)throw Error('Unexpected external request: '+url);
  let body,type='text/javascript';
  if(url.pathname==='/track.js')body=compile('src/lib/track.ts');
  else if(url.pathname==='/identity.js')body=compile('src/lib/analytics-identity.ts');
  else if(url.pathname==='/analytics.js')body=compile('src/lib/analytics.ts');
  else if(url.pathname==='/i18n.js')body="export const stripBase=p=>p;export const withBase=p=>p;";
  else {type='text/html';body=`<!doctype html><html lang="zh-CN" data-analytics-qa="true"><head><script>${identityScript}</script><script>${privacyScript}</script><script data-website-id="synthetic-fixture"></script></head><body><main><section data-track-region="fixture"><button data-track-label="test">test</button><input value="private-content-not-collected"></section></main><script type="module">import * as tracking from '/track.js';import {startAnalytics} from '/analytics.js';window.__tracking=tracking;window.__stop=startAnalytics();window.__ready=true;</script></body></html>`;}
  await route.fulfill({status:200,contentType:type,body});
 });
 await page.goto(fixture);await page.waitForFunction(()=>window.__ready);
}
const events=page=>page.evaluate(()=>window.__events);

test('长开页面的心跳不续期；真实操作轮换会话并重置访问计时，不叠加 timer',async({page})=>{
 await page.clock.install();await setup(page);
 const first=(await events(page))[0].data;
 await page.clock.runFor(31*60000);
 expect(new Set((await events(page)).map(e=>e.data.session_id)).size).toBe(1);
 expect(await page.evaluate(()=>JSON.parse(sessionStorage.getItem('ia:analytics:session:v2')).last)).toBe(first.event_time);
 await page.locator('button').click();
 const rows=await events(page),arrival=rows.filter(e=>e.name==='page-arrival').at(-1);
 expect(arrival.data.session_id).not.toBe(first.session_id);expect(arrival.data.visit_id).not.toBe(first.visit_id);
 expect(arrival.data.page_step).toBe(1);expect(arrival.data.sequence).toBe(1);
 expect(rows.findLast(e=>e.name==='page-engagement'&&e.data.session_id===first.session_id).data.visible_ms).toBeGreaterThanOrEqual(31*60000);
 const before=rows.filter(e=>e.name==='page-engagement'&&e.data.session_id===arrival.data.session_id).length;
 await page.clock.runFor(30000);
 const heartbeats=(await events(page)).filter(e=>e.name==='page-engagement'&&e.data.session_id===arrival.data.session_id);
 expect(heartbeats.length-before).toBe(1);expect(heartbeats.at(-1).data.visible_ms).toBeLessThanOrEqual(31000);
 expect(await page.evaluate(()=>Object.keys(localStorage).filter(k=>/visitor|subject/i.test(k)))).toEqual(['ia:analytics:visitor:v1']);
});

test('GPC 在初始采集、自动 pageview、晚加载队列和日志端点一致生效',async({page})=>{
 await setup(page,{gpc:true});await page.locator('button').click();expect(await events(page)).toEqual([]);
 expect(await page.evaluate(()=>window.iaAnalyticsBeforeSend('event',{url:'/'}))).toBeNull();
 expect(await page.evaluate(()=>sessionStorage.getItem('ia:analytics:session:v2'))).toBeNull();
});

test('晚加载队列遇 GPC 后丢弃，不在解除排除时补报旧事件',async({page})=>{
 await setup(page,{late:true});await page.locator('button').click();expect(await events(page)).toEqual([]);
 await page.evaluate(()=>{Object.defineProperty(navigator,'globalPrivacyControl',{configurable:true,value:true});window.__tracking.flushTracking();Object.defineProperty(navigator,'globalPrivacyControl',{configurable:true,value:false});window.__install();});
 expect(await events(page)).toEqual([]);
 await page.locator('button').click();expect((await events(page)).some(e=>e.name==='ui-click')).toBe(true);
});

test('隐藏不是离开；BFCache 新 visit 且监听器不重复，内容不进入事件',async({page})=>{
 await page.clock.install();await setup(page);const first=(await events(page))[0].data.visit_id;
 await page.clock.runFor(60000);
 await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,value:'hidden'});document.dispatchEvent(new Event('visibilitychange'));});
 const hidden=(await events(page)).find(e=>e.name==='page-hidden').data;
 expect((await events(page)).filter(e=>e.name==='page-leave')).toHaveLength(0);
 await page.clock.runFor(60000);
 await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,value:'visible'});document.dispatchEvent(new Event('visibilitychange'));window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));});
 await page.locator('button').click();const rows=await events(page);
 expect(rows.filter(e=>e.name==='page-leave')).toHaveLength(1);expect(rows.filter(e=>e.name==='ui-click')).toHaveLength(1);
 expect(rows.find(e=>e.name==='page-arrival'&&e.data.restored).data.visit_id).not.toBe(first);
 expect(hidden.active_ms).toBeLessThanOrEqual(30000);expect(JSON.stringify(rows)).not.toContain('private-content');
});

test('渠道按精确来源区分，自定义属性保留 schema2；只持久化获批同源身份',async({page})=>{
 await setup(page);
 expect((await events(page))[0].data).toMatchObject({schema:2,project:'interface-atlas',hostname:'stats.gongfpp.icu',channel:'unknown'});
 const cases=[['https://gongfpp.github.io/interface-atlas-web/','github-pages'],['https://gongfpp.github.io/other/','unknown'],['https://atlas.gongfpp.icu/','edgeone-pages'],['https://interface-atlas-9po.pages.dev/','cloudflare-pages'],['https://other.pages.dev/','unknown']];
 // 用纯函数源码和合成 location 检验映射，不导航到生产域名。
 const source=readFileSync(new URL('src/lib/track.ts',root),'utf8').match(/export function analyticsChannel\(\) \{([\s\S]*?)\n\}/)[1];
 for(const [url,channel]of cases)expect(Function('window',source)({location:new URL(url)})).toBe(channel);
 expect(await page.evaluate(()=>localStorage.length)).toBe(1);
});

test('DNT 与自主排除同样过滤自动及自定义事件，服务故障不抛出到页面',async({page})=>{
 await setup(page);await page.evaluate(()=>{Object.defineProperty(window,'doNotTrack',{configurable:true,value:'yes'});window.__tracking.track('blocked');});
 expect(await page.evaluate(()=>window.iaAnalyticsBeforeSend('event',{}))).toBeNull();
 const before=(await events(page)).length;
 await page.evaluate(()=>{Object.defineProperty(window,'doNotTrack',{configurable:true,value:undefined});localStorage.setItem('umami.disabled','1');window.__tracking.track('blocked');});
 expect((await events(page)).length).toBe(before);
 expect(await page.evaluate(()=>window.iaAnalyticsBeforeSend('event',{}))).toBeNull();
 await page.evaluate(()=>{localStorage.removeItem('umami.disabled');window.umami.track=()=>Promise.reject(Error('synthetic offline'));window.__tracking.track('synthetic');});
 await page.locator('button').click();
});
