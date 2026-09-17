import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

function Thumb({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      data-anatomy="2"
      className={`absolute top-1 h-3.5 w-3.5 rounded-full bg-white shadow transition-all ${
        on ? 'left-[18px]' : 'left-1'
      }`}
      style={{ transitionDuration: 'calc(180ms * var(--demo-speed, 1))' }}
    />
  );
}

function Switch({
  on,
  onToggle,
  label,
  anatomy,
}: {
  on: boolean;
  onToggle: () => void;
  label: string;
  anatomy?: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      data-anatomy={anatomy}
      className={`relative w-10 shrink-0 rounded-full transition-colors ${
        on ? 'bg-accent' : 'bg-ink-3/40'
      }`}
      style={{ height: 22, transitionDuration: 'calc(180ms * var(--demo-speed, 1))' }}
    >
      <Thumb on={on} />
    </button>
  );
}

function SettingsPanel() {
  const [prefs, setPrefs] = useState({ notify: true, autoSave: false, darkFollow: true });
  const flip = (k: keyof typeof prefs) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  const ROWS: { key: keyof typeof prefs; title: string; desc: string }[] = [
    { key: 'notify', title: '推送通知', desc: '接收新评论与 @ 提醒' },
    { key: 'autoSave', title: '自动保存', desc: '每 30 秒保存草稿' },
    { key: 'darkFollow', title: '跟随系统外观', desc: '自动切换深浅色主题' },
  ];

  return (
    <div className="mx-auto max-w-xs rounded-xl border border-line bg-paper p-2">
      {ROWS.map((r) => (
        <div key={r.key} className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div data-anatomy="3" className="min-w-0">
            <p className="text-xs font-medium text-ink">{r.title}</p>
            <p className="truncate text-[11px] text-ink-3">{r.desc}</p>
          </div>
          <div className="ml-auto">
            <Switch on={prefs[r.key]} onToggle={() => flip(r.key)} label={r.title} anatomy="1" />
          </div>
        </div>
      ))}
      <p className="border-t border-line px-2 pb-1 pt-2 text-[11px] text-ink-3">
        已开启 {Object.values(prefs).filter(Boolean).length} / 3 项
      </p>
    </div>
  );
}

function TextInside() {
  const [on, setOn] = useState(true);
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => setOn((o) => !o)}
      className={`relative h-6 w-14 rounded-full transition-colors ${on ? 'bg-accent' : 'bg-ink-3/40'}`}
      style={{ transitionDuration: 'calc(180ms * var(--demo-speed, 1))' }}
    >
      <span
        className={`absolute inset-y-0 flex items-center text-[10px] font-medium text-white transition-opacity ${
          on ? 'left-2 opacity-100' : 'left-2 opacity-0'
        }`}
      >
        开
      </span>
      <span
        className={`absolute inset-y-0 right-2 flex items-center text-[10px] font-medium text-ink-2 transition-opacity ${
          on ? 'opacity-0' : 'opacity-100'
        }`}
      >
        关
      </span>
      <Thumb on={on} />
    </button>
  );
}

const SwitchDemo: DemoComponent = ({ mode }) => {
  if (mode === 'variants') {
    return (
      <div className="mx-auto flex max-w-md flex-col gap-4 text-sm">
        <div>
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-3">基础 Basic</p>
          <div className="flex gap-3 rounded-xl border border-line bg-paper p-3">
            <Switch on={true} onToggle={() => {}} label="开" anatomy="1" />
            <Switch on={false} onToggle={() => {}} label="关" />
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-3">带状态文字 With text</p>
          <div className="rounded-xl border border-line bg-paper p-3">
            <TextInside />
          </div>
        </div>
      </div>
    );
  }
  return <SettingsPanel />;
};

export default SwitchDemo;
