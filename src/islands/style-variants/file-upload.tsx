import { useState } from 'react';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

interface Uploaded {
  id: number;
  name: string;
}

/** 模块级自增 id：初始为空列表，不会造成 SSR/CSR 不一致。 */
let uid = 0;

function useFiles(session: VariantDemoProps['session'], locale: VariantDemoProps['locale']) {
  const [files, setFiles] = useSessionState<Uploaded[]>(session, 'files', []);
  const [error, setError] = useState('');
  const onPick = (list: FileList | null) => {
    if (!list || !list.length) return;
    setError('');
    const next = Array.from(list).map((f) => ({ id: ++uid, name: f.name }));
    setFiles((prev) => [...prev, ...next]);
  };
  const reject = () => setError(locale === 'zh' ? 'sketch.psd：仅允许 PNG / JPG / PDF' : 'sketch.psd: only PNG / JPG / PDF allowed');
  const remove = (id: number) => setFiles((prev) => prev.filter((x) => x.id !== id));
  return { files, error, onPick, reject, remove };
}

function FileInput({ onPick, label, className }: { onPick: (l: FileList | null) => void; label: string; className: string }) {
  return (
    <label className={className}>
      {label}
      <input type="file" multiple className="sr-only" onChange={(e) => onPick(e.target.files)} />
    </label>
  );
}

function HandDrawn({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const { files, error, onPick, reject, remove } = useFiles(session, locale);
  return (
    <div className="mx-auto w-full max-w-sm rounded-[14px_6px_16px_8px] border-2 border-dashed border-neutral-800 bg-[#fdf9ef] p-5 text-neutral-800" style={{ transform: 'rotate(-0.6deg)' }}>
      <p className="font-serif text-lg italic">{zh ? '把文件拖到这里…' : 'Drop your files here…'}</p>
      <div className="mt-3 flex gap-2">
        <FileInput onPick={onPick} label={zh ? '选择文件' : 'pick a file'} className="cursor-pointer rounded-[10px_4px_12px_5px] border-2 border-neutral-800 bg-[#fef3c7] px-3 py-1.5 font-serif text-sm italic" />
        <button onClick={reject} className="rounded-[5px_11px_4px_10px] border-2 border-neutral-400 px-3 py-1.5 font-serif text-sm italic text-neutral-500">
          {zh ? '试试 .psd' : 'try .psd'}
        </button>
      </div>
      <ul className="mt-3 space-y-1">
        {files.map((f) => (
          <li key={f.id} className="flex items-center justify-between border-b border-dashed border-neutral-400 pb-1 font-serif text-sm">
            {f.name}
            <button onClick={() => remove(f.id)} aria-label={zh ? `移除 ${f.name}` : `Remove ${f.name}`} className="text-xs text-neutral-500">✕</button>
          </li>
        ))}
      </ul>
      {error && <p className="mt-2 font-serif text-xs italic text-red-700" role="alert">{error}</p>}
    </div>
  );
}

function Flat({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const { files, error, onPick, reject, remove } = useFiles(session, locale);
  return (
    <div className="mx-auto w-full max-w-sm bg-[#2563eb] p-6 text-white">
      <p className="text-sm font-semibold uppercase tracking-wide">{zh ? '上传文件' : 'Upload files'}</p>
      <p className="mt-1 text-xs text-white/80">{zh ? 'PNG · JPG · PDF，最大 5 MB' : 'PNG · JPG · PDF, max 5 MB'}</p>
      <div className="mt-4 flex gap-3">
        <FileInput onPick={onPick} label={zh ? '选择文件' : 'Choose file'} className="cursor-pointer bg-white px-4 py-2 text-sm font-semibold text-[#2563eb]" />
        <button onClick={reject} className="border-2 border-white px-4 py-2 text-sm font-semibold">{zh ? '试试 .psd' : 'Try .psd'}</button>
      </div>
      <ul className="mt-4 space-y-2">
        {files.map((f) => (
          <li key={f.id} className="flex items-center justify-between bg-[#1d4ed8] px-3 py-2 text-sm">
            {f.name}
            <button onClick={() => remove(f.id)} aria-label={zh ? `移除 ${f.name}` : `Remove ${f.name}`} className="text-white/80">{zh ? '移除' : 'Remove'}</button>
          </li>
        ))}
        {error && <li className="bg-[#f59e0b] px-3 py-2 text-sm font-medium" role="alert">{error}</li>}
      </ul>
    </div>
  );
}

function Skeuo({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const { files, error, onPick, reject, remove } = useFiles(session, locale);
  return (
    <div className="mx-auto w-full max-w-sm rounded-lg border border-[#b9b9b9] bg-gradient-to-b from-[#f2f2f2] to-[#d8d8d8] p-5 text-[#333]">
      <p className="text-xs font-bold text-[#555] [text-shadow:0_1px_0_#fff]">{zh ? '上传文件' : 'Upload files'}</p>
      <div className="mt-3 rounded-md border border-[#a8a8a8] bg-gradient-to-b from-[#e2e2e2] to-[#fafafa] p-4 text-center shadow-[inset_0_2px_6px_#0002]">
        <p className="text-[11px] text-[#666]">{zh ? '从你的设备选择文件' : 'Choose files from your device'}</p>
        <FileInput onPick={onPick} label={zh ? '浏览…' : 'Browse…'} className="cursor-pointer mt-2 inline-block rounded border border-[#8a8a8a] bg-gradient-to-b from-white to-[#d0d0d0] px-4 py-1.5 text-xs font-bold text-[#333] shadow-[inset_0_1px_0_#fff,0_1px_2px_#0003] active:from-[#c8c8c8] active:to-[#eee]" />
      </div>
      <ul className="mt-3 space-y-1.5">
        {files.map((f) => (
          <li key={f.id} className="flex items-center justify-between rounded border border-[#c2c2c2] bg-gradient-to-b from-white to-[#ececec] px-2.5 py-1.5 text-xs shadow-[inset_0_1px_0_#fff]">
            <span>📄 {f.name}</span>
            <button onClick={() => remove(f.id)} aria-label={zh ? `移除 ${f.name}` : `Remove ${f.name}`} className="text-[#999]">✕</button>
          </li>
        ))}
      </ul>
      {error && <p className="mt-2 text-[11px] font-bold text-[#a33]" role="alert">{error}</p>}
      <button onClick={reject} className="mt-3 text-[10px] text-[#777] underline">{zh ? '测试不支持的类型' : 'Test unsupported type'}</button>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'hand-drawn',
    name: { zh: '手绘', en: 'Hand-drawn' },
    note: {
      zh: '手绘感虚线双框配衬线斜体，整体轻微倾斜，像便签纸上随手画的草稿；选文件是真实文件选择。',
      en: 'A sketchy dashed double frame in italic serif, tilted slightly, like a doodle on a note pad — with a real file picker.',
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
