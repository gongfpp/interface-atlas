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
const privacyScript=[...layout.matchAll(/<script is:inline>([\s\S]*?)<\/script>/g)].find(([,source])=>source.includes('iaAnalyticsBeforeSend'))[1];
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
 const last=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('ia:analytics:session:v2')).last);
 await page.clock.runFor(31*60000);
 expect(new Set((await events(page)).map(e=>e.data.session_id)).size).toBe(1);
 expect(await page.evaluate(()=>JSON.parse(sessionStorage.getItem('ia:analytics:session:v2')).last)).toBe(last);
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

test('EO原生发送钩子在真实浏览器来源下拒绝http/端口/假域及缺marker，既有QA组合保持',async({browser})=>{
 const cases=[
  ['https://atlas.gongfpp.icu/',{'data-analytics-upgrade':'true'},true],
  ['http://atlas.gongfpp.icu/',{'data-analytics-upgrade':'true'},false],
  ['https://atlas.gongfpp.icu:444/',{'data-analytics-upgrade':'true'},false],
  ['https://atlas.gongfpp.icu.evil.test/',{'data-analytics-upgrade':'true'},false],
  ['https://interface-atlas-9po.pages.dev/',{'data-analytics-upgrade':'true'},false],
  ['https://gongfpp.github.io/interface-atlas-web/',{'data-analytics-upgrade':'true'},false],
  ['https://atlas.gongfpp.icu/',{},false],
  ['https://stats.gongfpp.icu/_qa/analytics-20261027/fixture/',{'data-analytics-qa':'true'},true],
  ['https://stats.gongfpp.icu/_qa/analytics-20261027/fixture/',{},false],
  ['https://stats.gongfpp.icu/_qa/analytics-20261027-other/',{'data-analytics-qa':'true'},false],
 ];
 for(const [origin,marker,allowed] of cases){
  const context=await browser.newContext({serviceWorkers:'block'}),page=await context.newPage();
  const attrs=Object.entries(marker).map(([key,value])=>`${key}="${value}"`).join(' ');
  const fixtureHtml=`<!doctype html><html ${attrs}><head><script>${identityScript}</script><script>${privacyScript}</script></head><body></body></html>`;
  await context.route('**/*',route=>route.fulfill({status:200,contentType:'text/html',body:fixtureHtml}));
  try {
  await page.goto(origin);
  const result=await page.evaluate(()=>({
   automatic:window.iaAnalyticsBeforeSend('event',{url:location.href}),
   custom:window.iaAnalyticsBeforeSend('event',{name:'page-arrival',data:{schema:2,event_time:Date.now()}}),
   visitor:localStorage.getItem('ia:analytics:visitor:v1'),
  }));
  for(const value of [result.automatic,result.custom])if(allowed)expect(value,origin).not.toBeNull();else expect(value,origin).toBeNull();
  if(allowed)expect(result.visitor,origin).not.toBeNull();else expect(result.visitor,origin).toBeNull();
  } finally { await context.close(); }
 }
});

test('同源跨页拒绝清理未安装reset的新文档访客，只移除固定访客键',async({page,context})=>{
 let fixtureHtml;
 await context.route('**/*',route=>route.fulfill({status:200,contentType:'text/html',body:fixtureHtml}));
 const visit=async(url,marker)=>{
  const attrs=Object.entries(marker).map(([key,value])=>`${key}="${value}"`).join(' ');
  fixtureHtml=`<!doctype html><html ${attrs}><head><script>${identityScript}</script><script>${privacyScript}</script></head><body></body></html>`;
  await page.goto(url);
 };
 const cases=[
  ['https://atlas.gongfpp.icu/valid/',{'data-analytics-upgrade':'true'},'https://atlas.gongfpp.icu/missing-marker/',{}],
  ['https://atlas.gongfpp.icu/valid/',{'data-analytics-upgrade':'true'},'https://atlas.gongfpp.icu/false-marker/',{'data-analytics-upgrade':'false'}],
  ['https://stats.gongfpp.icu/_qa/analytics-20261027/valid/',{'data-analytics-qa':'true'},'https://stats.gongfpp.icu/wrong-path/',{'data-analytics-qa':'true'}],
 ];
 for(const [valid,validMarker,blocked,blockedMarker] of cases){
  await visit(valid,validMarker);
  const prior=await page.evaluate(()=>{
   localStorage.setItem('ia-theme','dark');localStorage.setItem('unrelated','keep');sessionStorage.setItem('ia:analytics:session:v2','unchanged-session');
   return localStorage.getItem('ia:analytics:visitor:v1');
  });
  expect(prior,valid).not.toBeNull();
  await visit(blocked,blockedMarker);
  expect(await page.evaluate(()=>typeof window.iaAnalyticsResetVisitor),blocked).toBe('undefined');
  expect(await page.evaluate(()=>localStorage.getItem('ia:analytics:visitor:v1')),blocked).toBe(prior);
  for(const custom of [false,true]){
   const result=await page.evaluate(({prior,custom})=>{
    localStorage.setItem('ia:analytics:visitor:v1',prior);
    const filtered=window.iaAnalyticsBeforeSend('event',custom?{name:'page-arrival',data:{schema:2,event_time:Date.now()}}:{url:location.href});
    return {filtered,visitor:localStorage.getItem('ia:analytics:visitor:v1'),theme:localStorage.getItem('ia-theme'),other:localStorage.getItem('unrelated'),session:sessionStorage.getItem('ia:analytics:session:v2')};
   },{prior,custom});
   expect(result,blocked).toEqual({filtered:null,visitor:null,theme:'dark',other:'keep',session:'unchanged-session'});
  }
 }
});
