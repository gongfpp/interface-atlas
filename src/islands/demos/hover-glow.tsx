import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const HoverGlowDemo: DemoComponent = ({ mode }) => (
  <div className="flex flex-col items-center gap-6">
    <div className="flex flex-wrap justify-center gap-6">
      <button className="rounded-xl border border-line bg-raised px-6 py-3 text-sm font-medium transition-all duration-300 hover:border-accent hover:shadow-[0_0_24px_rgba(180,68,31,0.45)]">
        悬停发光 / Glow
      </button>
      <button className="rounded-full border border-line bg-raised px-6 py-3 text-sm font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(180,68,31,0.5)]">
        Pill glow
      </button>
    </div>
    {mode === 'variants' && (
      <div className="flex flex-wrap justify-center gap-6">
        <button className="rounded-xl bg-ink px-6 py-3 text-sm font-medium text-paper transition-all duration-300 hover:shadow-[0_0_28px_rgba(23,21,15,0.55)]">
          Dark glow
        </button>
        <button className="rounded-xl border border-accent bg-accent-soft px-6 py-3 text-sm font-medium text-accent transition-all duration-300 hover:shadow-[inset_0_0_18px_rgba(180,68,31,0.35)]">
          Inner glow
        </button>
      </div>
    )}
    <p className="text-xs text-ink-3">🖱 鼠标悬停在按钮上观察光晕 / Hover the buttons（桌面端效果）</p>
  </div>
);

export default HoverGlowDemo;
