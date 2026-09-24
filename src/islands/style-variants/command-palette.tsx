import { useState } from 'react';
import type { StyleVariantSet } from './types';

function AuroraPalette() {
  const [q, setQ] = useState('');
  const cmds = ['New document', 'Invite teammate', 'Open settings', 'Toggle theme'];
  const hits = cmds.filter((c) => c.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-[#0a0a14] p-4 text-white">
      <span className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#6d4bff]/50 blur-3xl" />
      <span className="pointer-events-none absolute -bottom-12 right-0 h-40 w-40 rounded-full bg-[#00e0b8]/40 blur-3xl" />
      <div className="relative">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Type a command…"
          className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none"
        />
        <ul className="mt-3 space-y-1">
          {hits.map((c) => (
            <li key={c} className="rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10">
              {c}
            </li>
          ))}
          {!hits.length && <li className="px-3 py-2 text-sm text-white/40">No results</li>}
        </ul>
      </div>
    </div>
  );
}

function GlassPalette() {
  const [q, setQ] = useState('');
  const cmds = ['Search files', 'Run task', 'New window', 'Preferences'];
  const hits = cmds.filter((c) => c.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-[#ff6ec7] via-[#7c5cff] to-[#5ad1ff] p-2">
      <div className="rounded-xl border border-white/40 bg-white/20 p-3 backdrop-blur-xl">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search commands"
          className="w-full rounded-lg border border-white/40 bg-white/20 px-3 py-2 text-sm text-white placeholder:text-white/70 focus:outline-none"
        />
        <ul className="mt-2">
          {hits.map((c) => (
            <li key={c} className="rounded-lg px-3 py-1.5 text-sm text-white hover:bg-white/25">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FlatPalette() {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const cmds = ['Create board', 'Add column', 'Assign member', 'Archive'];
  const hits = cmds.filter((c) => c.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="mx-auto w-full max-w-sm bg-raised p-4" style={{ border: '2px solid #2d3340' }}>
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setActive(0);
        }}
        placeholder="Quick actions"
        className="w-full rounded-md bg-code-bg px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:outline-none"
      />
      <ul className="mt-3 space-y-1">
        {hits.map((c, i) => (
          <li key={c}>
            <button
              onMouseEnter={() => setActive(i)}
              className={`w-full rounded-md px-3 py-2 text-left text-sm ${active === i ? 'bg-[#4d96ff] text-white' : 'text-ink-2'}`}
            >
              {c}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'aurora',
    name: { zh: '极光', en: 'Aurora' },
    note: {
      zh: '近黑面板两侧晕染紫青柔光，输入框和命中项只靠极淡的白色透层示意，检索在暗场里进行。',
      en: 'Purple and teal blooms wash a near-black panel while input and hits stay barely-there white layers, so search happens in a dark field.',
    },
    Demo: AuroraPalette,
  },
  {
    style: 'glassmorphism',
    name: { zh: '玻璃拟态', en: 'Glassmorphism' },
    note: {
      zh: '整块面板做成叠在彩色渐变上的磨砂玻璃，白色半透明描边与背景模糊区分层级。',
      en: 'The whole palette is frosted glass over a colourful gradient, with translucent white strokes and backdrop blur separating its layers.',
    },
    Demo: GlassPalette,
  },
  {
    style: 'flat-design',
    name: { zh: '扁平设计', en: 'Flat Design' },
    note: {
      zh: '硬边框配纯色高亮行，取消一切阴影与模糊，键盘式悬停选中由一块实心蓝直接标记。',
      en: 'A hard border and solid fills drop every shadow and blur, with hover selection marked by one flat blue block.',
    },
    Demo: FlatPalette,
  },
];

export default styleVariants;
