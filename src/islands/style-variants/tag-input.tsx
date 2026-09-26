import { useState, type KeyboardEvent } from 'react';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

interface Tag {
  id: number;
  label: string;
}

let uid = 0;
const make = (label: string): Tag => ({ id: ++uid, label });

/** Enter 提交；输入法组合中（中文/日文候选）不提交，避免误触发。 */
function isSubmit(e: KeyboardEvent<HTMLInputElement>) {
  return e.key === 'Enter' && !e.nativeEvent.isComposing;
}

function Minimal({ session }: VariantDemoProps) {
  const [tags, setTags] = useSessionState(session, 'tags', [{ id: -2, label: 'design' }, { id: -1, label: 'systems' }]);
  const [value, setValue] = useState('');
  const add = () => {
    const v = value.trim();
    if (v && !tags.some((t) => t.label === v)) setTags((prev) => [...prev, make(v)]);
    setValue('');
  };
  return (
    <div className="mx-auto w-full max-w-sm border border-black/15 bg-white p-5 text-black">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">Topics</p>
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
        {tags.map((t) => (
          <span key={t.id} className="inline-flex items-center gap-1 text-sm">
            <span className="border-b border-black/30">{t.label}</span>
            <button onClick={() => setTags((prev) => prev.filter((x) => x.id !== t.id))} aria-label={`Remove ${t.label}`} className="text-black/40 hover:text-black">×</button>
          </span>
        ))}
      </div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => isSubmit(e) && add()}
        aria-label="Add tag"
        placeholder="Add tag…"
        className="mt-5 w-full border-b border-black/30 bg-transparent pb-1 text-sm outline-none placeholder:text-black/30 focus:border-black"
      />
    </div>
  );
}

function Memphis({ session }: VariantDemoProps) {
  const [tags, setTags] = useSessionState(session, 'tags', [{ id: -2, label: 'pop' }, { id: -1, label: 'wow' }]);
  const [value, setValue] = useState('');
  const add = () => {
    const v = value.trim();
    if (v) setTags((prev) => [...prev, make(v)]);
    setValue('');
  };
  const chips = ['-rotate-3 bg-[#ff6bd6]', 'rotate-2 bg-[#61dafb]', '-rotate-2 bg-[#a2f39a]'];
  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border-2 border-black bg-[#fff1a8] p-5 text-black">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">Tags!!</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((t, n) => (
          <button key={t.id} onClick={() => setTags((prev) => prev.filter((x) => x.id !== t.id))} aria-label={`Remove ${t.label}`} className={`border-2 border-black px-3 py-1 text-xs font-bold ${chips[n % chips.length]}`}>
            {t.label} ×
          </button>
        ))}
      </div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => isSubmit(e) && add()}
        aria-label="Add tag"
        placeholder="+ type a tag"
        className="mt-4 w-full rounded-full border-2 border-black bg-white px-3 py-2 text-sm outline-none placeholder:text-black/40"
      />
    </div>
  );
}

function Brutal({ session }: VariantDemoProps) {
  const [tags, setTags] = useSessionState(session, 'tags', [{ id: -2, label: 'RAW' }, { id: -1, label: 'FORM' }]);
  const [value, setValue] = useState('');
  const add = () => {
    const v = value.trim();
    if (v) setTags((prev) => [...prev, make(v.toUpperCase())]);
    setValue('');
  };
  return (
    <div className="mx-auto w-full max-w-sm border-4 border-white bg-black p-5 font-mono text-white">
      <p className="text-[10px] uppercase tracking-[0.3em]">Input / tags</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((t) => (
          <button key={t.id} onClick={() => setTags((prev) => prev.filter((x) => x.id !== t.id))} aria-label={`Remove ${t.label}`} className="border-2 border-white px-2 py-1 text-sm uppercase hover:bg-white hover:text-black">
            {t.label} ×
          </button>
        ))}
      </div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => isSubmit(e) && add()}
        aria-label="Add tag"
        placeholder="> ADD…"
        className="mt-5 w-full border-b-4 border-white bg-transparent pb-2 text-2xl uppercase text-white outline-none placeholder:text-white/40"
      />
      <p className="mt-3 text-[10px] leading-relaxed text-white/50">TYPE + ENTER. NO APOLOGIES.</p>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'minimalism',
    name: { zh: '极简主义', en: 'Minimalism' },
    note: {
      zh: '标签只是带下划线的文字，删除是细小的 ×，输入框只有一条会变黑的底线，无胶囊无阴影。',
      en: 'Tags are merely underlined words with a tiny ×, and the field is one baseline rule that darkens on focus — no pills, no shadow.',
    },
    Demo: Minimal,
  },
  {
    style: 'memphis',
    name: { zh: '孟菲斯风格', en: 'Memphis Design' },
    note: {
      zh: '彩色标签像贴纸一样各自倾斜、黑描边、撞色循环，输入框是圆胖的形状，整块糖果底。',
      en: 'Colourful tags tilt like stickers with black outlines and cycling clashes, over a candy ground with a fat rounded field.',
    },
    Demo: Memphis,
  },
  {
    style: 'brutalism',
    name: { zh: '粗野主义', en: 'Brutalism' },
    note: {
      zh: '黑底白字等宽全大写，标签是方括号般的硬边块，输入行 2xl 巨大、下划线 4px，反差拉满。',
      en: 'Black ground, white monospace caps; tags are hard blocks and the 2xl input sits on a 4px rule for maximum harshness.',
    },
    Demo: Brutal,
  },
];

export default styleVariants;
