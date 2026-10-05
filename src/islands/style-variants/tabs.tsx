import { useId } from 'react';
import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useRovingTabs } from './behavior';

function Flat({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const tabs = en ? ['Design', 'Prototype', 'Specs'] : ['设计', '原型', '规格'];
  const panels = en
    ? ['Visual system and tokens.', 'Interactive flows and states.', 'Engineering handoff notes.']
    : ['视觉系统与设计变量。', '交互流程与状态。', '工程交接说明。'];
  const { active, onKeyDown, tabProps, panelProps } = useRovingTabs(session, tabs.length, 0);
  const prefix = useId();
  return (
    <div className="mx-auto w-full max-w-sm bg-paper">
      <div role="tablist" aria-label={en ? 'Project sections' : '项目分区'} onKeyDown={onKeyDown} className="flex gap-1">
        {tabs.map((t, i) => (
          <button
            key={t}
            type="button"
            id={`${prefix}-${i}`}
            aria-controls={`${prefix}-panel-${i}`}
            {...tabProps(i)}
            className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none flex-1 px-3 py-2 text-xs font-medium ${active === i ? 'bg-accent text-white' : 'bg-code-bg text-ink-2 hover:bg-line'}`}
          >
            {t}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t}
          id={`${prefix}-panel-${i}`}
          aria-labelledby={`${prefix}-${i}`}
          {...panelProps(i)}
          className="bg-raised p-4 text-xs leading-relaxed text-ink-2"
        >
          {panels[i]}
        </div>
      ))}
    </div>
  );
}

function LiquidGlass({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const tabs = en ? ['Design', 'Prototype', 'Specs'] : ['设计', '原型', '规格'];
  const panels = en
    ? ['Visual system and tokens.', 'Interactive flows and states.', 'Engineering handoff notes.']
    : ['视觉系统与设计变量。', '交互流程与状态。', '工程交接说明。'];
  const { active, onKeyDown, tabProps, panelProps } = useRovingTabs(session, tabs.length, 0);
  const prefix = useId();
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-br from-[#2a2f45] to-[#5b3a6e] p-5">
      <span className="pointer-events-none absolute -top-10 left-1/4 h-24 w-40 rounded-full bg-white/30 blur-2xl" />
      <div role="tablist" aria-label={en ? 'Project sections' : '项目分区'} onKeyDown={onKeyDown} className="relative flex rounded-full border border-white/40 bg-white/10 p-1 backdrop-blur-xl">
        {tabs.map((t, i) => (
          <button
            key={t}
            type="button"
            id={`${prefix}-${i}`}
            aria-controls={`${prefix}-panel-${i}`}
            {...tabProps(i)}
            className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${active === i ? 'bg-white/80 text-[#2a2f45] shadow-[inset_0_1px_1px_rgba(255,255,255,.9)]' : 'text-white/80 hover:bg-white/10'}`}
          >
            {t}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t}
          id={`${prefix}-panel-${i}`}
          aria-labelledby={`${prefix}-${i}`}
          {...panelProps(i)}
          className="relative mt-4 text-center text-[11px] text-white/85"
        >
          {panels[i]}
        </div>
      ))}
    </div>
  );
}

function Memphis({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const tabs = en ? ['Design', 'Prototype', 'Specs'] : ['设计', '原型', '规格'];
  const panels = en
    ? ['Visual system and tokens.', 'Interactive flows and states.', 'Engineering handoff notes.']
    : ['视觉系统与设计变量。', '交互流程与状态。', '工程交接说明。'];
  const { active, onKeyDown, tabProps, panelProps } = useRovingTabs(session, tabs.length, 0);
  const prefix = useId();
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden bg-[#fdf3e3] p-5" style={{ border: '3px solid #111' }}>
      <span className="pointer-events-none absolute right-4 top-3 text-lg text-[#00a7c4]">◌</span>
      <span className="pointer-events-none absolute bottom-3 left-4 h-4 w-4 rotate-12 bg-[#ff5da2]" style={{ borderRadius: '40% 60% 55% 45%' }} />
      <div role="tablist" aria-label={en ? 'Project sections' : '项目分区'} onKeyDown={onKeyDown} className="relative flex gap-2">
        {tabs.map((t, i) => (
          <button
            key={t}
            type="button"
            id={`${prefix}-${i}`}
            aria-controls={`${prefix}-panel-${i}`}
            {...tabProps(i)}
            className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none px-3 py-2 text-xs font-black uppercase ${i % 2 ? 'rotate-1' : '-rotate-1'} ${active === i ? 'bg-[#ffd23f] shadow-[3px_3px_0_0_#111]' : 'bg-white'}`}
            style={{ border: '3px solid #111' }}
          >
            {t}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t}
          id={`${prefix}-panel-${i}`}
          aria-labelledby={`${prefix}-${i}`}
          {...panelProps(i)}
          className="relative mt-4 text-xs font-medium text-black/70"
        >
          {panels[i]}
        </div>
      ))}
    </div>
  );
}


function AdaptedTabs({ style, session, locale }: VariantDemoProps & { style: RecipeStyleId }) {
  const en = locale === 'en';
  const r = recipe(style);
  const id = useId();
  const labels = en ? ['Design', 'Prototype', 'Specs'] : ['设计', '原型', '规格'];
  const panels = en ? ['Visual system, colour tokens and layout rules.', 'Interactive flows, focus order and reversible states.', 'Engineering handoff with responsive and accessibility notes.'] : ['视觉体系、颜色变量与布局规则。', '交互流程、焦点顺序与可撤销状态。', '包含响应式和无障碍说明的工程交接。'];
  const { active, onKeyDown, tabProps, panelProps } = useRovingTabs(session, 3, 0);
  return <RecipeFrame style={style} locale={locale} title={en ? 'Project sections' : '项目分区'}>
    <div role="tablist" aria-label={en ? 'Project sections' : '项目分区'} onKeyDown={onKeyDown} className="flex gap-2">{labels.map((label, i) => <button key={i} type="button" id={`${id}-tab-${i}`} aria-controls={`${id}-panel-${i}`} {...tabProps(i)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none flex-1 px-2 py-3 text-xs ${active === i ? r.active : r.secondary}`}>{label}</button>)}</div>
    {panels.map((panel, i) => <div key={i} id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} {...panelProps(i)} className={`mt-3 min-h-32 p-4 text-sm leading-relaxed ${r.item}`}><h3 className={r.title}>{labels[i]}</h3><p className={`mt-2 ${r.body}`}>{panel}</p></div>)}
  </RecipeFrame>;
}

function localDemo(Demo: StyleVariantSet[number]['Demo']) {
  return function LocalDemo(props: VariantDemoProps) {
    return <><Demo {...props} /><p className="mx-auto mt-4 w-full max-w-md text-xs leading-relaxed text-ink-2">{props.locale === 'en' ? 'Local interaction demo. Nothing is sent or saved outside this page.' : '本地交互演示，不会向外发送或保存数据。'}</p></>;
  };
}

const adaptedNotes = {
  "minimalism": {
    "zh": "白底细边、宽松留白和黑白反转状态，移除多余装饰。标签头与对应面板具名关联，点击或方向键只显示所选内容。",
    "en": "White space, fine borders and monochrome inversion remove unnecessary decoration. Named tab-panel relationships support clicking and arrow-key switching while only the selected panel is visible."
  },
  "swiss-style": {
    "zh": "编号书眉和严格对齐的网格配黑色规则线，红色侧轨标记选中状态。标签头与对应面板具名关联，点击或方向键只显示所选内容。",
    "en": "A numbered masthead and aligned grid use black rules, with red rails marking selection. Named tab-panel relationships support clicking and arrow-key switching while only the selected panel is visible."
  },
  "neobrutalism": {
    "zh": "黄色底、3px 黑描边、粉色选中块与硬偏移投影，让控件像实体拼贴。标签头与对应面板具名关联，点击或方向键只显示所选内容。",
    "en": "Yellow ground, 3px black outlines, pink selections and hard offset shadows make tactile collage-like controls. Named tab-panel relationships support clicking and arrow-key switching while only the selected panel is visible."
  },
  "editorial": {
    "zh": "纸色表面、衬线斜体标题、书眉和细分隔线建立杂志式阅读层级。标签头与对应面板具名关联，点击或方向键只显示所选内容。",
    "en": "Paper surfaces, italic serif headings, a journal masthead and fine rules create editorial hierarchy. Named tab-panel relationships support clicking and arrow-key switching while only the selected panel is visible."
  },
  "art-deco": {
    "zh": "深炭底上用对称金色双线、菱形书眉和大字距衬线标题构成秩序。标签头与对应面板具名关联，点击或方向键只显示所选内容。",
    "en": "Symmetric gold double rules, a diamond masthead and tracked serif titles structure a charcoal surface. Named tab-panel relationships support clicking and arrow-key switching while only the selected panel is visible."
  }
};

const styleVariants: StyleVariantSet = [
  {
    style: 'flat-design',
    name: {"zh":"扁平化设计","en":"Flat Design"},
    note: {
      zh: '纯色块标签页，零圆角零阴影，选中态就是一块实心强调色；方向键可切换标签。',
      en: 'Solid colour blocks with no radius or shadow — selection is a filled accent tile, switchable with arrow keys.',
    },
    Demo: localDemo(Flat),
  },
  {
    style: 'liquid-glass',
    name: {"zh":"液态玻璃","en":"Liquid Glass"},
    note: {
      zh: '几乎透明的胶囊分段控件，选中项是一块带顶部高光的乳白玻璃浮片。',
      en: 'A near-clear pill segmented control whose selection is a milky glass chip with a specular top highlight.',
    },
    Demo: localDemo(LiquidGlass),
  },
  {
    style: 'memphis',
    name: {"zh":"孟菲斯风格","en":"Memphis Design"},
    note: {
      zh: '倾斜的粗描边色块配几何涂鸦装饰，选中标签弹出一块硬投影的黄。',
      en: 'Tilted, thick-outlined colour blocks with doodled geometry; the active chip pops out on a hard yellow shadow.',
    },
    Demo: localDemo(Memphis),
  },
  ...(['minimalism', 'swiss-style', 'neobrutalism', 'editorial', 'art-deco'] as const).map(style => recipeVariant(style, (props: VariantDemoProps) => <AdaptedTabs {...props} style={style} />, adaptedNotes[style])),
];

export default styleVariants;
