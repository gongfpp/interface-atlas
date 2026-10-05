import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSelectionList } from './behavior';

const TOPICS = ['Design', 'Code', 'Motion', 'Data'];
const SHAPES = [
  { id: 'Design', color: '#e1261c', radius: '9999px' },
  { id: 'Code', color: '#1b4fd8', radius: '0' },
  { id: 'Motion', color: '#f2c200', radius: '9999px 9999px 0 0' },
  { id: 'Data', color: '#247f59', radius: '50% 0 50% 0' },
];

function MinimalMultiSelect({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const label: Record<string, string> = { Design: en ? 'Design' : '设计', Code: en ? 'Code' : '代码', Motion: en ? 'Motion' : '动效', Data: en ? 'Data' : '数据' };
  const { selected, toggle } = useSelectionList(session, 'selected', ['Design']);
  return (
    <div className="mx-auto w-full max-w-sm border border-line bg-raised p-5 text-ink">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-3">{en ? 'Topics' : '主题'}</p>
      <div className="mt-3 flex flex-wrap gap-px border border-line bg-line">
        {TOPICS.map((t) => {
          const on = selected.includes(t);
          return (
            <button
              key={t}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(t)}
              className={`focus-visible:outline-2 focus-visible:outline-offset-2 flex-1 px-2 py-2.5 text-[11px] uppercase tracking-widest transition-colors duration-150 ${
                on ? 'bg-ink text-paper' : 'bg-raised text-ink-2 hover:text-ink'
              }`}
            >
              {label[t]}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-ink-3">
        {en ? `${selected.length} of ${TOPICS.length} selected` : `已选 ${selected.length} / ${TOPICS.length}`}
      </p>
    </div>
  );
}

function BauhausMultiSelect({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const shapeLabel: Record<string, string> = { Design: en ? 'Design' : '设计', Code: en ? 'Code' : '代码', Motion: en ? 'Motion' : '动效', Data: en ? 'Data' : '数据' };
  const { selected, toggle } = useSelectionList(session, 'selected', ['Design']);
  return (
    <div className="mx-auto w-full max-w-sm border-[3px] border-black bg-[#f6efdd] p-6 text-black">
      <p className="text-center text-[11px] font-bold uppercase tracking-[0.3em]">{en ? 'Select topics' : '选择主题'}</p>
      <div className="mt-6 flex items-end flex-wrap justify-center gap-4">
        {SHAPES.map((s) => {
          const on = selected.includes(s.id);
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(s.id)}
              className="focus-visible:outline-2 focus-visible:outline-offset-2 flex flex-col items-center gap-2"
            >
              <span
                className={`h-12 w-12 border-[3px] border-black transition-transform ${
                  on ? 'scale-100' : 'scale-90 hover:scale-100'
                }`}
                style={{ background: on ? s.color : '#fff', borderRadius: s.radius }}
              />
              <span className="text-[10px] font-bold uppercase tracking-wider">{shapeLabel[s.id]}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-6 border-t-2 border-black pt-2 text-center text-[11px]">{en ? `${selected.length} chosen` : `已选 ${selected.length} 个`}</p>
    </div>
  );
}

function LiquidGlassMultiSelect({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const label: Record<string, string> = { Design: en ? 'Design' : '设计', Code: en ? 'Code' : '代码', Motion: en ? 'Motion' : '动效', Data: en ? 'Data' : '数据' };
  const { selected, toggle } = useSelectionList(session, 'selected', ['Design', 'Motion']);
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[28px] bg-gradient-to-br from-[#8ea2ff] via-[#f0a4ff] to-[#7fd8ff] p-6 text-white">
      <span className="pointer-events-none absolute -left-8 -top-10 h-32 w-32 rounded-full bg-white/50 blur-2xl" />
      <span className="pointer-events-none absolute -bottom-12 -right-6 h-36 w-36 rounded-full bg-[#ffd36e]/50 blur-2xl" />
      <p className="relative font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">{en ? 'Focus' : '焦点'}</p>
      <div className="relative mt-4 flex flex-wrap gap-2">
        {TOPICS.map((t) => {
          const on = selected.includes(t);
          return (
            <button
              key={t}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(t)}
              className={`focus-visible:outline-2 focus-visible:outline-offset-2 rounded-full border px-4 py-1.5 text-xs font-medium backdrop-blur-xl transition-all duration-200 ${
                on
                  ? 'border-white/80 bg-white/70 text-[#1b1740] shadow-lg shadow-black/10'
                  : 'border-white/40 bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              {label[t]}
            </button>
          );
        })}
      </div>
      <p className="relative mt-4 text-[11px] text-white/80">{en ? `${selected.length} selected` : `已选 ${selected.length} 项`}</p>
    </div>
  );
}


function Expanded({ session, locale, style }: VariantDemoProps & { style: RecipeStyleId }) {
  const zh = locale === 'zh';
  const r = recipe(style);
  const { selected, toggle, clear } = useSelectionList(session, 'selected', ['Design']);
  const labels = zh ? ['设计', '代码', '动效', '数据'] : TOPICS;
  return <RecipeFrame style={style} locale={locale} title={zh ? '关注主题' : 'Topics of interest'}>
    <fieldset><legend className={`mb-3 text-sm ${r.muted}`}>{zh ? '可选择多个主题' : 'Choose any number of topics'}</legend>
      <div className="grid grid-cols-2 gap-3">{TOPICS.map((topic, i) => <label key={topic} className={`flex min-h-14 cursor-pointer items-center gap-2 p-3 ${selected.includes(topic) ? r.active : r.item}`}>
        <input type="checkbox" checked={selected.includes(topic)} onChange={() => toggle(topic)} className="focus-visible:outline-2 focus-visible:outline-offset-2 h-5 w-5 shrink-0 accent-current focus-visible:outline-2 focus-visible:outline-offset-2" />
        <span className="text-sm">{labels[i]}</span>
      </label>)}</div>
    </fieldset>
    <p role="status" className={`mt-4 text-sm ${r.muted}`}>{zh ? `已选 ${selected.length} 项` : `${selected.length} selected`}</p>
    <button type="button" onClick={clear} className={`focus-visible:outline-2 focus-visible:outline-offset-2 mt-3 ${r.secondary}`}>{zh ? '清除选择' : 'Clear selection'}</button>
  </RecipeFrame>;
}

const styleVariants: StyleVariantSet = [
  {
    style: 'minimalism',
    name: {"zh":"极简主义","en":"Minimalism"},
    note: {
      zh: '去掉圆角与阴影，用 1px 发丝线分隔等宽标签，选中态只做黑白反转。',
      en: 'No radius or shadow; equal-width tags split by 1px hairlines, and selection is a pure black/white inversion.',
    },
    Demo: MinimalMultiSelect,
  },
  {
    style: 'bauhaus',
    name: {"zh":"包豪斯","en":"Bauhaus"},
    note: {
      zh: '把选项还原成圆/方/拱三种原色几何块，重黑描边，选中即填满原色。',
      en: 'Options become three primary-coloured geometric primitives (disc, square, arch) with heavy black outlines; selecting fills the solid primary.',
    },
    Demo: BauhausMultiSelect,
  },
  {
    style: 'liquid-glass',
    name: {"zh":"液态玻璃","en":"Liquid Glass"},
    note: {
      zh: '胶囊选项做成清透玻璃，叠在彩色渐变与模糊光斑上，选中时玻璃变白并浮起。',
      en: 'Pill options are clear glass over a colourful gradient with blurred blooms; selection turns the glass white and lifts it.',
    },
    Demo: LiquidGlassMultiSelect,
  },
  recipeVariant('flat-design', (props) => <Expanded {...props} style="flat-design" />, { zh: "纯色块与清晰层级，不依赖阴影；主题块的几何、边界与选中材质同时切换，保留原生多选与清空。", en: "Solid blocks and clear hierarchy without shadows; topic tiles change geometry, borders and selection materials together with native checkboxes and reset." }),
  recipeVariant('swiss-style', (props) => <Expanded {...props} style="swiss-style" />, { zh: "编号网格、直角边界与红色强调；主题块的几何、边界与选中材质同时切换，保留原生多选与清空。", en: "An indexed grid, square edges and a red accent; topic tiles change geometry, borders and selection materials together with native checkboxes and reset." }),
  recipeVariant('neobrutalism', (props) => <Expanded {...props} style="neobrutalism" />, { zh: "粗黑描边、硬投影与高对比选中；主题块的几何、边界与选中材质同时切换，保留原生多选与清空。", en: "Heavy black outlines, hard shadows and bold selection; topic tiles change geometry, borders and selection materials together with native checkboxes and reset." }),
  recipeVariant('neumorphism', (props) => <Expanded {...props} style="neumorphism" />, { zh: "同色曲面、双向阴影与实体边界；主题块的几何、边界与选中材质同时切换，保留原生多选与清空。", en: "Shared soft surfaces, paired shadows and explicit borders; topic tiles change geometry, borders and selection materials together with native checkboxes and reset." }),
  recipeVariant('organic', (props) => <Expanded {...props} style="organic" />, { zh: "大地色与不规则圆角，柔和而清楚；主题块的几何、边界与选中材质同时切换，保留原生多选与清空。", en: "Earth tones and irregular corners, soft yet clear; topic tiles change geometry, borders and selection materials together with native checkboxes and reset." }),
];

export default styleVariants;
