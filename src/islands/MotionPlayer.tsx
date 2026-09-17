import { useState } from 'react';

/**
 * Motion 播放器（PRD §22 全量）：Play / Replay / Slow Motion / Before-After。
 * 原理：容器设置 --demo-speed 速度系数（Demo 动画时长写法见生产规范），
 *       重播通过 key 重挂载；Before 实例禁用全部动画。
 */
export default function MotionPlayer({
  render,
  locale,
}: {
  render: () => React.ReactNode;
  locale: 'zh' | 'en';
}) {
  const [speed, setSpeed] = useState(1);
  const [running, setRunning] = useState(true);
  const [replayKey, setReplayKey] = useState(0);
  const [compare, setCompare] = useState(false);

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
      className={`demo-stage-checker overflow-hidden rounded-xl border border-line p-6 ${frozen ? 'no-motion' : ''}`}
      style={{ '--demo-speed': frozen ? 1 : speed, animationPlayState: frozen || running ? 'running' : 'paused' } as React.CSSProperties}
    >
      {render()}
    </div>
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        <button className={running ? btn : btnOn} onClick={() => setRunning((r) => !r)}>
          {running ? label.pause[locale] : label.play[locale]}
        </button>
        <button className={btn} onClick={() => { setReplayKey((k) => k + 1); setRunning(true); }}>
          ↻ {label.replay[locale]}
        </button>
        <button className={speed !== 1 ? btnOn : btn} onClick={() => setSpeed((s) => (s === 1 ? 0.3 : 1))}>
          🐢 {speed !== 1 ? label.normal[locale] : label.slow[locale]}
        </button>
        <button className={compare ? btnOn : btn} onClick={() => setCompare((c) => !c)}>
          ⇋ {label.beforeAfter[locale]}
        </button>
      </div>
      {compare ? (
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
  );
}
