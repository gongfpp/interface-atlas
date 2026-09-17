import type { DemoComponent } from '@/islands/DemoStage';

const base =
  'inline-flex select-none items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-100 active:duration-150';

const PressFeedbackDemo: DemoComponent = ({ mode }) => (
  <div className="flex flex-col items-center gap-6">
    <div className="flex flex-wrap items-center justify-center gap-4">
      <button
        className={`${base} bg-accent text-white shadow-md active:scale-[0.96] active:shadow-sm`}
        style={{ touchAction: 'manipulation' }}
      >
        按住我试试 / Press me
      </button>
      <button
        className={`${base} border border-line-strong bg-raised text-ink shadow-sm active:scale-[0.96] active:shadow-none`}
      >
        Secondary
      </button>
    </div>
    {mode === 'variants' && (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          className={`${base} bg-ink text-paper shadow-md active:scale-[0.96] active:shadow-none`}
        >
          Scale + shadow
        </button>
        <button className={`${base} bg-raised text-ink active:brightness-90`}>Darken only</button>
        <button
          className={`${base} border-2 border-ink bg-raised text-ink shadow-[4px_4px_0_0_var(--color-ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_0_var(--color-ink)]`}
        >
          Neobrutalism press
        </button>
      </div>
    )}
    <p className="text-xs text-ink-3">⌨ 按住按钮不放观察缩放；Tab + Space 同样可触发</p>
  </div>
);

export default PressFeedbackDemo;
