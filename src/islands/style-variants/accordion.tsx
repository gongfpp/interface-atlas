import { useId } from 'react';
import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function SwissAccordion({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [open, setOpen] = useSessionState(session, 'open', 0);
  const accordionId = useId();
  const items: [string, string, string][] = en
    ? [
        ['01', 'Grid', 'Twelve columns, one baseline, nothing floats free.'],
        ['02', 'Type', 'Neue Haas-style neutral grotesk at strict sizes.'],
        ['03', 'Colour', 'Black, white and a single signal red for state.'],
      ]
    : [
        ['01', '网格', '十二列、一条基线，任何元素都不自由漂浮。'],
        ['02', '字体', '严格字号的中性怪诞体，接近 Neue Haas 风格。'],
        ['03', '色彩', '黑白为主，仅用一条信号红区分状态。'],
      ];
  return (
    <div className="mx-auto w-full max-w-sm bg-white text-black" style={{ borderTop: '3px solid #000' }}>
      {items.map(([no, title, body], i) => (
        <div key={no} className="border-b border-black/15">
          <button type="button" id={`${accordionId}-trigger-${i}`} aria-expanded={open === i} aria-controls={`${accordionId}-panel-${i}`} onClick={() => setOpen(open === i ? -1 : i)} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-3 py-3 text-left">
            <span className="font-mono text-[10px]" style={{ color: '#e00' }}>
              {no}
            </span>
            <span className="text-sm font-medium">{title}</span>
            <span className="text-lg leading-none" style={{ color: open === i ? '#e00' : '#000' }}>
              {open === i ? '−' : '+'}
            </span>
          </button>
          <p id={`${accordionId}-panel-${i}`} role="region" aria-labelledby={`${accordionId}-trigger-${i}`} hidden={open !== i} className="pb-3 pl-[3.25rem] text-[11px] leading-relaxed text-black/60">{body}</p>
        </div>
      ))}
    </div>
  );
}

function RawAccordion({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [open, setOpen] = useSessionState(session, 'open', 0);
  const accordionId = useId();
  const items = en ? ['UPLOAD', 'TRANSCODE', 'PUBLISH'] : ['上传', '转码', '发布'];
  return (
    <div className="mx-auto w-full max-w-sm bg-[#d8d8d8] font-mono text-black">
      {items.map((it, i) => (
        <div key={it} className="border-b-2 border-black">
          <button type="button" id={`${accordionId}-trigger-${i}`} aria-expanded={open === i} aria-controls={`${accordionId}-panel-${i}`} onClick={() => setOpen(open === i ? -1 : i)} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none flex w-full items-center justify-between px-3 py-2 text-left">
            <span className={`text-xl font-bold uppercase leading-none tracking-tighter ${open === i ? 'bg-black px-1 text-[#d8d8d8]' : ''}`}>
              {it}
            </span>
            <span className="text-sm">{String(i + 1).padStart(2, '0')}</span>
          </button>
          <p id={`${accordionId}-panel-${i}`} role="region" aria-labelledby={`${accordionId}-trigger-${i}`} hidden={open !== i} className="px-3 pb-3 text-[11px] leading-snug">{en ? '[ RAW TEXT BODY — NO ROUNDING, NO SHADOW, JUST STRUCTURE ]' : '[ 原始文本主体 —— 无圆角、无阴影，只有结构 ]'}</p>
        </div>
      ))}
    </div>
  );
}

function LiquidAccordion({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [open, setOpen] = useSessionState(session, 'open', 0);
  const accordionId = useId();
  const items = en ? ['Storage', 'Privacy', 'Devices'] : ['存储', '隐私', '设备'];
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1b2a4a] via-[#3b2d63] to-[#0e1730] p-4">
      <span className="pointer-events-none absolute -top-10 left-10 h-32 w-32 rounded-full bg-[#5b8cff]/40 blur-2xl" />
      <div className="relative flex flex-col gap-2">
        {items.map((it, i) => (
          <div key={it} className="overflow-hidden rounded-3xl border border-white/25 bg-white/10 backdrop-blur-xl">
            <button type="button" id={`${accordionId}-trigger-${i}`} aria-expanded={open === i} aria-controls={`${accordionId}-panel-${i}`} onClick={() => setOpen(open === i ? -1 : i)} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium text-white">
              {it}
              <span className="text-white/60">{open === i ? '−' : '+'}</span>
            </button>
            <p id={`${accordionId}-panel-${i}`} role="region" aria-labelledby={`${accordionId}-trigger-${i}`} hidden={open !== i} className="px-4 pb-3 text-[11px] leading-relaxed text-white/70">{en ? 'A frosted pill expands in place with no chrome.' : '磨砂胶囊在原地展开，没有任何多余装饰。'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


function AdaptedAccordion({ style, session, locale }: VariantDemoProps & { style: RecipeStyleId }) {
  const en = locale === 'en';
  const id = useId();
  const r = recipe(style);
  const [open, setOpen] = useSessionState(session, 'open', 0);
  const items = en
    ? [['Layout', 'A twelve-column grid keeps content aligned.'], ['Typography', 'A clear type scale separates titles from details.'], ['Colour', 'One accent identifies the current state.']]
    : [['布局', '十二列网格让内容保持对齐。'], ['字体', '清晰的字号层级区分标题和详情。'], ['色彩', '用一种强调色标记当前状态。']];
  return <RecipeFrame style={style} locale={locale} title={en ? 'Design principles' : '设计原则'}>
    <div className="space-y-2">{items.map(([title, body], i) => <section key={i} className={r.item}>
      <h3><button type="button" id={`${id}-trigger-${i}`} aria-expanded={open === i} aria-controls={`${id}-panel-${i}`} onClick={() => setOpen(open === i ? -1 : i)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none flex w-full items-center gap-3 p-3 text-left ${open === i ? r.active : r.secondary}`}>
        <span aria-hidden="true" className="font-mono text-xs">0{i + 1}</span><span className="flex-1">{title}</span><span aria-hidden="true">{open === i ? '−' : '+'}</span>
      </button></h3>
      <div id={`${id}-panel-${i}`} role="region" aria-labelledby={`${id}-trigger-${i}`} hidden={open !== i} className={`p-3 text-sm leading-relaxed ${r.body}`}>{body}</div>
    </section>)}</div>
  </RecipeFrame>;
}

function localDemo(Demo: StyleVariantSet[number]['Demo']) {
  return function LocalDemo(props: VariantDemoProps) {
    return <><Demo {...props} /><p className="mx-auto mt-4 w-full max-w-md text-xs leading-relaxed text-ink-2">{props.locale === 'en' ? 'Local interaction demo. Nothing is sent or saved outside this page.' : '本地交互演示，不会向外发送或保存数据。'}</p></>;
  };
}

const adaptedNotes = {
  "minimalism": {
    "zh": "白底细边、宽松留白和黑白反转状态，移除多余装饰。编号触发器控制具名详情区，可展开、切换和再次折叠。",
    "en": "White space, fine borders and monochrome inversion remove unnecessary decoration. Numbered triggers control named detail regions and support opening, switching and collapsing."
  },
  "flat-design": {
    "zh": "蓝色实心面、简洁圆角与无投影的层级，让选中项清晰可辨。编号触发器控制具名详情区，可展开、切换和再次折叠。",
    "en": "Solid blue surfaces, simple corners and shadow-free hierarchy make selection explicit. Numbered triggers control named detail regions and support opening, switching and collapsing."
  },
  "neobrutalism": {
    "zh": "黄色底、3px 黑描边、粉色选中块与硬偏移投影，让控件像实体拼贴。编号触发器控制具名详情区，可展开、切换和再次折叠。",
    "en": "Yellow ground, 3px black outlines, pink selections and hard offset shadows make tactile collage-like controls. Numbered triggers control named detail regions and support opening, switching and collapsing."
  },
  "editorial": {
    "zh": "纸色表面、衬线斜体标题、书眉和细分隔线建立杂志式阅读层级。编号触发器控制具名详情区，可展开、切换和再次折叠。",
    "en": "Paper surfaces, italic serif headings, a journal masthead and fine rules create editorial hierarchy. Numbered triggers control named detail regions and support opening, switching and collapsing."
  },
  "art-deco": {
    "zh": "深炭底上用对称金色双线、菱形书眉和大字距衬线标题构成秩序。编号触发器控制具名详情区，可展开、切换和再次折叠。",
    "en": "Symmetric gold double rules, a diamond masthead and tracked serif titles structure a charcoal surface. Numbered triggers control named detail regions and support opening, switching and collapsing."
  }
};

const styleVariants: StyleVariantSet = [
  {
    style: 'swiss-style',
    name: {"zh":"瑞士风格","en":"Swiss Style"},
    note: {
      zh: '编号、标题、标记严格对齐三条网格线，只用一条信号红区分展开态，其余全是黑白细规线。',
      en: 'Number, title and marker lock to a three-track grid, with one signal red for the open state and everything else black-on-white hairlines.',
    },
    Demo: localDemo(SwissAccordion),
  },
  {
    style: 'brutalism',
    name: {"zh":"粗野主义","en":"Brutalism"},
    note: {
      zh: '等宽超大写标题直接压在水泥灰底上，展开时标题被反白成黑块，拒绝任何圆角与过渡。',
      en: 'Oversized monospace capitals sit raw on concrete grey, and opening inverts the title into a solid black block with no rounding or easing.',
    },
    Demo: localDemo(RawAccordion),
  },
  {
    style: 'liquid-glass',
    name: {"zh":"液态玻璃","en":"Liquid Glass"},
    note: {
      zh: '深色渐变上浮着磨砂玻璃胶囊，白色描边与背景模糊制造通透层次，展开在原地撑开。',
      en: 'Frosted glass pills float over a dark gradient, white borders and backdrop blur giving depth as each one expands in place.',
    },
    Demo: localDemo(LiquidAccordion),
  },
  ...(['minimalism', 'flat-design', 'neobrutalism', 'editorial', 'art-deco'] as const).map(style => recipeVariant(style, (props: VariantDemoProps) => <AdaptedAccordion {...props} style={style} />, adaptedNotes[style])),
];

export default styleVariants;
