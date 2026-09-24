import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Kind = 'overshoot' | 'critical' | 'bouncy';

const RECIPES: Record<Kind, { anim: string; label: string; labelEn: string; note: string; noteEn: string }> = {
  overshoot: {
    anim: 'spring-overshoot',
    label: '过冲弹簧',
    labelEn: 'Overshoot spring',
    note: 'cubic-bezier(0.34, 1.56, 0.64, 1) 冲过终点再回落',
    noteEn: 'cubic-bezier(0.34, 1.56, 0.64, 1) — overshoot then settle',
  },
  critical: {
    anim: 'spring-critical',
    label: '临界阻尼',
    labelEn: 'Critically damped',
    note: 'ease-out 稳稳停住，零过冲',
    noteEn: 'ease-out settles dead-stop, zero overshoot',
  },
  bouncy: {
    anim: 'spring-bouncy',
    label: '弹跳',
    labelEn: 'Bouncy',
    note: '振荡两三次后停住，俏皮易过量',
    noteEn: 'two or three oscillations — playful, easy to overdo',
  },
};

function SpringPlayground({ en, kind }: { en: boolean; kind: Kind }) {
  const [run, setRun] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const recipe = RECIPES[kind];

  const fire = () => {
    setAtEnd((v) => !v);
    setRun((r) => r + 1);
  };

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-5">
      <div className="relative h-28 w-full overflow-hidden rounded-xl border border-line bg-paper">
        <div
          data-anatomy="3"
          className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-lg border border-dashed border-line"
        />
        <div
          key={run}
          data-anatomy="2"
          className={`spring-box ${recipe.anim} absolute top-1/2 h-10 w-10 -translate-y-1/2 rounded-lg bg-accent-soft shadow-md`}
          style={{ left: atEnd ? 'calc(100% - 56px)' : 16 }}
        >
          <span className="flex h-full w-full items-center justify-center text-xs font-bold text-accent">●</span>
        </div>
      </div>

      <button
        data-anatomy="1"
        onClick={fire}
        className="rounded-full bg-accent px-5 py-2 text-xs font-semibold text-white transition-transform active:scale-95"
      >
        {en ? 'Trigger spring' : '触发弹簧'}
      </button>

      <p className="text-center text-xs text-ink-3">
        <span className="font-medium text-ink-2">{en ? recipe.labelEn : recipe.label}</span>
        <br />
        {en ? recipe.noteEn : recipe.note}
      </p>

      <style>{`@keyframes spring-overshoot { 0% { transform: translateY(-50%) translateX(0) } 70% { transform: translateY(-50%) translateX(8px) } 100% { transform: translateY(-50%) translateX(0) } }
@keyframes spring-critical { 0% { transform: translateY(-50%) translateX(-12px) } 100% { transform: translateY(-50%) translateX(0) } }
@keyframes spring-bouncy { 0% { transform: translateY(-50%) scale(0.7) } 40% { transform: translateY(-50%) scale(1.18) } 60% { transform: translateY(-50%) scale(0.9) } 80% { transform: translateY(-50%) scale(1.06) } 100% { transform: translateY(-50%) scale(1) } }
.spring-box { transform-origin: center; transition: left calc(0.45s * var(--demo-speed, 1)) cubic-bezier(0.34, 1.56, 0.64, 1); animation-duration: calc(0.5s * var(--demo-speed, 1)); animation-fill-mode: both; }
.spring-overshoot { animation-name: spring-overshoot; animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1) }
.spring-critical { animation-name: spring-critical; animation-timing-function: ease-out; animation-duration: calc(0.35s * var(--demo-speed, 1)) }
.spring-bouncy { animation-name: spring-bouncy; animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); animation-duration: calc(0.6s * var(--demo-speed, 1)) }
`}</style>
    </div>
  );
}

function VariantSheet({ en }: { en: boolean }) {
  const kinds: Kind[] = ['overshoot', 'critical', 'bouncy'];
  return (
    <div className="mx-auto grid max-w-xl grid-cols-1 gap-3 text-sm sm:grid-cols-3">
      {kinds.map((k) => {
        const r = RECIPES[k];
        return (
          <div key={k} className="rounded-xl border border-line bg-paper p-3">
            <p className="text-xs font-semibold text-ink">{en ? r.labelEn : r.label}</p>
            <p className="mt-1 text-[10px] text-ink-3">{k}</p>
            <div className="relative mt-2 h-12 overflow-hidden rounded-lg bg-code-bg">
              <div className={`spring-box ${r.anim} absolute top-1/2 left-2 h-6 w-6 -translate-y-1/2 rounded bg-accent/80`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

const SpringAnimationDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <VariantSheet en={en} />;
  return <SpringPlayground en={en} kind="overshoot" />;
};

export default SpringAnimationDemo;
