import { useEffect, useRef, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const SLIDES = [
  {
    key: 'aurora',
    titleZh: '极光渐变',
    titleEn: 'Aurora',
    bodyZh: '多层柔光叠加，适合夜间模式首屏。',
    bodyEn: 'Layered soft light — a night-mode hero.',
  },
  {
    key: 'bento',
    titleZh: '便当格栅',
    titleEn: 'Bento grid',
    bodyZh: '不等高卡片拼贴，信息密度高。',
    bodyEn: 'Uneven card collage, high density.',
  },
  {
    key: 'editorial',
    titleZh: '编辑排版',
    titleEn: 'Editorial',
    bodyZh: '大字标题 + 细线分栏，阅读节奏舒展。',
    bodyEn: 'Big headlines, hairline columns, easy reading.',
  },
  {
    key: 'glass',
    titleZh: '玻璃拟态',
    titleEn: 'Glassmorphism',
    bodyZh: '半透明模糊面板，层叠出景深。',
    bodyEn: 'Translucent blurred panels stacking depth.',
  },
];

type Controls = 'dots' | 'arrows' | 'autoplay';

function SlideCard({ index, en }: { index: number; en: boolean }) {
  const s = SLIDES[index];
  return (
    <div className="flex h-full flex-col justify-end rounded-xl bg-code-bg p-4">
      <p className="text-[10px] uppercase tracking-[0.2em] text-ink-3">
        {String(index + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
      </p>
      <p className="mt-1 font-serif text-lg font-semibold text-ink">
        {en ? s.titleEn : s.titleZh}
      </p>
      <p className="mt-1 text-xs text-ink-2">{en ? s.bodyEn : s.bodyZh}</p>
    </div>
  );
}

function CarouselStage({
  en,
  controls,
  onControls,
  autoplay,
  onAutoplay,
  compact,
}: {
  en: boolean;
  controls: Controls;
  onControls?: (c: Controls) => void;
  autoplay: boolean;
  onAutoplay?: (v: boolean) => void;
  compact?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);
  const showArrows = controls === 'arrows' || controls === 'autoplay';
  const showDots = controls === 'dots' || controls === 'autoplay';
  const count = SLIDES.length;

  useEffect(() => {
    if (!autoplay || paused) return;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), 2600);
    return () => window.clearInterval(id);
  }, [autoplay, paused, count]);

  const go = (next: number) => setIndex(((next % count) + count) % count);

  return (
    <div
      ref={regionRef}
      role="group"
      aria-roledescription="carousel"
      aria-label={en ? 'Style gallery' : '风格画廊'}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          go(index + 1);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          go(index - 1);
        }
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="rounded-xl border border-line bg-raised p-3 outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div data-anatomy="1" className="relative overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SLIDES.map((s, i) => (
            <div
              key={s.key}
              data-anatomy={i === index ? '2' : undefined}
              aria-hidden={i !== index}
              className={`h-36 w-full flex-none px-0.5 ${compact ? 'h-28' : ''}`}
            >
              <SlideCard index={i} en={en} />
            </div>
          ))}
        </div>
        {showArrows && (
          <>
            <button
              type="button"
              aria-label={en ? 'Previous slide' : '上一张'}
              onClick={() => go(index - 1)}
              className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full border border-line bg-raised/90 px-2 py-1 text-xs text-ink-2 transition-colors hover:text-accent"
            >
              ←
            </button>
            <button
              type="button"
              aria-label={en ? 'Next slide' : '下一张'}
              onClick={() => go(index + 1)}
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full border border-line bg-raised/90 px-2 py-1 text-xs text-ink-2 transition-colors hover:text-accent"
            >
              →
            </button>
          </>
        )}
      </div>

      <div
        data-anatomy="3"
        className="mt-3 flex items-center justify-between gap-2"
      >
        {showDots ? (
          <div className="flex items-center gap-1.5" role="tablist" aria-label={en ? 'Slides' : '分页'}>
            {SLIDES.map((s, i) => (
              <button
                key={s.key}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${en ? 'Slide' : '第'} ${i + 1}`}
                onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-accent' : 'w-1.5 bg-line'}`}
              />
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-ink-3">
            {en ? 'Arrow keys / edge buttons' : '方向键或两侧箭头'}
          </p>
        )}

        <div className="flex items-center gap-2">
          {autoplay && (
            <button
              type="button"
              aria-pressed={paused}
              onClick={() => setPaused((p) => !p)}
              className="rounded-md border border-line px-2 py-1 text-[11px] text-ink-2 transition-colors hover:border-accent hover:text-accent"
            >
              {paused ? (en ? '▶ Play' : '▶ 播放') : en ? '❚❚ Pause' : '❚❚ 暂停'}
            </button>
          )}
          <span className="font-mono text-[11px] text-ink-3">
            {index + 1}/{count}
          </span>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {en ? `Slide ${index + 1} of ${count}` : `第 ${index + 1} 项，共 ${count} 项`}
      </p>

      {onControls && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(
            [
              ['dots', en ? 'Dots' : '分页点'],
              ['arrows', en ? 'Arrows' : '箭头'],
              ['autoplay', en ? 'Autoplay' : '自动播放'],
            ] as [Controls, string][]
          ).map(([c, label]) => (
            <button
              key={c}
              type="button"
              aria-pressed={controls === c}
              onClick={() => {
                onControls(c);
                if (onAutoplay) onAutoplay(c === 'autoplay');
                go(0);
              }}
              className={`rounded-md border px-2 py-1 text-[11px] transition-colors ${
                controls === c
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-line text-ink-2 hover:border-accent hover:text-accent'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const CarouselDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  const [controls, setControls] = useState<Controls>(
    mode === 'variants' ? 'dots' : 'arrows',
  );
  const [autoplay, setAutoplay] = useState(mode === 'variants');

  if (mode === 'variants') {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-3">
        <p className="text-xs text-ink-3">
          {en
            ? 'Three control styles — switch below, then browse with arrows or ←/→.'
            : '三种控件形态 — 下方切换，再用箭头或 ←/→ 浏览。'}
        </p>
        <CarouselStage
          en={en}
          controls={controls}
          onControls={setControls}
          autoplay={autoplay}
          onAutoplay={setAutoplay}
          compact
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-2">
      <p className="text-xs text-ink-3">
        {en
          ? 'Browse every slide; focus is announced politely.'
          : '浏览全部项目；切换时会礼貌播报当前位置。'}
      </p>
      <CarouselStage
        en={en}
        controls={controls}
        onControls={setControls}
        autoplay={autoplay}
        onAutoplay={setAutoplay}
      />
    </div>
  );
};

export default CarouselDemo;
