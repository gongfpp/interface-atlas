import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const bar = 'absolute left-1/2 h-[2.5px] w-6 rounded-full bg-ink transition-all';

const MorphingIconDemo: DemoComponent = ({ mode }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-8">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? '关闭菜单' : '打开菜单'}
          className="relative h-12 w-12 rounded-xl border border-line bg-raised shadow-sm transition-transform active:scale-95"
        >
          <span
            className={bar}
            style={{
              top: '50%',
              transform: open ? 'translate(-50%, calc(-50% + 0px)) translateY(-6.5px) rotate(45deg)' : 'translate(-50%, calc(-50% + 0px)) translateY(-7px)',
              transitionDuration: 'calc(0.3s * var(--demo-speed, 1))',
            }}
          />
          <span
            className={bar}
            style={{
              top: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: open ? 0 : 1,
              transitionDuration: 'calc(0.3s * var(--demo-speed, 1))',
            }}
          />
          <span
            className={bar}
            style={{
              top: '50%',
              transform: open ? 'translate(-50%, -50%) translateY(6.5px) rotate(-45deg)' : 'translate(-50%, -50%) translateY(7px)',
              transitionDuration: 'calc(0.3s * var(--demo-speed, 1))',
            }}
          />
        </button>
        <p className="text-sm text-ink-2">{open ? '菜单打开中 → 关闭' : '点按打开菜单'}</p>
      </div>
      {mode === 'variants' && (
        <div className="flex items-center gap-8">
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? '关闭' : '加号'}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-raised shadow-sm transition-transform active:scale-95"
          >
            <span
              className="relative block h-6 w-6 transition-transform"
              style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)', transitionDuration: 'calc(0.3s * var(--demo-speed, 1))' }}
            >
              <span className="absolute left-1/2 top-1/2 h-[2.5px] w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" />
              <span className="absolute left-1/2 top-1/2 h-6 w-[2.5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" />
            </span>
          </button>
          <p className="text-sm text-ink-2">变体：加号 ↔ 叉（整体旋转 45°）</p>
        </div>
      )}
      <p className="text-xs text-ink-3">同一组线条 rotate/translate/opacity 过渡 300ms，占位不变</p>
    </div>
  );
};

export default MorphingIconDemo;
