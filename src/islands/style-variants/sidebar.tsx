import { useState } from 'react';
import type { StyleVariantSet } from './types';

function Deco() {
  const [active, setActive] = useState('Overview');
  const items = ['Overview', 'Collection', 'Archive'];
  return (
    <div className="mx-auto w-full max-w-sm bg-[#12100c] p-5 text-[#e8d8a8]" style={{ border: '1px solid #8a6d2f' }}>
      <p className="mb-4 border-b border-[#8a6d2f]/60 pb-3 text-center font-serif text-sm uppercase tracking-[0.35em]">Atlas</p>
      <nav className="space-y-1 font-serif text-sm">
        {items.map((it) => (
          <button key={it} type="button" onClick={() => setActive(it)} className={`flex w-full items-center gap-3 px-2 py-2 text-left tracking-wide ${active === it ? 'bg-[#8a6d2f]/25 text-[#f4e6b8]' : 'text-[#c9b276] hover:text-[#f4e6b8]'}`}>
            <span className="text-[10px] text-[#c9a227]">◆</span>{it}
          </button>
        ))}
      </nav>
    </div>
  );
}

function Bento() {
  const [active, setActive] = useState('Inbox');
  const items = ['Inbox', 'Today', 'Projects', 'Archive', 'Settings'];
  const dots = ['bg-accent', 'bg-ink-2', 'bg-ink-3', 'bg-accent-soft', 'bg-line-strong'];
  return (
    <div className="mx-auto w-full max-w-sm bg-paper p-4">
      <div className="grid grid-cols-2 gap-3">
        {items.map((it, i) => (
          <button key={it} type="button" onClick={() => setActive(it)} className={`rounded-2xl border p-4 text-left transition-colors ${i === 0 ? 'col-span-2' : ''} ${active === it ? 'border-line-strong bg-raised' : 'border-line bg-code-bg hover:bg-raised'}`}>
            <span className={`block h-5 w-5 rounded-md ${dots[i]}`} />
            <span className="mt-2 block text-xs font-medium text-ink">{it}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Editorial() {
  const [active, setActive] = useState(1);
  const items = ['The New Order', 'On Craft', 'Field Notes', 'Archive'];
  return (
    <div className="mx-auto w-full max-w-sm border-t-4 border-ink bg-paper px-5 py-4">
      <p className="mb-3 font-serif text-[11px] uppercase tracking-[0.3em] text-accent">Contents</p>
      <nav className="divide-y divide-line">
        {items.map((it, i) => (
          <button key={it} type="button" onClick={() => setActive(i)} className="flex w-full items-baseline gap-3 py-3 text-left">
            <span className="font-mono text-[11px] text-ink-3">{String(i + 1).padStart(2, '0')}</span>
            <span className={`font-serif text-sm ${active === i ? 'font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4' : 'text-ink-2'}`}>{it}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'art-deco',
    name: { zh: '装饰艺术', en: 'Art Deco' },
    note: {
      zh: '深炭底配金色菱形标记与对称居中衬线标题，导航像剧院节目单。',
      en: 'A deep charcoal panel with gold lozenge markers and a symmetric serif masthead, like a theatre programme.',
    },
    Demo: Deco,
  },
  {
    style: 'bento-grid',
    name: { zh: '便当网格', en: 'Bento Grid' },
    note: {
      zh: '导航被拆成圆角卡片模块拼成网格，首页大格子占两列，选中态只提高卡片层级。',
      en: 'Navigation becomes rounded card modules in a grid, with a two-column hero tile and elevation marking selection.',
    },
    Demo: Bento,
  },
  {
    style: 'editorial',
    name: { zh: '杂志编辑', en: 'Editorial' },
    note: {
      zh: '衬线标题配编号目录与细分隔线，选中项用朱砂下划线标记，像一本杂志的目录页。',
      en: 'A serif contents list with folio numbers, hairline rules and a vermilion underline for the active entry.',
    },
    Demo: Editorial,
  },
];

export default styleVariants;
