import { useId } from 'react';
import type { KeyboardEvent } from 'react';
import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

const formatClasses = ['font-bold', 'italic', 'underline', 'line-through'];
function useToolbar(session: VariantDemoProps['session']) {
  const [active, setActive] = useSessionState(session, 'active', 0);
  const [focus, setFocus] = useSessionState(session, 'toolbarFocus', 0);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[data-tool]'));
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 3 : (current + (event.key === 'ArrowRight' ? 1 : 3)) % 4;
    setFocus(next); buttons[next]?.focus();
  };
  const toolProps = (i: number) => ({ 'data-tool': true, 'aria-pressed': active === i, tabIndex: focus === i ? 0 : -1, onFocus: () => setFocus(i), onClick: () => setActive(active === i ? -1 : i) });
  return { active, onKeyDown, toolProps };
}
function OriginalToolbar({ session, locale, skin }: VariantDemoProps & { skin: 'flat-design' | 'art-deco' | 'bauhaus' }) {
  const en = locale === 'en';
  const { active, onKeyDown, toolProps } = useToolbar(session);
  const [more, setMore] = useSessionState(session, 'toolbarMore', false);
  const id = useId();
  const labels = en ? ['Bold', 'Italic', 'Underline', 'Strikethrough'] : ['加粗', '斜体', '下划线', '删除线'];
  const frame = skin === 'flat-design' ? 'rounded-lg border border-line bg-raised p-3 text-ink' : skin === 'art-deco' ? 'border-2 border-[#c9a227] bg-[#111014] p-4 text-[#e8d9a0]' : 'border-2 border-black bg-[#f4f1e8] p-5 text-black';
  const text = en ? 'A little style goes a long way.' : '一点风格，让表达更清晰。';
  return <div className={`mx-auto w-full max-w-sm ${frame}`}>
    {skin !== 'flat-design' && <p className={skin === 'art-deco' ? 'text-center font-serif text-[10px] uppercase tracking-[0.45em]' : 'font-mono text-xs font-bold uppercase tracking-widest'}>{en ? 'Text tools' : '文本工具'}</p>}
    <div role="toolbar" aria-label={en ? 'Text formatting' : '文本格式'} onKeyDown={onKeyDown} className={`mt-3 flex items-center gap-2 ${skin === 'art-deco' ? 'divide-x divide-[#c9a227]/40 border-y border-[#c9a227]/40' : ''}`}>
      {labels.map((label, i) => {
        const cls = skin === 'flat-design' ? `flex-1 rounded-md px-3 py-2 text-sm ${active === i ? 'bg-accent text-white' : 'bg-code-bg text-ink-2'}` : skin === 'art-deco' ? `flex-1 py-3 font-serif text-lg ${active === i ? 'bg-[#c9a227] text-[#111014]' : 'text-[#e8d9a0]'}` : `h-12 w-12 border-2 ${i === 2 ? 'border-transparent' : 'border-black'} ${i === 1 ? 'rounded-full' : ''} ${active === i ? 'ring-2 ring-black ring-offset-2' : 'opacity-60'}`;
        return <button key={i} type="button" aria-label={label} {...toolProps(i)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none ${cls} ${formatClasses[i]}`} style={skin === 'bauhaus' ? { background: i === 2 ? 'transparent' : ['#e2231a','#1257a6','#f5c400','#111'][i], color: i===2 ? '#111' : '#fff' } : undefined}>{skin === 'bauhaus' ? <><span className="sr-only">{label}</span>{i === 2 && <span aria-hidden="true" className="block h-11 w-11 bg-[#f5c400]" style={{ clipPath: 'polygon(50% 0, 0 100%, 100% 100%)' }} />}</> : ['B','I','U','S'][i]}</button>;
      })}
    </div>
    <p className={`mt-4 border-y border-current/30 py-4 text-lg ${formatClasses[active] ?? ''}`}>{text}</p>
    <p role="status" className="mt-3 text-xs">{active < 0 ? (en ? 'No formatting applied' : '未应用格式') : en ? `${labels[active]} applied. Select again to undo.` : `已应用${labels[active]}，再次点击可撤销。`}</p>
    {skin === 'flat-design' && <><button type="button" aria-expanded={more} aria-controls={`${id}-help`} onClick={() => setMore(!more)} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none mt-3 min-h-11 rounded-md border border-line bg-code-bg px-3 text-xs">{more ? (en ? 'Less' : '收起') : (en ? 'More' : '更多')}</button><p id={`${id}-help`} hidden={!more} className="mt-2 text-xs">{en ? 'Arrow keys move between tools. Enter toggles formatting. This only changes the sample text.' : '方向键切换工具焦点，回车切换格式。仅修改示例文字。'}</p></>}
    {skin === 'art-deco' && <div aria-hidden="true" className="mt-3 text-center text-xs tracking-[0.5em] text-[#c9a227]">◆ ◆ ◆</div>}
  </div>;
}
function Flat(props: VariantDemoProps) { return <OriginalToolbar {...props} skin="flat-design" />; }
function Deco(props: VariantDemoProps) { return <OriginalToolbar {...props} skin="art-deco" />; }
function Bauhaus(props: VariantDemoProps) { return <OriginalToolbar {...props} skin="bauhaus" />; }

function AdaptedToolbar({ style, session, locale }: VariantDemoProps & { style: RecipeStyleId }) {
  const en = locale === 'en';
  const r = recipe(style);
  const { active, onKeyDown, toolProps } = useToolbar(session);
  const labels = en ? ['Bold', 'Italic', 'Underline', 'Strikethrough'] : ['加粗', '斜体', '下划线', '删除线'];
  const classes = ['font-bold', 'italic', 'underline', 'line-through'];
  return <RecipeFrame style={style} locale={locale} title={en ? 'Text tools' : '文本工具'}>
    <div role="toolbar" aria-label={en ? 'Text formatting' : '文本格式'} onKeyDown={onKeyDown} className="flex gap-2">{labels.map((label, i) => <button key={i} type="button" aria-label={label} {...toolProps(i)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none flex-1 px-2 ${classes[i]} ${active === i ? r.active : r.secondary}`}>{['B','I','U','S'][i]}</button>)}</div>
    <p className={`mt-4 min-h-24 p-4 text-lg ${r.item} ${classes[active] ?? ''}`}>{en ? 'A little style goes a long way.' : '一点风格，让表达更清晰。'}</p><p role="status" className={`mt-3 text-xs ${r.muted}`}>{active < 0 ? (en ? 'No formatting applied' : '未应用格式') : (en ? `${labels[active]} applied. Select again to undo.` : `已应用${labels[active]}，再次点击可撤销。`)}</p>
  </RecipeFrame>;
}

function localDemo(Demo: StyleVariantSet[number]['Demo']) {
  return function LocalDemo(props: VariantDemoProps) {
    return <><Demo {...props} /><p className="mx-auto mt-4 w-full max-w-md text-xs leading-relaxed text-ink-2">{props.locale === 'en' ? 'Local interaction demo. Nothing is sent or saved outside this page.' : '本地交互演示，不会向外发送或保存数据。'}</p></>;
  };
}

const adaptedNotes = {
  "minimalism": {
    "zh": "白底细边、宽松留白和黑白反转状态，移除多余装饰。格式工具实际作用于示例文字，再次选择可撤销，方向键移动工具焦点。",
    "en": "White space, fine borders and monochrome inversion remove unnecessary decoration. Formatting tools actually style the sample text, toggle off on repeated selection, and support arrow-key focus movement."
  },
  "swiss-style": {
    "zh": "编号书眉和严格对齐的网格配黑色规则线，红色侧轨标记选中状态。格式工具实际作用于示例文字，再次选择可撤销，方向键移动工具焦点。",
    "en": "A numbered masthead and aligned grid use black rules, with red rails marking selection. Formatting tools actually style the sample text, toggle off on repeated selection, and support arrow-key focus movement."
  },
  "neobrutalism": {
    "zh": "黄色底、3px 黑描边、粉色选中块与硬偏移投影，让控件像实体拼贴。格式工具实际作用于示例文字，再次选择可撤销，方向键移动工具焦点。",
    "en": "Yellow ground, 3px black outlines, pink selections and hard offset shadows make tactile collage-like controls. Formatting tools actually style the sample text, toggle off on repeated selection, and support arrow-key focus movement."
  },
  "editorial": {
    "zh": "纸色表面、衬线斜体标题、书眉和细分隔线建立杂志式阅读层级。格式工具实际作用于示例文字，再次选择可撤销，方向键移动工具焦点。",
    "en": "Paper surfaces, italic serif headings, a journal masthead and fine rules create editorial hierarchy. Formatting tools actually style the sample text, toggle off on repeated selection, and support arrow-key focus movement."
  },
  "organic": {
    "zh": "奶油与苔绿表面配不对称大圆角，选中态以深绿色柔软块面出现。格式工具实际作用于示例文字，再次选择可撤销，方向键移动工具焦点。",
    "en": "Cream and moss surfaces use asymmetric rounded contours, with a deep-green soft selected shape. Formatting tools actually style the sample text, toggle off on repeated selection, and support arrow-key focus movement."
  }
};

const styleVariants: StyleVariantSet = [
  {
    style: 'flat-design',
    name: {"zh":"扁平化设计","en":"Flat Design"},
    note: {
      zh: '工具栏全是纯色块，没有任何阴影或渐变，选中态只靠一块实心强调色区分。',
      en: 'A toolbar of pure colour blocks with no shadow or gradient; selection is signalled only by a solid accent fill.',
    },
    Demo: localDemo(Flat),
  },
  {
    style: 'art-deco',
    name: {"zh":"装饰艺术","en":"Art Deco"},
    note: {
      zh: '黑金对称构图：居中标徽、金色细分隔线、对称图标列与底部菱形装饰，奢华而克制。',
      en: 'A symmetric black-and-gold composition — centred wordmark, gold rules, a mirrored icon row and diamond ornament.',
    },
    Demo: localDemo(Deco),
  },
  {
    style: 'bauhaus',
    name: {"zh":"包豪斯","en":"Bauhaus"},
    note: {
      zh: '工具就是几何形体：正方、圆、三角、长条各占红黄蓝主色，选中即填充纯色。',
      en: 'Tools are geometric forms — square, circle, triangle and bar in primary red/blue/yellow, filled solid when active.',
    },
    Demo: localDemo(Bauhaus),
  },
  ...(['minimalism', 'swiss-style', 'neobrutalism', 'editorial', 'organic'] as const).map(style => recipeVariant(style, (props: VariantDemoProps) => <AdaptedToolbar {...props} style={style} />, adaptedNotes[style])),
];

export default styleVariants;
