import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSelectionList } from './behavior';

function Swiss({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const cats = [
    { id: 'Sans', label: en ? 'Sans' : '无衬线' },
    { id: 'Serif', label: en ? 'Serif' : '衬线' },
    { id: 'Mono', label: en ? 'Mono' : '等宽' },
  ];
  const sizes = [
    { id: 'Small', label: en ? 'Small' : '小号' },
    { id: 'Large', label: en ? 'Large' : '大号' },
  ];
  const { selected, toggle, clear } = useSelectionList(session, 'active', ['Sans']);
  const rows = (items: { id: string; label: string }[]) =>
    items.map((it) => (
      <label key={it.id} className="flex cursor-pointer items-center justify-between border-t border-black/10 py-1.5 text-xs">
        <span className="flex items-center gap-2">
          <input type="checkbox" checked={selected.includes(it.id)} onChange={() => toggle(it.id)} className="h-4 w-4 accent-black focus-visible:outline-2 focus-visible:outline-offset-2" />
          {it.label}
        </span>
        <span className="font-mono text-[10px] text-black/40">{it.label.length}</span>
      </label>
    ));
  return (
    <div className="mx-auto w-full max-w-sm border border-black bg-white font-sans text-black">
      <div className="flex items-baseline justify-between border-b-2 border-red-600 px-4 py-2.5">
        <span className="text-sm font-bold uppercase tracking-tight">{en ? 'Filter' : '筛选'}</span>
        <span className="font-mono text-[10px] tracking-wider text-black/50">{en ? `${selected.length} FILTERS` : `${selected.length} 项筛选`}</span>
      </div>
      <div className="p-4">
        <p className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em]">
          <span className="h-2 w-2 bg-red-600" />{en ? 'Category' : '分类'}
        </p>
        {rows(cats)}
        <p className="mb-1 mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em]">
          <span className="h-2 w-2 bg-red-600" />{en ? 'Size' : '尺寸'}
        </p>
        {rows(sizes)}
      </div>
      <button type="button" onClick={() => clear()} className="focus-visible:outline-2 focus-visible:outline-offset-2 w-full border-t border-black bg-black py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-red-600">
        {en ? 'Clear all' : '清除全部'}
      </button>
    </div>
  );
}

function Bauhaus({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const { selected, toggle, clear } = useSelectionList(session, 'active', ['Sans']);
  const opts = [
    { id: 'Sans', label: en ? 'Sans' : '无衬线', color: '#1d4ed8' },
    { id: 'Serif', label: en ? 'Serif' : '衬线', color: '#e11d48' },
    { id: 'Mono', label: en ? 'Mono' : '等宽', color: '#f5b500' },
  ];
  return (
    <div className="mx-auto w-full max-w-sm border-2 border-black bg-[#f4efe2] p-4 font-sans text-black">
      <div className="mb-3 flex items-center gap-2 border-b-2 border-black pb-3">
        <span className="h-4 w-4 rounded-full bg-[#e11d48]" />
        <span className="h-4 w-4 bg-[#f5b500]" />
        <span className="h-0 w-0 border-x-[8px] border-b-[14px] border-x-transparent border-b-[#1d4ed8]" />
        <span className="ml-auto text-xs font-black uppercase tracking-widest">{en ? 'Filter' : '筛选'}</span>
      </div>
      {opts.map((o) => {
        const on = selected.includes(o.id);
        return (
          <button type="button" key={o.id} aria-pressed={selected.includes(o.id)} onClick={() => toggle(o.id)} className="focus-visible:outline-2 focus-visible:outline-offset-2 mb-2 flex w-full items-center gap-3 border-2 border-black bg-white px-3 py-2 text-left text-sm font-bold">
            <span className="h-4 w-4 rounded-full border-2 border-black" style={{ background: on ? o.color : 'transparent' }} />
            {o.label}
            <span className="ml-auto font-mono text-xs">{on ? '■' : '□'}</span>
          </button>
        );
      })}
      <button type="button" onClick={() => clear()} className="focus-visible:outline-2 focus-visible:outline-offset-2 mt-1 w-full bg-black py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white">
        {en ? 'Reset' : '重置'}
      </button>
    </div>
  );
}

function Neumorph({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const tones = [
    { id: 'Sans', label: en ? 'Sans' : '无衬线' },
    { id: 'Serif', label: en ? 'Serif' : '衬线' },
    { id: 'Mono', label: en ? 'Mono' : '等宽' },
  ];
  const { selected, toggle, clear } = useSelectionList(session, 'active', ['Sans']);
  return (
    <div className="mx-auto w-full max-w-sm rounded-3xl bg-[#e6e9ef] p-6 text-[#4b5563]">
      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7280]">{en ? 'Type category' : '字体分类'}</p>
      {tones.map((o) => {
        const on = selected.includes(o.id);
        return (
          <button type="button"
            key={o.id}
            aria-pressed={selected.includes(o.id)} onClick={() => toggle(o.id)}
            className={`focus-visible:outline-2 focus-visible:outline-offset-2 mb-3 flex w-full items-center justify-between rounded-2xl px-5 py-3 text-sm font-semibold transition-shadow ${
              on
                ? 'shadow-[inset_5px_5px_10px_#c3c7cf,inset_-5px_-5px_10px_#ffffff]'
                : 'shadow-[5px_5px_10px_#c3c7cf,-5px_-5px_10px_#ffffff]'
            }`}
          >
            {o.label}
            <span className={`h-3 w-3 rounded-full ${on ? 'bg-[#7c8aa5]' : 'bg-[#d1d6de]'}`} />
          </button>
        );
      })}
      <button type="button" onClick={() => clear()} className="focus-visible:outline-2 focus-visible:outline-offset-2 mt-1 w-full rounded-2xl px-4 py-2 text-[11px] uppercase tracking-widest text-[#6b7280] shadow-[3px_3px_6px_#c3c7cf,-3px_-3px_6px_#ffffff]">
        {en ? 'Clear' : '清除'}
      </button>
    </div>
  );
}


function Expanded({ session, locale, style }: VariantDemoProps & { style: RecipeStyleId }) {
  const zh = locale === 'zh';
  const r = recipe(style);
  const { selected, toggle, clear } = useSelectionList(session, 'active', ['Sans']);
  const items = [{ id: 'Sans', zh: '无衬线', en: 'Sans' }, { id: 'Serif', zh: '衬线', en: 'Serif' }, { id: 'Mono', zh: '等宽', en: 'Mono' }];
  const examples = [{ title: 'Inter', type: 'Sans', size: 'Small' }, { title: 'Noto Sans', type: 'Sans', size: 'Large' }, { title: 'Lora', type: 'Serif', size: 'Large' }, { title: 'IBM Plex Mono', type: 'Mono', size: 'Small' }];
  const selectedTypes = selected.filter((value) => ['Sans', 'Serif', 'Mono'].includes(value));
  const selectedSizes = selected.filter((value) => ['Small', 'Large'].includes(value));
  const results = examples.filter((example) => (!selectedTypes.length || selectedTypes.includes(example.type)) && (!selectedSizes.length || selectedSizes.includes(example.size)));
  return <RecipeFrame style={style} locale={locale} title={zh ? '字体筛选' : 'Font filters'}>
    <fieldset><legend className={`mb-3 text-sm ${r.muted}`}>{zh ? '选择字体分类' : 'Choose type categories'}</legend>
      <div className={style === 'flat-design' || style === 'neobrutalism' ? 'grid gap-2' : 'space-y-2'}>
        {items.map((item) => <label key={item.id} className={`flex min-h-12 cursor-pointer items-center gap-3 p-3 ${selected.includes(item.id) ? r.active : r.item}`}>
          <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggle(item.id)} className="focus-visible:outline-2 focus-visible:outline-offset-2 h-5 w-5 accent-current focus-visible:outline-2 focus-visible:outline-offset-2" />{zh ? item.zh : item.en}
        </label>)}
      </div>
    </fieldset>
    <fieldset className="mt-4"><legend className={`mb-2 text-sm ${r.muted}`}>{zh ? '尺寸' : 'Size'}</legend>
      <div className="grid grid-cols-2 gap-2">{['Small', 'Large'].map((size, i) => <label key={size} className={`flex min-h-12 cursor-pointer items-center gap-2 p-3 ${selected.includes(size) ? r.active : r.item}`}>
        <input type="checkbox" checked={selected.includes(size)} onChange={() => toggle(size)} className="h-5 w-5 accent-current focus-visible:outline-2 focus-visible:outline-offset-2" />{zh ? ['小号', '大号'][i] : size}
      </label>)}</div>
    </fieldset>
    <button type="button" onClick={clear} className={`focus-visible:outline-2 focus-visible:outline-offset-2 mt-3 ${r.secondary}`}>{zh ? '清除全部' : 'Clear all'}</button>
    <div aria-live="polite" className={`mt-4 border-t pt-3 ${r.divider}`}>
      <p className={`text-sm ${r.muted}`}>{zh ? `${results.length} 条本地示例结果` : `${results.length} local sample results`}</p>
      <ul className="mt-2 space-y-1">{results.map((result) => <li key={result.title}>{result.title}</li>)}</ul>
      {!results.length && <p className="text-sm">{zh ? '没有匹配结果，请清除筛选后重试。' : 'No matches. Clear the filters to try again.'}</p>}
    </div>
  </RecipeFrame>;
}

const styleVariants: StyleVariantSet = [
  {
    style: 'swiss-style',
    name: {"zh":"瑞士风格","en":"Swiss Style"},
    note: {
      zh: '两栏网格配红色标记与发丝分割线，复选项排成无圆角的黑白表格，选中只靠纯黑填充。',
      en: 'A two-column grid with red ticks and hairline rules; checkboxes become square table cells and selection is pure black-and-white fill.',
    },
    Demo: Swiss,
  },
  {
    style: 'bauhaus',
    name: {"zh":"包豪斯","en":"Bauhaus"},
    note: {
      zh: '圆、方、三角作几何标记并以红黄蓝原色填充，粗黑边框把筛选组切成海报式色块。',
      en: 'Circle, square and triangle serve as marks filled in primary red, blue and yellow, thick black borders cutting groups into poster blocks.',
    },
    Demo: Bauhaus,
  },
  {
    style: 'neumorphism',
    name: {"zh":"新拟态","en":"Neumorphism"},
    note: {
      zh: '同一灰底上用双向柔和阴影把选项挤出或压入软陶质感，选中项变成内陷凹槽。',
      en: 'Dual soft shadows on one grey surface extrude or press each option like clay; the selected row becomes an inset groove.',
    },
    Demo: Neumorph,
  },
  recipeVariant('minimalism', (props) => <Expanded {...props} style="minimalism" />, { zh: "发丝线、黑白反转与留白；筛选项的材质与选择态一致，实际筛选本地字体示例并支持清除。", en: "Hairlines, monochrome inversion and whitespace; option materials and selected states stay consistent while filtering local font examples and clearing." }),
  recipeVariant('flat-design', (props) => <Expanded {...props} style="flat-design" />, { zh: "纯色块与清晰层级，不依赖阴影；筛选项的材质与选择态一致，实际筛选本地字体示例并支持清除。", en: "Solid blocks and clear hierarchy without shadows; option materials and selected states stay consistent while filtering local font examples and clearing." }),
  recipeVariant('neobrutalism', (props) => <Expanded {...props} style="neobrutalism" />, { zh: "粗黑描边、硬投影与高对比选中；筛选项的材质与选择态一致，实际筛选本地字体示例并支持清除。", en: "Heavy black outlines, hard shadows and bold selection; option materials and selected states stay consistent while filtering local font examples and clearing." }),
  recipeVariant('organic', (props) => <Expanded {...props} style="organic" />, { zh: "大地色与不规则圆角，柔和而清楚；筛选项的材质与选择态一致，实际筛选本地字体示例并支持清除。", en: "Earth tones and irregular corners, soft yet clear; option materials and selected states stay consistent while filtering local font examples and clearing." }),
  recipeVariant('glassmorphism', (props) => <Expanded {...props} style="glassmorphism" />, { zh: "深色背景上的磨砂透明层与高亮边缘；筛选项的材质与选择态一致，实际筛选本地字体示例并支持清除。", en: "Frosted layers and highlighted edges over a deep backdrop; option materials and selected states stay consistent while filtering local font examples and clearing." }),
];

export default styleVariants;
