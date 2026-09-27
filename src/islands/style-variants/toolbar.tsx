import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

const tools = [
  { id: 'bold', glyph: 'B', cls: 'font-extrabold' },
  { id: 'italic', glyph: 'I', cls: 'italic' },
  { id: 'under', glyph: 'U', cls: 'underline' },
  { id: 'strike', glyph: 'S', cls: 'line-through' },
];

function Flat({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const label: Record<string, string> = { bold: en ? 'Bold' : '加粗', italic: en ? 'Italic' : '斜体', under: en ? 'Underline' : '下划线', strike: en ? 'Strikethrough' : '删除线' };
  const [active, setActive] = useSessionState(session, 'active', 'bold');
  return (
    <div className="mx-auto flex w-full max-w-sm items-center gap-1 rounded-lg border border-line bg-raised p-2 text-ink">
      {tools.map((t) => (
        <button
          key={t.id}
          onClick={() => setActive(t.id)}
          aria-label={label[t.id]}
          className={`flex h-9 flex-1 items-center justify-center rounded-md text-sm ${t.cls} ${active === t.id ? 'bg-accent text-white' : 'bg-code-bg text-ink-2 hover:text-ink'}`}
        >
          {t.glyph}
        </button>
      ))}
      <span className="mx-1 h-6 w-px bg-line" />
      <button className="rounded-md bg-code-bg px-3 py-2 text-xs text-ink-2 hover:text-ink">{en ? 'More' : '更多'}</button>
    </div>
  );
}

function Deco({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [active, setActive] = useSessionState(session, 'active', 'home');
  const glyph: Record<string, string> = { home: '⌂', search: '⌕', star: '✦', user: '☖' };
  const label: Record<string, string> = { home: en ? 'Home' : '首页', search: en ? 'Search' : '搜索', star: en ? 'Star' : '收藏', user: en ? 'User' : '用户' };
  return (
    <div className="mx-auto w-full max-w-sm border-2 border-[#c9a227] bg-[#111014] p-4 text-[#e8d9a0]">
      <p className="text-center font-serif text-[10px] uppercase tracking-[0.45em] text-[#c9a227]">Atlas</p>
      <div className="mt-3 flex items-stretch divide-x divide-[#c9a227]/40 border-y border-[#c9a227]/40">
        {['home', 'search', 'star', 'user'].map((t) => (
          <button key={t} onClick={() => setActive(t)} aria-label={label[t]} className={`flex-1 py-3 text-lg transition-colors ${active === t ? 'bg-[#c9a227] text-[#111014]' : 'hover:text-white'}`}>{glyph[t]}</button>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-2 text-[10px] text-[#c9a227]"><span>◆</span><span>◆</span><span>◆</span></div>
    </div>
  );
}

function Bauhaus({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [active, setActive] = useSessionState(session, 'active', 'square');
  return (
    <div className="mx-auto w-full max-w-sm border-2 border-black bg-[#f4f1e8] p-5 text-black">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em]">Werkzeug</p>
      <div className="mt-4 flex items-center justify-between">
        <button onClick={() => setActive('square')} aria-label={en ? 'Square' : '方形'} className={`h-12 w-12 border-2 border-black ${active === 'square' ? 'bg-[#e2231a]' : 'bg-[#e2231a]/25'}`} />
        <button onClick={() => setActive('circle')} aria-label={en ? 'Circle' : '圆形'} className={`h-12 w-12 rounded-full border-2 border-black ${active === 'circle' ? 'bg-[#1257a6]' : 'bg-[#1257a6]/25'}`} />
        <button onClick={() => setActive('triangle')} aria-label={en ? 'Triangle' : '三角形'} className="h-12 w-12" style={{ clipPath: 'polygon(50% 0, 0 100%, 100% 100%)', background: active === 'triangle' ? '#f5c400' : '#f5c40055' }} />
        <button onClick={() => setActive('bar')} aria-label={en ? 'Bar' : '长条'} className={`h-12 w-12 border-2 border-black ${active === 'bar' ? 'bg-black' : 'bg-black/20'}`} />
      </div>
      <p className="mt-4 text-[11px] leading-relaxed text-black/60">{en ? 'Form follows function: the selected tool is a filled primary shape.' : '形式追随功能：选中的工具是填充主色的几何形体。'}</p>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'flat-design',
    name: { zh: '扁平化设计', en: 'Flat Design' },
    note: {
      zh: '工具栏全是纯色块，没有任何阴影或渐变，选中态只靠一块实心强调色区分。',
      en: 'A toolbar of pure colour blocks with no shadow or gradient; selection is signalled only by a solid accent fill.',
    },
    Demo: Flat,
  },
  {
    style: 'art-deco',
    name: { zh: '装饰艺术', en: 'Art Deco' },
    note: {
      zh: '黑金对称构图：居中标徽、金色细分隔线、对称图标列与底部菱形装饰，奢华而克制。',
      en: 'A symmetric black-and-gold composition — centred wordmark, gold rules, a mirrored icon row and diamond ornament.',
    },
    Demo: Deco,
  },
  {
    style: 'bauhaus',
    name: { zh: '包豪斯', en: 'Bauhaus' },
    note: {
      zh: '工具就是几何形体：正方、圆、三角、长条各占红黄蓝主色，选中即填充纯色。',
      en: 'Tools are geometric forms — square, circle, triangle and bar in primary red/blue/yellow, filled solid when active.',
    },
    Demo: Bauhaus,
  },
];

export default styleVariants;
