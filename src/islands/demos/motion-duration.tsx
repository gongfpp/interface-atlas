import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type EaseKey = 'out' | 'standard' | 'in';

const EASE: Record<
  EaseKey,
  { css: string; pts: [number, number, number, number]; zh: string; en: string }
> = {
  out: {
    css: 'cubic-bezier(0, 0, 0.2, 1)',
    pts: [0, 0, 0.2, 1],
    zh: 'ease-out · 入场',
    en: 'ease-out · enter',
  },
  standard: {
    css: 'cubic-bezier(0.2, 0, 0, 1)',
    pts: [0.2, 0, 0, 1],
    zh: '标准',
    en: 'Standard',
  },
  in: {
    css: 'cubic-bezier(0.4, 0, 1, 1)',
    pts: [0.4, 0, 1, 1],
    zh: 'ease-in · 退场',
    en: 'ease-in · exit',
  },
};

const DURATIONS = [
  { ms: 120, zh: '微反馈', en: 'Micro', range: '100–150ms' },
  { ms: 240, zh: '标准', en: 'Standard', range: '200–300ms' },
  { ms: 420, zh: '强调', en: 'Emphasized', range: '300–500ms' },
];

const EaseCurve = ({ pts }: { pts: [number, number, number, number] }) => {
  const [x1, y1, x2, y2] = pts;
  const x = (v: number) => 2 + v * 56;
  const y = (v: number) => 58 - v * 56;
  const d = `M 2 58 C ${x(x1)} ${y(y1)}, ${x(x2)} ${y(y2)}, 58 2`;
  return (
    <svg viewBox="0 0 60 60" className="h-16 w-16 shrink-0 text-accent" aria-hidden="true">
      <line
        x1="2"
        y1="58"
        x2="58"
        y2="2"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="3 3"
        opacity="0.35"
      />
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

const MotionDurationMain = ({ en }: { en: boolean }) => {
  const [duration, setDuration] = useState(240);
  const [ease, setEase] = useState<EaseKey>('standard');
  const [on, setOn] = useState(false);
  const [reduce, setReduce] = useState(false);

  const ms = reduce ? 150 : duration;
  const travel = reduce ? 0 : 200;
  const easing = reduce ? EASE.out.css : EASE[ease].css;

  return (
    <div className="mx-auto w-full max-w-sm">
      <div data-anatomy="1" className="flex justify-center gap-1.5">
        {DURATIONS.map((d) => (
          <button
            key={d.ms}
            type="button"
            aria-pressed={!reduce && duration === d.ms}
            onClick={() => {
              setDuration(d.ms);
              setOn((o) => !o);
            }}
            className="demo-tool border border-line text-center"
          >
            <span className="block text-[11px]">{en ? d.en : d.zh}</span>
            <span className="block font-mono text-[9px] text-ink-3">{d.ms}ms</span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <div
          data-anatomy="3"
          className="relative h-10 w-60 max-w-full overflow-hidden rounded-lg bg-code-bg"
        >
          <span className="absolute left-2 top-1/2 -translate-y-1/2 font-mono text-[9px] text-ink-3">
            A
          </span>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[9px] text-ink-3">
            B
          </span>
          <span
            className="absolute left-1 top-1 h-8 w-8 rounded-md bg-accent"
            style={{
              transform: `translateX(${on ? travel : 0}px)`,
              opacity: reduce ? (on ? 1 : 0.35) : 1,
              transitionProperty: 'transform, opacity',
              transitionDuration: `calc(${ms}ms * var(--demo-speed, 1))`,
              transitionTimingFunction: easing,
            }}
          />
        </div>
      </div>

      <div data-anatomy="2" className="mt-4 flex items-center justify-center gap-3">
        <EaseCurve pts={EASE[ease].pts} />
        <div className="flex min-w-0 flex-col gap-1">
          {(Object.keys(EASE) as EaseKey[]).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={!reduce && ease === k}
              onClick={() => setEase(k)}
              className="demo-tool border border-line text-left"
            >
              <span className="font-mono text-[9px]">{EASE[k].css}</span>
              <span className="ml-2 text-[10px] text-ink-3">{en ? EASE[k].en : EASE[k].zh}</span>
            </button>
          ))}
        </div>
      </div>

      <label
        data-anatomy="4"
        className="mt-4 flex cursor-pointer items-center justify-between rounded-xl border border-line bg-raised px-3 py-2"
      >
        <span className="text-xs text-ink">
          {en ? 'Simulate prefers-reduced-motion' : '模拟 prefers-reduced-motion'}
        </span>
        <input
          type="checkbox"
          checked={reduce}
          onChange={(e) => setReduce(e.target.checked)}
          className="h-4 w-4 accent-[var(--color-accent)]"
        />
      </label>

      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="truncate font-mono text-[10px] text-ink-3">
          {reduce ? 'reduce · 150ms · fade only' : `${EASE[ease].css} · ${ms}ms`}
        </p>
        <button
          type="button"
          onClick={() => setOn((o) => !o)}
          className="demo-tool shrink-0 border border-line"
        >
          {en ? 'Replay ▸' : '重播 ▸'}
        </button>
      </div>
      <p className="mt-1 text-center text-[11px] leading-relaxed text-ink-3">
        {en
          ? 'Shorter for feedback, longer for entrances. Under reduced motion, travel becomes a fade.'
          : '反馈要短，入场可长。开启减弱动效后，位移降级为淡入。'}
      </p>
    </div>
  );
};

const MotionDurationVariants = ({ en }: { en: boolean }) => {
  const [on, setOn] = useState(false);
  const rows: Array<{ id: string; ms: number; ease: EaseKey; zh: string; en: string; range: string }> = [
    { id: 'micro', ms: 120, ease: 'out', zh: '微反馈', en: 'Micro', range: '100–150ms' },
    { id: 'standard', ms: 240, ease: 'standard', zh: '标准过渡', en: 'Standard', range: '200–300ms' },
    { id: 'emphasized', ms: 420, ease: 'out', zh: '强调入场', en: 'Emphasized', range: '300–500ms' },
  ];
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3">
      {rows.map((r) => (
        <article key={r.id} className="rounded-xl border border-line bg-raised p-3">
          <div className="flex items-center justify-between">
            <p className="specimen-eyebrow">{en ? r.en : r.zh}</p>
            <span className="font-mono text-[9px] text-ink-3">{r.range}</span>
          </div>
          <div className="relative mx-auto mt-2 h-8 w-56 max-w-full overflow-hidden rounded-lg bg-code-bg">
            <span
              className="absolute left-1 top-1 h-6 w-6 rounded-md bg-accent"
              style={{
                transform: `translateX(${on ? 192 : 0}px)`,
                transitionProperty: 'transform',
                transitionDuration: `calc(${r.ms}ms * var(--demo-speed, 1))`,
                transitionTimingFunction: EASE[r.ease].css,
              }}
            />
          </div>
          <p className="mt-1 truncate font-mono text-[9px] text-ink-3">
            {EASE[r.ease].css} · {r.ms}ms
          </p>
        </article>
      ))}
      <button
        type="button"
        onClick={() => setOn((o) => !o)}
        className="demo-tool self-center border border-line"
      >
        {en ? 'Replay all ▸' : '全部重播 ▸'}
      </button>
    </div>
  );
};

const MotionDurationDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <MotionDurationVariants en={en} />;
  return <MotionDurationMain en={en} />;
};

export default MotionDurationDemo;
