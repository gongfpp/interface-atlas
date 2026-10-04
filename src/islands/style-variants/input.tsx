import { useId, useRef, type ReactNode } from 'react';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/** 同一份本地邮箱状态在切换风格时保留输入与校验结果。 */
function useEmailDemo({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const id = useId();
  const [value, setValue] = useSessionState(session, 'value', '');
  const [touched, setTouched] = useSessionState(session, 'inputTouched', false);
  const [feedback, setFeedback] = useSessionState<'idle' | 'cleared' | 'checked'>(session, 'inputFeedback', 'idle');
  const invalid = touched && !validEmail(value);
  return {
    zh, id, value, invalid,
    hint: invalid
      ? zh ? '请输入完整邮箱，例如 name@studio.com。' : 'Enter a complete email, for example name@studio.com.'
      : zh ? '输入邮箱后移开焦点，即可检查格式。' : 'Enter an email, then leave the field to check its format.',
    status: feedback === 'cleared'
      ? zh ? '已清空，可以重新输入。' : 'Cleared. Ready for a new email.'
      : feedback === 'checked' && !invalid
        ? zh ? '格式有效。仅在此处检查，未发送邮件。' : 'Format looks valid. Checked here only; nothing was sent.'
        : '',
    change(next: string) { setValue(next); setFeedback('idle'); },
    blur() { setTouched(true); },
    clear() { setValue(''); setTouched(false); setFeedback('cleared'); },
    check() { setTouched(true); setFeedback('checked'); },
  };
}

type EmailDemo = ReturnType<typeof useEmailDemo>;

function EmailField({ demo, labelClassName, inputClassName, clearClassName = '', prefix }: {
  demo: EmailDemo;
  labelClassName: string;
  inputClassName: string;
  clearClassName?: string;
  prefix?: ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="min-w-0">
      <label htmlFor={`${demo.id}-email`} className={`block ${labelClassName}`}>
        {demo.zh ? '邮箱地址' : 'Email address'}
      </label>
      <div className="relative mt-2 min-w-0">
        {prefix}
        <input
          ref={inputRef}
          id={`${demo.id}-email`}
          type="email"
          autoComplete="off"
          spellCheck={false}
          value={demo.value}
          onChange={(event) => demo.change(event.target.value)}
          onBlur={demo.blur}
          placeholder="name@studio.com"
          aria-invalid={demo.invalid}
          aria-describedby={`${demo.id}-hint ${demo.id}-local`}
          className={`min-h-12 w-full min-w-0 pr-14 text-base focus-visible:outline-2 focus-visible:outline-offset-2 ${inputClassName}`}
        />
        {demo.value && (
          <button
            type="button"
            aria-label={demo.zh ? '清空邮箱' : 'Clear email'}
            onClick={() => { demo.clear(); inputRef.current?.focus(); }}
            className={`absolute inset-y-0 right-0 my-auto flex h-11 w-11 items-center justify-center text-xl focus-visible:outline-2 focus-visible:outline-offset-2 ${clearClassName}`}
          >
            <span aria-hidden="true">×</span>
          </button>
        )}
      </div>
    </div>
  );
}

function EmailFeedback({ demo, buttonClassName, errorClassName = 'text-[#a1281b]', hintClassName = '' }: {
  demo: EmailDemo; buttonClassName: string; errorClassName?: string; hintClassName?: string;
}) {
  return (
    <div className="mt-4 space-y-3 text-xs leading-relaxed [overflow-wrap:anywhere]">
      <p id={`${demo.id}-hint`} aria-live="polite" className={demo.invalid ? `font-semibold ${errorClassName}` : hintClassName}>{demo.hint}</p>
      <button type="submit" className={`min-h-11 max-w-full px-3 py-2 text-left text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 ${buttonClassName}`}>
        {demo.zh ? '检查格式' : 'Check format'}
      </button>
      <p role="status" className="min-h-5">{demo.status}</p>
      <p id={`${demo.id}-local`} className={`text-[11px] ${hintClassName}`}>
        {demo.zh ? '本地交互演示 · 不会订阅或发送邮件' : 'Local interaction demo · No subscription or email is sent'}
      </p>
    </div>
  );
}

function Minimal(props: VariantDemoProps) {
  const demo = useEmailDemo(props);
  return (
    <form noValidate onSubmit={(event) => { event.preventDefault(); demo.check(); }} className="mx-auto w-full max-w-sm border border-black/10 bg-white p-6 text-black">
      <EmailField demo={demo} labelClassName="font-mono text-[10px] uppercase tracking-[0.25em] text-black/65" inputClassName="border-b border-black/40 bg-transparent placeholder:text-black/50 focus:border-black aria-invalid:border-[#a1281b]" />
      <EmailFeedback demo={demo} buttonClassName="border-b border-black hover:bg-black/5" hintClassName="text-black/65" />
    </form>
  );
}

function Neobrutal(props: VariantDemoProps) {
  const demo = useEmailDemo(props);
  return (
    <form noValidate onSubmit={(event) => { event.preventDefault(); demo.check(); }} className="mx-auto w-full max-w-sm border-[2.5px] border-black bg-[#b8e0ff] p-5 text-black">
      <EmailField demo={demo} labelClassName="font-mono text-[10px] font-black uppercase tracking-[0.2em]" inputClassName="border-[2.5px] border-black bg-white px-3 font-bold shadow-[4px_4px_0_0_#000] motion-safe:transition-[translate,box-shadow] motion-safe:duration-100 motion-safe:focus:translate-x-[2px] motion-safe:focus:translate-y-[2px] focus:shadow-none aria-invalid:border-[#a1281b]" clearClassName="right-1" />
      <EmailFeedback demo={demo} buttonClassName="border-2 border-black bg-[#ffe66d] font-black uppercase shadow-[3px_3px_0_#000] hover:bg-white active:shadow-none motion-safe:active:translate-x-px motion-safe:active:translate-y-px" />
    </form>
  );
}

function Editorial(props: VariantDemoProps) {
  const demo = useEmailDemo(props);
  return (
    <form noValidate onSubmit={(event) => { event.preventDefault(); demo.check(); }} className="mx-auto w-full max-w-sm border-y-4 border-double border-ink bg-paper px-2 py-6 text-ink">
      <p className="font-serif text-2xl leading-none">{demo.zh ? '订阅' : 'Subscribe'}</p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-2">{demo.zh ? '每周通讯 · 格式预览' : 'The Weekly Dispatch · Format preview'}</p>
      <div className="mt-6 border-t border-line-strong pt-4">
        <EmailField demo={demo} labelClassName="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-2" inputClassName="border-b-2 border-ink bg-transparent font-serif text-lg italic placeholder:text-ink-2 focus:border-accent aria-invalid:border-accent" />
      </div>
      <EmailFeedback demo={demo} buttonClassName="border-b border-ink font-serif italic hover:text-accent" errorClassName="text-accent italic" hintClassName="text-ink-2" />
    </form>
  );
}

function Swiss(props: VariantDemoProps) {
  const demo = useEmailDemo(props);
  return (
    <form noValidate onSubmit={(event) => { event.preventDefault(); demo.check(); }} className="mx-auto grid w-full max-w-sm grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 border-t-4 border-black bg-[#f2f1ed] p-4 font-sans text-black">
      <span aria-hidden="true" className="border-t border-black pt-2 text-4xl leading-none tracking-tighter text-[#c72d0e]">01</span>
      <div className="min-w-0 border-t border-black pt-2">
        <h3 className="mb-6 break-words text-3xl leading-none tracking-tight">{demo.zh ? '联系信息' : 'Contact'}</h3>
        <EmailField demo={demo} labelClassName="text-xs font-semibold" inputClassName="border-0 border-b-2 border-black bg-white px-2 placeholder:text-black/55 focus-visible:outline-black aria-invalid:border-[#b32616]" />
        <EmailFeedback demo={demo} buttonClassName="w-full bg-black text-white hover:bg-[#333] focus-visible:outline-black" hintClassName="text-black/70" />
      </div>
    </form>
  );
}

function Cyberpunk(props: VariantDemoProps) {
  const demo = useEmailDemo(props);
  return (
    <form noValidate onSubmit={(event) => { event.preventDefault(); demo.check(); }} className="relative mx-auto w-full max-w-sm border border-[#00e5ff]/70 bg-[#0d0b14] p-5 font-mono text-[#edfaff] shadow-[0_0_8px_#00e5ff22]">
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.04] [background:repeating-linear-gradient(0deg,#fff_0_1px,transparent_1px_4px)]" />
      <div className="relative">
        <p className="mb-5 border-l-4 border-[#ff2e88] bg-white/5 px-3 py-2 text-xs uppercase tracking-wider [clip-path:polygon(0_0,calc(100%_-_12px)_0,100%_12px,100%_100%,0_100%)]">{demo.zh ? '终端 01 / 本地模式' : 'Terminal 01 / Local mode'}</p>
        <EmailField demo={demo} labelClassName="text-[11px] uppercase tracking-wider" inputClassName="border border-[#00e5ff] bg-[#12101f] pl-8 text-sm text-[#edfaff] placeholder:text-[#a6a9bc] focus-visible:outline-[#00e5ff] focus:shadow-[0_0_8px_#00e5ff55] aria-invalid:border-[#ff94bc]" clearClassName="text-[#00e5ff] focus-visible:outline-[#00e5ff]" prefix={<span aria-hidden="true" className="pointer-events-none absolute left-3 top-3 text-[#00e5ff]">&gt;</span>} />
        <EmailFeedback demo={demo} buttonClassName="border border-[#00e5ff] bg-[#00e5ff]/10 text-[#e1fbff] hover:bg-[#00e5ff]/20 focus-visible:outline-[#00e5ff]" errorClassName="text-[#ff94bc]" hintClassName="text-[#b7c8d6]" />
      </div>
    </form>
  );
}

function Neumorphic(props: VariantDemoProps) {
  const demo = useEmailDemo(props);
  return (
    <form noValidate onSubmit={(event) => { event.preventDefault(); demo.check(); }} className="mx-auto w-full max-w-sm rounded-3xl bg-[#e7ecf2] p-6 text-[#283c50] shadow-[8px_8px_18px_#bcc6d1,-8px_-8px_18px_#ffffff]">
      <div className="mb-6 flex min-h-12 w-12 items-center justify-center rounded-2xl bg-[#e7ecf2] text-xl font-semibold shadow-[4px_4px_8px_#bdc8d3,-4px_-4px_8px_#ffffff]" aria-hidden="true">@</div>
      <EmailField demo={demo} labelClassName="text-sm font-semibold" inputClassName="rounded-xl border border-[#738496] bg-[#e7ecf2] px-3 shadow-[inset_4px_4px_8px_#c1cbd6,inset_-4px_-4px_8px_#ffffff] placeholder:text-[#596b7d] focus-visible:outline-[#1756a9] aria-invalid:border-[#a1281b]" clearClassName="right-1 rounded-lg focus-visible:outline-[#1756a9]" />
      <EmailFeedback demo={demo} buttonClassName="rounded-xl border border-[#738496] bg-[#e7ecf2] shadow-[4px_4px_8px_#bdc8d3,-4px_-4px_8px_#ffffff] hover:border-[#1756a9] active:shadow-[inset_3px_3px_6px_#bdc8d3,inset_-3px_-3px_6px_#ffffff] focus-visible:outline-[#1756a9]" hintClassName="text-[#4d6175]" />
    </form>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'minimalism', name: { zh: '极简主义', en: 'Minimalism' },
    note: { zh: '发丝下划线、微小标签与留白框定输入；本地格式检查与清空可实际操作。', en: 'A hairline underline, tiny label and whitespace frame a working local format check and clear action.' },
    Demo: Minimal,
  },
  {
    style: 'neobrutalism', name: { zh: '新粗野主义', en: 'Neobrutalism' },
    note: { zh: '粗黑描边与硬投影形成按压手感；减少动态效果时保留静态聚焦边框。', en: 'Heavy black outlines and hard shadows create a pressed surface; reduced motion retains a static focus outline.' },
    Demo: Neobrutal,
  },
  {
    style: 'editorial', name: { zh: '杂志编辑风', en: 'Editorial' },
    note: { zh: '双线书眉、衬线标题与斜体输入行构成通讯版式，仅演示格式检查。', en: 'Double rules, a serif masthead and an italic field create a newsletter layout with local format checking only.' },
    Demo: Editorial,
  },
  {
    style: 'swiss-style', name: { zh: '瑞士风格', en: 'Swiss Style' },
    note: { zh: '编号侧栏与严格网格对齐，字号跳跃、黑白表面及单一红色编号建立秩序。', en: 'An indexed rail and strict grid use type-scale contrast, black-and-white surfaces and one red index.' },
    Demo: Swiss,
  },
  {
    style: 'cyberpunk', name: { zh: '赛博朋克', en: 'Cyberpunk' },
    note: { zh: '等宽终端、切角标题与静态扫描线配霓虹实体描边，正文保持高对比。', en: 'A monospace terminal, corner-cut header and static scanlines pair solid neon edges with readable body text.' },
    Demo: Cyberpunk,
  },
  {
    style: 'neumorphism', name: { zh: '新拟态', en: 'Neumorphism' },
    note: { zh: '同色柔软表面上用双阴影区分凸起控件与凹陷输入，另保留实线边界与焦点。', en: 'Paired shadows distinguish raised controls from an inset field on a shared soft surface, with explicit borders and focus.' },
    Demo: Neumorphic,
  },
];

export default styleVariants;
