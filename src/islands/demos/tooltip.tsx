import { useRef, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';
import { TooltipLayer } from '../shared/TooltipLayer';
import type { TooltipPlacement as Placement } from '../../lib/tooltip-placement';

type Skin = 'dark' | 'light' | 'rich';

const ARROW: Record<Placement, string> = {
  top: 'top-full left-[var(--tooltip-arrow-x)] -translate-x-1/2 -mt-[3px]',
  bottom: 'bottom-full left-[var(--tooltip-arrow-x)] -translate-x-1/2 -mb-[3px]',
  left: 'left-full top-[var(--tooltip-arrow-y)] -translate-y-1/2 -ml-[3px]',
  right: 'right-full top-[var(--tooltip-arrow-y)] -translate-y-1/2 -mr-[3px]',
};

function Tip({
  label,
  placement = 'top',
  skin = 'dark',
  delay = 300,
  triggerClass,
  children,
}: {
  label: React.ReactNode;
  placement?: Placement;
  skin?: Skin;
  delay?: number;
  triggerClass?: string;
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const root = useRef<HTMLSpanElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  const enter = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setShow(true), delay);
  };
  const leave = () => {
    window.clearTimeout(timer.current);
    setShow(false);
  };

  const bubbleSkin =
    skin === 'dark'
      ? 'bg-ink text-paper'
      : 'border border-line bg-raised text-ink shadow-md';
  const arrowSkin = skin === 'dark' ? 'bg-ink' : 'border border-line bg-raised';

  return (
    <span
      ref={root}
      className="relative inline-flex"
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={() => setShow(true)}
      onBlur={leave}
    >
      <button
        ref={trigger}
        data-anatomy="1"
        aria-describedby={show ? 'tip' : undefined}
        className={`rounded-lg border border-line bg-raised px-2.5 py-1 text-xs text-ink-2 transition-colors hover:border-accent hover:text-accent ${triggerClass ?? ''}`}
      >
        {children}
      </button>
      {show && (
        <TooltipLayer as="span" root={root} anchor={trigger} preferred={placement} gap={8} className="pointer-events-none">{(actualPlacement) => (
          <span
            id="tip"
            role="tooltip"
            data-anatomy="2"
            className={`relative block whitespace-normal break-words rounded-md px-2 py-1 text-[11px] leading-snug ${bubbleSkin}`}
            style={{ animation: 'demo-tip-in calc(150ms * var(--demo-speed, 1)) both' }}
          >
            {label}
            <span
              data-anatomy="3"
              aria-hidden="true"
              className={`absolute h-1.5 w-1.5 rotate-45 ${arrowSkin} ${skin === 'light' || skin === 'rich' ? 'border-line' : ''} ${ARROW[actualPlacement]}`}
              style={skin === 'dark' ? undefined : { clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
            />
          </span>
        )}</TooltipLayer>
      )}
    </span>
  );
}

function Toolbar() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 rounded-xl border border-line bg-paper px-3 py-2">
        <Tip label="粗体 ⌘B">B</Tip>
        <Tip label="斜体 ⌘I"><span className="italic">I</span></Tip>
        <Tip label="删除线 ⌘⇧X"><span className="line-through">S</span></Tip>
        <Tip label="插入链接 ⌘K">⌘K</Tip>
      </div>
      <Tip
        placement="bottom"
        label="Acme Design System v2.4.1 · 全量更新日志见 changelog.acme.dev"
        triggerClass="max-w-[240px] truncate text-left"
      >
        Acme Design System v2.4.1 · 全量更新日志见 changelog.acme.dev
      </Tip>
      <p className="text-center text-[11px] text-ink-3">悬停按钮或被截断的文本 / Hover the buttons or truncated text</p>
    </div>
  );
}

const TooltipDemo: DemoComponent = ({ mode }) => {
  const keyframes = (
    <style>{`@keyframes demo-tip-in { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: none } }`}</style>
  );
  if (mode === 'variants') {
    return (
      <div className="flex flex-col items-center gap-3">
        {keyframes}
        <div className="flex items-center gap-2">
          <Tip skin="dark" label="深色气泡 Dark">深色</Tip>
          <Tip skin="light" label="浅色卡片 Light">浅色</Tip>
          <Tip skin="rich" label={<span><b>快捷键</b> · <kbd className="font-mono text-[10px]">⌘K</kbd></span>}>
            富提示
          </Tip>
        </div>
        <div className="flex items-center gap-2">
          <Tip placement="top" label="上方 Top">上方</Tip>
          <Tip placement="bottom" label="下方 Bottom">下方</Tip>
          <Tip placement="left" label="左侧 Left">左侧</Tip>
          <Tip placement="right" label="右侧 Right">右侧</Tip>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-4">
      {keyframes}
      <Toolbar />
    </div>
  );
};

export default TooltipDemo;
