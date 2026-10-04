import { useSessionState } from './session';
import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';


function OriginalBreadcrumb({ session, locale, skin }: VariantDemoProps & { skin: 'editorial' | 'pixel-art' | 'brutalism' }) {
  const en = locale === 'en';
  const [level, setLevel] = useSessionState(session, 'level', 2);
  const labels = en ? ['Library', 'Design', 'Components'] : ['资料库', '设计', '组件'];
  const classes = {
    editorial: { frame: 'border-y border-ink bg-paper py-4 font-serif text-ink', row: 'justify-center', current: 'font-semibold text-ink underline decoration-accent underline-offset-4', other: 'text-ink-2', divider: '/', panel: 'border-t border-line' },
    'pixel-art': { frame: 'border-4 border-[#566c86] bg-[#1a1c2c] p-4 font-mono text-[#f4f4f4] shadow-[4px_4px_0_#333c57]', row: '', current: 'bg-[#ef7d57] text-[#1a1c2c]', other: 'bg-[#566c86] text-white', divider: '►', panel: 'border-t-4 border-[#566c86]' },
    brutalism: { frame: 'border-4 border-black bg-white p-4 font-mono font-bold uppercase text-black', row: '', current: 'bg-black text-white', other: 'underline', divider: '//', panel: 'border-t-2 border-black' },
  }[skin];
  return <div className={`mx-auto w-full max-w-sm ${classes.frame}`}>
    <nav aria-label={en ? 'Breadcrumb' : '面包屑导航'}><ol className={`flex flex-wrap items-center gap-1 ${classes.row}`}>
      {labels.slice(0, level + 1).map((label, i) => <li key={i} className="flex items-center gap-1">{i > 0 && <span aria-hidden="true" className="px-1 text-accent">{classes.divider}</span>}<button type="button" aria-current={i === level ? 'page' : undefined} onClick={() => setLevel(i)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none px-2 py-2 text-xs ${i === level ? classes.current : classes.other}`}>{label}</button></li>)}
    </ol></nav>
    <div className={`mt-3 px-2 pt-3 ${classes.panel}`}><p role="status" className="text-xs">{en ? `Viewing ${labels[level]}` : `正在查看：${labels[level]}`}</p><button type="button" disabled={level === 2} onClick={() => setLevel(level + 1)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none mt-2 border border-current px-3 text-xs disabled:opacity-40 ${classes.other}`}>{en ? 'Open next level' : '打开下一级'}</button></div>
  </div>;
}
function Editorial(props: VariantDemoProps) { return <OriginalBreadcrumb {...props} skin="editorial" />; }
function Pixel(props: VariantDemoProps) { return <OriginalBreadcrumb {...props} skin="pixel-art" />; }
function Brutal(props: VariantDemoProps) { return <OriginalBreadcrumb {...props} skin="brutalism" />; }

function AdaptedBreadcrumb({ style, session, locale }: VariantDemoProps & { style: RecipeStyleId }) {
  const en = locale === 'en';
  const r = recipe(style);
  const [level, setLevel] = useSessionState(session, 'level', 2);
  const labels = en ? ['Library', 'Design', 'Components'] : ['资料库', '设计', '组件'];
  return <RecipeFrame style={style} locale={locale} title={en ? 'Location trail' : '位置路径'}>
    <nav aria-label={en ? 'Breadcrumb' : '面包屑导航'}><ol className="flex flex-wrap items-center gap-1">{labels.slice(0, level + 1).map((label, i) => <li key={i} className="flex items-center gap-1">
      {i > 0 && <span aria-hidden="true" className={`px-1 ${r.muted}`}>/</span>}
      <button type="button" aria-current={i === level ? 'page' : undefined} onClick={() => setLevel(i)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none px-3 py-2 text-sm ${i === level ? r.active : r.secondary}`}>{label}</button>
    </li>)}</ol></nav>
    <div className={`mt-4 p-4 ${r.item}`}><p role="status" className={r.title}>{en ? `Viewing ${labels[level]}` : `正在查看：${labels[level]}`}</p>
      <p className={`mt-1 text-xs ${r.muted}`}>{en ? 'Parent locations stay within this preview.' : '上级位置仅在本预览内切换。'}</p>
      <button type="button" disabled={level === 2} onClick={() => setLevel(level + 1)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none mt-3 px-3 py-2 text-xs disabled:opacity-45 ${r.control}`}>{en ? 'Open next level' : '打开下一级'}</button>
    </div>
  </RecipeFrame>;
}

function localDemo(Demo: StyleVariantSet[number]['Demo']) {
  return function LocalDemo(props: VariantDemoProps) {
    return <><Demo {...props} /><p className="mx-auto mt-4 w-full max-w-md text-xs leading-relaxed text-ink-2">{props.locale === 'en' ? 'Local interaction demo. Nothing is sent or saved outside this page.' : '本地交互演示，不会向外发送或保存数据。'}</p></>;
  };
}

const adaptedNotes = {
  "minimalism": {
    "zh": "白底细边、宽松留白和黑白反转状态，移除多余装饰。路径按钮可回到任意上级，再逐级进入子层，当前位置始终明确。",
    "en": "White space, fine borders and monochrome inversion remove unnecessary decoration. Path controls return to any ancestor and reopen child levels while preserving a clear current location."
  },
  "flat-design": {
    "zh": "蓝色实心面、简洁圆角与无投影的层级，让选中项清晰可辨。路径按钮可回到任意上级，再逐级进入子层，当前位置始终明确。",
    "en": "Solid blue surfaces, simple corners and shadow-free hierarchy make selection explicit. Path controls return to any ancestor and reopen child levels while preserving a clear current location."
  },
  "swiss-style": {
    "zh": "编号书眉和严格对齐的网格配黑色规则线，红色侧轨标记选中状态。路径按钮可回到任意上级，再逐级进入子层，当前位置始终明确。",
    "en": "A numbered masthead and aligned grid use black rules, with red rails marking selection. Path controls return to any ancestor and reopen child levels while preserving a clear current location."
  },
  "neobrutalism": {
    "zh": "黄色底、3px 黑描边、粉色选中块与硬偏移投影，让控件像实体拼贴。路径按钮可回到任意上级，再逐级进入子层，当前位置始终明确。",
    "en": "Yellow ground, 3px black outlines, pink selections and hard offset shadows make tactile collage-like controls. Path controls return to any ancestor and reopen child levels while preserving a clear current location."
  },
  "organic": {
    "zh": "奶油与苔绿表面配不对称大圆角，选中态以深绿色柔软块面出现。路径按钮可回到任意上级，再逐级进入子层，当前位置始终明确。",
    "en": "Cream and moss surfaces use asymmetric rounded contours, with a deep-green soft selected shape. Path controls return to any ancestor and reopen child levels while preserving a clear current location."
  }
};

const styleVariants: StyleVariantSet = [
  {
    style: 'editorial',
    name: {"zh":"杂志编辑风","en":"Editorial"},
    note: {
      zh: '上下双规则线夹住一行居中衬线路径，只用朱砂斜杠层级分隔。',
      en: 'A centred serif path held between two rules, with vermilion slashes the only hierarchy cue.',
    },
    Demo: localDemo(Editorial),
  },
  {
    style: 'pixel-art',
    name: {"zh":"像素风","en":"Pixel Art UI"},
    note: {
      zh: '4px 硬像素边框与直角色块，用三角箭头当分隔符，末级路径反白高亮。',
      en: 'Hard 4px pixel borders and square colour chips, with triangle separators and the last crumb inverted.',
    },
    Demo: localDemo(Pixel),
  },
  {
    style: 'brutalism',
    name: {"zh":"粗野主义","en":"Brutalism"},
    note: {
      zh: '超大号等宽双斜杠强行断开层级，黑白硬对比，当前页直接反色成黑块。',
      en: 'Oversized monospace double-slashes violently split the levels; the current page inverts to a black block.',
    },
    Demo: localDemo(Brutal),
  },
  ...(['minimalism', 'flat-design', 'swiss-style', 'neobrutalism', 'organic'] as const).map(style => recipeVariant(style, (props: VariantDemoProps) => <AdaptedBreadcrumb {...props} style={style} />, adaptedNotes[style])),
];

export default styleVariants;
