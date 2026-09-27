import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function Minimal({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [v, setV] = useSessionState(session, 'value', '');
  return (
    <div className="mx-auto w-full max-w-sm space-y-4 border border-black/10 bg-white p-6 text-black">
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/50">{zh ? '邮箱地址' : 'Email address'}</span>
        <input
          value={v}
          onChange={(e) => setV(e.target.value)}
          placeholder="name@studio.com"
          className="mt-3 w-full border-b border-black/30 bg-transparent pb-2 text-sm outline-none placeholder:text-black/25 focus:border-black"
        />
      </label>
      <p className="text-[11px] leading-relaxed text-black/45">A single hairline under the field — the tiny uppercase label does all the framing.</p>
    </div>
  );
}

function Neobrutal({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [v, setV] = useSessionState(session, 'value', 'hello@studio');
  return (
    <div className="mx-auto w-full max-w-sm border-[2.5px] border-black bg-[#b8e0ff] p-5 text-black">
      <label className="block">
        <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em]">{zh ? '你的邮箱' : 'Your email'}</span>
        <input
          value={v}
          onChange={(e) => setV(e.target.value)}
          className="mt-2 w-full border-[2.5px] border-black bg-white px-3 py-2 text-sm font-bold shadow-[4px_4px_0_0_#000] transition-all duration-100 focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none focus:outline-none"
        />
      </label>
      <p className="mt-3 text-[11px] font-medium leading-relaxed">A 2.5px outline plus hard offset shadow; focusing presses the field into the page.</p>
    </div>
  );
}

function Editorial({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [v, setV] = useSessionState(session, 'value', '');
  return (
    <div className="mx-auto w-full max-w-sm border-y-4 border-double border-ink bg-paper px-1 py-6 text-ink">
      <p className="font-serif text-2xl leading-none">{zh ? '订阅' : 'Subscribe'}</p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-3">The Weekly Dispatch</p>
      <label className="mt-6 block border-t border-line-strong pt-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-2">{zh ? '邮箱' : 'Email'}</span>
        <input
          value={v}
          onChange={(e) => setV(e.target.value)}
          placeholder="reader@example.com"
          className="mt-2 w-full border-b-2 border-ink bg-transparent pb-2 font-serif text-lg italic outline-none placeholder:text-ink-3/60 focus:border-accent"
        />
      </label>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'minimalism',
    name: { zh: '极简主义', en: 'Minimalism' },
    note: {
      zh: '只保留一条发丝下划线，用微小大写标签和留白承担框定，聚焦仅把线变黑。',
      en: 'Only a hairline underline remains; a tiny uppercase label and whitespace do the framing, and focus simply darkens the line.',
    },
    Demo: Minimal,
  },
  {
    style: 'neobrutalism',
    name: { zh: '新粗野主义', en: 'Neobrutalism' },
    note: {
      zh: '2.5px 黑描边配硬边投影，聚焦时输入框向右下压入、投影消失。',
      en: 'A 2.5px black outline with a hard offset shadow; focusing sinks the field down-right and drops the shadow.',
    },
    Demo: Neobrutal,
  },
  {
    style: 'editorial',
    name: { zh: '杂志编辑风', en: 'Editorial' },
    note: {
      zh: '双线书眉配衬线标题，输入行用粗衬线斜体，聚焦转为品牌红的下边线。',
      en: 'Double-rule masthead with a serif headline; the field is bold serif italic and its rule turns accent red on focus.',
    },
    Demo: Editorial,
  },
];

export default styleVariants;
