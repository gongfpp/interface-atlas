import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/* 页面结构缩略示意图（wireframe）：色块 + 真实标签 */

const VARIANTS = [
  { id: 'sidebar', zh: '侧栏导航', en: 'Sidebar' },
  { id: 'tabbed', zh: '标签页', en: 'Tabbed' },
  { id: 'sectioned', zh: '分组单页', en: 'Single Page' },
  { id: 'modal', zh: '弹窗', en: 'Modal' },
] as const;

type VariantId = (typeof VARIANTS)[number]['id'];

const SECTIONS = ['通用', '通知', '安全'];

const Bar = ({ w = 'w-full', h = 'h-1.5', cls = 'bg-ink-3/25' }: { w?: string; h?: string; cls?: string }) => (
  <div className={`${h} ${w} rounded-full ${cls}`} />
);

function Row({
  label,
  hint,
  control,
}: {
  label: string;
  hint?: string;
  control?: 'switch' | 'input';
}) {
  return (
    <div className="flex items-center justify-between border-t border-line py-1.5" data-anatomy="3">
      <div className="min-w-0 space-y-0.5">
        <p className="text-[10px] font-medium">{label}</p>
        {hint && <Bar w="w-24" h="h-1" />}
      </div>
      {control === 'input' ? (
        <span className="rounded border border-line bg-paper px-2 py-0.5 text-[9px] text-ink-3">我的团队</span>
      ) : (
        <span className="h-3.5 w-6 rounded-full bg-accent p-0.5">
          <span className="block h-2.5 w-2.5 rounded-full bg-white" />
        </span>
      )}
    </div>
  );
}

function SectionPanel({ section }: { section: string }) {
  const rows =
    section === '通用'
      ? [{ label: '团队名称', control: 'input' as const }, { label: '默认语言' }, { label: '周起始日' }]
      : section === '通知'
        ? [{ label: '邮件通知' }, { label: '推送通知' }, { label: '短信通知' }]
        : [{ label: '两步验证' }, { label: '登录提醒' }];
  return (
    <div className="flex-1 space-y-1 overflow-hidden" data-anatomy="2">
      <p className="text-xs font-serif font-semibold">{section}</p>
      {rows.map((r) => (
        <Row key={r.label} {...r} />
      ))}
    </div>
  );
}

function Wireframe({ variant }: { variant: VariantId }) {
  const [section, setSection] = useState('通用');
  const [dirty, setDirty] = useState(false);

  const nav = (vertical: boolean) =>
    (variant === 'modal' ? SECTIONS.slice(0, 2) : SECTIONS).map((s) => (
      <button
        key={s}
        onClick={() => {
          setSection(s);
          setDirty(true);
        }}
        className={`rounded px-2 py-1 text-[10px] transition-colors ${
          section === s ? 'bg-accent-soft text-accent' : 'text-ink-2 hover:bg-code-bg'
        } ${vertical ? 'block w-full text-left' : ''}`}
        aria-current={section === s ? 'true' : undefined}
      >
        {s}
      </button>
    ));

  const body = (
    <>
      {variant === 'sidebar' && (
        <div className="flex flex-1 overflow-hidden">
          <nav className="w-16 shrink-0 border-r border-line p-2" data-anatomy="1">{nav(true)}</nav>
          <div className="flex-1 p-3"><SectionPanel section={section} /></div>
        </div>
      )}
      {variant === 'tabbed' && (
        <div className="flex flex-1 flex-col overflow-hidden">
          <nav className="flex gap-1 border-b border-line px-3 py-2" data-anatomy="1">{nav(false)}</nav>
          <div className="flex-1 p-3"><SectionPanel section={section} /></div>
        </div>
      )}
      {variant === 'sectioned' && (
        <div className="flex-1 space-y-3 overflow-hidden p-3">
          {SECTIONS.map((s) => (
            <div key={s} className="space-y-1">
              <p className="text-[10px] font-medium text-ink-2">—— {s} ——</p>
              <SectionPanel section={s} />
            </div>
          ))}
        </div>
      )}
      {variant === 'modal' && (
        <div className="flex flex-1 items-center justify-center bg-ink-3/10 p-3">
          <div className="flex h-full w-4/5 flex-col overflow-hidden rounded-lg border border-line bg-raised shadow-lg">
            <div className="flex items-center justify-between border-b border-line px-3 py-1.5">
              <span className="text-[10px] font-medium">快捷设置</span>
              <span className="text-[10px] text-ink-3">✕</span>
            </div>
            <div className="flex flex-1 overflow-hidden">
              <nav className="w-14 shrink-0 border-r border-line p-1.5">{nav(true)}</nav>
              <div className="flex-1 p-2"><SectionPanel section={section} /></div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="flex h-72 w-full flex-col overflow-hidden rounded-lg border border-line bg-paper text-left text-xs">
      <div className="flex h-8 shrink-0 items-center border-b border-line bg-raised px-3">
        <span className="text-[10px] font-medium">设置</span>
      </div>
      {body}
      {(variant === 'sidebar' || variant === 'sectioned') && (
        <div className="mx-3 mb-2 shrink-0 rounded-md border border-red-400/50 bg-red-400/5 px-3 py-1.5" data-anatomy="4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-red-500">危险区 · 删除账号</span>
            <span className="rounded border border-red-400/60 px-2 py-0.5 text-[9px] text-red-500">删除…</span>
          </div>
        </div>
      )}
      {dirty && (
        <div
          className="flex shrink-0 items-center justify-between border-t border-line bg-raised px-3 py-1.5"
          data-anatomy="5"
          style={{ animation: `settings-save-in calc(200ms * var(--demo-speed, 1)) ease-out` }}
        >
          <span className="text-[9px] text-ink-2">有未保存的更改</span>
          <button onClick={() => setDirty(false)} className="rounded bg-accent px-2 py-0.5 text-[9px] text-white">
            保存
          </button>
        </div>
      )}
      <style>{`@keyframes settings-save-in { from { transform: translateY(100%); opacity: 0; } to { transform: none; opacity: 1; } }`}</style>
    </div>
  );
}

const SettingsDemo: DemoComponent = ({ mode }) => {
  const [variant, setVariant] = useState<VariantId>('sidebar');

  if (mode === 'variants') {
    return (
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {VARIANTS.map((v) => (
          <div key={v.id} className="relative overflow-hidden rounded-lg border border-line" style={{ height: 148 }}>
            <div className="absolute left-0 top-0 w-[200%] origin-top-left scale-50">
              <Wireframe variant={v.id} />
            </div>
            <span className="absolute bottom-1 right-1 rounded bg-paper px-1.5 py-0.5 text-[10px] text-ink-2 shadow-sm">
              {v.zh} / {v.en}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            onClick={() => setVariant(v.id)}
            className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
              variant === v.id ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:border-accent'
            }`}
          >
            {v.zh}
          </button>
        ))}
      </div>
      <Wireframe key={variant} variant={variant} />
      <p className="text-center text-[11px] text-ink-3">切换分区触发保存条；点「保存」收起</p>
    </div>
  );
};

export default SettingsDemo;
