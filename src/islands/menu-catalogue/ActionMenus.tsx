import { useRef, useState, useId } from 'react';
import { useMenu, MenuRoot, MenuTrigger, MenuPanel, Item, Preview, menuRoot, words as w, type DemoProps } from './MenuPrimitives';
export function ContextMenu({locale}: DemoProps) {
  const m=useMenu();
  const [name,setName]=useState(w(locale,'界面草稿.fig','Interface.fig'));
  const [draft,setDraft]=useState(name);
  const [editing,setEditing]=useState(false);
  const [exists,setExists]=useState(true);
  const [opened,setOpened]=useState(false);
  const [copies,setCopies]=useState(0);
  const [action,setAction]=useState('');
  const [point,setPoint]=useState<{x:number;y:number}|null>(null);
  const labels=[w(locale,'打开','Open'),w(locale,'复制','Copy'),w(locale,'重命名','Rename'),w(locale,'复制链接','Copy link'),w(locale,'删除','Delete')];
  const execute=async(index:number)=>{
    m.close(index!==2&&index!==4);
    if(index===0)setOpened(true);
    if(index===1)setCopies(n=>n+1);
    if(index===2){setDraft(name);setEditing(true);requestAnimationFrame(()=>document.getElementById(`${m.id}-name`)?.focus());}
    if(index===3){
      try{await navigator.clipboard.writeText(`${window.location.href.split('#')[0]}#context-menu`);}
      catch{setAction(w(locale,'未能访问剪贴板','Clipboard unavailable'));return;}
    }
    if(index===4){setExists(false);setOpened(false);setEditing(false);}
    setAction(labels[index]);
  };
  const save=()=>{if(draft.trim()){setName(draft.trim());setEditing(false);}};
  return <MenuRoot menu={m} className="mc-context">
    {exists?<>
      {editing?<form onSubmit={e=>{e.preventDefault();save();}}><input id={`${m.id}-name`} className="mc-input" aria-label={w(locale,'文件名','File name')} value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Escape'){e.stopPropagation();setEditing(false);}}}/><button className="mc-small-button" type="submit">{w(locale,'保存','Save')}</button></form>:
      <button id={`${m.id}-trigger`} className="mc-file" aria-haspopup="menu" aria-expanded={m.open} onContextMenu={e=>{e.preventDefault();const r=menuRoot(m.id)!.getBoundingClientRect();setPoint({x:Math.min(e.clientX-r.left,Math.max(0,r.width-220)),y:Math.min(e.clientY-r.top,40)});m.setOpen(true);}} onClick={()=>{setPoint(null);m.setOpen(!m.open);}} onKeyDown={e=>{if(e.key==='ContextMenu'||(e.shiftKey&&e.key==='F10')){e.preventDefault();m.setOpen(true);}else if(e.key==='F2'||e.key==='Delete'||((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='c')){e.preventDefault();void execute(e.key==='F2'?2:e.key==='Delete'?4:1);}}}><span aria-hidden="true">▤</span>{name}</button>}
      <div style={point?{marginLeft:point.x,marginTop:point.y}:undefined}><MenuPanel menu={m} label={w(locale,'文件操作','File actions')}>{labels.map((text,index)=><Item key={text} className={index===4?'mc-danger':''} onClick={()=>void execute(index)}>{text}<kbd>{['Enter','Ctrl+C','F2','','Del'][index]}</kbd></Item>)}</MenuPanel></div>
      {opened&&<Preview><span className="mc-document">▤</span><strong>{name}</strong></Preview>}
    </>:<button className="mc-small-button" onClick={()=>{setExists(true);setAction('');}}>{w(locale,'恢复演示文件','Restore demo file')}</button>}
    {copies>0&&<Preview>{Array.from({length:copies},(_,i)=><span key={i}>{name} · {w(locale,'副本','copy')} {i+1}</span>)}</Preview>}
    {action&&<output className="mc-result">{action} · {name}</output>}
  </MenuRoot>;
}
export function SplitButton({locale}: DemoProps) {
 const m=useMenu();const [format,setFormat]=useState('PDF');const [exported,setExported]=useState(false);
 return <MenuRoot menu={m}><div className="mc-split"><button onClick={()=>{setExported(true);m.close(false);}}>{w(locale,'导出','Export')} {format}</button><MenuTrigger menu={m} aria-label={w(locale,'其他导出格式','Other export formats')}><span className="sr-only">{w(locale,'选择格式','Choose format')}</span></MenuTrigger></div><MenuPanel menu={m} label={w(locale,'导出格式','Export format')}>{['PNG','SVG','PDF'].map(f=><Item key={f} selected={f===format} onClick={()=>{setFormat(f);setExported(false);m.close();}}>{w(locale,'导出','Export')} {f}</Item>)}</MenuPanel><Preview><span className="mc-document">{exported?'✓':format}</span><span>{exported?w(locale,'演示导出已完成','Demo export complete'):w(locale,'选择导出格式','Choose export format')}</span></Preview></MenuRoot>;
}
export function RadialMenu({locale}: DemoProps) {
 const [open,setOpen]=useState(true);const [choice,setChoice]=useState('');const labels=[w(locale,'复制','Copy'),w(locale,'删除','Delete'),w(locale,'移动','Move'),w(locale,'旋转','Rotate')];
 return <div className="mc-radial" onKeyDown={e=>{if(e.key==='Escape')setOpen(false);}}><button className="mc-radial-center" aria-expanded={open} onClick={()=>setOpen(!open)}>{w(locale,'编辑','Edit')}</button>{open&&<div role="group" aria-label={w(locale,'环形操作','Radial actions')}>{labels.map((s,i)=><button key={s} className={`mc-radial-item mc-sector-${i}`} aria-pressed={choice===s} onClick={()=>setChoice(s)}>{s}</button>)}</div>}<output className="mc-radial-result">{choice}</output></div>;
}
export function OverlayMenu({locale,variant}: DemoProps & {variant:'sheet'|'drawer'|'fullscreen'}) {
 const dialog=useRef<HTMLDialogElement>(null);const trigger=useRef<HTMLButtonElement>(null);const id=useId();const [selected,setSelected]=useState('');const zh=locale==='zh';
 const close=()=>{dialog.current?.close();trigger.current?.focus();};
 const labels=variant==='sheet'?[w(locale,'分享文件','Share file'),w(locale,'保存副本','Save a copy')]:variant==='drawer'?[w(locale,'概览','Overview'),w(locale,'资源','Resources'),w(locale,'任务','Tasks'),w(locale,'设置','Settings')]:[w(locale,'作品','Work'),w(locale,'关于','About'),w(locale,'联系','Contact')];
 return <div className="mc-overlay-example"><Preview><span className="mc-document">{variant==='sheet'?'▤':'▦'}</span><strong>{selected||w(locale,'项目工作台','Project workspace')}</strong></Preview><button ref={trigger} className="mc-trigger" onClick={()=>dialog.current?.showModal()}>{variant==='sheet'?w(locale,'文件操作','File actions'):variant==='drawer'?w(locale,'打开导航','Open navigation'):w(locale,'全屏导航','Fullscreen navigation')}<span aria-hidden="true">↗</span></button><dialog ref={dialog} className={`mc-dialog mc-dialog-${variant}`} aria-labelledby={id} onClick={e=>{if(e.target===e.currentTarget)close();}} onClose={()=>trigger.current?.focus()}><header><h3 id={id}>{variant==='sheet'?(zh?'对文件执行操作':'File actions'):(zh?'工作台':'Studio')}</h3><button aria-label={w(locale,'关闭','Close')} onClick={close}>×</button></header><nav aria-label={w(locale,'演示操作','Demo actions')}>{labels.map((label,i)=><button key={label} onClick={()=>{setSelected(label);close();}}>{variant==='fullscreen'&&<span>0{i+1}</span>}{label}<span aria-hidden="true">→</span></button>)}</nav>{variant==='sheet'&&<button className="mc-cancel" onClick={close}>{w(locale,'取消','Cancel')}</button>}</dialog></div>;
}
export const ActionSheet=(p:DemoProps)=><OverlayMenu {...p} variant="sheet"/>;
export function CommandPalette({locale}: DemoProps) {
 const m=useMenu();const [query,setQuery]=useState('');const [theme,setTheme]=useState('light');const [active,setActive]=useState(0);
 const commands=[{id:'light',zh:'切换为浅色',en:'Switch to light'},{id:'dark',zh:'切换为深色',en:'Switch to dark'},{id:'system',zh:'跟随系统',en:'Use system theme'}].filter(c=>`${c.zh} ${c.en} theme 主题`.toLowerCase().includes(query.toLowerCase()));
 const execute=(id:string)=>{setTheme(id);m.close();};
 return <MenuRoot menu={m} onKeyDownCapture={e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();e.stopPropagation();m.setOpen(true);requestAnimationFrame(()=>menuRoot(m.id)?.querySelector('input')?.focus());}}}><MenuTrigger menu={m}>{w(locale,'搜索命令','Search commands')}<kbd>⌘ K</kbd></MenuTrigger><MenuPanel menu={m} label={w(locale,'命令','Commands')} role="group"><label className="mc-search"><span aria-hidden="true">⌕</span><input aria-label={w(locale,'搜索命令','Search commands')} placeholder={w(locale,'切换主题…','Switch theme…')} value={query} onChange={e=>{setQuery(e.target.value);setActive(0);}} onKeyDown={e=>{if(['ArrowDown','ArrowUp','Enter'].includes(e.key)){e.preventDefault();e.stopPropagation();if(e.key==='Enter'&&commands[active])execute(commands[active].id);else setActive(i=>(i+(e.key==='ArrowDown'?1:-1)+commands.length)%Math.max(1,commands.length));}}}/></label><div role="menu" aria-label={w(locale,'搜索结果','Search results')}>{commands.map((c,i)=><Item key={c.id} selected={i===active} onClick={()=>execute(c.id)}>{c[locale]}<kbd>Enter</kbd></Item>)}{!commands.length&&<p className="mc-empty">{w(locale,'没有匹配命令','No matching commands')}</p>}</div></MenuPanel><Preview className={`mc-theme-${theme}`}><strong>Aa</strong><span>{theme}</span></Preview></MenuRoot>;
}
