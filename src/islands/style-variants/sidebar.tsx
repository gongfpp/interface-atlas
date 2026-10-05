import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function Deco({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const items = en ? ['Overview', 'Collection', 'Archive', 'Activity', 'Settings'] : ['概览', '收藏集', '档案', '动态', '设置'];
  const [active, setActive] = useSessionState(session, 'active', 0);
  return (
    <div className="mx-auto w-full max-w-sm bg-[#12100c] p-5 text-[#e8d8a8]" style={{ border: '1px solid #8a6d2f' }}>
      <p className="mb-4 border-b border-[#8a6d2f]/60 pb-3 text-center font-serif text-sm uppercase tracking-[0.35em]">Atlas</p>
      <nav className="space-y-1 font-serif text-sm">
        {items.map((it, i) => (
          <button key={it} type="button" aria-current={active === i ? 'page' : undefined} onClick={() => setActive(i)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none flex w-full items-center gap-3 px-2 py-2 text-left tracking-wide ${active === i ? 'bg-[#8a6d2f]/25 text-[#f4e6b8]' : 'text-[#c9b276] hover:text-[#f4e6b8]'}`}>
            <span className="text-[10px] text-[#c9a227]">◆</span>{it}
          </button>
        ))}
      </nav>
      <p role="status" className="mt-3 text-xs">{en ? `Previewing ${items[active]}` : `当前预览：${items[active]}`}</p>
    </div>
  );
}

function Bento({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const items = en ? ['Overview', 'Collection', 'Archive', 'Activity', 'Settings'] : ['概览', '收藏集', '档案', '动态', '设置'];
  const [active, setActive] = useSessionState(session, 'active', 0);
  const dots = ['bg-accent', 'bg-ink-2', 'bg-ink-3', 'bg-accent-soft', 'bg-line-strong'];
  return (
    <div className="mx-auto w-full max-w-sm bg-paper p-4">
      <div className="grid grid-cols-2 gap-3">
        {items.map((it, i) => (
          <button key={it} type="button" aria-current={active === i ? 'page' : undefined} onClick={() => setActive(i)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none rounded-2xl border p-4 text-left transition-colors ${i === 0 ? 'col-span-2' : ''} ${active === i ? 'border-line-strong bg-raised' : 'border-line bg-code-bg hover:bg-raised'}`}>
            <span className={`block h-5 w-5 rounded-md ${dots[i]}`} />
            <span className="mt-2 block text-xs font-medium text-ink">{it}</span>
          </button>
        ))}
      <p role="status" className="col-span-2 p-2 text-xs">{en ? `Previewing ${items[active]}` : `当前预览：${items[active]}`}</p>
      </div>
    </div>
  );
}

function Editorial({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const items = en ? ['Overview', 'Collection', 'Archive', 'Activity', 'Settings'] : ['概览', '收藏集', '档案', '动态', '设置'];
  const [active, setActive] = useSessionState(session, 'active', 0);
  return (
    <div className="mx-auto w-full max-w-sm border-t-4 border-ink bg-paper px-5 py-4">
      <p className="mb-3 font-serif text-[11px] uppercase tracking-[0.3em] text-accent">{en ? 'Contents' : '目录'}</p>
      <nav className="divide-y divide-line">
        {items.map((it, i) => (
          <button key={it} type="button" aria-current={active === i ? 'page' : undefined} onClick={() => setActive(i)} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none flex w-full items-baseline gap-3 py-3 text-left">
            <span className="font-mono text-[11px] text-ink-3">{String(i + 1).padStart(2, '0')}</span>
            <span className={`font-serif text-sm ${active === i ? 'font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4' : 'text-ink-2'}`}>{it}</span>
          </button>
        ))}
      </nav>
      <p role="status" className="mt-3 text-xs">{en ? `Previewing ${items[active]}` : `当前预览：${items[active]}`}</p>
    </div>
  );
}


function AdaptedSidebar({ style, session, locale }: VariantDemoProps & { style: RecipeStyleId }) {
  const en = locale === 'en';
  const r = recipe(style);
  const [active, setActive] = useSessionState(session, 'active', 0);
  const items = en ? ['Overview', 'Collection', 'Archive', 'Activity', 'Settings'] : ['概览', '收藏集', '档案', '动态', '设置'];
  return <RecipeFrame style={style} locale={locale} title={en ? 'Workspace sidebar' : '工作区侧栏'}>
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-3"><nav aria-label={en ? 'Workspace sections' : '工作区分区'} className="space-y-2">{items.map((item, i) => <button key={i} type="button" aria-current={active === i ? 'page' : undefined} onClick={() => setActive(i)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none flex w-full items-center gap-2 px-2 py-3 text-left text-xs ${active === i ? r.active : r.item}`}><span aria-hidden="true" className="font-mono">0{i+1}</span>{item}</button>)}</nav>
    <section className={`min-w-0 p-3 ${r.item}`}><h3 className={r.title}>{items[active] ?? items[0]}</h3><p role="status" className={`mt-3 text-xs leading-relaxed ${r.muted}`}>{en ? 'The active workspace section appears here. Choose another item to switch views.' : '这里显示当前工作区分区。选择其他条目即可切换视图。'}</p><div aria-hidden="true" className={`mt-5 h-16 ${r.active}`} /></section></div>
  </RecipeFrame>;
}

function localDemo(Demo: StyleVariantSet[number]['Demo']) {
  return function LocalDemo(props: VariantDemoProps) {
    return <><Demo {...props} /><p className="mx-auto mt-4 w-full max-w-md text-xs leading-relaxed text-ink-2">{props.locale === 'en' ? 'Local interaction demo. Nothing is sent or saved outside this page.' : '本地交互演示，不会向外发送或保存数据。'}</p></>;
  };
}

const adaptedNotes = {
  "minimalism": {
    "zh": "白底细边、宽松留白和黑白反转状态，移除多余装饰。持续可见的分区导航驱动相邻内容区，当前项同时有视觉与语义标记。",
    "en": "White space, fine borders and monochrome inversion remove unnecessary decoration. Persistent section navigation drives an adjacent content region with visual and semantic current-item markers."
  },
  "flat-design": {
    "zh": "蓝色实心面、简洁圆角与无投影的层级，让选中项清晰可辨。持续可见的分区导航驱动相邻内容区，当前项同时有视觉与语义标记。",
    "en": "Solid blue surfaces, simple corners and shadow-free hierarchy make selection explicit. Persistent section navigation drives an adjacent content region with visual and semantic current-item markers."
  },
  "swiss-style": {
    "zh": "编号书眉和严格对齐的网格配黑色规则线，红色侧轨标记选中状态。持续可见的分区导航驱动相邻内容区，当前项同时有视觉与语义标记。",
    "en": "A numbered masthead and aligned grid use black rules, with red rails marking selection. Persistent section navigation drives an adjacent content region with visual and semantic current-item markers."
  },
  "neobrutalism": {
    "zh": "黄色底、3px 黑描边、粉色选中块与硬偏移投影，让控件像实体拼贴。持续可见的分区导航驱动相邻内容区，当前项同时有视觉与语义标记。",
    "en": "Yellow ground, 3px black outlines, pink selections and hard offset shadows make tactile collage-like controls. Persistent section navigation drives an adjacent content region with visual and semantic current-item markers."
  },
  "organic": {
    "zh": "奶油与苔绿表面配不对称大圆角，选中态以深绿色柔软块面出现。持续可见的分区导航驱动相邻内容区，当前项同时有视觉与语义标记。",
    "en": "Cream and moss surfaces use asymmetric rounded contours, with a deep-green soft selected shape. Persistent section navigation drives an adjacent content region with visual and semantic current-item markers."
  }
};

const styleVariants: StyleVariantSet = [
  {
    style: 'art-deco',
    name: {"zh":"装饰艺术","en":"Art Deco"},
    note: {
      zh: '深炭底配金色菱形标记与对称居中衬线标题，导航像剧院节目单。',
      en: 'A deep charcoal panel with gold lozenge markers and a symmetric serif masthead, like a theatre programme.',
    },
    Demo: localDemo(Deco),
  },
  {
    style: 'bento-grid',
    name: {"zh":"便当盒网格","en":"Bento Grid"},
    note: {
      zh: '导航被拆成圆角卡片模块拼成网格，首页大格子占两列，选中态只提高卡片层级。',
      en: 'Navigation becomes rounded card modules in a grid, with a two-column hero tile and elevation marking selection.',
    },
    Demo: localDemo(Bento),
  },
  {
    style: 'editorial',
    name: {"zh":"杂志编辑风","en":"Editorial"},
    note: {
      zh: '衬线标题配编号目录与细分隔线，选中项用朱砂下划线标记，像一本杂志的目录页。',
      en: 'A serif contents list with folio numbers, hairline rules and a vermilion underline for the active entry.',
    },
    Demo: localDemo(Editorial),
  },
  ...(['minimalism', 'flat-design', 'swiss-style', 'neobrutalism', 'organic'] as const).map(style => recipeVariant(style, (props: VariantDemoProps) => <AdaptedSidebar {...props} style={style} />, adaptedNotes[style])),
];

export default styleVariants;
