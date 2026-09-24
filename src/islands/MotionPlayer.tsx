import { useState } from 'react';
import type { DemoMode } from '@/islands/DemoStage';

export type MotionControl = 'play' | 'replay' | 'slow' | 'compare';

const ALL_CONTROLS: MotionControl[] = ['play', 'replay', 'slow', 'compare'];

const MODE_LABEL: Record<DemoMode, [string, string]> = {
  default: ['默认', 'Default'],
  dark: ['深色', 'Dark'],
  loading: ['加载态', 'Loading'],
  variants: ['形式', 'Variants'],
};

/**
 * Motion 播放器（PRD §22）：Play / Replay / Slow Motion / Before-After。
 *
 * 运行时契约（所有 Motion Demo 必须遵守，见 docs/content-guide.md）：
 * - 动画时长写法固定为 `calc(<时长> * var(--demo-speed, 1))`；
 *   播放器通过调大 --demo-speed（1 = 常速，3 = 慢速）实现慢放，而不是改小系数。
 * - 暂停通过容器上的 .motion-paused 类实现（CSS 对全部后代 animation-play-state: paused）。
 * - 重播通过 key 重挂载整棵 Demo 子树，内部状态随之复位。
 * - Before 实例用 .no-motion 冻结全部动画（仅对 CSS 动画/过渡有效）。
 *
 * `controls` 由内容 YAML 的 `demo.motionControls` 声明：只渲染对该 demo 真正生效的控件，
 * 交互型 demo（hover / press / pointer）不显示无意义的播放、慢速、前后对比按钮。
 */
export default function MotionPlayer({
  render,
  locale,
  modes = ['default'],
  anatomy = [],
  controls = ALL_CONTROLS,
}: {
  render: (mode: DemoMode) => React.ReactNode;
  locale: 'zh' | 'en';
  modes?: DemoMode[];
  anatomy?: string[];
  controls?: MotionControl[];
}) {
  const [mode, setMode] = useState<DemoMode>(modes[0] ?? 'default');
  const [speed, setSpeed] = useState<1 | 3>(1);
  const [running, setRunning] = useState(true);
  const [replayKey, setReplayKey] = useState(0);
  const [compare, setCompare] = useState(false);
  const [part, setPart] = useState<number | null>(null);

  const en = locale === 'en';
  const has = (c: MotionControl) => controls.includes(c);
  const visibleModes = modes.length ? modes : (['default'] as DemoMode[]);

  const label = {
    play: { zh: '播放', en: 'Play' },
    pause: { zh: '暂停', en: 'Pause' },
    replay: { zh: '重播', en: 'Replay' },
    slow: { zh: '慢速', en: 'Slow' },
    normal: { zh: '常速', en: 'Normal' },
    beforeAfter: { zh: '前后对比', en: 'Before / After' },
    before: { zh: '前', en: 'Before' },
    after: { zh: '后', en: 'After' },
  } as const;

  const btn = 'rounded-full border border-line px-3 py-1 text-xs text-ink-2 transition-colors hover:border-accent hover:text-accent';
  const btnOn = 'rounded-full border border-accent bg-accent-soft px-3 py-1 text-xs text-accent';

  const stage = (frozen: boolean, key: number) => (
    <div
      key={key}
      className={`demo-stage-checker overflow-hidden rounded-xl border border-line p-6 ${frozen ? 'no-motion' : ''} ${
        !frozen && !running ? 'motion-paused' : ''
      }`}
      style={{ '--demo-speed': speed } as React.CSSProperties}
    >
      <div className="demo-content" data-active-part={frozen ? undefined : (part ?? undefined)}>{render(mode)}</div>
    </div>
  );

  return (
    <div>
      <div className="demo-toolbar mb-0">
        {visibleModes.length > 1 && (
          <div className="flex flex-wrap gap-1" role="group" aria-label={en ? 'Variants' : '变体'}>
            {visibleModes.map((m) => (
              <button
                key={m}
                aria-pressed={mode === m}
                className="demo-tool"
                onClick={() => {
                  setMode(m);
                  setPart(null);
                }}
              >
                {MODE_LABEL[m][en ? 1 : 0]}
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-1">
          {has('play') && (
            <button className={running ? btnOn : btn} aria-pressed={running} onClick={() => setRunning((r) => !r)}>
              {running ? label.pause[locale] : label.play[locale]}
            </button>
          )}
          {has('replay') && (
            <button
              className={btn}
              onClick={() => {
                setReplayKey((k) => k + 1);
                setRunning(true);
              }}
            >
              ↻ {label.replay[locale]}
            </button>
          )}
          {has('slow') && (
            <button className={speed !== 1 ? btnOn : btn} aria-pressed={speed !== 1} onClick={() => setSpeed((s) => (s === 1 ? 3 : 1))}>
              🐢 {speed !== 1 ? label.normal[locale] : label.slow[locale]}
            </button>
          )}
          {has('compare') && (
            <button className={compare ? btnOn : btn} aria-pressed={compare} onClick={() => setCompare((c) => !c)}>
              ⇋ {label.beforeAfter[locale]}
            </button>
          )}
        </div>
      </div>

      <div className="mt-3">
        {compare && has('compare') ? (
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="mb-1 text-xs text-ink-3">{label.before[locale]}</p>
              {stage(true, replayKey)}
            </div>
            <div>
              <p className="mb-1 text-xs text-accent">{label.after[locale]}</p>
              {stage(false, replayKey)}
            </div>
          </div>
        ) : (
          stage(false, replayKey)
        )}
      </div>

      {anatomy.length > 0 && (
        <div className="demo-anatomy mt-3 rounded-xl border border-line">
          <p className="mb-3 text-xs text-ink-3">
            {en ? 'Explore the anatomy · focus or select a part' : '结构拆解 · 悬停、聚焦或点选部位'}
          </p>
          <ol className="grid gap-2 sm:grid-cols-2">
            {anatomy.map((labelText, i) => (
              <li key={labelText}>
                <button
                  className="anatomy-part"
                  aria-pressed={part === i + 1}
                  onMouseEnter={() => setPart(i + 1)}
                  onMouseLeave={() => setPart(null)}
                  onFocus={() => setPart(i + 1)}
                  onBlur={() => setPart(null)}
                  onClick={() => setPart(i + 1)}
                >
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {labelText}
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
