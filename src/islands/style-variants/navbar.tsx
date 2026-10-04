import { useId, useRef } from 'react';
import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function Swiss({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const items = en ? ['Work', 'Studio', 'Contact'] : ['作品', '工作室', '联系'];
  const [active, setActive] = useSessionState(session, 'active', 0);
  return (
    <div className="mx-auto w-full max-w-md bg-white px-5 py-3 text-black" style={{ borderBottom: '3px solid #111' }}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold tracking-tight">Atlas<span className="text-[#d0021b]">.</span></span>
        <nav className="flex flex-wrap gap-3 text-[12px]">
          {items.map((it, i) => (
            <button key={it} type="button" aria-current={active === i ? 'page' : undefined} onClick={() => setActive(i)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none relative py-1 ${active === i ? 'font-semibold' : 'text-black/55 hover:text-black'}`}>
              {it}
              {active === i && <span className="absolute inset-x-0 -bottom-[13px] h-[3px] bg-[#d0021b]" />}
            </button>
          ))}
        </nav>
      </div>
      <p role="status" className="mt-3 text-xs">{en ? `Previewing ${items[active]}` : `当前预览：${items[active]}`}</p>
    </div>
  );
}

function Neobrutal({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const items = en ? ['Work', 'Studio', 'Contact'] : ['作品', '工作室', '联系'];
  const [active, setActive] = useSessionState(session, 'active', 0);
  const [menu, setMenu] = useSessionState(session, 'navbarMenu', false);
  return <div className="mx-auto w-full max-w-md text-black">
    <div className="flex flex-wrap items-center justify-between gap-2 border-[3px] border-black bg-[#ffd23f] px-4 py-3 shadow-[5px_5px_0_#000]">
      <span className="text-sm font-black uppercase tracking-wide">Atlas★</span>
      <button ref={triggerRef} type="button" aria-expanded={menu} aria-controls={`${id}-menu`} onClick={() => setMenu(!menu)} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none min-h-11 border-[3px] border-black bg-white px-3 text-xs font-black">{menu ? (en ? 'Close menu' : '收起菜单') : (en ? 'Open menu' : '展开菜单')}</button>
    </div>
    <nav onKeyDown={event => { if (event.key === 'Escape') { setMenu(false); triggerRef.current?.focus(); } }} id={`${id}-menu`} hidden={!menu} aria-label={en ? 'Main navigation' : '主导航'} className="mt-3 border-[3px] border-black bg-white px-3 py-2 shadow-[5px_5px_0_#000]">
      {items.map((item, i) => <button key={i} type="button" aria-current={active === i ? 'page' : undefined} onClick={() => { setActive(i); setMenu(false); triggerRef.current?.focus(); }} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none px-3 text-xs font-black uppercase ${active === i ? 'bg-black text-white' : 'text-black underline'}`}>{item}</button>)}
    </nav><p role="status" className="mt-4 text-xs">{en ? `Previewing ${items[active]}` : `当前预览：${items[active]}`}</p>
  </div>;
}

function Glass({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const items = en ? ['Work', 'Studio', 'Contact'] : ['作品', '工作室', '联系'];
  const [active, setActive] = useSessionState(session, 'active', 0);
  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-r from-[#7c5cff] via-[#ff6ec7] to-[#5ad1ff] p-2 text-[#161c38]">
      <div className="flex items-center justify-between gap-2 rounded-xl border border-white/40 bg-white/20 px-3 py-2 text-white backdrop-blur-md">
        <span className="text-sm font-semibold">Atlas</span>
        <nav className="flex gap-1 text-xs">
          {items.map((it, i) => (
            <button key={it} type="button" aria-current={active === i ? 'page' : undefined} onClick={() => setActive(i)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none rounded-full px-3 py-1 transition-colors ${active === i ? 'bg-white/35 font-semibold' : 'text-white/75 hover:bg-white/15'}`}>{it}</button>
          ))}
        </nav>
      </div>
      <p role="status" className="mt-3 text-xs">{en ? `Previewing ${items[active]}` : `当前预览：${items[active]}`}</p>
    </div>
  );
}


function AdaptedNavbar({ style, session, locale }: VariantDemoProps & { style: RecipeStyleId }) {
  const en = locale === 'en';
  const r = recipe(style);
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useSessionState(session, 'active', 0);
  const [menu, setMenu] = useSessionState(session, 'navbarMenu', false);
  const items = en ? ['Work', 'Studio', 'Contact'] : ['作品', '工作室', '联系'];
  return <RecipeFrame style={style} locale={locale} title={en ? 'Studio navigation' : '工作室导航'}>
    <div className={`flex flex-wrap items-center justify-between gap-2 p-3 ${r.item}`}><span className={`text-lg ${r.title}`}>Atlas<span aria-hidden="true">.</span></span>
      <button ref={triggerRef} type="button" aria-expanded={menu} aria-controls={`${id}-navigation`} onClick={() => setMenu(!menu)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none px-3 text-xs ${r.control}`}>{menu ? (en ? 'Close menu' : '收起菜单') : (en ? 'Open menu' : '展开菜单')}</button>
    </div>
    <nav onKeyDown={event => { if (event.key === 'Escape') { setMenu(false); triggerRef.current?.focus(); } }} id={`${id}-navigation`} aria-label={en ? 'Main navigation' : '主导航'} hidden={!menu} className="mt-2 flex flex-wrap gap-2">{items.map((item, i) => <button key={i} type="button" aria-current={active === i ? 'page' : undefined} onClick={() => { setActive(i); setMenu(false); triggerRef.current?.focus(); }} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none flex-1 px-3 py-2 text-sm ${active === i ? r.active : r.secondary}`}>{item}</button>)}</nav>
    <section className={`mt-3 p-4 ${r.item}`}><h3 className={r.title}>{items[active]}</h3><p role="status" className={`mt-2 text-xs ${r.muted}`}>{en ? 'Selected section is shown here, within the demo.' : '选中的分区在本演示中显示。'}</p></section>
  </RecipeFrame>;
}

function localDemo(Demo: StyleVariantSet[number]['Demo']) {
  return function LocalDemo(props: VariantDemoProps) {
    return <><Demo {...props} /><p className="mx-auto mt-4 w-full max-w-md text-xs leading-relaxed text-ink-2">{props.locale === 'en' ? 'Local interaction demo. Nothing is sent or saved outside this page.' : '本地交互演示，不会向外发送或保存数据。'}</p></>;
  };
}

const adaptedNotes = {
  "minimalism": {
    "zh": "白底细边、宽松留白和黑白反转状态，移除多余装饰。菜单可展开、关闭并选择内容分区，收起后保留当前分区并归还焦点。",
    "en": "White space, fine borders and monochrome inversion remove unnecessary decoration. The menu opens, closes and selects a section, retaining the current section and restoring focus on dismissal."
  },
  "flat-design": {
    "zh": "蓝色实心面、简洁圆角与无投影的层级，让选中项清晰可辨。菜单可展开、关闭并选择内容分区，收起后保留当前分区并归还焦点。",
    "en": "Solid blue surfaces, simple corners and shadow-free hierarchy make selection explicit. The menu opens, closes and selects a section, retaining the current section and restoring focus on dismissal."
  },
  "editorial": {
    "zh": "纸色表面、衬线斜体标题、书眉和细分隔线建立杂志式阅读层级。菜单可展开、关闭并选择内容分区，收起后保留当前分区并归还焦点。",
    "en": "Paper surfaces, italic serif headings, a journal masthead and fine rules create editorial hierarchy. The menu opens, closes and selects a section, retaining the current section and restoring focus on dismissal."
  },
  "art-deco": {
    "zh": "深炭底上用对称金色双线、菱形书眉和大字距衬线标题构成秩序。菜单可展开、关闭并选择内容分区，收起后保留当前分区并归还焦点。",
    "en": "Symmetric gold double rules, a diamond masthead and tracked serif titles structure a charcoal surface. The menu opens, closes and selects a section, retaining the current section and restoring focus on dismissal."
  },
  "organic": {
    "zh": "奶油与苔绿表面配不对称大圆角，选中态以深绿色柔软块面出现。菜单可展开、关闭并选择内容分区，收起后保留当前分区并归还焦点。",
    "en": "Cream and moss surfaces use asymmetric rounded contours, with a deep-green soft selected shape. The menu opens, closes and selects a section, retaining the current section and restoring focus on dismissal."
  }
};

const styleVariants: StyleVariantSet = [
  {
    style: 'swiss-style',
    name: {"zh":"瑞士风格","en":"Swiss Style"},
    note: {
      zh: '严格左右分栏，粗底线收口，选中项用一条红色标尺线强调，信息按网格对齐。',
      en: 'A strict left/right grid closed by a heavy rule, with a red measuring line marking the active item.',
    },
    Demo: localDemo(Swiss),
  },
  {
    style: 'neobrutalism',
    name: {"zh":"新粗野主义","en":"Neobrutalism"},
    note: {
      zh: '亮黄导航条配 3px 黑描边和硬投影，移动端折叠成同名下拉块。',
      en: 'A bright yellow bar with a 3px black outline and hard offset shadow that collapses into a dropdown on small screens.',
    },
    Demo: localDemo(Neobrutal),
  },
  {
    style: 'glassmorphism',
    name: {"zh":"玻璃拟态","en":"Glassmorphism"},
    note: {
      zh: '导航本体是一条磨砂胶囊，浮在彩色渐变上，活跃项用更亮的玻璃块表示。',
      en: 'The bar itself is a frosted pill floating over a colourful gradient, the active item a brighter pane of glass.',
    },
    Demo: localDemo(Glass),
  },
  ...(['minimalism', 'flat-design', 'editorial', 'art-deco', 'organic'] as const).map(style => recipeVariant(style, (props: VariantDemoProps) => <AdaptedNavbar {...props} style={style} />, adaptedNotes[style])),
];

export default styleVariants;
