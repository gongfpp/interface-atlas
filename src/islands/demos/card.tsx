import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

function Media({ label }: { label: string }) {
  return (
    <div data-anatomy="1" className="flex aspect-video items-center justify-center rounded-t-xl bg-accent-soft">
      <span className="font-serif text-xl text-accent">{label}</span>
    </div>
  );
}

function BasicCard() {
  const [liked, setLiked] = useState(false);
  return (
    <div className="w-44 rounded-xl border border-line bg-raised">
      <div data-anatomy="1" className="flex h-16 items-center justify-center rounded-t-xl bg-accent-soft">
        <span className="font-serif text-lg text-accent">Aa</span>
      </div>
      <div className="p-3">
        <p data-anatomy="2" className="text-xs font-medium">Acme Serif 字体</p>
        <p data-anatomy="3" className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-ink-2">
          新版品牌衬线字体，用于标题、数字与强调场景。
        </p>
      </div>
      <div data-anatomy="4" className="flex items-center justify-between border-t border-line px-3 py-2">
        <span className="text-[10px] text-ink-3">v2.4.1</span>
        <button
          onClick={() => setLiked((v) => !v)}
          className={`text-[11px] transition-colors ${liked ? 'text-accent' : 'text-ink-3 hover:text-accent'}`}
        >
          {liked ? '★ 已收藏' : '☆ 收藏'}
        </button>
      </div>
    </div>
  );
}

function ActionableCard() {
  const [active, setActive] = useState(false);
  return (
    <button
      onClick={() => setActive((v) => !v)}
      className={`w-44 rounded-xl border p-3 text-left transition-all duration-150 ${
        active ? 'border-accent bg-accent-soft shadow-md' : 'border-line bg-raised hover:-translate-y-0.5 hover:border-accent hover:shadow-md'
      }`}
      style={{ transitionDuration: 'calc(150ms * var(--demo-speed, 1))' }}
    >
      <div data-anatomy="2" className="text-xs font-medium">仪表盘重构</div>
      <div data-anatomy="3" className="mt-1 text-[11px] leading-relaxed text-ink-2">
        卡片化布局上线后，日均浏览时长 +18%。
      </div>
      <div data-anatomy="4" className="mt-2 flex items-center gap-1.5 text-[10px] text-ink-3">
        <span className="rounded bg-code-bg px-1.5 py-0.5">案例</span>
        <span>{active ? '已选中' : '点击整卡'}</span>
      </div>
    </button>
  );
}

const CardDemo: DemoComponent = ({ mode }) => {
  if (mode === 'variants') {
    return (
      <div className="flex items-start justify-center gap-4">
        <div>
          <p className="mb-1.5 text-center text-[10px] uppercase tracking-wider text-ink-3">Basic</p>
          <BasicCard />
        </div>
        <div>
          <p className="mb-1.5 text-center text-[10px] uppercase tracking-wider text-ink-3">Media + Action</p>
          <MediaCard />
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start justify-center gap-4">
      <ActionableCard />
      <MediaCard />
    </div>
  );
};

function MediaCard() {
  return (
    <div className="w-44 overflow-hidden rounded-xl border border-line bg-raised transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md" style={{ transitionDuration: 'calc(150ms * var(--demo-speed, 1))' }}>
      <Media label="山与雾" />
      <div className="p-3">
        <p data-anatomy="2" className="text-xs font-medium">富士山晨雾</p>
        <p data-anatomy="3" className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-ink-2">
          摄影师 Rin 的秋季合集，本篇收录 12 张作品。
        </p>
        <div data-anatomy="4" className="mt-2 flex gap-2">
          <span className="rounded-md border border-line px-2 py-0.5 text-[10px] text-ink-2">查看</span>
          <span className="rounded-md border border-line px-2 py-0.5 text-[10px] text-ink-2">保存</span>
        </div>
      </div>
    </div>
  );
}

export default CardDemo;
