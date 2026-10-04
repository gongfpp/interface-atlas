import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function BentoMenu({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [active, setActive] = useSessionState(session, 'active', 0);
  const items = en ? ['Home', 'Explore', 'Library', 'Inbox', 'Profile'] : ['首页', '探索', '资料库', '收件箱', '个人资料'];
  return (
    <div className="mx-auto grid w-full max-w-sm grid-cols-2 gap-3 bg-paper p-1">
      {items.map((it, i) => (
        <button type="button"
          key={it}
          aria-current={active === i ? 'page' : undefined} onClick={() => setActive(i)}
          className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none rounded-2xl border p-4 text-left transition-colors ${i === 0 ? 'col-span-2' : ''} ${
            active === i ? 'border-accent bg-accent-soft' : 'border-line bg-raised'
          }`}
        >
          <span className="font-mono text-[10px] text-ink-3">0{i + 1}</span>
          <span className="mt-6 block text-sm font-medium text-ink">{it}</span>
        </button>
      ))}
    <p role="status" className="col-span-2 p-2 text-xs">{en ? `Previewing ${items[active]}` : `当前预览：${items[active]}`}</p>
    </div>
  );
}

function CyberMenu({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [active, setActive] = useSessionState(session, 'active', 0);
  const items = en ? ['Home', 'Explore', 'Library', 'Inbox', 'Profile'] : ['首页', '探索', '资料库', '收件箱', '个人资料'];
  return (
    <div
      className="mx-auto w-full max-w-sm bg-[#05060a] p-5 font-mono text-[#b4c4db]"
      style={{ border: '1px solid #00f0ff55', boxShadow: '0 0 24px #00f0ff22' }}
    >
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#ff2e88]">{en ? '// system menu' : '// 系统菜单'}</p>
      <nav className="mt-3 flex flex-col">
        {items.map((it, i) => (
          <button type="button"
            key={it}
            aria-current={active === i ? 'page' : undefined} onClick={() => setActive(i)}
            className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none border-l-2 py-2 pl-3 text-left text-sm transition-colors ${
              active === i ? 'border-[#00f0ff] text-[#00f0ff]' : 'border-[#33384a] text-[#8b93b0]'
            }`}
          >
            <span className="mr-2 text-[#ff2e88]">{String(i + 1).padStart(2, '0')}</span>
            {it}
          </button>
        ))}
      </nav>
      <p role="status" className="mt-3 text-xs">{en ? `Previewing ${items[active]}` : `当前预览：${items[active]}`}</p>
    </div>
  );
}

function OrganicMenu({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [active, setActive] = useSessionState(session, 'active', 0);
  const items = en ? ['Home', 'Explore', 'Library', 'Inbox', 'Profile'] : ['首页', '探索', '资料库', '收件箱', '个人资料'];
  return (
    <div className="mx-auto w-full max-w-sm rounded-[2.5rem] bg-[#eef3e2] p-6 text-[#35482e]">
      <p className="px-2 text-xs uppercase tracking-[0.2em] text-[#7a8a63]">{en ? 'Menu' : '菜单'}</p>
      <nav className="mt-3 flex flex-col gap-2">
        {items.map((it, i) => (
          <button type="button"
            key={it}
            aria-current={active === i ? 'page' : undefined} onClick={() => setActive(i)}
            className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none rounded-[2rem] px-5 py-3 text-left text-sm transition-colors ${
              active === i ? 'bg-[#5c7a4a] text-[#f3f7e8]' : 'bg-[#e2ead0] text-[#35482e]'
            }`}
          >
            {it}
          </button>
        ))}
      </nav>
      <p role="status" className="mt-3 text-xs">{en ? `Previewing ${items[active]}` : `当前预览：${items[active]}`}</p>
    </div>
  );
}


function AdaptedMenu({ style, session, locale }: VariantDemoProps & { style: RecipeStyleId }) {
  const en = locale === 'en';
  const r = recipe(style);
  const [active, setActive] = useSessionState(session, 'active', 0);
  const items = en ? ['Home', 'Explore', 'Library', 'Inbox', 'Profile'] : ['首页', '探索', '资料库', '收件箱', '个人资料'];
  return <RecipeFrame style={style} locale={locale} title={en ? 'Workspace menu' : '工作区菜单'}>
    <nav aria-label={en ? 'Workspace' : '工作区'} className="space-y-2">{items.map((item, i) => <button key={i} type="button" aria-current={active === i ? 'page' : undefined} onClick={() => setActive(i)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none flex w-full items-center gap-3 p-3 text-left ${active === i ? r.active : r.item}`}>
      <span aria-hidden="true" className="font-mono text-xs">0{i + 1}</span><span className="flex-1">{item}</span><span aria-hidden="true">{active === i ? '●' : '→'}</span>
    </button>)}</nav>
    <p role="status" className={`mt-3 p-3 text-xs ${r.secondary}`}>{en ? `Previewing ${items[active] ?? items[0]}` : `当前预览：${items[active] ?? items[0]}`}</p>
  </RecipeFrame>;
}

function localDemo(Demo: StyleVariantSet[number]['Demo']) {
  return function LocalDemo(props: VariantDemoProps) {
    return <><Demo {...props} /><p className="mx-auto mt-4 w-full max-w-md text-xs leading-relaxed text-ink-2">{props.locale === 'en' ? 'Local interaction demo. Nothing is sent or saved outside this page.' : '本地交互演示，不会向外发送或保存数据。'}</p></>;
  };
}

const adaptedNotes = {
  "minimalism": {
    "zh": "白底细边、宽松留白和黑白反转状态，移除多余装饰。每个导航条目改变本地当前分区，选中轨迹和状态说明保持同步。",
    "en": "White space, fine borders and monochrome inversion remove unnecessary decoration. Each navigation entry changes the local section, keeping its selected marker and status text synchronized."
  },
  "flat-design": {
    "zh": "蓝色实心面、简洁圆角与无投影的层级，让选中项清晰可辨。每个导航条目改变本地当前分区，选中轨迹和状态说明保持同步。",
    "en": "Solid blue surfaces, simple corners and shadow-free hierarchy make selection explicit. Each navigation entry changes the local section, keeping its selected marker and status text synchronized."
  },
  "swiss-style": {
    "zh": "编号书眉和严格对齐的网格配黑色规则线，红色侧轨标记选中状态。每个导航条目改变本地当前分区，选中轨迹和状态说明保持同步。",
    "en": "A numbered masthead and aligned grid use black rules, with red rails marking selection. Each navigation entry changes the local section, keeping its selected marker and status text synchronized."
  },
  "neobrutalism": {
    "zh": "黄色底、3px 黑描边、粉色选中块与硬偏移投影，让控件像实体拼贴。每个导航条目改变本地当前分区，选中轨迹和状态说明保持同步。",
    "en": "Yellow ground, 3px black outlines, pink selections and hard offset shadows make tactile collage-like controls. Each navigation entry changes the local section, keeping its selected marker and status text synchronized."
  },
  "editorial": {
    "zh": "纸色表面、衬线斜体标题、书眉和细分隔线建立杂志式阅读层级。每个导航条目改变本地当前分区，选中轨迹和状态说明保持同步。",
    "en": "Paper surfaces, italic serif headings, a journal masthead and fine rules create editorial hierarchy. Each navigation entry changes the local section, keeping its selected marker and status text synchronized."
  }
};

const styleVariants: StyleVariantSet = [
  {
    style: 'bento-grid',
    name: {"zh":"便当盒网格","en":"Bento Grid"},
    note: {
      zh: '导航项被打成大小不一的圆角模块，首项横跨两列做主角，选中态用主题色描边与浅底标出。',
      en: 'Nav items become rounded modules of unequal size, the first spanning two columns as hero and selection marked by accent border and tint.',
    },
    Demo: localDemo(BentoMenu),
  },
  {
    style: 'cyberpunk',
    name: {"zh":"赛博朋克","en":"Cyberpunk"},
    note: {
      zh: '近黑底上等宽路径名配青色霓虹左轨与洋红序号，选中项整行发光，像终端里的活动条目。',
      en: 'Monospace routes on near-black carry cyan neon rails and magenta indices, the active row glowing like a live terminal entry.',
    },
    Demo: localDemo(CyberMenu),
  },
  {
    style: 'organic',
    name: {"zh":"有机自然","en":"Organic"},
    note: {
      zh: '大面积圆角与奶油绿分层色，选中项化作深苔绿药丸，轮廓柔软到几乎没有直线。',
      en: 'Generous curves and layered cream-greens let the chosen item become a deep moss pill, with hardly a straight edge anywhere.',
    },
    Demo: localDemo(OrganicMenu),
  },
  ...(['minimalism', 'flat-design', 'swiss-style', 'neobrutalism', 'editorial'] as const).map(style => recipeVariant(style, (props: VariantDemoProps) => <AdaptedMenu {...props} style={style} />, adaptedNotes[style])),
];

export default styleVariants;
