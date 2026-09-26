import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Kind = 'overshoot' | 'critical' | 'bouncy';

const RECIPES: Record<Kind, { label: string; labelEn: string; note: string; noteEn: string }> = {
  overshoot: {
    label: '过冲弹簧',
    labelEn: 'Overshoot spring',
    note: 'cubic-bezier(0.34, 1.56, 0.64, 1) 冲过终点再回落',
    noteEn: 'cubic-bezier(0.34, 1.56, 0.64, 1) — overshoot then settle',
  },
  critical: {
    label: '临界阻尼',
    labelEn: 'Critically damped',
    note: 'ease-out 稳稳停住，零过冲',
    noteEn: 'ease-out settles dead-stop, zero overshoot',
  },
  bouncy: {
    label: '弹跳',
    labelEn: 'Bouncy',
    note: '回缩后再弹出，俏皮易过量',
    noteEn: 'pulls back then pops — playful, easy to overdo',
  },
};

/** 共享的弹簧轨道：所有模式复用同一个行为与样式，靠 easing 类区分手感。 */
function SpringTrack({ kind, en, compact = false }: { kind: Kind; en: boolean; compact?: boolean }) {
  const [atEnd, setAtEnd] = useState(false);
  const recipe = RECIPES[kind];
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className={`relative w-full overflow-hidden rounded-xl border border-line bg-paper ${compact ? 'h-16' : 'h-28'}`}>
        <div
          data-anatomy={compact ? undefined : '3'}
          className={`absolute right-4 top-1/2 -translate-y-1/2 rounded-lg border border-dashed border-line ${compact ? 'h-6 w-6' : 'h-10 w-10'}`}
        />
        <div
          data-anatomy={compact ? undefined : '2'}
          className={`spring-box spring-${kind} absolute top-1/2 -translate-y-1/2 rounded-lg bg-accent-soft shadow-md ${compact ? 'h-6 w-6' : 'h-10 w-10'}`}
          style={{ left: atEnd ? 'calc(100% - 56px)' : 16 }}
        >
          <span className={`flex h-full w-full items-center justify-center font-bold text-accent ${compact ? 'text-[10px]' : 'text-xs'}`}>●</span>
        </div>
      </div>
      <button
        data-anatomy={compact ? undefined : '1'}
        onClick={() => setAtEnd((v) => !v)}
        className={`rounded-full bg-accent px-5 py-2 text-xs font-semibold text-white transition-transform active:scale-95 ${compact ? 'px-3 py-1 text-[10px]' : ''}`}
      >
        {en ? 'Trigger spring' : '触发弹簧'}
      </button>
      <p className="text-center text-xs text-ink-3">
        <span className="font-medium text-ink-2">{en ? recipe.labelEn : recipe.label}</span>
        {!compact && (
          <>
            <br />
            {en ? recipe.noteEn : recipe.note}
          </>
        )}
      </p>
    </div>
  );
}

const SPRING_STYLE = `@keyframes spring-none { to { opacity: 1 } }
.spring-box { transition: left calc(0.45s * var(--demo-speed, 1)); }
.spring-overshoot { transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
.spring-critical { transition-timing-function: ease-out; }
.spring-bouncy { transition-timing-function: cubic-bezier(0.68, -0.55, 0.27, 1.55); }`;

function VariantSheet({ en }: { en: boolean }) {
  const kinds: Kind[] = ['overshoot', 'critical', 'bouncy'];
  return (
    <div className="mx-auto grid max-w-xl grid-cols-1 gap-3 text-sm sm:grid-cols-3">
      {kinds.map((k) => (
        <div key={k} className="rounded-xl border border-line bg-paper p-3">
          <p className="text-xs font-semibold text-ink">{en ? RECIPES[k].labelEn : RECIPES[k].label}</p>
          <p className="mb-2 mt-1 text-[10px] text-ink-3">{k}</p>
          <SpringTrack kind={k} en={en} compact />
        </div>
      ))}
    </div>
  );
}

const SpringAnimationDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  return (
    <div className="mx-auto w-full max-w-md">
      {mode === 'variants' ? <VariantSheet en={en} /> : <SpringTrack kind="overshoot" en={en} />}
      <style>{SPRING_STYLE}</style>
    </div>
  );
};

export default SpringAnimationDemo;
