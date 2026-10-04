import { useId } from 'react';
import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function Vapor({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [open, setOpen] = useSessionState(session, 'open', 0);
  const timelineId = useId();
  const events = [
    { t: '09:12', title: en ? 'Draft created' : '创建草稿' },
    { t: '09:40', title: en ? 'Review completed' : '完成审阅' },
    { t: '10:05', title: en ? 'Preview prepared' : '备好预览' },
  ];
  return (
    <div
      className="mx-auto w-full max-w-sm rounded-lg bg-[#1a0b2e] p-5 text-[#e9d5ff]"
      style={{
        backgroundImage: 'linear-gradient(#ff4fd844 1px, transparent 1px), linear-gradient(90deg,#22d3ee44 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#22d3ee]">{en ? 'Activity log' : '活动日志'}</p>
      <ol className="relative border-l border-[#ff4fd8]/50 pl-5">
        {events.map((e, i) => (
          <li key={e.t} className="mb-3 last:mb-0">
            <button type="button" aria-expanded={open === i} aria-controls={`${timelineId}-detail-${i}`} onClick={() => setOpen(open === i ? -1 : i)} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none w-full text-left">
              <span className={`absolute -left-[6px] mt-1.5 h-3 w-3 rotate-45 border ${open === i ? 'border-[#22d3ee] bg-[#22d3ee] shadow-[0_0_10px_#22d3ee]' : 'border-[#ff4fd8] bg-[#1a0b2e]'}`} />
              <span className="font-mono text-[10px] text-[#22d3ee]">{e.t}</span>
              <span className="ml-2 text-sm">{e.title}</span>
            </button>
            <p id={`${timelineId}-detail-${i}`} hidden={open !== i} className="mt-1 text-[11px] text-[#e9d5ff]/70">{en ? 'processed by runner-04 · 1.2s' : '由 runner-04 处理 · 1.2s'}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Organic({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [open, setOpen] = useSessionState(session, 'open', 0);
  const timelineId = useId();
  const events = en ? ['Draft created', 'Review completed', 'Preview prepared'] : ['创建草稿', '完成审阅', '备好预览'];
  return (
    <div className="mx-auto w-full max-w-sm rounded-[2rem] bg-[#f3efe2] p-6 text-[#3f4a34]">
      <p className="mb-4 font-serif text-lg">{en ? 'Growth journal' : '生长日志'}</p>
      <ol className="space-y-4">
        {events.map((e, i) => (
          <li key={e} className="flex items-start gap-3">
            <span className={`mt-0.5 h-5 w-5 shrink-0 rounded-[60%_40%_55%_45%] border border-[#7c8b5e] ${open === i ? 'bg-[#8ea562]' : 'bg-transparent'}`} />
            <button type="button" aria-expanded={open === i} aria-controls={`${timelineId}-detail-${i}`} onClick={() => setOpen(open === i ? -1 : i)} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none flex-1 text-left">
              <span className="text-sm font-semibold">{e}</span>
              <span id={`${timelineId}-detail-${i}`} hidden={open !== i} className="mt-1 block font-serif text-xs italic text-[#6b7355]">{en ? 'A gentle note about this step, growing over time.' : '关于这一步的一点记录，随时间慢慢生长。'}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Raw({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [open, setOpen] = useSessionState(session, 'open', 0);
  const timelineId = useId();
  const events = en ? ['DRAFT', 'REVIEW', 'PREVIEW'] : ['草稿', '审阅', '预览'];
  return (
    <div className="mx-auto w-full max-w-sm bg-white p-5 text-black" style={{ border: '4px solid #000' }}>
      <p className="font-mono text-4xl font-black leading-none tracking-tighter">{en ? 'LOG' : '日志'}</p>
      <ol className="mt-4 divide-y-2 divide-black border-y-4 border-black">
        {events.map((e, i) => (
          <li key={e} className="py-2">
            <button type="button" aria-expanded={open === i} aria-controls={`${timelineId}-detail-${i}`} onClick={() => setOpen(open === i ? -1 : i)} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none flex w-full items-baseline justify-between">
              <span className="font-mono text-2xl font-bold">{e}</span>
              <span className="font-mono text-xs">{String(i).padStart(2, '0')}:45</span>
            </button>
            <p id={`${timelineId}-detail-${i}`} hidden={open !== i} className="mt-1 font-mono text-[11px] uppercase">{en ? '[detail] raw system output, no decoration.' : '[详情] 原始系统输出，无修饰。'}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}


function AdaptedTimeline({ style, session, locale }: VariantDemoProps & { style: RecipeStyleId }) {
  const en = locale === 'en';
  const r = recipe(style);
  const id = useId();
  const [open, setOpen] = useSessionState(session, 'open', 0);
  const titles = en ? ['Draft created', 'Review completed', 'Preview prepared'] : ['创建草稿', '完成审阅', '备好预览'];
  const details = en ? ['Layout and type samples were added.', 'Keyboard order and contrast were checked.', 'A local preview is ready to inspect.'] : ['已添加布局和字体示例。', '已检查键盘顺序与对比度。', '本地预览已准备好，可在此查看。'];
  return <RecipeFrame style={style} locale={locale} title={en ? 'Sample activity' : '示例活动'}>
    <ol className="space-y-3">{titles.map((title, i) => <li key={i} className={`p-3 ${r.item}`}><button type="button" id={`${id}-event-${i}`} aria-expanded={open === i} aria-controls={`${id}-detail-${i}`} onClick={() => setOpen(open === i ? -1 : i)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none flex w-full items-center gap-3 p-2 text-left ${open === i ? r.active : r.secondary}`}><span aria-hidden="true">{open === i ? '◆' : '◇'}</span><span className="flex-1 text-sm">{title}</span><time className="font-mono text-xs" dateTime={`2026-01-01T0${i + 7}:30`}>0{i + 7}:30</time></button><div id={`${id}-detail-${i}`} role="region" aria-labelledby={`${id}-event-${i}`} hidden={open !== i} className={`mt-2 p-2 text-xs leading-relaxed ${r.body}`}>{details[i]}</div></li>)}</ol>
  </RecipeFrame>;
}

function localDemo(Demo: StyleVariantSet[number]['Demo']) {
  return function LocalDemo(props: VariantDemoProps) {
    return <><Demo {...props} /><p className="mx-auto mt-4 w-full max-w-md text-xs leading-relaxed text-ink-2">{props.locale === 'en' ? 'Local interaction demo. Nothing is sent or saved outside this page.' : '本地交互演示，不会向外发送或保存数据。'}</p></>;
  };
}

const adaptedNotes = {
  "minimalism": {
    "zh": "白底细边、宽松留白和黑白反转状态，移除多余装饰。带时间的事件按钮控制各自详情，展开项可再次点击收起。",
    "en": "White space, fine borders and monochrome inversion remove unnecessary decoration. Timestamped event controls toggle their own details, including collapsing the selected event."
  },
  "flat-design": {
    "zh": "蓝色实心面、简洁圆角与无投影的层级，让选中项清晰可辨。带时间的事件按钮控制各自详情，展开项可再次点击收起。",
    "en": "Solid blue surfaces, simple corners and shadow-free hierarchy make selection explicit. Timestamped event controls toggle their own details, including collapsing the selected event."
  },
  "swiss-style": {
    "zh": "编号书眉和严格对齐的网格配黑色规则线，红色侧轨标记选中状态。带时间的事件按钮控制各自详情，展开项可再次点击收起。",
    "en": "A numbered masthead and aligned grid use black rules, with red rails marking selection. Timestamped event controls toggle their own details, including collapsing the selected event."
  },
  "neobrutalism": {
    "zh": "黄色底、3px 黑描边、粉色选中块与硬偏移投影，让控件像实体拼贴。带时间的事件按钮控制各自详情，展开项可再次点击收起。",
    "en": "Yellow ground, 3px black outlines, pink selections and hard offset shadows make tactile collage-like controls. Timestamped event controls toggle their own details, including collapsing the selected event."
  },
  "editorial": {
    "zh": "纸色表面、衬线斜体标题、书眉和细分隔线建立杂志式阅读层级。带时间的事件按钮控制各自详情，展开项可再次点击收起。",
    "en": "Paper surfaces, italic serif headings, a journal masthead and fine rules create editorial hierarchy. Timestamped event controls toggle their own details, including collapsing the selected event."
  }
};

const styleVariants: StyleVariantSet = [
  {
    style: 'vaporwave',
    name: {"zh":"蒸汽波","en":"Vaporwave"},
    note: {
      zh: '紫黑底叠粉青网格，发光菱形节点配等宽时间戳，展开项亮起霓虹。',
      en: 'A purple-black base under a pink/cyan grid, with glowing diamond markers, monospace timestamps and a neon active node.',
    },
    Demo: localDemo(Vapor),
  },
  {
    style: 'organic',
    name: {"zh":"有机自然","en":"Organic"},
    note: {
      zh: '奶油绿圆润曲面节点与衬线日记体，柔和块面取代连线，像植物生长记录。',
      en: 'Cream and green rounded organic markers in a serif journal voice, with soft shapes replacing the connecting line.',
    },
    Demo: localDemo(Organic),
  },
  {
    style: 'brutalism',
    name: {"zh":"粗野主义","en":"Brutalism"},
    note: {
      zh: '超大等宽标题套在 4px 黑框里，事件像未经修饰直接打印的系统日志。',
      en: 'Oversized monospace headings inside a 4px black frame; events read like raw, undecorated printed system logs.',
    },
    Demo: localDemo(Raw),
  },
  ...(['minimalism', 'flat-design', 'swiss-style', 'neobrutalism', 'editorial'] as const).map(style => recipeVariant(style, (props: VariantDemoProps) => <AdaptedTimeline {...props} style={style} />, adaptedNotes[style])),
];

export default styleVariants;
