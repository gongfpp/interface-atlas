import { type KeyboardEvent } from 'react';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

/** 悬停与键盘聚焦都能显示；Escape 关闭；提示带 role=tooltip 与 aria-describedby。 */
function useTooltip(session: VariantDemoProps['session'], id: string) {
  const [show, setShow] = useSessionState(session, 'open', false);
  const triggerProps = {
    'aria-describedby': show ? id : undefined,
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false),
    onFocus: () => setShow(true),
    onBlur: () => setShow(false),
    onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Escape') setShow(false);
    },
  };
  return { show, triggerProps, tooltipProps: { role: 'tooltip' as const, id } };
}

function RetroTooltip({ session }: VariantDemoProps) {
  const { show, triggerProps, tooltipProps } = useTooltip(session, 'retro-tooltip');
  return (
    <div
      className="mx-auto w-full max-w-sm rounded-lg bg-[#1b1420] p-8 text-[#f4d9a0]"
      style={{ border: '1px solid #ffb347', boxShadow: 'inset 0 0 24px #ffb34722' }}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#ffb347]">System 84</p>
      <div className="relative mt-4 inline-block">
        <button
          {...triggerProps}
          className="rounded border border-[#ffb347] bg-gradient-to-b from-[#ffd27a] to-[#c98a2e] px-4 py-2 text-xs font-bold text-[#1b1420] shadow-[0_0_16px_#ffb34766]"
        >
          Hover or focus
        </button>
        {show && (
          <span {...tooltipProps} className="absolute -top-10 left-0 z-10 whitespace-nowrap rounded border border-[#ffb347] bg-[#1b1420] px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-[#ffb347] shadow-[0_0_18px_#ffb34755]">
            Power: 98%
          </span>
        )}
      </div>
      <p className="mt-6 text-[11px] leading-relaxed text-[#f4d9a0]/70">A chrome button with a glowing neon tooltip.</p>
    </div>
  );
}

function CyberTooltip({ session }: VariantDemoProps) {
  const { show, triggerProps, tooltipProps } = useTooltip(session, 'cyber-tooltip');
  return (
    <div className="mx-auto w-full max-w-sm bg-[#05060a] p-8 font-mono text-[#7cf9ff]" style={{ border: '1px solid #ff2e88' }}>
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#ff2e88]">net://node</p>
      <div className="relative mt-4 inline-block">
        <button
          {...triggerProps}
          className="border border-[#7cf9ff] px-4 py-2 text-xs uppercase tracking-widest text-[#7cf9ff]"
          style={{ boxShadow: '0 0 12px #7cf9ff88, inset 0 0 8px #7cf9ff33' }}
        >
          [ ping ]
        </button>
        {show && (
          <span
            {...tooltipProps}
            className="absolute -top-9 left-0 z-10 whitespace-nowrap border border-[#ff2e88] bg-[#0b0d14] px-2 py-1 text-[10px] tracking-wider text-[#ff2e88]"
            style={{ boxShadow: '0 0 14px #ff2e88aa' }}
          >
            &gt; latency 12ms
          </span>
        )}
      </div>
      <p className="mt-6 text-[11px] leading-relaxed text-[#7cf9ff]/60">Neon outlines and glow on near-black, all monospace.</p>
    </div>
  );
}

function SkeuoTooltip({ session }: VariantDemoProps) {
  const { show, triggerProps, tooltipProps } = useTooltip(session, 'skeuo-tooltip');
  return (
    <div
      className="mx-auto w-full max-w-sm rounded-xl p-8 text-[#2b2b2b]"
      style={{ background: 'linear-gradient(#f2efe6,#d9d3c4)', boxShadow: 'inset 0 1px 0 #fff, inset 0 -2px 4px #b9b2a1' }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7a7264]">Toolbar</p>
      <div className="relative mt-4 inline-block">
        <button
          {...triggerProps}
          className="rounded-md border border-[#9a927f] px-4 py-2 text-xs font-semibold text-[#3a352b]"
          style={{ background: 'linear-gradient(#ffffff,#dcd6c6)', boxShadow: 'inset 0 1px 0 #fff, 0 2px 3px #00000033' }}
        >
          Bold
        </button>
        {show && (
          <span
            {...tooltipProps}
            className="absolute -top-9 left-0 z-10 whitespace-nowrap rounded-md border border-[#8a816d] px-2 py-1 text-[10px] font-semibold text-[#2b2b2b]"
            style={{ background: 'linear-gradient(#fffbe9,#e8dfc2)', boxShadow: '0 2px 4px #00000040' }}
          >
            Make text bold
          </span>
        )}
      </div>
      <p className="mt-6 text-[11px] leading-relaxed text-[#7a7264]">Glossy bevels imitate a physical desktop tooltip.</p>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'retro-futurism',
    name: { zh: '复古未来主义', en: 'Retro-Futurism' },
    note: {
      zh: '铬黄渐变的实体按钮上浮出发光霓虹提示，像 80 年代机器面板；键盘聚焦也会显示。',
      en: 'A glowing neon tooltip rises off a chrome-gradient button, like an 80s machine panel — keyboard focus shows it too.',
    },
    Demo: RetroTooltip,
  },
  {
    style: 'cyberpunk',
    name: { zh: '赛博朋克', en: 'Cyberpunk' },
    note: {
      zh: '近黑底上只用青色描边与洋红光晕，提示文本全部等宽终端风。',
      en: 'On near-black only cyan outlines and magenta glow; the tooltip text is all monospace terminal.',
    },
    Demo: CyberTooltip,
  },
  {
    style: 'skeuomorphism',
    name: { zh: '拟物化', en: 'Skeuomorphism' },
    note: {
      zh: '提示条做成有内高光与投影的奶油色实体标签，像桌面软件的浮出说明。',
      en: 'The tooltip is a cream physical label with inner highlight and drop shadow, like a desktop app callout.',
    },
    Demo: SkeuoTooltip,
  },
];

export default styleVariants;
