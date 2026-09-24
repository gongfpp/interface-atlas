import { useState } from 'react';
import type { StyleVariantSet } from './types';

const SAMPLES = ['brief.pdf', 'cover.png', 'notes.jpg'];

function useFiles() {
  const [files, setFiles] = useState<string[]>([]);
  const [error, setError] = useState('');
  const pick = () => setFiles((f) => (f.length >= SAMPLES.length ? f : [...f, SAMPLES[f.length]]));
  const reject = () => setError('sketch.psd: only PNG / JPG / PDF allowed');
  const remove = (n: string) => setFiles((f) => f.filter((x) => x !== n));
  return { files, error, pick, reject, remove };
}

function HandDrawn() {
  const { files, error, pick, reject, remove } = useFiles();
  return (
    <div className="mx-auto w-full max-w-sm rounded-[14px_6px_16px_8px] border-2 border-dashed border-neutral-800 bg-[#fdf9ef] p-5 text-neutral-800" style={{ transform: 'rotate(-0.6deg)' }}>
      <p className="font-serif text-lg italic">Drop your files here…</p>
      <div className="mt-3 flex gap-2">
        <button onClick={pick} className="rounded-[10px_4px_12px_5px] border-2 border-neutral-800 bg-[#fef3c7] px-3 py-1.5 font-serif text-sm italic">
          pick a file
        </button>
        <button onClick={reject} className="rounded-[5px_11px_4px_10px] border-2 border-neutral-400 px-3 py-1.5 font-serif text-sm italic text-neutral-500">
          try .psd
        </button>
      </div>
      <ul className="mt-3 space-y-1">
        {files.map((f) => (
          <li key={f} className="flex items-center justify-between border-b border-dashed border-neutral-400 pb-1 font-serif text-sm">
            {f}
            <button onClick={() => remove(f)} className="text-xs text-neutral-500">✕</button>
          </li>
        ))}
      </ul>
      {error && <p className="mt-2 font-serif text-xs italic text-red-700">{error}</p>}
    </div>
  );
}

function Flat() {
  const { files, error, pick, reject, remove } = useFiles();
  return (
    <div className="mx-auto w-full max-w-sm bg-[#2563eb] p-6 text-white">
      <p className="text-sm font-semibold uppercase tracking-wide">Upload files</p>
      <p className="mt-1 text-xs text-white/80">PNG · JPG · PDF, max 5 MB</p>
      <div className="mt-4 flex gap-3">
        <button onClick={pick} className="bg-white px-4 py-2 text-sm font-semibold text-[#2563eb]">
          Choose file
        </button>
        <button onClick={reject} className="border-2 border-white px-4 py-2 text-sm font-semibold">
          Try .psd
        </button>
      </div>
      <ul className="mt-4 space-y-2">
        {files.map((f) => (
          <li key={f} className="flex items-center justify-between bg-[#1d4ed8] px-3 py-2 text-sm">
            {f}
            <button onClick={() => remove(f)} className="text-white/70">Remove</button>
          </li>
        ))}
        {error && <li className="bg-[#f59e0b] px-3 py-2 text-sm font-medium">{error}</li>}
      </ul>
    </div>
  );
}

function Skeuo() {
  const { files, error, pick, reject, remove } = useFiles();
  return (
    <div className="mx-auto w-full max-w-sm rounded-lg border border-[#b9b9b9] bg-gradient-to-b from-[#f2f2f2] to-[#d8d8d8] p-5 text-[#333]">
      <p className="text-xs font-bold text-[#555] [text-shadow:0_1px_0_#fff]">Upload files</p>
      <div className="mt-3 rounded-md border border-[#a8a8a8] bg-gradient-to-b from-[#e2e2e2] to-[#fafafa] p-4 text-center shadow-[inset_0_2px_6px_#0002]">
        <p className="text-[11px] text-[#666]">Drag files here</p>
        <button onClick={pick} className="mt-2 rounded border border-[#8a8a8a] bg-gradient-to-b from-white to-[#d0d0d0] px-4 py-1.5 text-xs font-bold text-[#333] shadow-[inset_0_1px_0_#fff,0_1px_2px_#0003] active:from-[#c8c8c8] active:to-[#eee]">
          Browse…
        </button>
      </div>
      <ul className="mt-3 space-y-1.5">
        {files.map((f) => (
          <li key={f} className="flex items-center justify-between rounded border border-[#c2c2c2] bg-gradient-to-b from-white to-[#ececec] px-2.5 py-1.5 text-xs shadow-[inset_0_1px_0_#fff]">
            <span>📄 {f}</span>
            <button onClick={() => remove(f)} className="text-[#999]">✕</button>
          </li>
        ))}
      </ul>
      {error && <p className="mt-2 text-[11px] font-bold text-[#a33]">{error}</p>}
      <button onClick={reject} className="mt-3 text-[10px] text-[#777] underline">Test unsupported type</button>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'hand-drawn',
    name: { zh: '手绘', en: 'Hand-drawn' },
    note: {
      zh: '手绘感虚线双框配衬线斜体，整体轻微倾斜，像便签纸上随手画的草稿。',
      en: 'A sketchy dashed double frame in italic serif, tilted slightly, like a doodle on a note pad.',
    },
    Demo: HandDrawn,
  },
  {
    style: 'flat-design',
    name: { zh: '扁平化', en: 'Flat Design' },
    note: {
      zh: '纯色块分区、零阴影零描边，用色相对比而非层次区分操作区与文件清单。',
      en: 'Flat solid blocks with no shadow or outline: hue contrast, not depth, separates actions from the file list.',
    },
    Demo: Flat,
  },
  {
    style: 'skeuomorphism',
    name: { zh: '拟物', en: 'Skeuomorphism' },
    note: {
      zh: '金属渐变、内阴影与高光仿出真实按键和凹槽，文件像叠放的塑料卡片。',
      en: 'Metal gradients, inner shadows and gloss imitate real bevels and grooves; files read as stacked plastic cards.',
    },
    Demo: Skeuo,
  },
];

export default styleVariants;
