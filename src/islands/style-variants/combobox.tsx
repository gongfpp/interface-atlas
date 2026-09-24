import { useState } from 'react';
import type { StyleVariantSet } from './types';

function Corporate() {
  const all = ['Aurora', 'Bauhaus', 'Cyberpunk', 'Organic', 'Vaporwave'];
  const [q, setQ] = useState('');
  const [val, setVal] = useState('');
  const list = all.filter((x) => x.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="mx-auto w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 text-slate-800 shadow-sm">
      <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        <span className="h-2 w-2 rotate-45 bg-indigo-400" />
        Style
      </p>
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setVal('');
        }}
        placeholder="Search styles…"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
      />
      <ul className="mt-2 overflow-hidden rounded-lg border border-slate-200">
        {list.map((x) => (
          <li key={x}>
            <button
              onClick={() => {
                setVal(x);
                setQ(x);
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-indigo-50 ${val === x ? 'bg-indigo-50 font-medium text-indigo-700' : ''}`}
            >
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              {x}
            </button>
          </li>
        ))}
        {!list.length && <li className="px-3 py-2 text-xs text-slate-400">No match</li>}
      </ul>
    </div>
  );
}

function Cyber() {
  const all = ['NEON-01', 'GRID-77', 'SYNTH-4', 'GLITCH-9'];
  const [q, setQ] = useState('');
  const list = all.filter((x) => x.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="mx-auto w-full max-w-sm border border-cyan-400 bg-[#05060f] p-4 font-mono text-cyan-300 shadow-[0_0_20px_#00e5ff44]">
      <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-fuchsia-400">&gt; TARGET_ID</p>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="scan…"
        className="w-full border border-cyan-500/60 bg-black/60 px-3 py-2 text-sm text-cyan-200 caret-fuchsia-400 outline-none focus:border-fuchsia-400"
      />
      <ul className="mt-2 space-y-1">
        {list.map((x) => (
          <li key={x} className="border-l-2 border-cyan-500/40 bg-cyan-500/5 px-2 py-1.5 text-xs hover:border-fuchsia-400 hover:text-fuchsia-300">
            {x}
          </li>
        ))}
        {!list.length && <li className="px-2 py-1.5 text-xs text-fuchsia-500">// no signal</li>}
      </ul>
    </div>
  );
}

function Bento() {
  const all = [
    { n: 'Aurora', c: 'bg-violet-100 text-violet-900' },
    { n: 'Bauhaus', c: 'bg-amber-100 text-amber-900' },
    { n: 'Organic', c: 'bg-emerald-100 text-emerald-900' },
    { n: 'Pixel', c: 'bg-sky-100 text-sky-900' },
  ];
  const [q, setQ] = useState('');
  const [val, setVal] = useState('');
  const list = all.filter((x) => x.n.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl bg-neutral-100 p-3 text-neutral-900">
      <div className="mb-3 rounded-xl bg-white p-3 shadow-sm">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400">Pick a style</p>
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setVal('');
          }}
          placeholder="Filter…"
          className="w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-sm outline-none focus:border-neutral-400"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {list.map((x) => (
          <button
            key={x.n}
            onClick={() => {
              setVal(x.n);
              setQ(x.n);
            }}
            className={`rounded-xl p-3 text-left text-sm font-medium transition-transform hover:-translate-y-0.5 ${x.c} ${val === x.n ? 'ring-2 ring-neutral-900' : ''}`}
          >
            {x.n}
          </button>
        ))}
        {!list.length && <p className="col-span-2 rounded-xl bg-white p-3 text-xs text-neutral-400">No modules match</p>}
      </div>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'corporate-memphis',
    name: { zh: '企业孟菲斯', en: 'Corporate Memphis' },
    note: {
      zh: '克制的圆点与菱形点缀配柔和靛蓝选中，候选列表是整洁可信的企业风卡片。',
      en: 'Restrained dot and diamond accents with a soft indigo selection keep the suggestion list clean and corporate.',
    },
    Demo: Corporate,
  },
  {
    style: 'cyberpunk',
    name: { zh: '赛博朋克', en: 'Cyberpunk' },
    note: {
      zh: '近黑底霓虹青与品红等宽字体，候选项是带左缘光的终端输出行。',
      en: 'Neon cyan and magenta monospace on near-black; each suggestion is a terminal row with a glowing left edge.',
    },
    Demo: Cyber,
  },
  {
    style: 'bento-grid',
    name: { zh: '便当网格', en: 'Bento Grid' },
    note: {
      zh: '输入框与候选拆成圆角小模块排进网格，选中项用一圈深色描边标出。',
      en: 'Input and options break into tidy rounded modules laid out in a grid, with the choice marked by a dark ring.',
    },
    Demo: Bento,
  },
];

export default styleVariants;
