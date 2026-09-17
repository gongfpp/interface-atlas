import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Step = {
  target: 'nav' | 'canvas' | 'panel';
  zh: string;
  en: string;
};

const STEPS: Step[] = [
  { target: 'nav', zh: '这里是主导航，切换不同的工作区。', en: 'This is the main nav — switch between workspaces.' },
  { target: 'canvas', zh: '中间是画布，你的内容都展示在这里。', en: 'The canvas in the middle displays your content.' },
  { target: 'panel', zh: '右侧面板用来调整属性与设置。', en: 'The side panel holds properties and settings.' },
];

const TARGET_LABEL: Record<Step['target'], { zh: string; cls: string }> = {
  nav: { zh: '导航', cls: 'col-span-3' },
  canvas: { zh: '画布', cls: 'col-span-2 row-span-2' },
  panel: { zh: '面板', cls: 'col-span-1 row-span-2' },
};

function TourSpotlight({ step, active }: { step: Step; active: boolean }) {
  const highlighted = active ? 'ring-2 ring-accent ring-offset-2 ring-offset-transparent' : '';
  return (
    <div
      data-anatomy="2"
      className={`${TARGET_LABEL[step.target].cls} ${highlighted} flex items-center justify-center rounded-md border border-line bg-raised text-[10px] text-ink-3 transition-all`}
      style={{
        transitionDuration: 'calc(0.25s * var(--demo-speed, 1))',
        filter: active ? 'none' : undefined,
      }}
    >
      {TARGET_LABEL[step.target].zh}
    </div>
  );
}

function TourOverlay({ step }: { step: Step }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10" style={{ background: 'color-mix(in srgb, currentColor 35%, transparent)', animation: `tour-fade calc(0.25s * var(--demo-speed, 1)) ease-out both` }}>
      <div
        data-anatomy="3"
        className="absolute left-1/2 top-1/2 w-40 -translate-x-1/2 -translate-y-1/2 rounded-md border border-line bg-raised p-2.5 shadow-lg"
      >
        <p className="text-[10px] leading-4 text-ink">{step.zh}</p>
        <p className="mt-0.5 text-[9px] leading-3.5 text-ink-3">{step.en}</p>
      </div>
    </div>
  );
}

function OnboardingTour() {
  const [index, setIndex] = useState<number | null>(0);
  const running = index !== null;
  const step = running ? STEPS[index] : null;

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className={`relative grid grid-cols-3 grid-rows-[auto_1fr] gap-1.5 rounded-lg border border-line bg-code-bg p-2 ${running ? '' : 'opacity-100'}`} style={{ height: 190 }}>
        <div className={TARGET_LABEL.nav.cls}>
          <TourSpotlight step={STEPS[0]} active={running && step.target === 'nav'} />
        </div>
        <div className={`${TARGET_LABEL.canvas.cls}`}>
          <TourSpotlight step={STEPS[1]} active={running && step.target === 'canvas'} />
        </div>
        <div className={`${TARGET_LABEL.panel.cls}`}>
          <TourSpotlight step={STEPS[2]} active={running && step.target === 'panel'} />
        </div>
        <div className="col-span-2 flex items-center justify-center rounded-md border border-line bg-raised text-[10px] text-ink-3">
          画布内容 · Canvas content
        </div>
        <div className="flex items-center justify-center rounded-md border border-line bg-raised text-[10px] text-ink-3">
          设置 · Panel
        </div>
        {running && step && <TourOverlay step={step} />}
      </div>

      <div className="mt-2 flex items-center justify-center gap-2" data-anatomy="4">
        {running ? (
          <>
            <button
              type="button"
              onClick={() => setIndex(null)}
              className="text-[10px] text-ink-3 underline-offset-2 hover:text-accent hover:underline"
            >
              跳过 · Skip
            </button>
            <button
              type="button"
              disabled={index === 0}
              onClick={() => setIndex((i) => Math.max(0, (i ?? 0) - 1))}
              className="rounded border border-line bg-raised px-2 py-1 text-[10px] text-ink-2 transition-colors hover:border-accent hover:text-accent disabled:opacity-30"
            >
              上一步
            </button>
            {STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`第 ${i + 1} 步`}
                onClick={() => setIndex(i)}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${running && i === index ? 'bg-accent' : 'bg-ink-3/40'}`}
              />
            ))}
            <button
              type="button"
              onClick={() => (index === STEPS.length - 1 ? setIndex(null) : setIndex((i) => (i ?? 0) + 1))}
              className="rounded bg-accent px-2 py-1 text-[10px] text-white transition-opacity hover:opacity-90"
            >
              {index === STEPS.length - 1 ? '完成 · Done' : '下一步'}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIndex(0)}
            className="rounded border border-line bg-raised px-3 py-1 text-[10px] text-ink-2 transition-colors hover:border-accent hover:text-accent"
          >
            重播引导 · Replay tour
          </button>
        )}
      </div>
    </div>
  );
}

const OnboardingTourDemo: DemoComponent = ({ mode }) => {
  if (mode === 'variants') {
    return (
      <div className="grid gap-3 text-[10px] text-ink-2 md:grid-cols-3">
        {[
          { id: 'spotlight', zh: '聚光引导', en: 'Spotlight', note: '蒙层挖洞高亮目标区域，注意力最聚焦' },
          { id: 'tooltip-sequence', zh: '气泡序列', en: 'Tooltip sequence', note: '依次弹出说明气泡，不打断整页' },
          { id: 'checklist', zh: '任务清单', en: 'Checklist', note: '侧边清单列出待办引导，用户自选节奏' },
        ].map((v) => (
          <div key={v.id} className="rounded-md border border-line bg-raised p-3">
            <div className="font-mono text-[10px] text-accent">{v.id}</div>
            <div className="mt-1 text-xs font-medium">{v.zh}</div>
            <div className="text-[10px] text-ink-3">{v.en}</div>
            <p className="mt-2 leading-relaxed">{v.note}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <OnboardingTour />
      <style>{`@keyframes tour-fade { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </div>
  );
};

export default OnboardingTourDemo;
