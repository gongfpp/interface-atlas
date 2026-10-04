import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import { useState } from 'react';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

interface Uploaded {
  id: number;
  name: string;
}

/** 模块级自增 id：初始为空列表，不会造成 SSR/CSR 不一致。 */
let uid = 0;

/** 不读取文件内容，不联网；校验元数据后只在当前演示列出文件名。 */
export function fileIssue(file: { name: string; size: number; type: string }): 'type' | 'size' | null {
  if (!/\.(png|jpe?g|pdf)$/i.test(file.name) || (file.type && !['image/png', 'image/jpeg', 'application/pdf'].includes(file.type))) return 'type';
  if (file.size > 5 * 1024 * 1024) return 'size';
  return null;
}

function useFiles(session: VariantDemoProps['session'], locale: VariantDemoProps['locale']) {
  const [files, setFiles] = useSessionState<Uploaded[]>(session, 'files', []);
  const [error, setError] = useState('');
  const onPick = (list: FileList | null) => {
    if (!list || !list.length) return;
    const incoming = Array.from(list);
    const rejected = incoming.filter((file) => fileIssue(file));
    setError(rejected.map((file) => `${file.name}: ${fileIssue(file) === 'size'
      ? (locale === 'zh' ? '超过 5 MB' : 'exceeds 5 MB')
      : (locale === 'zh' ? '仅允许 PNG / JPG / PDF' : 'only PNG / JPG / PDF allowed')}`).join(' · '));
    const next = incoming.filter((file) => !fileIssue(file)).map((file) => ({ id: ++uid, name: file.name }));
    setFiles((prev) => [...prev, ...next]);
  };
  const reject = () => setError(locale === 'zh' ? 'sketch.psd：仅允许 PNG / JPG / PDF' : 'sketch.psd: only PNG / JPG / PDF allowed');
  const remove = (id: number) => setFiles((prev) => prev.filter((x) => x.id !== id));
  return { files, error, onPick, reject, remove };
}

function FileInput({ onPick, label, className }: { onPick: (l: FileList | null) => void; label: string; className: string }) {
  return (
    <label className={`focus-within:outline-2 focus-within:outline-offset-2 ${className}`}>
      {label}
      <input type="file" accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf" multiple className="focus-visible:outline-2 focus-visible:outline-offset-2 sr-only" onChange={(e) => { onPick(e.target.files); e.currentTarget.value = ''; }} />
    </label>
  );
}

function HandDrawn({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const { files, error, onPick, reject, remove } = useFiles(session, locale);
  return (
    <div className="mx-auto w-full max-w-sm rounded-[14px_6px_16px_8px] border-2 border-dashed border-neutral-800 bg-[#fdf9ef] p-5 text-neutral-800" style={{ transform: 'rotate(-0.6deg)' }}>
      <p className="font-serif text-lg italic">{zh ? '选择本地文件…' : 'Choose local files…'}</p>
      <div className="mt-3 flex gap-2">
        <FileInput onPick={onPick} label={zh ? '选择文件' : 'pick a file'} className="cursor-pointer rounded-[10px_4px_12px_5px] border-2 border-neutral-800 bg-[#fef3c7] px-3 py-1.5 font-serif text-sm italic" />
        <button type="button" onClick={reject} className="focus-visible:outline-2 focus-visible:outline-offset-2 rounded-[5px_11px_4px_10px] border-2 border-neutral-400 px-3 py-1.5 font-serif text-sm italic text-neutral-500">
          {zh ? '试试 .psd' : 'try .psd'}
        </button>
      </div>
      <p className="mt-2 text-xs">{zh ? 'PNG / JPG / PDF，每个最大 5 MB，仅本地列出，不上传。' : 'PNG / JPG / PDF, up to 5 MB each. Listed locally, never uploaded.'}</p>
      <ul className="mt-3 space-y-1">
        {files.map((f) => (
          <li key={f.id} className="flex items-center justify-between border-b border-dashed border-neutral-400 pb-1 font-serif text-sm">
            {f.name}
            <button type="button" onClick={() => remove(f.id)} aria-label={zh ? `移除 ${f.name}` : `Remove ${f.name}`} className="focus-visible:outline-2 focus-visible:outline-offset-2 text-xs text-neutral-500">✕</button>
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
      <p className="text-sm font-semibold uppercase tracking-wide">{zh ? '本地文件队列' : 'Local file queue'}</p>
      <p className="mt-1 text-xs text-white/80">{zh ? 'PNG · JPG · PDF，最大 5 MB，仅本地列出，不上传' : 'PNG · JPG · PDF, max 5 MB. Listed locally, never uploaded'}</p>
      <div className="mt-4 flex gap-3">
        <FileInput onPick={onPick} label={zh ? '选择文件' : 'Choose file'} className="cursor-pointer bg-white px-4 py-2 text-sm font-semibold text-[#2563eb]" />
        <button type="button" onClick={reject} className="focus-visible:outline-2 focus-visible:outline-offset-2 border-2 border-white px-4 py-2 text-sm font-semibold">{zh ? '试试 .psd' : 'Try .psd'}</button>
      </div>
      <ul className="mt-4 space-y-2">
        {files.map((f) => (
          <li key={f.id} className="flex items-center justify-between bg-[#1d4ed8] px-3 py-2 text-sm">
            {f.name}
            <button type="button" onClick={() => remove(f.id)} aria-label={zh ? `移除 ${f.name}` : `Remove ${f.name}`} className="focus-visible:outline-2 focus-visible:outline-offset-2 text-white/80">{zh ? '移除' : 'Remove'}</button>
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
      <p className="text-xs font-bold text-[#555] [text-shadow:0_1px_0_#fff]">{zh ? '本地文件队列' : 'Local file queue'}</p>
      <div className="mt-3 rounded-md border border-[#a8a8a8] bg-gradient-to-b from-[#e2e2e2] to-[#fafafa] p-4 text-center shadow-[inset_0_2px_6px_#0002]">
        <p className="text-[11px] text-[#666]">{zh ? '从设备选择文件，仅本地列出，不上传' : 'Choose from your device. Listed locally, never uploaded'}</p>
        <FileInput onPick={onPick} label={zh ? '浏览…' : 'Browse…'} className="cursor-pointer mt-2 inline-block rounded border border-[#8a8a8a] bg-gradient-to-b from-white to-[#d0d0d0] px-4 py-1.5 text-xs font-bold text-[#333] shadow-[inset_0_1px_0_#fff,0_1px_2px_#0003] active:from-[#c8c8c8] active:to-[#eee]" />
      </div>
      <ul className="mt-3 space-y-1.5">
        {files.map((f) => (
          <li key={f.id} className="flex items-center justify-between rounded border border-[#c2c2c2] bg-gradient-to-b from-white to-[#ececec] px-2.5 py-1.5 text-xs shadow-[inset_0_1px_0_#fff]">
            <span>📄 {f.name}</span>
            <button type="button" onClick={() => remove(f.id)} aria-label={zh ? `移除 ${f.name}` : `Remove ${f.name}`} className="focus-visible:outline-2 focus-visible:outline-offset-2 text-[#999]">✕</button>
          </li>
        ))}
      </ul>
      {error && <p className="mt-2 text-[11px] font-bold text-[#a33]" role="alert">{error}</p>}
      <button type="button" onClick={reject} className="focus-visible:outline-2 focus-visible:outline-offset-2 mt-3 text-[10px] text-[#777] underline">{zh ? '测试不支持的类型' : 'Test unsupported type'}</button>
    </div>
  );
}


function Expanded({ session, locale, style }: VariantDemoProps & { style: RecipeStyleId }) {
  const zh = locale === 'zh';
  const r = recipe(style);
  const { files, error, onPick, remove } = useFiles(session, locale);
  return <RecipeFrame style={style} locale={locale} title={zh ? '本地文件队列' : 'Local file queue'}>
    <div className={`p-4 ${r.item}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); onPick(event.dataTransfer.files); }}>
      <p className={`mb-3 text-sm ${r.muted}`}>{zh ? '拖入文件或点击选择，PNG / JPG / PDF，每个不超过 5 MB。' : 'Drop files or choose below. PNG / JPG / PDF, up to 5 MB each.'}</p>
      <FileInput onPick={onPick} label={zh ? '选择文件' : 'Choose files'} className={`inline-flex cursor-pointer ${r.control}`} />
    </div>
    <ul className="mt-4 space-y-2">
      {files.map((file) => <li key={file.id} className={`flex items-center justify-between gap-2 p-3 ${r.item}`}>
        <span className="min-w-0 break-all text-sm">{file.name}</span>
        <button type="button" onClick={() => remove(file.id)} aria-label={zh ? `移除 ${file.name}` : `Remove ${file.name}`} className={`focus-visible:outline-2 focus-visible:outline-offset-2 shrink-0 ${r.secondary}`}>×</button>
      </li>)}
    </ul>
    {error && <p role="alert" className="mt-3 text-sm font-semibold">{error}</p>}
    <p role="status" className={`mt-3 text-sm ${r.muted}`}>{zh ? `${files.length} 个文件仅在本地列出，未读取内容或上传。` : `${files.length} files listed locally. Contents are not read or uploaded.`}</p>
  </RecipeFrame>;
}

const styleVariants: StyleVariantSet = [
  {
    style: 'hand-drawn',
    name: {"zh":"手绘涂鸦","en":"Hand-drawn UI"},
    note: {
      zh: '手绘感虚线双框配衬线斜体，整体轻微倾斜，像便签纸上随手画的草稿；选文件是真实文件选择。',
      en: 'A sketchy dashed double frame in italic serif, tilted slightly, like a doodle on a note pad — with a real file picker.',
    },
    Demo: HandDrawn,
  },
  {
    style: 'flat-design',
    name: {"zh":"扁平化设计","en":"Flat Design"},
    note: {
      zh: '纯色块分区、零阴影零描边，用色相对比而非层次区分操作区与文件清单。',
      en: 'Flat solid blocks with no shadow or outline: hue contrast, not depth, separates actions from the file list.',
    },
    Demo: Flat,
  },
  {
    style: 'skeuomorphism',
    name: {"zh":"拟物化","en":"Skeuomorphism"},
    note: {
      zh: '金属渐变、内阴影与高光仿出真实按键和凹槽，文件像叠放的塑料卡片。',
      en: 'Metal gradients, inner shadows and gloss imitate real bevels and grooves; files read as stacked plastic cards.',
    },
    Demo: Skeuo,
  },
  recipeVariant('minimalism', (props) => <Expanded {...props} style="minimalism" />, { zh: "发丝线、黑白反转与留白；文件入口与队列行共享边界和材质，真实校验格式与体积，仅本地列出。", en: "Hairlines, monochrome inversion and whitespace; file controls and queued rows share borders and materials, with real type and size checks and local-only listing." }),
  recipeVariant('swiss-style', (props) => <Expanded {...props} style="swiss-style" />, { zh: "编号网格、直角边界与红色强调；文件入口与队列行共享边界和材质，真实校验格式与体积，仅本地列出。", en: "An indexed grid, square edges and a red accent; file controls and queued rows share borders and materials, with real type and size checks and local-only listing." }),
  recipeVariant('neobrutalism', (props) => <Expanded {...props} style="neobrutalism" />, { zh: "粗黑描边、硬投影与高对比选中；文件入口与队列行共享边界和材质，真实校验格式与体积，仅本地列出。", en: "Heavy black outlines, hard shadows and bold selection; file controls and queued rows share borders and materials, with real type and size checks and local-only listing." }),
  recipeVariant('neumorphism', (props) => <Expanded {...props} style="neumorphism" />, { zh: "同色曲面、双向阴影与实体边界；文件入口与队列行共享边界和材质，真实校验格式与体积，仅本地列出。", en: "Shared soft surfaces, paired shadows and explicit borders; file controls and queued rows share borders and materials, with real type and size checks and local-only listing." }),
  recipeVariant('organic', (props) => <Expanded {...props} style="organic" />, { zh: "大地色与不规则圆角，柔和而清楚；文件入口与队列行共享边界和材质，真实校验格式与体积，仅本地列出。", en: "Earth tones and irregular corners, soft yet clear; file controls and queued rows share borders and materials, with real type and size checks and local-only listing." }),
];

export default styleVariants;
