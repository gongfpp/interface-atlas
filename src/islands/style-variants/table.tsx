import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSortable } from './behavior';

function EditorialTable({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const rows = [
    { city: zh ? '布局' : 'Layout', pop: 12 },
    { city: zh ? '字体' : 'Typography', pop: 8 },
    { city: zh ? '色彩' : 'Colour', pop: 6 },
  ];
  const { asc, sorted, toggle, headerProps } = useSortable(session, rows, (r) => r.pop, 'asc', false);
  return (
    <div className="mx-auto w-full max-w-md border-t-2 border-ink bg-raised p-5 text-ink">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">{zh ? '组件清单' : 'Component inventory'}</p>
      <table className="mt-3 w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-ink">
            <th scope="col" className="py-2 font-serif text-sm font-normal italic">{zh ? '类别' : 'Category'}</th>
            <th scope="col" {...headerProps} className="py-2 text-right font-serif text-sm font-normal italic">
              <button type="button" onClick={toggle} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none underline-offset-2 hover:underline">
                {zh ? '数量' : 'Count'} {asc ? '↑' : '↓'}
              </button>
            </th>
          </tr>
        </thead>
        <tbody className="font-serif">
          {sorted.map((r) => (
            <tr key={r.city} className="border-b border-line">
              <td className="py-2 text-sm">{r.city}</td>
              <td className="py-2 text-right text-sm tabular-nums">{r.pop}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-[11px] text-ink-3">{zh ? '衬线表头、细线分隔，点击数量排序。' : 'Serif headers, rule-separated rows, click count to sort.'}</p>
    </div>
  );
}

function SwissTable({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const rows = [
    { city: zh ? '布局' : 'Layout', units: 12 },
    { city: zh ? '字体' : 'Typography', units: 8 },
    { city: zh ? '色彩' : 'Colour', units: 6 },
  ];
  const { asc, sorted, toggle, headerProps } = useSortable(session, rows, (r) => r.units, 'asc', false);
  return (
    <div className="mx-auto w-full max-w-md bg-white p-4 text-black" style={{ border: '1px solid #000' }}>
      <div className="flex items-center justify-between border-b-2 border-[#e60012] pb-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{zh ? '统计' : 'Statistics'}</span>
        <span className="font-mono text-[10px]">2026</span>
      </div>
      <table className="mt-2 w-full border-collapse">
        <thead>
          <tr className="text-left text-[10px] font-bold uppercase tracking-widest">
            <th scope="col" className="py-2">{zh ? '类别' : 'Category'}</th>
            <th scope="col" {...headerProps} className="py-2 text-right">
              <button type="button" onClick={toggle} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none uppercase tracking-widest">
                {zh ? '数量' : 'Units'} {asc ? '↑' : '↓'}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.city} className="border-t border-black/20">
              <td className="py-2 text-sm font-medium">{r.city}</td>
              <td className="py-2 text-right font-mono text-sm tabular-nums">{r.units}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HandDrawnTable({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const rows = [{ item: zh ? '布局' : 'Layout', qty: 12 }, { item: zh ? '字体' : 'Typography', qty: 8 }, { item: zh ? '色彩' : 'Colour', qty: 6 }];
  const { asc, sorted, toggle, headerProps } = useSortable(session, rows, row => row.qty, 'asc', false);
  return (
    <div
      className="mx-auto w-full max-w-md bg-[#fdfaf0] p-5 text-[#2f2a20]"
      style={{ border: '2px dashed #4a4234', borderRadius: '12px 6px 14px 8px' }}
    >
      <p className="font-serif text-lg" style={{ textDecoration: 'underline wavy #b4441f' }}>
        {zh ? '组件清单' : 'Component inventory'}
      </p>
      <table className="mt-3 w-full border-collapse">
        <thead><tr><th scope="col" className="text-left text-xs">{zh ? '类别' : 'Category'}</th><th scope="col" {...headerProps} className="text-right"><button type="button" onClick={toggle} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none min-h-11 border-b-2 border-dashed border-current px-2 text-xs">{zh ? '数量' : 'Count'} {asc ? '↑' : '↓'}</button></th></tr></thead>
        <tbody>
          {sorted.map(({item, qty}, i) => (
            <tr key={item} className={i % 2 ? 'rotate-[-0.4deg]' : 'rotate-[0.3deg]'}>
              <td className="py-2 text-sm">
                <span className="inline-block border-b border-[#4a4234]/60 px-1">{item}</span>
              </td>
              <td className="py-2 text-right font-serif text-sm">{qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-[11px] italic text-[#4a4234]/70">{zh ? '手绘线条、轻微倾斜的行与手写衬线体。' : 'Rough inked rules, tilted rows, handwritten serif.'}</p>
    </div>
  );
}


function AdaptedTable({ style, session, locale }: VariantDemoProps & { style: RecipeStyleId }) {
  const en = locale === 'en';
  const r = recipe(style);
  const rows = [{ id: 'layout', name: en ? 'Layout' : '布局', count: 12 }, { id: 'type', name: en ? 'Typography' : '字体', count: 8 }, { id: 'colour', name: en ? 'Colour' : '色彩', count: 6 }];
  const { asc, sorted, toggle, headerProps } = useSortable(session, rows, row => row.count, 'asc', false);
  return <RecipeFrame style={style} locale={locale} title={en ? 'Component inventory' : '组件清单'}>
    <div className={`overflow-x-auto ${r.item}`}><table className="w-full border-collapse text-left text-sm"><caption className={`p-3 text-left text-xs ${r.muted}`}>{en ? 'Sample inventory · sort by count' : '示例清单 · 可按数量排序'}</caption><thead className={r.active}><tr><th scope="col" className="p-3">{en ? 'Category' : '类别'}</th><th scope="col" {...headerProps} className="p-2 text-right"><button type="button" onClick={toggle} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none px-2 text-xs ${r.control}`}>{en ? 'Count' : '数量'} <span aria-hidden="true">{asc ? '↑' : '↓'}</span><span className="sr-only">{asc ? (en ? ', ascending; activate to sort descending' : '，升序；点击切换降序') : (en ? ', descending; activate to sort ascending' : '，降序；点击切换升序')}</span></button></th></tr></thead>
    <tbody>{sorted.map(row => <tr key={row.id} className={`border-b ${r.divider}`}><th scope="row" className={`p-3 text-left font-normal ${r.body}`}>{row.name}</th><td className="p-3 text-right font-mono tabular-nums">{row.count}</td></tr>)}</tbody></table></div>
    <p role="status" className={`mt-3 text-xs ${r.muted}`}>{asc ? (en ? 'Smallest count first' : '数量从少到多') : (en ? 'Largest count first' : '数量从多到少')}</p>
  </RecipeFrame>;
}

function localDemo(Demo: StyleVariantSet[number]['Demo']) {
  return function LocalDemo(props: VariantDemoProps) {
    return <><Demo {...props} /><p className="mx-auto mt-4 w-full max-w-md text-xs leading-relaxed text-ink-2">{props.locale === 'en' ? 'Local interaction demo. Nothing is sent or saved outside this page.' : '本地交互演示，不会向外发送或保存数据。'}</p></>;
  };
}

const adaptedNotes = {
  "minimalism": {
    "zh": "白底细边、宽松留白和黑白反转状态，移除多余装饰。真实数值排序改变表格行顺序，排序方向同时写入表头语义。",
    "en": "White space, fine borders and monochrome inversion remove unnecessary decoration. Numeric sorting changes row order and exposes the direction in the column-header semantics."
  },
  "flat-design": {
    "zh": "蓝色实心面、简洁圆角与无投影的层级，让选中项清晰可辨。真实数值排序改变表格行顺序，排序方向同时写入表头语义。",
    "en": "Solid blue surfaces, simple corners and shadow-free hierarchy make selection explicit. Numeric sorting changes row order and exposes the direction in the column-header semantics."
  },
  "neobrutalism": {
    "zh": "黄色底、3px 黑描边、粉色选中块与硬偏移投影，让控件像实体拼贴。真实数值排序改变表格行顺序，排序方向同时写入表头语义。",
    "en": "Yellow ground, 3px black outlines, pink selections and hard offset shadows make tactile collage-like controls. Numeric sorting changes row order and exposes the direction in the column-header semantics."
  },
  "art-deco": {
    "zh": "深炭底上用对称金色双线、菱形书眉和大字距衬线标题构成秩序。真实数值排序改变表格行顺序，排序方向同时写入表头语义。",
    "en": "Symmetric gold double rules, a diamond masthead and tracked serif titles structure a charcoal surface. Numeric sorting changes row order and exposes the direction in the column-header semantics."
  },
  "organic": {
    "zh": "奶油与苔绿表面配不对称大圆角，选中态以深绿色柔软块面出现。真实数值排序改变表格行顺序，排序方向同时写入表头语义。",
    "en": "Cream and moss surfaces use asymmetric rounded contours, with a deep-green soft selected shape. Numeric sorting changes row order and exposes the direction in the column-header semantics."
  }
};

const styleVariants: StyleVariantSet = [
  {
    style: 'editorial',
    name: {"zh":"杂志编辑风","en":"Editorial"},
    note: {
      zh: '表头用斜体衬线、行间只用发丝规则线分隔，整张表像杂志的数据栏。',
      en: 'Italic serif headers and hairline row rules make the table read like a magazine data column.',
    },
    Demo: localDemo(EditorialTable),
  },
  {
    style: 'swiss-style',
    name: {"zh":"瑞士风格","en":"Swiss Style"},
    note: {
      zh: '黑框内用红色粗线压顶，标题全大写紧字距，数字用等宽体右对齐。',
      en: 'Inside a black frame a bold red rule caps the header, with all-caps tight tracking and monospace right-aligned figures.',
    },
    Demo: localDemo(SwissTable),
  },
  {
    style: 'hand-drawn',
    name: {"zh":"手绘涂鸦","en":"Hand-drawn UI"},
    note: {
      zh: '虚线手绘边框配波浪下划线，每一行略微倾斜，像随手记的清单。',
      en: 'A dashed sketch border and wavy underline, with every row tilted slightly like a scrawled list.',
    },
    Demo: localDemo(HandDrawnTable),
  },
  ...(['minimalism', 'flat-design', 'neobrutalism', 'art-deco', 'organic'] as const).map(style => recipeVariant(style, (props: VariantDemoProps) => <AdaptedTable {...props} style={style} />, adaptedNotes[style])),
];

export default styleVariants;
