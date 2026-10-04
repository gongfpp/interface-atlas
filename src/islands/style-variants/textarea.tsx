import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function Flat({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [v, setV] = useSessionState(session, 'value', '');
  return (
    <div className="mx-auto w-full max-w-sm rounded-lg bg-[#eef4ff] p-4 text-[#0f172a]">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#2563eb]">{zh ? '消息' : 'Message'}</span>
        <span className="rounded bg-[#2563eb] px-2 py-0.5 text-[10px] font-semibold text-white">{v.length}</span>
      </div>
      <textarea
        aria-label={zh ? '消息内容' : 'Message'}
        value={v}
        onChange={(e) => setV(e.target.value)}
        rows={3}
        placeholder={zh ? '写下一段文字…' : 'Write a short note…'}
        className="focus-visible:outline-2 focus-visible:outline-offset-2 w-full resize-none rounded-md border-2 border-[#2563eb] bg-white p-3 text-sm focus:outline-none"
      />
      <p className="mt-3 text-[11px] leading-relaxed text-[#475569]">{zh ? "纯色块与 2px 边框配实时字数，只保留当前本地草稿。" : "Solid fills and a flat 2px border with a live character chip \u2014 depth is purely colour-blocked. Local draft only; nothing is sent."}</p>
    </div>
  );
}

function HandDrawn({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [v, setV] = useSessionState(session, 'value', '');
  return (
    <div className="mx-auto w-full max-w-sm -rotate-1 bg-[#fbf7ec] p-5 text-[#2f2a25]">
      <p className="font-serif text-lg italic">{zh ? '草稿本' : 'Scratch pad'}</p>
      <textarea
        aria-label={zh ? '消息内容' : 'Message'}
        value={v}
        onChange={(e) => setV(e.target.value)}
        rows={3}
        placeholder={zh ? '写下一段文字…' : 'Write a short note…'}
        style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}
        className="focus-visible:outline-2 focus-visible:outline-offset-2 mt-3 w-full resize-none border-2 border-[#2f2a25] bg-transparent p-3 text-sm italic outline-none"
      />
      <p className="mt-3 text-[11px] leading-relaxed text-[#6b6155]">{zh ? "不规则描边与轻微倾斜像手绘纸面；只保留当前本地草稿。" : "Wobbly asymmetric radii and a slight tilt make the box feel penciled onto paper by hand. Local draft only; nothing is sent."}</p>
    </div>
  );
}

function Cyberpunk({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [v, setV] = useSessionState(session, 'value', '');
  return (
    <div
      className="mx-auto w-full max-w-sm bg-[#05060a] p-5 font-mono text-[#7df9ff]"
      style={{ border: '1px solid #ff2bd6', boxShadow: '0 0 12px #ff2bd6, inset 0 0 24px #ff2bd610' }}
    >
      <p className="mb-2 text-[10px] uppercase tracking-[0.35em] text-[#ff2bd6]">{zh ? '// 上行链路' : '// uplink'}</p>
      <textarea
        aria-label={zh ? '消息内容' : 'Message'}
        value={v}
        onChange={(e) => setV(e.target.value)}
        rows={3}
        placeholder={zh ? '写下一段文字…' : 'Write a short note…'}
        className="focus-visible:outline-2 focus-visible:outline-offset-2 w-full resize-none border border-[#7df9ff]/60 bg-[#0a0f18] p-3 text-xs text-[#7df9ff] outline-none placeholder:text-[#7df9ff]/40 focus:border-[#7df9ff] focus:shadow-[0_0_16px_#7df9ff]"
      />
      <p className="mt-3 text-[11px] leading-relaxed text-[#ff2bd6]/80">{zh ? "品红发光边框包围等宽输入区；仅本地草稿，不发送内容。" : "A magenta frame glows around a monospace input grid; the void background makes every neon edge hum. Local draft only; nothing is sent."}</p>
    </div>
  );
}


function Expanded({ session, locale, style }: VariantDemoProps & { style: RecipeStyleId }) {
  const zh = locale === 'zh';
  const r = recipe(style);
  const [value, setValue] = useSessionState(session, 'value', '');
  const [status, setStatus] = useSessionState(session, 'textareaFeedback', '');
  return <RecipeFrame style={style} locale={locale} title={zh ? '文字草稿' : 'Text draft'}>
    <label className="block text-sm">{zh ? '消息内容' : 'Message'}
      <textarea value={value} onChange={(event) => { setValue(event.target.value); setStatus(''); }} rows={4} placeholder={zh ? '写下一段文字…' : 'Write a short note…'} className={`focus-visible:outline-2 focus-visible:outline-offset-2 mt-2 w-full resize-y ${r.field}`} />
    </label>
    <p className={`mt-2 text-right text-xs tabular-nums ${r.muted}`}>{zh ? `${value.length} 个字符` : `${value.length} characters`}</p>
    <button type="button" onClick={() => { setValue(''); setStatus('cleared'); }} className={`focus-visible:outline-2 focus-visible:outline-offset-2 mt-3 ${r.secondary}`}>{zh ? '清空草稿' : 'Clear draft'}</button>
    <p role="status" className={`mt-3 text-sm ${r.muted}`}>{status === 'cleared' ? (zh ? '已清空，可重新输入。' : 'Cleared. Ready for a new draft.') : (zh ? '文本仅保留在当前演示会话。' : 'Text stays in this demo session only.')}</p>
  </RecipeFrame>;
}

const styleVariants: StyleVariantSet = [
  {
    style: 'flat-design',
    name: {"zh":"扁平化设计","en":"Flat Design"},
    note: {
      zh: '纯色块加 2px 平边，配实时字数小徽章，完全不用阴影和渐变来做层次。',
      en: 'Pure colour blocks, a flat 2px border and a live character chip — hierarchy with no shadow or gradient at all.',
    },
    Demo: Flat,
  },
  {
    style: 'hand-drawn',
    name: {"zh":"手绘涂鸦","en":"Hand-drawn UI"},
    note: {
      zh: '四角用不对称的抖动圆角画出歪斜描边，整块纸面轻转一度，像铅笔随手框出。',
      en: 'Asymmetric wobbling radii render a shaky outline, and the whole page tilts a degree like a pencil sketch.',
    },
    Demo: HandDrawn,
  },
  {
    style: 'cyberpunk',
    name: {"zh":"赛博朋克","en":"Cyberpunk"},
    note: {
      zh: '近黑底上一圈发光的品红边框，输入区是等宽青字，聚焦时整框亮起霓虹辉光。',
      en: 'A glowing magenta frame on near-black holds a monospace cyan grid, and focusing ignites the neon glow.',
    },
    Demo: Cyberpunk,
  },
  recipeVariant('minimalism', (props) => <Expanded {...props} style="minimalism" />, { zh: "发丝线、黑白反转与留白；文字区域、计数与清空按钮共用几何和材质，实时字数与清空均可用。", en: "Hairlines, monochrome inversion and whitespace; text area, counter and clear control share geometry and materials with working count and clear." }),
  recipeVariant('swiss-style', (props) => <Expanded {...props} style="swiss-style" />, { zh: "编号网格、直角边界与红色强调；文字区域、计数与清空按钮共用几何和材质，实时字数与清空均可用。", en: "An indexed grid, square edges and a red accent; text area, counter and clear control share geometry and materials with working count and clear." }),
  recipeVariant('neobrutalism', (props) => <Expanded {...props} style="neobrutalism" />, { zh: "粗黑描边、硬投影与高对比选中；文字区域、计数与清空按钮共用几何和材质，实时字数与清空均可用。", en: "Heavy black outlines, hard shadows and bold selection; text area, counter and clear control share geometry and materials with working count and clear." }),
  recipeVariant('neumorphism', (props) => <Expanded {...props} style="neumorphism" />, { zh: "同色曲面、双向阴影与实体边界；文字区域、计数与清空按钮共用几何和材质，实时字数与清空均可用。", en: "Shared soft surfaces, paired shadows and explicit borders; text area, counter and clear control share geometry and materials with working count and clear." }),
  recipeVariant('organic', (props) => <Expanded {...props} style="organic" />, { zh: "大地色与不规则圆角，柔和而清楚；文字区域、计数与清空按钮共用几何和材质，实时字数与清空均可用。", en: "Earth tones and irregular corners, soft yet clear; text area, counter and clear control share geometry and materials with working count and clear." }),
];

export default styleVariants;
