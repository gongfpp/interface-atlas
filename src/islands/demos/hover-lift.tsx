import type { DemoComponent } from '@/islands/DemoStage';

const cardBase =
  'block w-44 cursor-pointer rounded-xl border border-line bg-raised p-4 transition-all duration-200 ease-out';

const HoverLiftDemo: DemoComponent = ({ mode }) => (
  <div>
    <div className="flex flex-wrap justify-center gap-6">
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className={`${cardBase} hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)]`}
      >
        <div className="mb-2 h-16 rounded-lg bg-code-bg" />
        <p className="text-sm font-medium">经典上浮 / Classic</p>
        <p className="text-xs text-ink-3">-4px + shadow</p>
      </a>
      {mode === 'variants' && (
        <>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className={`${cardBase} hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)]`}
          >
            <div className="mb-2 h-16 rounded-lg bg-code-bg" />
            <p className="text-sm font-medium">上浮 + 放大 / + Scale</p>
            <p className="text-xs text-ink-3">scale(1.02)</p>
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className={`${cardBase} border-line-strong hover:-translate-y-1 hover:border-accent`}
          >
            <div className="mb-2 h-16 rounded-lg bg-code-bg" />
            <p className="text-sm font-medium">上浮 + 边框 / + Border</p>
            <p className="text-xs text-ink-3">accent border</p>
          </a>
        </>
      )}
    </div>
    <p className="mt-5 text-center text-xs text-ink-3">
      🖱 把鼠标移到卡片上 / Hover the cards（桌面端效果）
    </p>
  </div>
);

export default HoverLiftDemo;
