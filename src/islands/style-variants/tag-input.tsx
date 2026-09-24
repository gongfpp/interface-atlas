import { useState } from 'react';
import type { StyleVariantSet } from './types';

function Minimal() {
  const [tags, setTags] = useState(['design', 'systems']);
  const [value, setValue] = useState('');
  const add = () => {
    const v = value.trim();
    if (v && !tags.includes(v)) setTags([...tags, v]);
    setValue('');
  };
  return (
    <div className="mx-auto w-full max-w-sm border border-black/15 bg-white p-5 text-black">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">Topics</p>
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 text-sm">
            <span className="border-b border-black/30">{t}</span>
            <button onClick={() => setTags(tags.filter((x) => x !== t))} aria-label={`Remove ${t}`} className="text-black/40 hover:text-black">×</button>
          </span>
        ))}
      </div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && add()}
        placeholder="Add tag…"
        className="mt-5 w-full border-b border-black/30 bg-transparent pb-1 text-sm outline-none placeholder:text-black/30 focus:border-black"
      />
    </div>
  );
}

function Memphis() {
  const [tags, setTags] = useState(['pop', 'wow']);
  const [value, setValue] = useState('');
  const add = () => {
    const v = value.trim();
    if (v) setTags([...tags, v]);
    setValue('');
  };
  const chips = ['-rotate-3 bg-[#ff6bd6]', 'rotate-2 bg-[#61dafb]', '-rotate-2 bg-[#a2f39a]'];
  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border-2 border-black bg-[#fff1a8] p-5 text-black">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">Tags!!</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((t, n) => (
          <button key={t} onClick={() => setTags(tags.filter((x) => x !== t))} className={`border-2 border-black px-3 py-1 text-xs font-bold ${chips[n % chips.length]}`}>
            {t} ×
          </button>
        ))}
      </div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && add()}
        placeholder="+ type a tag"
        className="mt-4 w-full rounded-full border-2 border-black bg-white px-3 py-2 text-sm outline-none placeholder:text-black/40"
      />
    </div>
  );
}

function Brutal() {
  const [tags, setTags] = useState(['RAW', 'FORM']);
  const [value, setValue] = useState('');
  const add = () => {
    const v = value.trim();
    if (v) setTags([...tags, v.toUpperCase()]);
    setValue('');
  };
  return (
    <div className="mx-auto w-full max-w-sm border-4 border-white bg-black p-5 font-mono text-white">
      <p className="text-[10px] uppercase tracking-[0.3em]">Input / tags</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((t) => (
          <button key={t} onClick={() => setTags(tags.filter((x) => x !== t))} className="border-2 border-white px-2 py-1 text-sm uppercase hover:bg-white hover:text-black">
            {t} ×
          </button>
        ))}
      </div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && add()}
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
