import { useState, type KeyboardEvent } from 'react';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function useCommands(session: VariantDemoProps['session'], cmds: string[]) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const [result, setResult] = useSessionState(session, 'result', '');
  const hits = cmds.filter((c) => c.toLowerCase().includes(q.toLowerCase()));
  const run = (c: string) => setResult(`Ran: ${c}`);
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, hits.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    }
    if (e.key === 'Enter' && hits[active]) run(hits[active]);
  };
  const change = (v: string) => {
    setQ(v);
    setActive(0);
  };
  return { q, hits, active, result, setActive, run, onKey, change };
}

function AuroraPalette({ session }: VariantDemoProps) {
  const { q, hits, active, result, setActive, run, onKey, change } = useCommands(session, ['New document', 'Invite teammate', 'Open settings', 'Toggle theme']);
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-[#0a0a14] p-4 text-white">
      <span className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#6d4bff]/50 blur-3xl" />
      <span className="pointer-events-none absolute -bottom-12 right-0 h-40 w-40 rounded-full bg-[#00e0b8]/40 blur-3xl" />
      <div className="relative">
        <input
          value={q}
          onChange={(e) => change(e.target.value)}
          onKeyDown={onKey}
          role="combobox"
          aria-expanded={hits.length > 0}
          aria-controls="aurora-cmds"
          aria-label="Command"
          placeholder="Type a command…"
          className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none"
        />
        <ul id="aurora-cmds" role="listbox" className="mt-3 space-y-1">
          {hits.map((c, i) => (
            <li key={c} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => run(c)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${i === active ? 'bg-white/15 text-white' : 'text-white/70'}`}
              >
                {c}
              </button>
            </li>
          ))}
          {!hits.length && <li className="px-3 py-2 text-sm text-white/40">No results</li>}
        </ul>
        <p role="status" className="mt-2 text-[11px] text-white/50">{result || '↑↓ then ↵'}</p>
      </div>
    </div>
  );
}

function GlassPalette({ session }: VariantDemoProps) {
  const { q, hits, active, result, setActive, run, onKey, change } = useCommands(session, ['Search files', 'Run task', 'New window', 'Preferences']);
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-[#ff6ec7] via-[#7c5cff] to-[#5ad1ff] p-2">
      <div className="rounded-xl border border-white/40 bg-white/20 p-3 backdrop-blur-xl">
        <input
          value={q}
          onChange={(e) => change(e.target.value)}
          onKeyDown={onKey}
          role="combobox"
          aria-expanded={hits.length > 0}
          aria-controls="glass-cmds"
          aria-label="Command"
          placeholder="Search commands"
          className="w-full rounded-lg border border-white/40 bg-white/20 px-3 py-2 text-sm text-white placeholder:text-white/70 focus:outline-none"
        />
        <ul id="glass-cmds" role="listbox" className="mt-2">
          {hits.map((c, i) => (
            <li key={c} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => run(c)}
                className={`w-full rounded-lg px-3 py-1.5 text-left text-sm text-white ${i === active ? 'bg-white/30' : 'hover:bg-white/20'}`}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
        <p role="status" className="mt-2 text-[11px] text-white/80">{result || '↑↓ then ↵'}</p>
      </div>
    </div>
  );
}

function FlatPalette({ session }: VariantDemoProps) {
  const { q, hits, active, result, setActive, run, onKey, change } = useCommands(session, ['Create board', 'Add column', 'Assign member', 'Archive']);
  return (
    <div className="mx-auto w-full max-w-sm bg-raised p-4" style={{ border: '2px solid #2d3340' }}>
      <input
        value={q}
        onChange={(e) => change(e.target.value)}
        onKeyDown={onKey}
        role="combobox"
        aria-expanded={hits.length > 0}
        aria-controls="flat-cmds"
        aria-label="Quick actions"
        placeholder="Quick actions"
        className="w-full rounded-md bg-code-bg px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:outline-none"
      />
      <ul id="flat-cmds" role="listbox" className="mt-3 space-y-1">
        {hits.map((c, i) => (
          <li key={c} role="option" aria-selected={i === active}>
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onClick={() => run(c)}
              className={`w-full rounded-md px-3 py-2 text-left text-sm ${active === i ? 'bg-[#4d96ff] text-white' : 'text-ink-2'}`}
            >
              {c}
            </button>
          </li>
        ))}
      </ul>
      <p role="status" className="mt-2 text-[11px] text-ink-3">{result || '↑↓ then ↵'}</p>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'aurora',
    name: { zh: '极光', en: 'Aurora' },
    note: {
      zh: '近黑面板两侧晕染紫青柔光，检索在暗场里进行；↑↓ 选择、回车执行都有可见结果。',
      en: 'Purple and teal blooms wash a near-black panel; search happens in a dark field with ↑↓ to move and Enter to run a real result.',
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
