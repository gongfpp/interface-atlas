import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';


/** 稳定会话值与双语展示分离；中文名称、英文正式名称和原始 ID 都能检索。 */
const STYLE_LABELS: Record<string, { zh: string; en: string }> = {
  Aurora: { zh: '极光渐变', en: 'Aurora Gradient' },
  Bauhaus: { zh: '包豪斯', en: 'Bauhaus' },
  Cyberpunk: { zh: '赛博朋克', en: 'Cyberpunk' },
  Organic: { zh: '有机自然', en: 'Organic' },
  Vaporwave: { zh: '蒸汽波', en: 'Vaporwave' },
};
const STYLE_VALUES = Object.keys(STYLE_LABELS);
const styleLabel = (value: string, locale: VariantDemoProps['locale']) => STYLE_LABELS[value]?.[locale] ?? value;
const matchesStyle = (value: string, query: string) =>
  [value, ...Object.values(STYLE_LABELS[value] ?? {})].some((label) => label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));

function Corporate({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const all = STYLE_VALUES;
  const [q, setQ] = useSessionState(session, 'comboQuery', '');
  const [val, setVal] = useSessionState(session, 'value', '');
  const list = all.filter((x) => matchesStyle(x, q));
  return (
    <div className="mx-auto w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 text-slate-800 shadow-sm">
      <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        <span className="h-2 w-2 rotate-45 bg-indigo-400" />
        {zh ? '风格' : 'Style'}
      </p>
      <input
        aria-label={zh ? '搜索风格' : 'Search styles'}
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
        }}
        placeholder={zh ? '搜索风格…' : 'Search styles…'}
        className="focus-visible:outline-2 focus-visible:outline-offset-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
      />
      <ul className="mt-2 overflow-hidden rounded-lg border border-slate-200">
        {list.map((x) => (
          <li key={x}>
            <button type="button"
              aria-pressed={val === x}
              onClick={() => {
                setVal(x);
                setQ('');
              }}
              className={`focus-visible:outline-2 focus-visible:outline-offset-2 flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-indigo-50 ${val === x ? 'bg-indigo-50 font-medium text-indigo-700' : ''}`}
            >
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              {styleLabel(x, locale)}
            </button>
          </li>
        ))}
        {!list.length && <li className="px-3 py-2 text-xs text-slate-400">{zh ? '无匹配' : 'No match'}</li>}
      </ul>
      <p role="status" className="mt-3 text-xs">{zh ? '已选：' : 'Selected: '}{styleLabel(val, locale) || (zh ? '尚未选择' : 'None')}</p>
      <button type="button" onClick={() => { setQ(''); setVal(''); }} className="mt-2 min-h-11 border border-current px-3 text-xs focus-visible:outline-2 focus-visible:outline-offset-2">{zh ? '清空搜索与选择' : 'Clear search and choice'}</button>
      <p className="mt-2 text-xs">{zh ? '本地交互演示，不提交选择。' : 'Local interaction demo. No selection is submitted.'}</p>
    </div>
  );
}

function Cyber({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const all = STYLE_VALUES;
  const [q, setQ] = useSessionState(session, 'comboQuery', '');
  const [val, setVal] = useSessionState(session, 'value', '');
  const list = all.filter((x) => matchesStyle(x, q));
  return (
    <div className="mx-auto w-full max-w-sm border border-cyan-400 bg-[#05060f] p-4 font-mono text-cyan-300 shadow-[0_0_20px_#00e5ff44]">
      <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-fuchsia-400">&gt; TARGET_ID</p>
      <input
        aria-label={zh ? '搜索风格' : 'Search styles'}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={zh ? '扫描…' : 'scan…'}
        className="focus-visible:outline-2 focus-visible:outline-offset-2 w-full border border-cyan-500/60 bg-black/60 px-3 py-2 text-sm text-cyan-200 caret-fuchsia-400 outline-none focus:border-fuchsia-400"
      />
      <ul className="mt-2 space-y-1">
        {list.map((x) => (
          <li key={x}>
            <button type="button" aria-pressed={val === x} onClick={() => { setVal(x); setQ(''); }} className={`min-h-11 w-full border-l-2 px-2 py-1.5 text-left text-xs focus-visible:outline-2 focus-visible:outline-offset-2 ${val === x ? 'border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-200' : 'border-cyan-500/40 bg-cyan-500/5 hover:border-fuchsia-400'}`}>{styleLabel(x, locale)}</button>
          </li>
        ))}
        {!list.length && <li className="px-2 py-1.5 text-xs text-fuchsia-500">{zh ? '// 无信号' : '// no signal'}</li>}
      </ul>
      <p role="status" className="mt-3 text-xs">{zh ? '已选：' : 'Selected: '}{styleLabel(val, locale) || (zh ? '尚未选择' : 'None')}</p>
      <button type="button" onClick={() => { setQ(''); setVal(''); }} className="mt-2 min-h-11 border border-current px-3 text-xs focus-visible:outline-2 focus-visible:outline-offset-2">{zh ? '清空搜索与选择' : 'Clear search and choice'}</button>
      <p className="mt-2 text-xs">{zh ? '本地交互演示，不提交选择。' : 'Local interaction demo. No selection is submitted.'}</p>
    </div>
  );
}

function Bento({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const all = [
    { n: 'Aurora', c: 'bg-violet-100 text-violet-900' },
    { n: 'Bauhaus', c: 'bg-amber-100 text-amber-900' },
    { n: 'Organic', c: 'bg-emerald-100 text-emerald-900' },
    { n: 'Cyberpunk', c: 'bg-sky-100 text-sky-900' },
    { n: 'Vaporwave', c: 'bg-pink-100 text-pink-900' },
  ];
  const [q, setQ] = useSessionState(session, 'comboQuery', '');
  const [val, setVal] = useSessionState(session, 'value', '');
  const list = all.filter((x) => matchesStyle(x.n, q));
  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl bg-neutral-100 p-3 text-neutral-900">
      <div className="mb-3 rounded-xl bg-white p-3 shadow-sm">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400">{zh ? '选择一个风格' : 'Pick a style'}</p>
        <input
          aria-label={zh ? '搜索风格' : 'Search styles'}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
          }}
          placeholder={zh ? '筛选…' : 'Filter…'}
          className="focus-visible:outline-2 focus-visible:outline-offset-2 w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-sm outline-none focus:border-neutral-400"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {list.map((x) => (
          <button type="button"
            key={x.n}
            aria-pressed={val === x.n}
            onClick={() => {
              setVal(x.n);
              setQ('');
            }}
            className={`focus-visible:outline-2 focus-visible:outline-offset-2 rounded-xl p-3 text-left text-sm font-medium motion-safe:transition-transform motion-safe:hover:-translate-y-0.5 ${x.c} ${val === x.n ? 'ring-2 ring-neutral-900' : ''}`}
          >
            {styleLabel(x.n, locale)}
          </button>
        ))}
        {!list.length && <p className="col-span-2 rounded-xl bg-white p-3 text-xs text-neutral-400">{zh ? '无匹配模块' : 'No modules match'}</p>}
      </div>
      <p role="status" className="mt-3 text-xs">{zh ? '已选：' : 'Selected: '}{styleLabel(val, locale) || (zh ? '尚未选择' : 'None')}</p>
      <button type="button" onClick={() => { setQ(''); setVal(''); }} className="mt-2 min-h-11 border border-current px-3 text-xs focus-visible:outline-2 focus-visible:outline-offset-2">{zh ? '清空搜索与选择' : 'Clear search and choice'}</button>
      <p className="mt-2 text-xs">{zh ? '本地交互演示，不提交选择。' : 'Local interaction demo. No selection is submitted.'}</p>
    </div>
  );
}


/** 搜索框和原生候选选择器组成可键盘操作的组合，不伪造 listbox 焦点模型。 */
function Expanded({ session, locale, style }: VariantDemoProps & { style: RecipeStyleId }) {
  const zh = locale === 'zh';
  const r = recipe(style);
  const [value, setValue] = useSessionState(session, 'value', '');
  const [query, setQuery] = useSessionState(session, 'comboQuery', '');
  const choices = STYLE_VALUES;
  const filtered = choices.filter((choice) => matchesStyle(choice, query));
  return <RecipeFrame style={style} locale={locale} title={zh ? '搜索并选择风格' : 'Search and choose a style'}>
    <label className="block text-sm">{zh ? '筛选候选项' : 'Filter options'}
      <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} className={`focus-visible:outline-2 focus-visible:outline-offset-2 mt-2 w-full ${r.field}`} placeholder={zh ? '输入风格名称' : 'Enter a style name'} />
    </label>
    <label className="mt-4 block text-sm">{zh ? '匹配的风格' : 'Matching styles'}
      <select value={value} onChange={(event) => setValue(event.target.value)} className={`focus-visible:outline-2 focus-visible:outline-offset-2 mt-2 w-full ${r.field}`}>
        <option value="">{zh ? '请选择' : 'Choose a style'}</option>
        {value && !filtered.includes(value) && <option value={value}>{styleLabel(value, locale)} · {zh ? '当前选择' : 'current choice'}</option>}
        {filtered.map((choice) => <option key={choice} value={choice}>{styleLabel(choice, locale)}</option>)}
      </select>
    </label>
    <div className={`mt-3 p-3 ${r.item}`} role="status">
      <p>{filtered.length ? (zh ? `${filtered.length} 个匹配` : `${filtered.length} matches`) : (zh ? '没有匹配的风格，请调整搜索。' : 'No matching styles. Try another search.')}</p>
      <p className={`mt-1 text-sm ${r.muted}`}>{zh ? '已选：' : 'Selected: '}{styleLabel(value, locale) || (zh ? '尚未选择' : 'None')}</p>
    </div>
    <button type="button" onClick={() => { setQuery(''); setValue(''); }} className={`focus-visible:outline-2 focus-visible:outline-offset-2 mt-3 ${r.secondary}`}>{zh ? '清空搜索与选择' : 'Clear search and choice'}</button>
  </RecipeFrame>;
}

const styleVariants: StyleVariantSet = [
  {
    style: 'corporate-memphis',
    name: {"zh":"企业孟菲斯","en":"Corporate Memphis"},
    note: {
      zh: '克制的圆点与菱形点缀配柔和靛蓝选中，候选列表是整洁可信的企业风卡片。',
      en: 'Restrained dot and diamond accents with a soft indigo selection keep the suggestion list clean and corporate.',
    },
    Demo: Corporate,
  },
  {
    style: 'cyberpunk',
    name: {"zh":"赛博朋克","en":"Cyberpunk"},
    note: {
      zh: '近黑底霓虹青与品红等宽字体，候选项是带左缘光的终端输出行。',
      en: 'Neon cyan and magenta monospace on near-black; each suggestion is a terminal row with a glowing left edge.',
    },
    Demo: Cyber,
  },
  {
    style: 'bento-grid',
    name: {"zh":"便当盒网格","en":"Bento Grid"},
    note: {
      zh: '输入框与候选拆成圆角小模块排进网格，选中项用一圈深色描边标出。',
      en: 'Input and options break into tidy rounded modules laid out in a grid, with the choice marked by a dark ring.',
    },
    Demo: Bento,
  },
  recipeVariant('minimalism', (props) => <Expanded {...props} style="minimalism" />, { zh: "发丝线、黑白反转与留白；搜索字段与候选选择器共用视觉语法，筛选、空结果和清空均可操作。", en: "Hairlines, monochrome inversion and whitespace; search and choice fields share a visual grammar, with working filtering, empty results and reset." }),
  recipeVariant('flat-design', (props) => <Expanded {...props} style="flat-design" />, { zh: "纯色块与清晰层级，不依赖阴影；搜索字段与候选选择器共用视觉语法，筛选、空结果和清空均可操作。", en: "Solid blocks and clear hierarchy without shadows; search and choice fields share a visual grammar, with working filtering, empty results and reset." }),
  recipeVariant('swiss-style', (props) => <Expanded {...props} style="swiss-style" />, { zh: "编号网格、直角边界与红色强调；搜索字段与候选选择器共用视觉语法，筛选、空结果和清空均可操作。", en: "An indexed grid, square edges and a red accent; search and choice fields share a visual grammar, with working filtering, empty results and reset." }),
  recipeVariant('neobrutalism', (props) => <Expanded {...props} style="neobrutalism" />, { zh: "粗黑描边、硬投影与高对比选中；搜索字段与候选选择器共用视觉语法，筛选、空结果和清空均可操作。", en: "Heavy black outlines, hard shadows and bold selection; search and choice fields share a visual grammar, with working filtering, empty results and reset." }),
  recipeVariant('neumorphism', (props) => <Expanded {...props} style="neumorphism" />, { zh: "同色曲面、双向阴影与实体边界；搜索字段与候选选择器共用视觉语法，筛选、空结果和清空均可操作。", en: "Shared soft surfaces, paired shadows and explicit borders; search and choice fields share a visual grammar, with working filtering, empty results and reset." }),
];

export default styleVariants;
