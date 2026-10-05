import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function Neumorph({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [page, setPage] = useSessionState(session, 'page', 3);
  const raised = 'shadow-[5px_5px_10px_#c3c4cb,-5px_-5px_10px_#ffffff]';
  const pressed = 'shadow-[inset_5px_5px_10px_#c3c4cb,inset_-5px_-5px_10px_#ffffff]';
  return (
    <div className="mx-auto w-full max-w-sm bg-[#e6e7ee] p-5">
      <nav aria-label={zh ? '分页导航' : 'Pagination'} className="flex flex-wrap items-center justify-center gap-1">
        <button type="button" aria-label={zh ? '上一页' : 'Previous page'} disabled={page === 1} onClick={() => setPage(Math.max(1, page - 1))} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none flex h-10 w-10 items-center justify-center rounded-2xl text-sm text-[#6b6f80] ${raised}`}>‹</button>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" aria-current={page === n ? 'page' : undefined} aria-label={zh ? `第 ${n} 页` : `Page ${n}`} onClick={() => setPage(n)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold ${page === n ? `text-[#5b5f70] ${pressed}` : 'text-[#8a8e9e] ' + raised}`}>{n}</button>
        ))}
      </nav>
      <p role="status" className="mt-4 text-center text-xs">{zh ? `第 ${page} / 5 页 · 条目 ${(page - 1) * 3 + 1}–${page * 3}` : `Page ${page} of 5 · Entries ${(page - 1) * 3 + 1}–${page * 3}`}</p>
    </div>
  );
}

function Vapor({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [page, setPage] = useSessionState(session, 'page', 3);
  return (
    <div className="mx-auto w-full max-w-sm bg-gradient-to-b from-[#2b1055] to-[#7597de] p-5 text-center">
      <div className="flex items-center justify-center gap-1 font-mono text-sm">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" aria-current={page === n ? 'page' : undefined} aria-label={zh ? `第 ${n} 页` : `Page ${n}`} onClick={() => setPage(n)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none h-9 w-9 ${page === n ? 'bg-[#ff71ce] text-[#2b1055] shadow-[0_0_18px_#ff71ce]' : 'border border-[#01cdfe]/60 text-[#01cdfe] hover:bg-[#01cdfe]/10'}`}>{n}</button>
        ))}
      </div>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[#b967ff]">{zh ? `第 ${page} / 5 页` : `Page ${page} / 5`}</p>
      <p role="status" className="mt-4 text-center text-xs">{zh ? `第 ${page} / 5 页 · 条目 ${(page - 1) * 3 + 1}–${page * 3}` : `Page ${page} of 5 · Entries ${(page - 1) * 3 + 1}–${page * 3}`}</p>
    </div>
  );
}

function Swiss({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [page, setPage] = useSessionState(session, 'page', 3);
  return (
    <div className="mx-auto w-full max-w-sm bg-white py-3 text-black" style={{ borderTop: '3px solid #111', borderBottom: '3px solid #111' }}>
      <div className="flex items-stretch justify-center divide-x divide-black/15 font-mono text-sm">
        <button type="button" aria-label={zh ? '上一页' : 'Previous page'} disabled={page === 1} onClick={() => setPage(Math.max(1, page - 1))} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none px-3 py-1 text-black/50 hover:text-[#d0021b]">←</button>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" aria-current={page === n ? 'page' : undefined} aria-label={zh ? `第 ${n} 页` : `Page ${n}`} onClick={() => setPage(n)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none px-3 py-1 ${page === n ? 'bg-[#d0021b] font-bold text-white' : 'hover:bg-black/5'}`}>{n}</button>
        ))}
        <button type="button" aria-label={zh ? '下一页' : 'Next page'} disabled={page === 5} onClick={() => setPage(Math.min(5, page + 1))} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none px-3 py-1 text-black/50 hover:text-[#d0021b]">→</button>
      </div>
      <p role="status" className="mt-4 text-center text-xs">{zh ? `第 ${page} / 5 页 · 条目 ${(page - 1) * 3 + 1}–${page * 3}` : `Page ${page} of 5 · Entries ${(page - 1) * 3 + 1}–${page * 3}`}</p>
    </div>
  );
}


function AdaptedPagination({ style, session, locale }: VariantDemoProps & { style: RecipeStyleId }) {
  const en = locale === 'en';
  const r = recipe(style);
  const [page, setPage] = useSessionState(session, 'page', 3);
  return <RecipeFrame style={style} locale={locale} title={en ? 'Archive pages' : '档案分页'}>
    <ol start={(page - 1) * 3 + 1} className="space-y-2">{[0, 1, 2].map(i => <li key={i} className={`flex items-center gap-3 p-3 text-sm ${r.item}`}><span className={`font-mono ${r.muted}`}>{String((page - 1) * 3 + i + 1).padStart(2, '0')}</span>{en ? 'Design study' : '设计研究'}</li>)}</ol>
    <nav aria-label={en ? 'Pagination' : '分页导航'} className="mt-4 flex flex-wrap items-center justify-center gap-1">
      <button type="button" disabled={page === 1} aria-label={en ? 'Previous page' : '上一页'} onClick={() => setPage(page - 1)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none min-w-9 disabled:opacity-40 ${r.secondary}`}>←</button>
      {[1,2,3,4,5].map(n => <button key={n} type="button" aria-label={en ? `Page ${n}` : `第 ${n} 页`} aria-current={page === n ? 'page' : undefined} onClick={() => setPage(n)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none min-w-9 px-2 ${page === n ? r.active : r.control}`}>{n}</button>)}
      <button type="button" disabled={page === 5} aria-label={en ? 'Next page' : '下一页'} onClick={() => setPage(page + 1)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none min-w-9 disabled:opacity-40 ${r.secondary}`}>→</button>
    </nav><p role="status" className={`mt-3 text-center text-xs ${r.muted}`}>{en ? `Page ${page} of 5 · 15 entries` : `第 ${page} / 5 页 · 共 15 条`}</p>
  </RecipeFrame>;
}

function localDemo(Demo: StyleVariantSet[number]['Demo']) {
  return function LocalDemo(props: VariantDemoProps) {
    return <><Demo {...props} /><p className="mx-auto mt-4 w-full max-w-md text-xs leading-relaxed text-ink-2">{props.locale === 'en' ? 'Local interaction demo. Nothing is sent or saved outside this page.' : '本地交互演示，不会向外发送或保存数据。'}</p></>;
  };
}

const adaptedNotes = {
  "minimalism": {
    "zh": "白底细边、宽松留白和黑白反转状态，移除多余装饰。页码控制真实示例条目范围，首末页禁用越界操作。",
    "en": "White space, fine borders and monochrome inversion remove unnecessary decoration. Page controls change the displayed sample entry range, disabling boundary navigation at the first and last pages."
  },
  "flat-design": {
    "zh": "蓝色实心面、简洁圆角与无投影的层级，让选中项清晰可辨。页码控制真实示例条目范围，首末页禁用越界操作。",
    "en": "Solid blue surfaces, simple corners and shadow-free hierarchy make selection explicit. Page controls change the displayed sample entry range, disabling boundary navigation at the first and last pages."
  },
  "neobrutalism": {
    "zh": "黄色底、3px 黑描边、粉色选中块与硬偏移投影，让控件像实体拼贴。页码控制真实示例条目范围，首末页禁用越界操作。",
    "en": "Yellow ground, 3px black outlines, pink selections and hard offset shadows make tactile collage-like controls. Page controls change the displayed sample entry range, disabling boundary navigation at the first and last pages."
  },
  "editorial": {
    "zh": "纸色表面、衬线斜体标题、书眉和细分隔线建立杂志式阅读层级。页码控制真实示例条目范围，首末页禁用越界操作。",
    "en": "Paper surfaces, italic serif headings, a journal masthead and fine rules create editorial hierarchy. Page controls change the displayed sample entry range, disabling boundary navigation at the first and last pages."
  },
  "art-deco": {
    "zh": "深炭底上用对称金色双线、菱形书眉和大字距衬线标题构成秩序。页码控制真实示例条目范围，首末页禁用越界操作。",
    "en": "Symmetric gold double rules, a diamond masthead and tracked serif titles structure a charcoal surface. Page controls change the displayed sample entry range, disabling boundary navigation at the first and last pages."
  }
};

const styleVariants: StyleVariantSet = [
  {
    style: 'neumorphism',
    name: {"zh":"新拟态","en":"Neumorphism"},
    note: {
      zh: '同色底上靠双向柔光投影把页码“挤”出来，当前页则向内凹陷。',
      en: 'Pages are extruded from a same-colour surface by dual soft shadows; the current page is pressed inward.',
    },
    Demo: localDemo(Neumorph),
  },
  {
    style: 'vaporwave',
    name: {"zh":"蒸汽波","en":"Vaporwave"},
    note: {
      zh: '紫蓝渐变底上等宽页码，选中页是发着粉色辉光的方块。',
      en: 'Monospaced page numbers on a purple-blue gradient, the active page a square glowing pink.',
    },
    Demo: localDemo(Vapor),
  },
  {
    style: 'swiss-style',
    name: {"zh":"瑞士风格","en":"Swiss Style"},
    note: {
      zh: '上下粗规则线夹住等分方格，当前页是唯一的红色实心块。',
      en: 'Equal grid cells between heavy double rules, with the current page as the single red solid block.',
    },
    Demo: localDemo(Swiss),
  },
  ...(['minimalism', 'flat-design', 'neobrutalism', 'editorial', 'art-deco'] as const).map(style => recipeVariant(style, (props: VariantDemoProps) => <AdaptedPagination {...props} style={style} />, adaptedNotes[style])),
];

export default styleVariants;
