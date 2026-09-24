import type { DemoComponent } from '@/islands/DemoStage';

const LINES = ['好的动效不抢戏', '它替界面把话说完', '一屏只有一个重点'];

const TextRevealDemo: DemoComponent = ({ mode }) => (
  <div className="flex flex-col items-center gap-6">
    <div key={mode} className="flex flex-col items-center gap-1.5 py-2">
      {LINES.map((line, i) => (
        <span key={line} className="overflow-hidden py-0.5">
          <span
            className="block font-serif text-lg font-semibold text-ink reveal-line"
            style={{ animationDelay: `calc(${i * 0.14}s * var(--demo-speed, 1))` }}
          >
            {line}
          </span>
        </span>
      ))}
      {mode === 'variants' && (
        <p className="mt-3 text-sm text-ink-2 word-stagger">
          {'按词逐个浮现的变体，节奏更快'.split('').map((ch, i) => (
            <span
              key={i}
              className="inline-block word-pop"
              style={{ animationDelay: `calc(${i * 0.05}s * var(--demo-speed, 1))` }}
            >
              {ch}
            </span>
          ))}
        </p>
      )}
    </div>
    <p className="text-xs text-ink-3">行遮罩上滑，行间延迟 140ms；可用播放器重播再看一遍</p>
    <style>{`@keyframes reveal-up { from { transform: translateY(110%) } to { transform: translateY(0) } }
@keyframes word-pop { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
.reveal-line { animation: reveal-up calc(0.6s * var(--demo-speed, 1)) cubic-bezier(0.22, 1, 0.36, 1) both; }
.word-stagger .word-pop { animation: word-pop calc(0.35s * var(--demo-speed, 1)) ease-out both; }`}</style>
  </div>
);

export default TextRevealDemo;
