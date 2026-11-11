import { useEffect, useRef, useState, type PointerEvent, type KeyboardEvent } from 'react';
import { OverlayMenu } from './ActionMenus';
import { useMenu, MenuRoot, MenuTrigger, MenuPanel, Item, Preview, menuRoot, words as w, type DemoProps } from './MenuPrimitives';
export function EdgeAwareMenu({locale}: DemoProps) {
 const m=useMenu();
 const [point,setPoint]=useState({x:85,y:75});const [box,setBox]=useState({width:360,height:238,panel:116});
 const dragging=useRef(false);const moved=useRef(false);
 useEffect(()=>{
  const root=menuRoot(m.id);if(!root)return;
  const observer=new ResizeObserver(()=>setBox({width:root.clientWidth,height:root.clientHeight,panel:root.querySelector<HTMLElement>('.mc-panel')?.offsetHeight||116}));
  observer.observe(root);const panel=root.querySelector('.mc-panel');if(panel)observer.observe(panel);
  return()=>observer.disconnect();
 },[m.open,m.id]);
 const x=Math.max(8,(box.width-108)*point.x/100),y=Math.max(8,(box.height-44)*point.y/100),width=Math.min(190,box.width-16);
 const left=x+width>box.width-8?Math.max(8,x+100-width):x;const up=y+36+box.panel>box.height-8;const top=up?Math.max(8,y-box.panel-6):y+40;
 return <MenuRoot menu={m} className="mc-edge"><div className="mc-edge-corners">{[[0,0],[100,0],[0,100],[100,100]].map(([cx,cy],i)=><button key={i} aria-label={w(locale,['左上','右上','左下','右下'][i],['Top left','Top right','Bottom left','Bottom right'][i])} style={{left:cx?'auto':4,right:cx?4:'auto',top:cy?'auto':4,bottom:cy?4:'auto'}} onClick={()=>{setPoint({x:cx,y:cy});m.setOpen(true);}}>⌖</button>)}</div><button id={`${m.id}-trigger`} className="mc-trigger mc-edge-trigger" style={{left:x,top:y}} aria-expanded={m.open} aria-haspopup="menu" onPointerDown={e=>{dragging.current=true;moved.current=false;e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e=>{if(!dragging.current)return;const r=menuRoot(m.id)!.getBoundingClientRect();setPoint({x:Math.max(0,Math.min(100,(e.clientX-r.left-50)/(r.width-108)*100)),y:Math.max(0,Math.min(100,(e.clientY-r.top-18)/(r.height-44)*100))});moved.current=true;m.setOpen(true);}} onPointerUp={()=>{dragging.current=false;}} onPointerCancel={()=>{dragging.current=false;}} onClick={()=>{if(!moved.current)m.setOpen(!m.open);}}>{w(locale,'操作','Actions')}⌄</button>{m.open&&<div style={{position:'absolute',left,top,width}} data-placement={up?'top':'bottom'}><MenuPanel menu={m} label={w(locale,'边缘定位菜单','Edge-aware menu')}>{[w(locale,'复制','Copy'),w(locale,'移动','Move'),w(locale,'收藏','Favorite')].map(s=><Item key={s} onClick={()=>m.close()}>{s}</Item>)}</MenuPanel></div>}</MenuRoot>;
}
export function ResponsiveOverflow({locale}: DemoProps) {
 const m=useMenu();const [requested,setRequested]=useState(400);const [available,setAvailable]=useState(400);const [selected,setSelected]=useState('');const bar=useRef<HTMLDivElement>(null);
 const labels=locale==='zh'?['文件','编辑','视图','排列','导出','分享']:['File','Edit','View','Arrange','Export','Share'];
 useEffect(()=>{const el=bar.current;if(!el)return;const observer=new ResizeObserver(()=>setAvailable(el.clientWidth));observer.observe(el);return()=>observer.disconnect();},[]);
 const count=available>=546?6:Math.max(1,Math.floor((available-64)/92));const hidden=labels.slice(count);
 return <MenuRoot menu={m} className="mc-wide"><label className="mc-width-control">{w(locale,'工具栏宽度','Toolbar width')}<input type="range" min="180" max="560" value={requested} aria-label={w(locale,'工具栏宽度','Toolbar width')} onChange={e=>setRequested(Number(e.target.value))}/></label><div ref={bar} className="mc-toolbar" style={{width:requested}}>{labels.slice(0,count).map(s=><button data-action={s} key={s} onClick={()=>setSelected(s)}>{s}</button>)}{hidden.length>0&&<MenuTrigger menu={m} aria-label={w(locale,'更多操作','More actions')}>•••</MenuTrigger>}</div>{hidden.length>0&&<MenuPanel menu={m} label={w(locale,'溢出操作','Overflow actions')}>{hidden.map(s=><Item key={s} data-action={s} onClick={()=>{setSelected(s);m.close();}}>{s}</Item>)}</MenuPanel>}{selected&&<output className="mc-result">{selected}</output>}</MenuRoot>;
}
export function TearOffMenu({locale}: DemoProps) {
 const m=useMenu();const [detached,setDetached]=useState(false);const [pos,setPos]=useState({x:90,y:18});const [tool,setTool]=useState(w(locale,'选择','Select'));
 const drag=useRef<{x:number;y:number;left:number;top:number}|null>(null);
 const constrain=(x:number,y:number)=>({x:Math.max(0,Math.min(Math.max(0,(menuRoot(m.id)?.clientWidth||300)-180),x)),y:Math.max(0,Math.min(108,y))});
 const down=(e:PointerEvent<HTMLButtonElement>)=>{setDetached(true);drag.current={x:e.clientX,y:e.clientY,left:pos.x,top:pos.y};e.currentTarget.setPointerCapture(e.pointerId);};
 const move=(e:PointerEvent<HTMLButtonElement>)=>{const d=drag.current;if(d)setPos(constrain(d.left+e.clientX-d.x,d.top+e.clientY-d.y));};
 const key=(e:KeyboardEvent<HTMLButtonElement>)=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();e.stopPropagation();setDetached(true);const dx=e.key==='ArrowRight'?10:e.key==='ArrowLeft'?-10:0;const dy=e.key==='ArrowDown'?10:e.key==='ArrowUp'?-10:0;setPos(p=>constrain(p.x+dx,p.y+dy));};
 return <MenuRoot menu={m} className="mc-tear-off"><MenuTrigger menu={m}>{w(locale,'工具','Tools')}</MenuTrigger>{m.open&&<div className={`mc-panel mc-floating-tools ${detached?'mc-detached':''}`} style={detached?{left:pos.x,top:pos.y}:undefined}><header><button className="mc-drag-handle" aria-label={w(locale,'拖动浮动面板','Drag floating panel')} onPointerDown={down} onPointerMove={move} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}} onKeyDown={key}><span aria-hidden="true">⠿</span>{w(locale,'工具','Tools')}</button><button aria-label={w(locale,'固定为浮动面板','Pin floating panel')} aria-pressed={detached} onClick={()=>setDetached(!detached)}>{detached?'↩':'↗'}</button></header><div role="menu" aria-label={w(locale,'工具选择','Choose tool')}>{[w(locale,'选择','Select'),w(locale,'画笔','Brush'),w(locale,'橡皮擦','Eraser')].map(s=><Item key={s} selected={tool===s} onClick={()=>setTool(s)}>{s}</Item>)}</div></div>}<Preview>{tool}</Preview></MenuRoot>;
}
export const NavigationDrawer=(p:DemoProps)=><OverlayMenu {...p} variant="drawer"/>;
export const FullscreenMenu=(p:DemoProps)=><OverlayMenu {...p} variant="fullscreen"/>;
