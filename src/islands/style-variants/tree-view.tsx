import { useState } from 'react';
import type { StyleVariantSet } from './types';

const TREE = [
  { label: 'src', children: ['app.tsx', 'styles.css'] },
  { label: 'public', children: ['logo.svg', 'favicon.ico'] },
];
const ROMAN = ['I', 'II', 'III'];
const toggleIn = (list: string[], k: string) => (list.includes(k) ? list.filter((x) => x !== k) : [...list, k]);

function BrutalistTree() {
  const [open, setOpen] = useState(['src']);
  return (
    <div className="mx-auto w-full max-w-sm border-4 border-black bg-white font-mono text-black">
      <p className="border-b-4 border-black bg-black px-4 py-2 text-sm font-black uppercase tracking-widest text-white">Files</p>
      <ul>
        {TREE.map((node) => {
          const on = open.includes(node.label);
          return (
            <li key={node.label} className="border-b-2 border-black last:border-b-0">
              <button type="button" aria-expanded={on} onClick={() => setOpen((o) => toggleIn(o, node.label))} className="flex w-full items-center gap-2 px-4 py-3 text-left text-lg font-black uppercase hover:bg-[#ff2d2d] hover:text-white">
                <span className="w-4">{on ? '−' : '+'}</span>
                {node.label}
              </button>
              {on && (
                <ul className="bg-[#f0f0f0]">
                  {node.children.map((c) => (
                    <li key={c} className="border-t-2 border-black py-2 pl-10 pr-4 text-base font-bold lowercase">{c}</li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function EditorialTree() {
  const [open, setOpen] = useState(['src']);
  return (
    <div className="mx-auto w-full max-w-sm bg-paper px-5 py-6 font-serif text-ink">
      <p className="text-center text-[10px] uppercase tracking-[0.4em] text-ink-3">Contents</p>
      <ul className="mt-4">
        {TREE.map((node, i) => {
          const on = open.includes(node.label);
          return (
            <li key={node.label} className="border-t border-line last:border-b">
              <button type="button" aria-expanded={on} onClick={() => setOpen((o) => toggleIn(o, node.label))} className="flex w-full items-baseline justify-between py-3 text-left">
                <span className="text-lg italic">{ROMAN[i]}. {node.label}</span>
                <span className="text-xs">{on ? '—' : '+'}</span>
              </button>
              {on && (
                <ul className="pb-3 pl-6">
                  {node.children.map((c) => (
                    <li key={c} className="flex items-baseline justify-between py-1 text-sm text-ink-2">
                      <span>{c}</span>
                      <span className="font-mono text-[10px] text-ink-3">{String(c.length).padStart(2, '0')}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function NeumorphicTree() {
  const [open, setOpen] = useState(['src']);
  const raised = 'shadow-[6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.9)]';
  const inset = 'shadow-[inset_4px_4px_8px_rgba(163,177,198,0.55),inset_-4px_-4px_8px_rgba(255,255,255,0.9)]';
  return (
    <div className="mx-auto w-full max-w-sm rounded-3xl bg-[#e6e9f0] p-6 text-[#4a5568]">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#8a97ad]">Explorer</p>
      <ul className="mt-4 space-y-3">
        {TREE.map((node) => {
          const on = open.includes(node.label);
          return (
            <li key={node.label}>
              <button type="button" aria-expanded={on} onClick={() => setOpen((o) => toggleIn(o, node.label))} className={`flex w-full items-center justify-between rounded-2xl bg-[#e6e9f0] px-4 py-3 text-left text-sm font-semibold ${on ? inset : raised}`}>
                {node.label}
                <span>{on ? '▾' : '▸'}</span>
              </button>
              {on && (
                <ul className="mt-3 space-y-2 pl-4">
                  {node.children.map((c) => (
                    <li key={c} className={`rounded-xl bg-[#e6e9f0] px-4 py-2 text-[13px] text-[#71809a] ${raised}`}>{c}</li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'brutalism',
    name: { zh: '粗野主义', en: 'Brutalism' },
    note: {
      zh: '超大字重等宽目录树，4px 黑边与整行反白悬停，结构粗暴直接。',
      en: 'An oversized monospace directory tree with 4px black borders and full-row inverted hover — structure stated bluntly.',
    },
    Demo: BrutalistTree,
  },
  {
    style: 'editorial',
    name: { zh: '杂志编辑风', en: 'Editorial' },
    note: {
      zh: '像杂志目录页，衬线斜体标题配罗马数字与细横线，子项右侧标字符数。',
      en: 'A magazine table of contents: serif italic headings with roman numerals and fine rules, child items counter-numbered on the right.',
    },
    Demo: EditorialTree,
  },
  {
    style: 'neumorphism',
    name: { zh: '新拟态', en: 'Neumorphism' },
    note: {
      zh: '同色浅灰底上用双向阴影挤出或按入节点，展开的节点呈现为凹陷状态。',
      en: 'On a same-colour pale ground, dual shadows extrude or press nodes; an expanded node reads as a soft inset well.',
    },
    Demo: NeumorphicTree,
  },
];

export default styleVariants;
