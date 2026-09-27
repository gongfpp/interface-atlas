import { type KeyboardEvent } from 'react';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function useTabs(session: VariantDemoProps['session'], count: number, initial: number) {
  const [active, setActive] = useSessionState(session, 'active', initial);
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const list = e.currentTarget;
    const buttons = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const focused = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const from = focused >= 0 ? focused : active;
    let next: number;
    if (e.key === 'ArrowRight') next = (from + 1) % count;
    else if (e.key === 'ArrowLeft') next = (from - 1 + count) % count;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = count - 1;
    else return;
    e.preventDefault();
    setActive(next);
    buttons[next]?.focus();
  };
  return { active, setActive, onKeyDown };
}

function Flat({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const tabs = en ? ['Design', 'Prototype', 'Specs'] : ['设计', '原型', '规格'];
  const panels = en
    ? ['Visual system and tokens.', 'Interactive flows and states.', 'Engineering handoff notes.']
    : ['视觉系统与设计变量。', '交互流程与状态。', '工程交接说明。'];
  const { active, setActive, onKeyDown } = useTabs(session, tabs.length, 0);
  const prefix = 'flat-tab';
  return (
    <div className="mx-auto w-full max-w-sm bg-paper">
      <div role="tablist" aria-label={en ? 'Project sections' : '项目分区'} onKeyDown={onKeyDown} className="flex gap-1">
        {tabs.map((t, i) => (
          <button
            key={t}
            type="button"
            role="tab"
            id={`${prefix}-${i}`}
            aria-selected={active === i}
            aria-controls={`${prefix}-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            className={`flex-1 px-3 py-2 text-xs font-medium ${active === i ? 'bg-accent text-white' : 'bg-code-bg text-ink-2 hover:bg-line'}`}
          >
            {t}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t}
          role="tabpanel"
          id={`${prefix}-panel-${i}`}
          aria-labelledby={`${prefix}-${i}`}
          hidden={active !== i}
          tabIndex={0}
          className="bg-raised p-4 text-xs leading-relaxed text-ink-2"
        >
          {panels[i]}
        </div>
      ))}
    </div>
  );
}

function LiquidGlass({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const tabs = en ? ['Day', 'Week', 'Month'] : ['日', '周', '月'];
  const panels = en
    ? ['Hourly forecast for the next 24 hours.', 'Daily outlook across seven days.', 'Monthly averages and trends.']
    : ['未来 24 小时的逐时预报。', '未来七天的每日展望。', '月度平均值与趋势。'];
  const { active, setActive, onKeyDown } = useTabs(session, tabs.length, 1);
  const prefix = 'glass-tab';
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-br from-[#2a2f45] to-[#5b3a6e] p-5">
      <span className="pointer-events-none absolute -top-10 left-1/4 h-24 w-40 rounded-full bg-white/30 blur-2xl" />
      <div role="tablist" aria-label={en ? 'Time range' : '时间范围'} onKeyDown={onKeyDown} className="relative flex rounded-full border border-white/40 bg-white/10 p-1 backdrop-blur-xl">
        {tabs.map((t, i) => (
          <button
            key={t}
            type="button"
            role="tab"
            id={`${prefix}-${i}`}
            aria-selected={active === i}
            aria-controls={`${prefix}-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${active === i ? 'bg-white/80 text-[#2a2f45] shadow-[inset_0_1px_1px_rgba(255,255,255,.9)]' : 'text-white/80 hover:bg-white/10'}`}
          >
            {t}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t}
          role="tabpanel"
          id={`${prefix}-panel-${i}`}
          aria-labelledby={`${prefix}-${i}`}
          hidden={active !== i}
          tabIndex={0}
          className="relative mt-4 text-center text-[11px] text-white/85"
        >
          {panels[i]}
        </div>
      ))}
    </div>
  );
}

function Memphis({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const tabs = en ? ['Pop', 'Jazz', 'Funk'] : ['流行', '爵士', '放克'];
  const panels = en
    ? ['Bright, maximalist pop styling.', 'Laid-back jazz groove.', 'Heavy syncopated funk.']
    : ['明亮、极繁的流行风格。', '慵懒的爵士律动。', '重切分的放克。'];
  const { active, setActive, onKeyDown } = useTabs(session, tabs.length, 0);
  const prefix = 'memphis-tab';
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden bg-[#fdf3e3] p-5" style={{ border: '3px solid #111' }}>
      <span className="pointer-events-none absolute right-4 top-3 text-lg text-[#00a7c4]">◌</span>
      <span className="pointer-events-none absolute bottom-3 left-4 h-4 w-4 rotate-12 bg-[#ff5da2]" style={{ borderRadius: '40% 60% 55% 45%' }} />
      <div role="tablist" aria-label={en ? 'Genres' : '曲风'} onKeyDown={onKeyDown} className="relative flex gap-2">
        {tabs.map((t, i) => (
          <button
            key={t}
            type="button"
            role="tab"
            id={`${prefix}-${i}`}
            aria-selected={active === i}
            aria-controls={`${prefix}-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            className={`px-3 py-2 text-xs font-black uppercase ${i % 2 ? 'rotate-1' : '-rotate-1'} ${active === i ? 'bg-[#ffd23f] shadow-[3px_3px_0_0_#111]' : 'bg-white'}`}
            style={{ border: '3px solid #111' }}
          >
            {t}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t}
          role="tabpanel"
          id={`${prefix}-panel-${i}`}
          aria-labelledby={`${prefix}-${i}`}
          hidden={active !== i}
          tabIndex={0}
          className="relative mt-4 text-xs font-medium text-black/70"
        >
          {panels[i]}
        </div>
      ))}
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'flat-design',
    name: { zh: '扁平设计', en: 'Flat Design' },
    note: {
      zh: '纯色块标签页，零圆角零阴影，选中态就是一块实心强调色；方向键可切换标签。',
      en: 'Solid colour blocks with no radius or shadow — selection is a filled accent tile, switchable with arrow keys.',
    },
    Demo: Flat,
  },
  {
    style: 'liquid-glass',
    name: { zh: '液态玻璃', en: 'Liquid Glass' },
    note: {
      zh: '几乎透明的胶囊分段控件，选中项是一块带顶部高光的乳白玻璃浮片。',
      en: 'A near-clear pill segmented control whose selection is a milky glass chip with a specular top highlight.',
    },
    Demo: LiquidGlass,
  },
  {
    style: 'memphis',
    name: { zh: '孟菲斯', en: 'Memphis' },
    note: {
      zh: '倾斜的粗描边色块配几何涂鸦装饰，选中标签弹出一块硬投影的黄。',
      en: 'Tilted, thick-outlined colour blocks with doodled geometry; the active chip pops out on a hard yellow shadow.',
    },
    Demo: Memphis,
  },
];

export default styleVariants;
