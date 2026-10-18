/** 八种非杂志参考页的交互；状态仅属于当前独立文档。 */
export function initOtherReference(root: HTMLElement) {
  const slug = root.dataset.styleScene;
  if (!slug || !root.classList.contains('reference-scene') || ['swiss-style', 'editorial'].includes(slug) || root.dataset.otherReady === 'true' || root.dataset.sceneInteractive !== 'true') return;
  root.dataset.otherReady = 'true';
  const en = root.dataset.sceneLocale === 'en';
  const l = (zh:string, english:string) => en ? english : zh;
  const q = <T extends HTMLElement = HTMLElement>(selector:string) => root.querySelector<T>(selector);
  const text = (selector:string, value:string) => { const el=q(selector); if(el) el.textContent=value; };
  const button = (label:string, action:string) => { const b=document.createElement('button'); b.type='button'; b.textContent=label; b.dataset.sceneAction=action; return b; };
  let opener:HTMLElement|null=null;
  const close = () => root.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach(d=>d.close());
  const open = (name:string, source:HTMLElement) => {
    const dialog=q<HTMLDialogElement>(`[data-other-dialog="${name}"]`);
    if (!dialog) return;
    if(!source.closest('dialog')) opener=source;
    close(); dialog.showModal();
  };
  const section = (index:number) => {
    close(); opener=null; const el=q(`#scene-section-${index}`);
    el?.scrollIntoView({block:'start'}); el?.focus({preventScroll:true});
  };
  root.querySelectorAll<HTMLDialogElement>('[data-other-dialog]').forEach(d=>{
    d.addEventListener('keydown', event=>{if(event.key==='Escape'){event.preventDefault();d.close();}});
    d.addEventListener('click', e=> { if((e.target as HTMLElement).closest('[data-other-close]')) d.close(); });
    d.addEventListener('close', ()=> { if(!root.querySelector('dialog[open]') && opener?.isConnected) opener.focus({preventScroll:true}); });
  });

  // 商品：款式、数量、移除，以及明确不扣款的订单预览。
  const names = slug==='minimalism' ? [l('Lumo 专注器','Lumo Focus'),l('桌面底座','Desk dock'),l('亚麻收纳袋','Linen sleeve')] : [l('经典胶片相机','Classic film camera'),l('手工皮革肩带','Handmade leather strap'),l('橡木相框','Oak photo frame')];
  const prices = slug==='minimalism' ? [699,129,89] : [1280,260,180];
  const descriptions = slug==='minimalism' ? [l('实体旋钮 · 25/50 分钟专注 · USB-C 充电 · 直径 85 mm。离线使用，无推送。','Physical dial · 25/50-minute focus · USB-C · 85 mm diameter. Offline, no notifications.'),l('铝制桌面支架，防滑软木底面，适配 Lumo 专注器。','Aluminum desk stand with non-slip cork base, made for Lumo Focus.'),l('未漂染亚麻，棉质抽绳，20 × 15 cm，可手洗。','Unbleached linen with cotton drawstring. 20 × 15 cm, hand washable.')] : [l('修复的 35 mm 胶片相机 · 金属机身 · 50 mm 定焦镜头 · 手动对焦。不含胶卷。','Restored 35 mm film camera · Metal body · 50 mm prime lens · Manual focus. Film not included.'),l('植鞣牛皮手工缝制，长度可调 90–120 cm，通用双环接口。','Hand-stitched vegetable-tanned leather. Adjustable 90–120 cm, universal twin-ring attachment.'),l('实木橡木相框，适配 6 寸照片，桌面与挂墙两用。','Solid oak frame for 6-inch prints. Stands on a desk or hangs on a wall.')];
  let product=0;
  const bag = new Map<string,{index:number;finish:string;quantity:number}>();
  function renderBag() {
    const list=q('[data-bag-items]'); if(!list) return;
    list.replaceChildren(); let total=0,count=0;
    bag.forEach((item,key)=>{
      count+=item.quantity; total+=prices[item.index]*item.quantity;
      const row=document.createElement('div'); row.className='bag-row';
      const title=document.createElement('p'); title.textContent=`${names[item.index]} · ${item.finish} · ¥${prices[item.index]} × ${item.quantity}`;
      row.append(title,button('−',`bag-minus-${key}`),button('+',`bag-plus-${key}`),button(l('移除','Remove'),`bag-remove-${key}`));
      row.querySelectorAll('button')[0].setAttribute('aria-label',l('减少数量','Decrease quantity'));
      row.querySelectorAll('button')[1].setAttribute('aria-label',l('增加数量','Increase quantity'));
      list.append(row);
    });
    if(!count) list.textContent=l('购物袋是空的。先选择一件喜欢的好物。','Your bag is empty. Explore the collection to find an object.');
    text('[data-bag-count]',String(count)); text('[data-bag-total]',l(`合计：¥${total}`,`Total: ¥${total}`));
    text('[data-order-preview]','');
  }

  // 日历从固定的 2024 年样张开始；操作后使用真实月长与星期偏移。
  let month=3, year=2024, day=15;
  const monthsZh=['一','二','三','四','五','六','七','八','九','十','十一','十二'];
  const monthLabel=()=> en ? new Date(year,month,1).toLocaleDateString('en',{month:'long',year:'numeric'}) : `${monthsZh[month]}月 ${year}`;
  function renderCalendar() {
    const grid=q('.calendar-grid'); if(!grid) return;
    grid.querySelectorAll(':scope > :not(b)').forEach(el=>el.remove());
    const offset=(new Date(year,month,1).getDay()+6)%7;
    for(let i=0;i<offset;i++) { const blank=document.createElement('span'); blank.setAttribute('aria-hidden','true'); grid.append(blank); }
    const length=new Date(year,month+1,0).getDate(); day=Math.min(day,length);
    root.dataset.calendarWeeks=String(Math.ceil((offset+length)/7));
    for(let n=1;n<=length;n++) { const b=button(String(n),`tasko-day-${n}`); b.classList.toggle('calendar-today',n===day); b.setAttribute('aria-pressed',String(n===day)); b.setAttribute('aria-label',`${year}-${month+1}-${n}`); grid.append(b); }
    text('[data-tasko-month]',monthLabel());
    text('[data-tasko-selected]',l(`${year} 年 ${month+1} 月 ${day} 日 · 个人计划`,`${day} ${monthLabel()} · Personal plan`));
  }
  const updateTasks=()=>{
    const checks=[...root.querySelectorAll<HTMLInputElement>('[data-task-check]')];
    const done=checks.filter(c=>c.checked).length;
    text('.bento-tasks > strong',String(checks.length-done));
    text('[data-task-status]',l(`已完成 ${done} / ${checks.length} 项任务`,`Completed ${done} / ${checks.length} tasks`));
  };
  let noteCount=12;

  // 使用结束时间计算剩余时长，避免轮询误差累积；计时状态不跨页面。
  let duration=25*60,remaining=duration,running=false,deadline=0,completed=0,focusedSeconds=0,lastTick=0;
  const format=(seconds:number)=>`${Math.floor(seconds/60).toString().padStart(2,'0')}:${(seconds%60).toString().padStart(2,'0')}`;
  function renderTimer(){
    text('[data-focus-time]',format(remaining));
    if(slug==='neumorphism') { text('.clock-inset > strong',format(remaining)); text('.clock-inset > span',running?l('专注中','Focusing'):l('准备专注','Ready to focus')); }
    text('[data-scene-action="mellow-toggle"]',running?l('暂停','Pause'):remaining===0?l('再来一次','Start again'):l('开始专注','Start focus'));
    text('[data-focus-sessions]',String(completed));
    text('[data-focus-minutes]',l(`本次页面累计专注 ${Math.floor(focusedSeconds/60)} 分钟`,`Focused ${Math.floor(focusedSeconds/60)} minutes this visit`));
  }
  function tick(){
    if(!running)return;
    const now=Date.now(); focusedSeconds+=Math.max(0,(Math.min(now,deadline)-lastTick)/1000); lastTick=now;
    remaining=Math.max(0,Math.ceil((deadline-now)/1000));
    if(!remaining) { running=false; completed++; text('[data-focus-status]',l('本段专注已完成，休息一下吧。','Session complete. Take a little break.')); }
    renderTimer();
  }
  if(slug==='neumorphism') {
    const interval=window.setInterval(tick,250);
    window.addEventListener('pagehide',()=>window.clearInterval(interval),{once:true});
  }
  let tip=0;
  const lumoTips=[l('更少的干扰|更多的生活','Less distraction|More living'),l('一次一件事|留白给自己','One thing at a time|Space for yourself'),l('放下屏幕|感受此刻','Put the screen away|Be here now')];
  const mellowTips=[l('更少干扰，更多可能','Less noise, more possibility'),l('先深呼吸，再开始','Breathe first. Then begin.'),l('小小的专注，也值得庆祝','A little focus is worth celebrating')];
  let savedDraft='';
  const selectedServices=new Set([0,1,2]);
  function updateServices(){
    const selected=['Design','Develop','Create'].filter((_,i)=>selectedServices.has(i));
    const label=selected.length?selected.join(' · '):l('尚未选择服务，请点击首屏清单。','No services selected. Use the hero checklist.');
    text('[data-play-services]',label); text('[data-play-brief-services]',l(`所选服务：${label}`,`Selected services: ${label}`));
  }

  // 复古浏览器：站内历史保留原首屏，留言只存在当前页面内存。
  const retroNames=['Home','About','Projects','Links','Guestbook'];
  const retroCopy=[l('欢迎回到 GoodOldNet。这里没有推荐算法，只有值得慢慢发现的页面。','Welcome to GoodOldNet. No recommendation algorithm, just pages to explore slowly.'),l('1998 年，我们用一张 HTML 页面认识世界。GoodOldNet 收集像素画、个人主页与用心编辑的链接，保留自由漫游的乐趣。','In 1998, a single HTML page opened a world. GoodOldNet collects pixel art, personal sites and carefully edited links to keep the joy of wandering alive.'),l('像素风景：用有限色彩记录一片湖。个人主页档案：记录早期网页中的自我表达。小型网页实验：用 HTML 与 CSS 做会动的明信片。','Pixel landscapes: a lake in a limited palette. Personal homepage archive: self-expression on the early web. Small web experiments: animated postcards made with HTML and CSS.'),l('推荐路线：从个人主页档案开始，再去看看像素风景与小型网页实验。所有链接都在本站内打开，不会前往示例域名。','Suggested route: start with the homepage archive, then explore pixel landscapes and small web experiments. All links open inside this study, never on fictional domains.'),l('留下你的一句话。留言仅保留在当前页面，刷新后清空；不连接服务器。','Leave a little message. Entries stay on this page only and reset on reload. No server is connected.')];
  let history=[0],historyIndex=0,retroCurrent=0;
  const bookmarks=new Set<number>();
  function renderRetro(index:number, scroll=true){
    retroCurrent=index; close(); opener=null;
    text('[data-retro-address]',`Address\u3000 ▧ goodoldnet / ${retroNames[index].toLowerCase()}`);
    text('.retro-titlebar > span:first-child',`▧ GoodOldNet - ${retroNames[index]}`);
    const reading=q('[data-retro-reading]'); if(!reading)return;
    reading.hidden=index===0;
    text('[data-retro-heading]',retroNames[index]);
    text('[data-retro-body]',retroCopy[index]);
    if(index===2||index===3) {
      const links=document.createElement('div'); links.className='other-actions';
      links.append(button(l('个人主页档案','Homepage archive'),'retro-page-1'),button(l('项目列表','Project collection'),'retro-page-2'),button(l('签写留言簿','Sign guestbook'),'retro-page-4'));
      q('[data-retro-body]')?.append(links);
    }
    const guest=index===4;
    const form=q<HTMLFormElement>('[data-other-form="guestbook"]'); if(form)form.hidden=!guest;
    const entries=q('[data-guest-messages]');if(entries)entries.hidden=!guest;
    root.querySelectorAll<HTMLElement>('.retro-sidebar [data-scene-action]').forEach((el,i)=>el.setAttribute('aria-current',i===index?'page':'false'));
    const back=q<HTMLButtonElement>('[data-scene-action="retro-back"]');if(back){back.disabled=historyIndex===0;back.setAttribute('aria-disabled',String(back.disabled));}
    const forward=q<HTMLButtonElement>('[data-scene-action="retro-forward"]');if(forward){forward.disabled=historyIndex===history.length-1;forward.setAttribute('aria-disabled',String(forward.disabled));}
    if(scroll){ if(index===0)window.scrollTo({top:0});else{reading.scrollIntoView({block:'start'});reading.focus({preventScroll:true});} }
  }
  function visit(index:number){
    if(index!==retroCurrent){history=history.slice(0,historyIndex+1);history.push(index);historyIndex=history.length-1;}
    renderRetro(index);
  }
  function renderBookmarks(){
    const list=q('[data-retro-bookmarks]');if(!list)return;list.replaceChildren();
    if(!bookmarks.size)list.textContent=l('还没有收藏页面。','No bookmarks yet.');
    bookmarks.forEach(i=>list.append(button(retroNames[i],`retro-page-${i}`)));
  }

  root.addEventListener('click',event=>{
    const target=(event.target as HTMLElement).closest<HTMLElement>('[data-scene-action]'); if(!target||!root.contains(target))return;
    const action=target.dataset.sceneAction!;
    if(action==='home'){close();window.scrollTo({top:0});}
    else if(action.startsWith('nav-')||action==='primary')section(action==='primary'?0:Number(action.slice(4)));
    else if(action==='lumo-shop'){product=0;showProduct(target);}
    else if(action==='lumo-next'||action==='lumo-previous'){
      tip=(tip+(action==='lumo-next'?1:2))%3;const caption=q('.lumo-caption');if(caption){caption.replaceChildren();lumoTips[tip].split('|').forEach((t,i)=>{if(i)caption.append(document.createElement('br'));caption.append(t);});}
      text('[data-lumo-page]',`0${tip+1} / 03`);
    }
    else if(action.startsWith('goods-detail-')){product=Number(action.slice(13));showProduct(target);}
    else if(action.startsWith('goods-collection-')){product=Number(action.slice(17));showProduct(target);}
    else if(action==='goods-search')open('goods-search',target);
    else if(action==='goods-add'){
      const select=q<HTMLSelectElement>('[data-product-finish]');const finish=select?.value||l('经典原色','Natural finish');const key=`${product}-${select?.selectedIndex||0}`;
      const existing=bag.get(key);if(existing)existing.quantity++;else bag.set(key,{index:product,finish,quantity:1});renderBag();
      text('[data-product-status]',l(`${names[product]} · ${finish} 已加入购物袋。`,`Added ${names[product]} · ${finish} to your bag.`));
    }
    else if(action==='goods-bag'){renderBag();open('bag',target);}
    else if(action.startsWith('bag-')){
      const [,operation,...parts]=action.split('-');const key=parts.join('-');const item=bag.get(key);if(!item)return;
      if(operation==='plus')item.quantity++;else if(operation==='minus'&&item.quantity>1)item.quantity--;else bag.delete(key);renderBag();
      q<HTMLButtonElement>('[data-other-dialog="bag"] [data-scene-action]')?.focus({preventScroll:true});
    }
    else if(action==='goods-checkout'){
      let count=0,total=0;bag.forEach(i=>{count+=i.quantity;total+=i.quantity*prices[i.index];});
      text('[data-order-preview]',count?l(`订单预览：${count} 件商品，合计 ¥${total}。未扣款；可继续修改购物袋。`,`Order preview: ${count} items, ¥${total}. No payment made. You can continue editing your bag.`):l('购物袋为空，请先选择商品。','Your bag is empty. Choose an object first.'));
    }
    else if(action==='aurora-create'){section(0);q<HTMLInputElement>('[name="topic"]')?.focus();}
    else if(action.startsWith('aurora-feature-')){
      const i=Number(action.slice(15));
      text('[data-feature-title]',[l('AI 灵感助手','Creative assistant'),l('云端同步','Always in sync'),l('多格式导出','Flexible export')][i]);
      text('[data-feature-copy]',[l('输入主题，选择诗意或简洁风格，使用本地固定模板获得第一稿，再自由修改。这是模板演示，并非真实 AI 调用。','Enter a topic and choose poetic or clear. A fixed local template gives you an editable first draft. This is not a real AI call.'),l('真实产品可跨设备同步。本样张不连接云端；保存按钮仅记录当前页面快照，刷新后重置。','A full product could sync across devices. This study is offline; Save stores a page-local snapshot that resets on reload.'),l('把当前编辑稿导出为 UTF-8 文本文件，可在常见编辑器中继续创作。只有点击导出才会下载文件。','Export the current draft as UTF-8 text and continue in your editor. A file downloads only when you click Export.')][i]);open('aurora-feature',target);
    }
    else if(action.startsWith('aurora-prompt-')){
      const i=Number(action.slice(14));const input=q<HTMLInputElement>('[name="topic"]');if(input)input.value=[l('清晨的第一束光','First light of the morning'),l('一座城市的声音','The sounds of a city'),l('给未来自己的信','A letter to your future self')][i];section(0);input?.focus();
    }
    else if(action==='aurora-save'||action==='aurora-export'||action==='aurora-restore'){
      const draft=q<HTMLTextAreaElement>('[data-aurora-draft]');if(!draft)return;
      if(action==='aurora-restore'){if(savedDraft){draft.value=savedDraft;text('[data-aurora-status]',l('已恢复当前页面保存的草稿。','Restored this page’s saved draft.'));}return;}
      if(!draft.value.trim()){text('[data-aurora-status]',l('请先生成或写下一段创作稿。','Generate or write a draft first.'));return;}
      if(action==='aurora-save'){savedDraft=draft.value;text('[data-aurora-status]',l('已保存当前页面快照；刷新后重置，可点击恢复。','Page-local snapshot saved. Reload resets it; use Restore to return to it.'));const restore=q<HTMLButtonElement>('[data-scene-action="aurora-restore"]');if(restore)restore.disabled=false;}
      else {const url=URL.createObjectURL(new Blob([draft.value],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='aurora-draft.txt';link.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000);text('[data-aurora-status]',l('已导出当前编辑稿为 aurora-draft.txt。','Exported the current draft as aurora-draft.txt.'));}
    }
    else if(action==='tasko-prev'||action==='tasko-next'){
      month+=action==='tasko-next'?1:-1;if(month<0){month=11;year--;}if(month>11){month=0;year++;}renderCalendar();
    }
    else if(action.startsWith('tasko-day-')){day=Number(action.slice(10));renderCalendar();section(0);}
    else if(action==='tasko-tasks')section(0);
    else if(action==='tasko-notes')section(1);
    else if(action==='tasko-profile'||action==='mellow-profile')open('profile',target);
    else if(action.startsWith('mellow-tool-')){const index=Number(action.slice(12));section(index);root.querySelectorAll('.mellow-tools [data-scene-action]').forEach((el,i)=>{el.classList.toggle('active',i===index);el.setAttribute('aria-pressed',String(i===index));});}
    else if(action==='mellow-toggle'){
      tick();running=!running;if(running){if(remaining===0)remaining=duration;deadline=Date.now()+remaining*1000;lastTick=Date.now();}text('[data-focus-status]',running?l('专注中。一次只做一件事。','Focusing. One thing at a time.'):l('已暂停，剩余时间已保留。','Paused. Your remaining time is preserved.'));renderTimer();
    }
    else if(action==='mellow-reset'){running=false;remaining=duration;text('[data-focus-status]',l('已重置，可以重新开始。','Reset. Ready to begin again.'));renderTimer();}
    else if(action==='mellow-next'||action==='mellow-previous'){tip=(tip+(action==='mellow-next'?1:2))%3;text('.mellow-caption',`「 ${mellowTips[tip]} 」`);text('[data-mellow-page]',`0${tip+1} / 03`);}
    else if(action.startsWith('void-case-')){
      const i=Number(action.slice(10));text('[data-void-title]',['OPEN CITY / Identity','COMMON GROUND / Digital','RAW MATERIAL / Culture'][i]);
      text('[data-void-copy]',[l('为公共空间计划建立直接、开放的识别系统。街道标识与数字地图使用一致的文字与方向逻辑。','A direct, open identity for a public-space program. Street signage and digital maps share typography and wayfinding logic.'),l('为社区组织建立可访问的网站，让活动信息、志愿者报名与公共资源更容易找到。','An accessible community website that makes events, volunteering and shared resources easier to find.'),l('将材料研究转化为展览视觉，用原始纹理与大字编排连接物理空间和数字档案。','Material research becomes an exhibition identity. Raw texture and oversized typography connect physical space with a digital archive.')][i]);
      text('[data-void-deliverables]',[l('品牌策略 / 字体系统 / 导视规范','Brand strategy / Type system / Wayfinding guidelines'),l('内容架构 / 响应式原型 / 无障碍测试','Content architecture / Responsive prototype / Accessibility tests'),l('展览识别 / 印刷物 / 数字档案','Exhibition identity / Print / Digital archive')][i]);open('void-case',target);
    }
    else if(action.startsWith('play-check-')){
      const i=Number(action.slice(11));if(selectedServices.has(i))selectedServices.delete(i);else selectedServices.add(i);
      target.textContent=`${selectedServices.has(i)?'☑':'☐'} ${['Design','Develop','Create'][i]}`;target.setAttribute('aria-pressed',String(selectedServices.has(i)));updateServices();
    }
    else if(action==='play-brief'){updateServices();open('play-brief',target);}
    else if(action.startsWith('play-work-')){
      const i=Number(action.slice(10));text('[data-play-title]',[l('MOMO · 城市骑行','MOMO · City cycling'),l('Little Planet · 探索实验室','Little Planet · Exploration lab'),l('Good Food · 社区餐桌','Good Food · Community table')][i]);
      text('[data-play-copy]',[l('把租车流程变成三个简单步骤。高对比路线卡、清晰取车提示与轻快的品牌语言，让通勤不再紧张。','A three-step bike rental flow. High-contrast route cards, clear pickup instructions and a playful voice make commuting easier.'),l('为孩子与家长设计一起探索的活动网站。用图形化课程卡、年龄筛选与简单报名，鼓励每一次提问。','An activity website for children and parents. Illustrated cards, age filters and simple booking encourage every curious question.'),l('让邻里共享一张餐桌。食材故事、开放日程与清晰参与方式，把线上介绍变成真实连接。','A shared neighborhood table. Ingredient stories, open schedules and clear participation turn an introduction into connection.')][i]);open('play-work',target);
    }
    else if(action.startsWith('retro-page-'))visit(Number(action.slice(11)));
    else if(action==='retro-back'&&historyIndex>0){historyIndex--;renderRetro(history[historyIndex]);}
    else if(action==='retro-forward'&&historyIndex<history.length-1){historyIndex++;renderRetro(history[historyIndex]);}
    else if(action==='retro-search')open('retro-search',target);
    else if(action==='retro-favorites'){renderBookmarks();open('retro-favorites',target);}
    else if(action==='retro-save'){bookmarks.add(retroCurrent);renderBookmarks();text('[data-retro-favorite-status]',l(`已收藏 ${retroNames[retroCurrent]}。`,`Bookmarked ${retroNames[retroCurrent]}.`));}
    else if(action==='retro-go'){
      const input=q<HTMLInputElement>('[data-retro-route]');if(input)input.value=`goodoldnet/${retroNames[retroCurrent].toLowerCase()}`;
      text('[data-retro-route-status]','');open('retro-address',target);
    }
    else if(action==='retro-minimize'){const content=q('.retro-content');if(content){content.hidden=!content.hidden;target.setAttribute('aria-expanded',String(!content.hidden));}}
    else if(action==='retro-maximize'){root.classList.toggle('retro-wide');target.setAttribute('aria-pressed',String(root.classList.contains('retro-wide')));}
    else if(action==='retro-close'||action.startsWith('retro-menu-')){
      const i=action==='retro-close'?5:Number(action.slice(11));text('[data-retro-menu-title]',action==='retro-close'?l('这个小站会留在这里','This little site is staying open'):['File','Edit','View','Favorites','Tools','Help'][i]);
      const items=q('[data-retro-menu-items]');if(!items)return;items.replaceChildren();
      const choices: Array<Array<[string,string]>>=[[[l('返回首页','Open home'),'retro-page-0'],[l('打开留言簿','Open guestbook'),'retro-page-4']],[[l('编辑一条新留言','Write a new entry'),'retro-page-4']],[[l('切换阅读宽度','Toggle reading width'),'retro-maximize'],[l('查看项目','View projects'),'retro-page-2']],[[l('打开收藏夹','Open favorites'),'retro-favorites']],[[l('站内搜索','Search this site'),'retro-search']],[[l('关于 GoodOldNet','About GoodOldNet'),'retro-page-1'],[l('留下反馈','Leave feedback'),'retro-page-4']]];
      const description=document.createElement('p');description.textContent=action==='retro-close'?l('这是页面内的复古浏览器，不会关闭你的真实标签页。可返回首页，或用上方关闭按钮继续浏览。','This is an in-page retro browser. It never closes your real tab. Return home or close this dialog to keep exploring.'):l('使用下面的站内功能。所有状态仅在当前页面保留。','Use these internal tools. State lasts only for this page.');items.append(description);
      choices[i].forEach(([label,key])=>items.append(button(label,key)));open('retro-menu',target);
    }
  });
  function showProduct(target:HTMLElement){
    text('[data-product-title]',names[product]);text('[data-product-description]',descriptions[product]);text('[data-product-price]',`¥${prices[product]}`);text('[data-product-status]','');
    const finish=q<HTMLSelectElement>('[data-product-finish]');if(finish)finish.selectedIndex=0;open('product',target);
  }

  root.addEventListener('change',event=>{
    const target=event.target as HTMLInputElement;
    if(target.matches('[data-task-check]'))updateTasks();
    else if(target.matches('[data-mellow-duration]')){running=false;duration=Number(target.value)*60;remaining=duration;renderTimer();text('[data-focus-status]',l('已更新专注时长，可以开始。','Duration updated. Ready to begin.'));}
    else if(target.matches('[data-mellow-contrast]'))root.classList.toggle('mellow-high-contrast',target.checked);
  });
  q<HTMLInputElement>('[data-mellow-name]')?.addEventListener('input',event=>text('[data-mellow-profile]',l(`你好，${(event.target as HTMLInputElement).value.trim()||'朋友'}。愿你今天专注而平静。`,`Hello, ${(event.target as HTMLInputElement).value.trim()||'friend'}. Have a focused, peaceful day.`)));
  function filter(input:string,items:string,status:string){
    q<HTMLInputElement>(input)?.addEventListener('input',event=>{
      const value=(event.target as HTMLInputElement).value.trim().toLocaleLowerCase();let count=0;
      root.querySelectorAll<HTMLElement>(items).forEach(el=>{el.hidden=!el.textContent!.toLocaleLowerCase().includes(value);if(!el.hidden)count++;});
      text(status,l(`找到 ${count} 个结果`,`${count} results found`));
    });
  }
  filter('[data-goods-query]','[data-goods-results] button','[data-goods-search-status]');
  filter('[data-retro-query]','[data-retro-results] button','[data-retro-search-status]');
  root.querySelectorAll<HTMLFormElement>('[data-other-form]').forEach(form=>form.addEventListener('submit',event=>{
    event.preventDefault();const data=new FormData(form);const value=(key:string)=>String(data.get(key)||'').trim();
    const name=form.dataset.otherForm;
    if(name==='aurora'){
      const topic=value('topic');if(!topic){text('[data-aurora-status]',l('请输入一个非空主题。','Enter a topic, not just spaces.'));return;}
      const draft=q<HTMLTextAreaElement>('[data-aurora-draft]');if(draft)draft.value=value('tone')==='poetic'?l(`${topic}\n\n从一个微小的细节开始。光线落在日常的边缘，时间慢了一点。\n\n我想记录${topic}，不是为了给出答案，而是为下一次发现留一扇窗。\n\n下一步：补充一个真实场景，让这段文字拥有你的声音。`,`${topic}\n\nBegin with one small detail. Light touches the edge of the ordinary and time slows down.\n\nI want to explore ${topic}, not to offer an answer, but to leave a window open for discovery.\n\nNext: add one real scene and make this your own.`):l(`${topic}\n\n目标：把「${topic}」讲清楚。\n受众：对此好奇、愿意尝试的人。\n核心信息：从一个具体场景出发，用清晰细节建立理解。\n行动：选择一个小步骤，今天就开始。`,`Topic: ${topic}\n\nGoal: make ${topic} clear.\nAudience: curious people willing to try.\nCore message: start with one concrete scene and build understanding through detail.\nAction: choose one small step and begin today.`);
      text('[data-aurora-status]',l('本地模板草稿已生成，可编辑、保存或导出。','Local template draft generated. Edit, save or export it.'));
    }
    else if(name==='task'){
      const task=value('task');if(!task){text('[data-task-status]',l('请填写任务内容。','Enter a task.'));return;}
      const label=document.createElement('label'),input=document.createElement('input'),span=document.createElement('span');input.type='checkbox';input.dataset.taskCheck='custom';span.textContent=task;label.append(input,span);q('.task-list')?.append(label);form.reset();updateTasks();
    }
    else if(name==='note'){
      const note=value('note');if(!note){text('[data-note-status]',l('请填写笔记内容。','Enter a note.'));return;}
      const li=document.createElement('li');li.textContent=note;q('[data-tasko-notes]')?.prepend(li);noteCount++;text('.bento-notes > strong',String(noteCount));text('[data-note-status]',l('笔记已加入当前页面。','Note added to this page.'));form.reset();
    }
    else if(name==='void-contact'){
      if(!value('name')||!value('brief')){text('[data-contact-summary]',l('请填写姓名与项目方向，不能仅为空格。','Enter a name and project direction, not just spaces.'));return;}
      text('[data-contact-summary]',l(`项目提案 · ${value('name')} · ${value('email')}\n${value('brief')}\n已整理成本地预览。未发送邮件，可修改后重新生成。`,`Inquiry · ${value('name')} · ${value('email')}\n${value('brief')}\nLocal preview prepared. No email sent. Edit and generate again.`));
    }
    else if(name==='play-brief'){
      if(!value('name')||!value('goal')||!selectedServices.size){text('[data-play-summary]',l('请填写项目名称和目标，并至少选择一项服务（首屏清单）。','Enter a project name and goal, and select at least one service in the hero checklist.'));return;}
      text('[data-play-summary]',l(`项目：${value('name')}\n目标：${value('goal')}\n服务：${['Design','Develop','Create'].filter((_,i)=>selectedServices.has(i)).join(' / ')}\n时间：${value('timeline')}\n简报已整理，可继续修改。未发送到服务器。`,`Project: ${value('name')}\nGoal: ${value('goal')}\nServices: ${['Design','Develop','Create'].filter((_,i)=>selectedServices.has(i)).join(' / ')}\nTimeline: ${value('timeline')}\nBrief prepared. You can keep editing. Nothing was sent.`));
    }
    else if(name==='retro-address'){
      const route=value('address').toLowerCase().replace(/^goodoldnet\s*\//,'').replace(/^\/+|\/+$/g,'');
      const index=retroNames.findIndex(name=>name.toLowerCase()===route);
      if(index<0){text('[data-retro-route-status]',l('未找到站内页面。请选择 home、about、projects、links 或 guestbook；不会跳往外部地址。','Page not found. Choose home, about, projects, links or guestbook. External addresses are not opened.'));return;}
      visit(index);
    }
    else if(name==='guestbook'){
      if(!value('name')||!value('message')){text('[data-guest-status]',l('请填写昵称和留言，不能仅为空格。','Enter a nickname and message, not just spaces.'));return;}
      const li=document.createElement('li'),strong=document.createElement('strong');strong.textContent=`${value('name')}: `;li.append(strong,document.createTextNode(value('message')));q('[data-guest-messages]')?.prepend(li);form.reset();text('[data-guest-status]',l('留言已加入。仅当前页面保留，刷新后重置。','Entry added. Kept on this page only; reload resets it.'));
    }
    else if(name==='profile'){
      if(!value('name')){text('[data-profile-status]',l('请输入昵称。','Enter a nickname.'));return;}
      const selector=slug==='bento-grid'?'[data-scene-action="tasko-profile"]':'[data-scene-action="mellow-profile"]';text(selector,value('name'));close();section(0);
    }
  }));
  // 初始首屏与静态封面完全同源；只有明确操作后才重新渲染状态。
  // 原日历为紧凑的 28 天构图，原时钟为 10:24，均不在初始化时更改。
  if(slug==='retro-web') {
    const back=q<HTMLButtonElement>('[data-scene-action="retro-back"]'); if(back)back.setAttribute('aria-disabled','true');
    const forward=q<HTMLButtonElement>('[data-scene-action="retro-forward"]'); if(forward)forward.setAttribute('aria-disabled','true');
  }
}
