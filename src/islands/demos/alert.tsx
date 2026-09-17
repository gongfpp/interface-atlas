import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type AlertKind = 'info' | 'success' | 'warning' | 'error';

const SKIN: Record<AlertKind, { wrap: string; glyph: string; icon: string }> = {
  info: { wrap: 'border-sky-500/40 border-l-sky-500 bg-sky-500/10', glyph: 'text-sky-500', icon: 'i' },
  success: { wrap: 'border-emerald-500/40 border-l-emerald-500 bg-emerald-500/10', glyph: 'text-emerald-500', icon: '✓' },
  warning: { wrap: 'border-amber-500/40 border-l-amber-500 bg-amber-500/10', glyph: 'text-amber-500', icon: '!' },
  error: { wrap: 'border-red-500/40 border-l-red-500 bg-red-500/10', glyph: 'text-red-500', icon: '✕' },
};

function Alert({
  kind,
  title,
  desc,
  onClose,
  role,
}: {
  kind: AlertKind;
  title: string;
  desc: string;
  onClose?: () => void;
  role?: string;
}) {
  const s = SKIN[kind];
  return (
    <div
      role={role}
      className={`flex items-start gap-2.5 rounded-xl border border-l-4 p-3 ${s.wrap}`}
      style={{ animation: 'demo-alert-in calc(200ms * var(--demo-speed, 1)) both' }}
    >
      <span data-anatomy="1" aria-hidden="true" className={`mt-px w-4 text-center text-sm font-bold leading-5 ${s.glyph}`}>
        {s.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p data-anatomy="2" className="text-xs font-medium">{title}</p>
        <p data-anatomy="3" className="mt-0.5 text-[11px] leading-relaxed text-ink-2">{desc}</p>
      </div>
      {onClose && (
        <button
          data-anatomy="4"
          aria-label="关闭"
          onClick={onClose}
          className="shrink-0 px-1 text-[11px] text-ink-3 transition-colors hover:text-ink"
        >
          ✕
        </button>
      )}
    </div>
  );
}

function SettingsForm() {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const submit = () => {
    if (!name.trim()) {
      setSaved(false);
      setError('「项目名称」不能为空。');
    } else {
      setError(null);
      setSaved(true);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="space-y-2">
        {error && <Alert kind="error" role="alert" title="保存失败" desc={error} onClose={() => setError(null)} />}
        {saved && <Alert kind="success" role="status" title="已保存" desc="设置已同步到所有成员。" onClose={() => setSaved(false)} />}
      </div>
      <div className="mt-3 rounded-xl border border-line bg-raised p-3">
        <label className="block text-[11px] text-ink-3" htmlFor="alert-demo-name">项目名称</label>
        <input
          id="alert-demo-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSaved(false);
          }}
          placeholder="Acme 官网改版"
          className="mt-1 w-full rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs outline-none focus:border-accent"
        />
        <button
          onClick={submit}
          className="mt-2.5 rounded-lg bg-accent px-3 py-1.5 text-xs text-white transition-opacity hover:opacity-90"
        >
          保存
        </button>
      </div>
      <p className="mt-2 text-center text-[11px] text-ink-3">直接保存试试，或填入名称后保存 / Try saving empty, then filled</p>
    </div>
  );
}

const VARIANTS: [AlertKind, string, string][] = [
  ['info', '系统通知', '09-20 02:00 计划内维护，预计 30 分钟。'],
  ['success', '导入完成', '已导入 128 条成员记录。'],
  ['warning', '额度将满', '本月 API 配额已用 92%，可考虑升级套餐。'],
  ['error', '同步失败', '网络连接中断，更改未上传。点击重试。'],
];

const AlertDemo: DemoComponent = ({ mode }) => {
  const [closed, setClosed] = useState<Record<string, boolean>>({});
  const keyframes = <style>{`@keyframes demo-alert-in { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: none } }`}</style>;

  if (mode === 'variants') {
    return (
      <div className="mx-auto w-full max-w-sm space-y-2">
        {keyframes}
        {VARIANTS.map(([kind, title, desc]) =>
          closed[kind] ? null : (
            <Alert
              key={kind}
              kind={kind}
              title={title}
              desc={desc}
              onClose={() => setClosed((c) => ({ ...c, [kind]: true }))}
            />
          ),
        )}
      </div>
    );
  }
  return (
    <div className="flex justify-center">
      {keyframes}
      <SettingsForm />
    </div>
  );
};

export default AlertDemo;
