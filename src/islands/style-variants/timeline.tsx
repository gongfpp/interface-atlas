import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function Vapor({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [open, setOpen] = useSessionState(session, 'open', 0);
  const events = [
    { t: '09:12', title: 'Deploy started' },
    { t: '09:40', title: 'Tests passed' },
    { t: '10:05', title: 'Live' },
  ];
  return (
    <div
      className="mx-auto w-full max-w-sm rounded-lg bg-[#1a0b2e] p-5 text-[#e9d5ff]"
      style={{
        backgroundImage: 'linear-gradient(#ff4fd844 1px, transparent 1px), linear-gradient(90deg,#22d3ee44 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#22d3ee]">{en ? 'Activity log' : '活动日志'}</p>
      <ol className="relative border-l border-[#ff4fd8]/50 pl-5">
        {events.map((e, i) => (
          <li key={e.t} className="mb-3 last:mb-0">
            <button onClick={() => setOpen(i)} className="w-full text-left">
              <span className={`absolute -left-[6px] mt-1.5 h-3 w-3 rotate-45 border ${open === i ? 'border-[#22d3ee] bg-[#22d3ee] shadow-[0_0_10px_#22d3ee]' : 'border-[#ff4fd8] bg-[#1a0b2e]'}`} />
              <span className="font-mono text-[10px] text-[#22d3ee]">{e.t}</span>
              <span className="ml-2 text-sm">{e.title}</span>
            </button>
            {open === i && <p className="mt-1 text-[11px] text-[#e9d5ff]/70">{en ? 'processed by runner-04 · 1.2s' : '由 runner-04 处理 · 1.2s'}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Organic({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [open, setOpen] = useSessionState(session, 'open', 1);
  const events = ['Seeded', 'Watered', 'Bloomed'];
  return (
    <div className="mx-auto w-full max-w-sm rounded-[2rem] bg-[#f3efe2] p-6 text-[#3f4a34]">
      <p className="mb-4 font-serif text-lg">{en ? 'Growth journal' : '生长日志'}</p>
      <ol className="space-y-4">
        {events.map((e, i) => (
          <li key={e} className="flex items-start gap-3">
            <span className={`mt-0.5 h-5 w-5 shrink-0 rounded-[60%_40%_55%_45%] border border-[#7c8b5e] ${open === i ? 'bg-[#8ea562]' : 'bg-transparent'}`} />
            <button onClick={() => setOpen(i)} className="flex-1 text-left">
              <span className="text-sm font-semibold">{e}</span>
              {open === i && <span className="mt-1 block font-serif text-xs italic text-[#6b7355]">{en ? 'A gentle note about this step, growing over time.' : '关于这一步的一点记录，随时间慢慢生长。'}</span>}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Raw({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [open, setOpen] = useSessionState(session, 'open', 0);
  const events = ['BUILD', 'TEST', 'SHIP'];
  return (
    <div className="mx-auto w-full max-w-sm bg-white p-5 text-black" style={{ border: '4px solid #000' }}>
      <p className="font-mono text-4xl font-black leading-none tracking-tighter">{en ? 'LOG' : '日志'}</p>
      <ol className="mt-4 divide-y-2 divide-black border-y-4 border-black">
        {events.map((e, i) => (
          <li key={e} className="py-2">
            <button onClick={() => setOpen(i)} className="flex w-full items-baseline justify-between">
              <span className="font-mono text-2xl font-bold">{e}</span>
              <span className="font-mono text-xs">{String(i).padStart(2, '0')}:45</span>
            </button>
            {open === i && <p className="mt-1 font-mono text-[11px] uppercase">{en ? '[detail] raw system output, no decoration.' : '[详情] 原始系统输出，无修饰。'}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'vaporwave',
    name: { zh: '蒸汽波', en: 'Vaporwave' },
    note: {
      zh: '紫黑底叠粉青网格，发光菱形节点配等宽时间戳，展开项亮起霓虹。',
      en: 'A purple-black base under a pink/cyan grid, with glowing diamond markers, monospace timestamps and a neon active node.',
    },
    Demo: Vapor,
  },
  {
    style: 'organic',
    name: { zh: '自然有机', en: 'Organic' },
    note: {
      zh: '奶油绿圆润曲面节点与衬线日记体，柔和块面取代连线，像植物生长记录。',
      en: 'Cream and green rounded organic markers in a serif journal voice, with soft shapes replacing the connecting line.',
    },
    Demo: Organic,
  },
  {
    style: 'brutalism',
    name: { zh: '粗野主义', en: 'Brutalism' },
    note: {
      zh: '超大等宽标题套在 4px 黑框里，事件像未经修饰直接打印的系统日志。',
      en: 'Oversized monospace headings inside a 4px black frame; events read like raw, undecorated printed system logs.',
    },
    Demo: Raw,
  },
];

export default styleVariants;
