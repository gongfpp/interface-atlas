import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';
import {randomUUID} from 'node:crypto';
import ts from 'typescript';

// 运行真实 TS 模块的无网络 DOM 合同模型；不是浏览器、样式或上线验收。
function rig({late=false,gpc=false,blockedStorage=false,upgraded=true,origin='https://stats.gongfpp.icu/_qa/analytics-20261027/'}={}){
 let time=1792860000000,performanceTime=0,next=0;const timers=new Map(),events=[];
 const disk=()=>{const values=new Map();return{getItem:k=>{if(blockedStorage)throw Error('synthetic blocked storage');return values.get(k)??null;},setItem:(k,v)=>{if(blockedStorage)throw Error('synthetic blocked storage');values.set(k,String(v));},removeItem:k=>values.delete(k),values};};
 const localStorage=disk(),sessionStorage=disk(),document=new EventTarget(),window=new EventTarget(),navigator={globalPrivacyControl:gpc,doNotTrack:undefined};
 Object.assign(document,{documentElement:{dataset:upgraded?{analyticsQa:'true',analyticsUpgrade:'true'}:{},lang:'zh-CN',scrollHeight:1600},body:{},visibilityState:'visible',referrer:'',querySelector:()=>({dataset:{websiteId:'synthetic'}}),querySelectorAll:()=>[],hasFocus:()=>true});
 Object.assign(window,{location:new URL(origin),innerWidth:800,innerHeight:600,scrollY:0,getSelection:()=>null,localStorage,sessionStorage});window.self=window.top=window;
 const install=()=>{window.umami={track(name,data){events.push({name,data:structuredClone(data)});return Promise.resolve();}};};if(!late)install();
 const schedule=(fn,delay,repeat)=>{const id=++next;timers.set(id,{fn,at:performanceTime+delay,delay,repeat});return id;};
 class ClockDate extends Date{static now(){return time;}}
 const context=createContext({window,document,navigator,localStorage,sessionStorage,location:window.location,innerWidth:800,innerHeight:600,scrollY:0,crypto:{randomUUID},Date:ClockDate,performance:{now:()=>performanceTime},Element:class{},IntersectionObserver:class{observe(){}disconnect(){}},Promise,URL,
  setInterval:(fn,delay)=>schedule(fn,delay,true),clearInterval:id=>timers.delete(id),setTimeout:(fn,delay)=>schedule(fn,delay,false),clearTimeout:id=>timers.delete(id)});
 const cache=new Map();
 const load=path=>{if(cache.has(path))return cache.get(path);const module={exports:{}};cache.set(path,module.exports);
  const source=readFileSync(new URL('../../'+path,import.meta.url),'utf8').replaceAll('import.meta.env.PUBLIC_LOG_API',"'off'");
  const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
  const require=name=>name==='@/lib/track'?load('src/lib/track.ts'):name==='@/lib/analytics-identity'?load('src/lib/analytics-identity.ts'):{stripBase:p=>p,withBase:p=>p};
  runInContext('(function(require,module,exports){'+js+'\n})',context)(require,module,module.exports);return module.exports;};
 const track=load('src/lib/track.ts'),analytics=load('src/lib/analytics.ts');
 runInContext(load('src/lib/analytics-identity.ts').analyticsIdentityScript,context);
 const layout=readFileSync(new URL('../../src/layouts/BaseLayout.astro',import.meta.url),'utf8');
 runInContext(layout.match(/<script is:inline>\s*([\s\S]*?iaAnalyticsBeforeSend[\s\S]*?)<\/script>/)[1],context);
 const dispatch=(target,type,details={})=>{const e=new Event(type);for(const [k,v]of Object.entries(details))Object.defineProperty(e,k,{value:v});target.dispatchEvent(e);};
 const advance=ms=>{const end=performanceTime+ms;while(true){const due=[...timers].filter(([,t])=>t.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!due)break;const[id,t]=due;time+=t.at-performanceTime;performanceTime=t.at;if(t.repeat)t.at+=t.delay;else timers.delete(id);t.fn();}time+=end-performanceTime;performanceTime=end;};
 return{events,window,document,navigator,localStorage,sessionStorage,track,install,advance,dispatch,timers,context,scriptConfig:load('src/lib/analytics-config.ts').analyticsScriptConfig,scope:load('src/lib/analytics-identity.ts').analyticsUpgradeEnabled,start:()=>analytics.startAnalytics()};
}

test('长开页面心跳不续期，真实操作轮换会话/visit、封存旧累计并且不增加定时器',()=>{
 const r=rig(),stop=r.start(),first=r.events[0].data;
 r.advance(31*60000);assert.equal(new Set(r.events.map(e=>e.data.session_id)).size,1);
 assert.equal(JSON.parse(r.sessionStorage.getItem('ia:analytics:session:v2')).last,first.event_time);
 r.dispatch(r.document,'pointerdown');const arrival=r.events.filter(e=>e.name==='page-arrival').at(-1).data;
 assert.notEqual(arrival.session_id,first.session_id);assert.notEqual(arrival.visit_id,first.visit_id);assert.equal(arrival.sequence,1);assert.equal(arrival.page_step,1);
 assert.equal(r.events.findLast(e=>e.name==='page-engagement'&&e.data.session_id===first.session_id).data.visible_ms,31*60000);
 r.advance(30000);const newRows=r.events.filter(e=>e.name==='page-engagement'&&e.data.session_id===arrival.session_id);
 assert.equal(newRows.length,1);assert.equal(newRows[0].data.visible_ms,30000);assert.equal(r.timers.size,1);assert.deepEqual([...r.localStorage.values.keys()],['ia:analytics:visitor:v1']);stop();assert.equal(r.timers.size,0);
});

test('真实操作持续活动时保留会话，后台心跳及隐藏快照不刷新 last',()=>{
 const r=rig();r.start();const first=r.events[0].data.session_id;
 for(let i=0;i<4;i++){r.advance(20*60000);r.dispatch(r.document,'keydown');}
 assert.equal(new Set(r.events.map(e=>e.data.session_id)).size,1);assert.equal(r.events.at(-1).data.session_id,first);
 const last=JSON.parse(r.sessionStorage.getItem('ia:analytics:session:v2')).last;r.document.visibilityState='hidden';r.dispatch(r.document,'visibilitychange');r.advance(31*60000);
 assert.equal(JSON.parse(r.sessionStorage.getItem('ia:analytics:session:v2')).last,last);r.document.visibilityState='visible';r.dispatch(r.document,'visibilitychange');
 assert.notEqual(r.events.at(-1).data.session_id,first);
});

test('隐藏不等于离开，时长不累加隐藏段；BFCache 新 visit 只留一组监听器',()=>{
 const r=rig();r.start();const visit=r.events[0].data.visit_id;r.advance(60000);
 r.document.visibilityState='hidden';r.dispatch(r.document,'visibilitychange');const hidden=r.events.find(e=>e.name==='page-hidden').data;
 assert.equal(r.events.filter(e=>e.name==='page-leave').length,0);r.advance(60000);r.document.visibilityState='visible';r.dispatch(r.document,'visibilitychange');r.advance(5000);
 r.dispatch(r.window,'pagehide',{persisted:true});r.dispatch(r.window,'pagehide',{persisted:true});assert.equal(r.events.filter(e=>e.name==='page-leave').length,1);
 assert.equal(r.events.find(e=>e.name==='page-leave').data.visible_ms-hidden.visible_ms,5000);r.dispatch(r.window,'pageshow',{persisted:true});
 assert.notEqual(r.events.find(e=>e.name==='page-arrival'&&e.data.restored).data.visit_id,visit);assert.equal(r.timers.size,1);assert.ok(hidden.active_ms<=30000);
});

test('GPC/DNT/自排除同时过滤自定义与自动 tracker；初始 GPC 不创建会话或访客',()=>{
 for(const flag of ['gpc','dnt','disabled','preview']){
  const r=rig({gpc:flag==='gpc'});if(flag==='dnt')r.window.doNotTrack='yes';if(flag==='disabled')r.localStorage.setItem('umami.disabled','1');if(flag==='preview')r.document.documentElement.dataset.analyticsPreview='true';
  r.start();r.track.track('synthetic');assert.equal(r.events.length,0);assert.equal(r.window.iaAnalyticsBeforeSend('event',{}),null);assert.equal(r.sessionStorage.values.size,0);
 }
});

test('晚加载队列遇隐私关闭后丢弃，失败发送不阻断；存储不可用仍可使用',()=>{
 const r=rig({late:true});r.start();r.track.track('synthetic');assert.equal(r.events.length,0);r.navigator.globalPrivacyControl=true;r.track.flushTracking();r.navigator.globalPrivacyControl=false;r.install();r.track.flushTracking();assert.equal(r.events.length,0);
 r.track.track('new');assert.equal(r.events.length,1);r.window.umami.track=()=>{throw Error('synthetic offline');};assert.doesNotThrow(()=>r.track.track('offline'));
 const blocked=rig({blockedStorage:true});assert.doesNotThrow(()=>blocked.start());assert.ok(blocked.events.length>0);
});

test('渠道按精确来源区分，保留 schema2 和独立站点维度，只使用获批同源身份',()=>{
 const r=rig();r.start();assert.equal(r.events[0].data.schema,2);assert.equal(r.events[0].data.project,'interface-atlas');assert.equal(r.events[0].data.hostname,'stats.gongfpp.icu');
 for(const [url,channel]of [['https://gongfpp.github.io/interface-atlas-web/','github-pages'],['https://gongfpp.github.io/other/','unknown'],['https://atlas.gongfpp.icu/','edgeone-pages'],['https://interface-atlas-9po.pages.dev/','cloudflare-pages'],['https://other.pages.dev/','unknown']]){r.window.location=new URL(url);assert.equal(r.track.analyticsChannel(),channel);}
 assert.deepEqual([...r.localStorage.values.keys()],['ia:analytics:visitor:v1']);assert.deepEqual([...r.sessionStorage.values.keys()],['ia:analytics:session:v2']);
});

test('90天身份固定出生期不滑动；到期/损坏换号，退出和DNT/GPC清理且不创建不上报',()=>{
 const r=rig(),first=r.window.iaAnalyticsVisitor();assert.match(first.id,/^[\da-f-]{36}$/);assert.equal(r.track.analyticsContext().visitor_id,first.id);
 r.advance(89*86400000);assert.equal(r.window.iaAnalyticsVisitor().id,first.id);assert.equal(r.window.iaAnalyticsVisitor().bornAt,first.bornAt);
 r.advance(86400000);const renewed=r.window.iaAnalyticsVisitor();assert.notEqual(renewed.id,first.id);assert.equal(renewed.bornAt,first.bornAt+90*86400000);
 r.localStorage.setItem('ia:analytics:visitor:v1','broken');assert.notEqual(r.window.iaAnalyticsVisitor().id,renewed.id);
 for(const kind of ['gpc','dnt','disabled']){
  const h=rig();const prior=h.window.iaAnalyticsVisitor().id;if(kind==='gpc')h.navigator.globalPrivacyControl=true;if(kind==='dnt')h.navigator.doNotTrack='1';if(kind==='disabled')h.localStorage.setItem('umami.disabled','1');
  h.track.track('blocked');assert.equal(h.window.iaAnalyticsBeforeSend('event',{}),null);assert.equal(h.window.iaAnalyticsVisitor(),undefined);assert.equal(h.localStorage.getItem('ia:analytics:visitor:v1'),null);assert.equal(h.events.length,0);
  h.navigator.globalPrivacyControl=false;h.navigator.doNotTrack=undefined;h.localStorage.removeItem('umami.disabled');assert.notEqual(h.window.iaAnalyticsVisitor().id,prior);
 }
});

test('长期身份存储不可读或不可写时不发伪身份；匿名会话仍能工作且不串到其它origin',()=>{
 const r=rig({blockedStorage:true});r.start();assert.ok(r.events.length>0);assert.equal(r.events[0].data.visitor_id,undefined);assert.equal(r.window.iaAnalyticsVisitor(),undefined);
 const h=rig();h.localStorage.removeItem('ia:analytics:visitor:v1');h.localStorage.setItem=()=>{throw Error('synthetic read-only storage');};assert.equal(h.window.iaAnalyticsVisitor(),undefined);assert.equal(h.track.analyticsContext().visitor_id,undefined);
 const a=rig(),b=rig();assert.notEqual(a.window.iaAnalyticsVisitor().id,b.window.iaAnalyticsVisitor().id);
});

test('到期边界晚到的旧事件不挂到后来出生的新身份',()=>{
 const r=rig(),old={...r.track.analyticsContext(),schema:2};r.advance(90*86400000);const result=r.window.iaAnalyticsBeforeSend('event',{data:old,id:old.visitor_id});
 assert.equal(result.id,undefined);assert.equal(result.data.visitor_id,undefined);assert.equal(result.data.visitor_born_at,undefined);
 const current={...r.track.analyticsContext(),schema:2};const newResult=r.window.iaAnalyticsBeforeSend('event',{data:current});assert.equal(newResult.id,current.visitor_id);
});

test('Umami3.4.1真实tracker首个自动pageview与首个自定义事件身份一致且无第二tracker',{skip:!process.env.UMAMI_TRACKER_SOURCE},async()=>{
 const r=rig({late:true});r.start();const requests=[];
 Object.assign(r.window,{document:r.document,navigator:r.navigator,screen:{width:1440,height:900},history:{pushState(){},replaceState(){}}});
 r.document.readyState='complete';r.document.title='Synthetic';r.document.currentScript={src:'https://analytics-fixture.invalid/script.js',getAttribute:name=>({'data-website-id':'00000000-0000-4000-8000-000000000001','data-before-send':'iaAnalyticsBeforeSend','data-exclude-search':'true','data-exclude-hash':'true','data-do-not-track':'true'}[name]??null)};
 r.context.fetch=async(_url,options)=>{requests.push(JSON.parse(options.body));return{json:async()=>({})};};
 const source=readFileSync(process.env.UMAMI_TRACKER_SOURCE,'utf8');const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
 runInContext(js.replace(/\nexport\s*\{\s*\};?\s*$/,''),r.context);const tracker=r.window.umami;r.track.flushTracking();await new Promise(setImmediate);
 assert.equal(r.window.umami,tracker);assert.equal(requests.filter(e=>e.type==='event'&&!e.payload.name).length,1);assert.equal(requests.some(e=>e.type==='identify'),false);
 const first=requests.find(e=>e.type==='event'&&!e.payload.name).payload,custom=requests.find(e=>e.payload.name==='page-arrival').payload;
 assert.equal(first.id,custom.id);assert.equal(first.id,custom.data.visitor_id);assert.equal(custom.data.visitor_born_at,r.window.iaAnalyticsVisitor().bornAt);
});

test('运行中切换 GPC 不续写 session，也不在解除后补报关闭期间累计时长',()=>{
 const r=rig();r.start();const last=JSON.parse(r.sessionStorage.getItem('ia:analytics:session:v2')).last;
 r.navigator.globalPrivacyControl=true;r.advance(5*60000);r.dispatch(r.document,'pointerdown');
 assert.equal(JSON.parse(r.sessionStorage.getItem('ia:analytics:session:v2')).last,last);assert.equal(r.track.beginAnalyticsVisit(),'');assert.deepEqual(Object.keys(r.track.analyticsContext()),[]);
 const before=r.events.length;r.navigator.globalPrivacyControl=false;r.dispatch(r.document,'pointerdown');r.advance(30000);
 assert.equal(r.events.slice(before).filter(e=>e.name==='page-arrival').length,1);assert.equal(r.events.at(-1).data.visible_ms,30000);assert.equal(r.timers.size,1);
});

test('GPC暂停后BFCache恢复只产生一次新的到达，不同时走两套恢复分支',()=>{
 const r=rig();r.start();r.navigator.globalPrivacyControl=true;r.advance(30000);r.dispatch(r.window,'pagehide',{persisted:true});
 const before=r.events.length;r.navigator.globalPrivacyControl=false;r.dispatch(r.window,'pageshow',{persisted:true});
 const arrivals=r.events.slice(before).filter(e=>e.name==='page-arrival');assert.equal(arrivals.length,1);assert.equal(arrivals[0].data.restored,true);assert.equal(r.timers.size,1);
});

test('新自托管配置只选Atlas正式EdgeOne，GH/CF/旧域保持原配置，生产启用必须精确域和marker',()=>{
 const r=rig(),input={legacySrc:'https://legacy.example/script.js',legacyId:'old-id',edgeOneSrc:'https://stats.gongfpp.icu/script.js',edgeOneId:'00000000-0000-4000-8000-000000000001'};
 for(const origin of ['https://gongfpp.github.io','https://interface-atlas-9po.pages.dev','https://old.edgeone.cool','https://atlas.gongfpp.icu.evil','https://atlas.gongfpp.icu:444','http://atlas.gongfpp.icu']){const config=r.scriptConfig({...input,origin});assert.equal(config.src,input.legacySrc);assert.equal(config.id,input.legacyId);assert.equal(config.upgraded,false);assert.equal(config.domains,undefined);}
 const config=r.scriptConfig({...input,origin:'https://atlas.gongfpp.icu'});assert.equal(config.src,input.edgeOneSrc);assert.equal(config.id,input.edgeOneId);assert.equal(config.domains,'atlas.gongfpp.icu');assert.equal(config.upgraded,true);
 assert.equal(r.scriptConfig({origin:'https://atlas.gongfpp.icu',legacySrc:input.legacySrc,legacyId:input.legacyId}).upgraded,false);
 assert.throws(()=>r.scriptConfig({...input,origin:'https://atlas.gongfpp.icu',edgeOneId:''}),/配置不完整/);
 for(const origin of ['https://gongfpp.github.io/interface-atlas-web/','https://interface-atlas-9po.pages.dev/','https://old.edgeone.cool/']){const x=rig({origin});assert.equal(x.scope(),false);x.start();assert.equal(x.events[0].data.visitor_id,undefined);assert.equal(x.localStorage.values.size,0);}
 const eo=rig({origin:'https://atlas.gongfpp.icu/',upgraded:false});assert.equal(eo.scope(),false);eo.document.documentElement.dataset.analyticsUpgrade='true';assert.equal(eo.scope(),true);
});

test('GH原会话心跳续期与原配置默认保留，不写新身份、不启用EdgeOne增强',()=>{
 const r=rig({origin:'https://gongfpp.github.io/interface-atlas-web/',upgraded:false});r.start();const first=r.events[0].data;r.advance(31*60000);r.dispatch(r.document,'keydown');
 assert.equal(new Set(r.events.map(e=>e.data.session_id)).size,1);assert.equal(r.events.filter(e=>e.name==='page-arrival').length,1);assert.equal(r.localStorage.values.size,0);assert.equal(r.events[0].data.project,undefined);assert.ok(JSON.parse(r.sessionStorage.getItem('ia:analytics:session:v2')).last>first.event_time);
 r.navigator.globalPrivacyControl=true;assert.equal(r.track.analyticsAllowed(),true); // 未改旧GH的门禁契约。
 const workflow=readFileSync(new URL('../../.github/workflows/deploy-web.yml',import.meta.url),'utf8');
 assert(!workflow.split('name: Build GitHub Pages')[1].split('name: Build EdgeOne root site')[0].includes('PUBLIC_EDGEONE_UMAMI'));
 assert(workflow.split('name: Build EdgeOne root site')[1].split('name: Publish to ')[0].includes('PUBLIC_EDGEONE_UMAMI_ID'));
 assert(!workflow.split('name: Build Cloudflare root site')[1].includes('PUBLIC_EDGEONE_UMAMI'));
});
