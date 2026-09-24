import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/* 页面结构缩略示意图（wireframe）：可点选的方案对比矩阵 */

const VARIANTS = [
  { id: 'table', zh: '并列表格', en: 'Table' },
  { id: 'diff', zh: '只看差异', en: 'Diff only' },
  { id: 'cards', zh: '卡片对比', en: 'Cards' },
] as const;

const T: React.CSSProperties = { transitionDuration: 'calc(200ms * var(--demo-speed, 1))' };

const PLANS = [
  { id: 'starter', zh: '入门版', en: 'Starter', price: '¥0' },
  { id: 'team', zh: '团队版', en: 'Team', price: '¥99' },
  { id: 'enterprise', zh: '企业版', en: 'Enterprise', price: '定制' },
] as const;

type PlanId = (typeof PLANS)[number]['id'];

const ROWS = [
  { zh: '成员数', en: 'Members', values: ['3', '10', '不限'], diff: true },
  { zh: '项目数', en: 'Projects', values: ['5', '50', '不限'], diff: true },
  { zh: '版本历史', en: 'Version history', values: ['—', '✓', '✓'], diff: true },
  { zh: '单点登录', en: 'SSO', values: ['—', '—', '✓'], diff: true },
  { zh: '审计日志', en: 'Audit log', values: ['—', '—', '✓'], diff: true },
  { zh: '支持', en: 'Support', values: ['社区', '邮件', '专属'], diff: true },
  { zh: '基础编辑器', en: 'Base editor', values: ['✓', '✓', '✓'], diff: false },
  { zh: '移动端 App', en: 'Mobile app', values: ['✓', '✓', '✓'], diff: false },
] as const;

const planLabel = (id: PlanId, en: boolean) => {
  const p = PLANS.find((x) => x.id === id)!;
  return en ? p.en : p.zh;
};

function Matrix({
  active,
  diffOnly,
  onPick,
  en,
  compact = false,
}: {
  active: PlanId;
  diffOnly: boolean;
  onPick?: (id: PlanId) => void;
  en: boolean;
  compact?: boolean;
}) {
  const rows = diffOnly ? ROWS.filter((r) => r.diff) : ROWS;
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-paper text-left text-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[360px] border-collapse">
          <thead>
            <tr data-anatomy="2">
              <th
                scope="col"
                data-anatomy="3"
                className="w-1/4 border-b border-line bg-raised p-2 text-left text-[10px] font-normal text-ink-3"
              >
                {en ? 'Feature' : '功能'}
              </th>
              {PLANS.map((p) => {
                const on = p.id === active;
                return (
                  <th key={p.id} scope="col" className="border-b border-line p-1.5 align-top">
                    <button
                      onClick={() => onPick?.(p.id)}
                      className={`w-full rounded-md border px-1.5 py-1 text-center transition-colors ${
                        on ? 'border-accent bg-accent-soft text-accent' : 'border-transparent text-ink-2 hover:border-line-strong'
                      }`}
                      style={T}
                    >
                      <span className="block text-[11px] font-medium">{en ? p.en : p.zh}</span>
                      <span className="mt-0.5 block text-[9px] text-ink-3">{p.price}</span>
                      {p.id === 'team' && (
                        <span className="mt-0.5 inline-block rounded bg-accent px-1 text-[8px] text-white">
                          {en ? 'Recommended' : '推荐'}
                        </span>
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.zh} className="border-b border-line last:border-b-0">
                <th
                  scope="row"
                  data-anatomy="3"
                  className="p-2 text-left text-[10px] font-normal text-ink-2"
                >
                  {en ? r.en : r.zh}
                </th>
                {r.values.map((v, i) => {
                  const on = PLANS[i].id === active;
                  return (
                    <td
                      key={i}
                      data-anatomy="4"
                      className={`p-1.5 text-center text-[11px] ${on ? 'bg-raised' : ''}`}
                    >
                      <span
                        data-anatomy="5"
                        className={
                          r.diff
                            ? 'inline-block min-w-[1.75rem] rounded bg-accent-soft px-1.5 py-0.5 font-mono text-accent'
                            : 'inline-block min-w-[1.75rem] font-mono text-ink-2'
                        }
                      >
                        {v}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!compact && (
        <div data-anatomy="6" className="flex items-center justify-between gap-2 border-t border-line px-3 py-2">
          <span className="text-[10px] text-ink-3">{en ? 'All paid plans include a 14-day trial.' : '所有付费方案含 14 天试用'}</span>
          <button
            className="rounded-md bg-accent px-2.5 py-1 text-[10px] font-medium text-white transition-colors hover:opacity-90"
            style={T}
          >
            {en ? 'Start trial' : '开始试用'}
          </button>
        </div>
      )}
    </div>
  );
}

function Cards({ active, onPick, en }: { active: PlanId; onPick?: (id: PlanId) => void; en: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {PLANS.map((p) => {
        const on = p.id === active;
        return (
          <div
            key={p.id}
            data-anatomy="2"
            className={`flex flex-col rounded-lg border bg-paper p-2.5 text-left ${on ? 'border-accent' : 'border-line'}`}
          >
            <button onClick={() => onPick?.(p.id)} className="text-left" style={T}>
              <span className="flex items-center gap-1 text-xs font-semibold">
                {en ? p.en : p.zh}
                {p.id === 'team' && (
                  <span className="rounded bg-accent px-1 text-[8px] font-normal text-white">{en ? 'Recommended' : '推荐'}</span>
                )}
              </span>
              <span className="text-[10px] text-ink-3">{p.price}</span>
            </button>
            <ul className="mt-2 space-y-1 border-t border-line pt-2">
              {ROWS.filter((r) => r.diff).slice(0, 4).map((r) => (
                <li key={r.zh} className="flex items-center justify-between gap-2 text-[10px]">
                  <span className="text-ink-2" data-anatomy="3">{en ? r.en : r.zh}</span>
                  <span className="font-mono text-accent" data-anatomy="5">{r.values[PLANS.indexOf(p)]}</span>
                </li>
              ))}
            </ul>
            <button
              data-anatomy="6"
              className="mt-2 rounded-md bg-accent-soft px-2 py-1 text-[10px] text-accent transition-colors hover:bg-accent hover:text-white"
              style={T}
            >
              {en ? 'Choose' : '选择'}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function Interactive({ en }: { en: boolean }) {
  const [active, setActive] = useState<PlanId>('team');
  const [diffOnly, setDiffOnly] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
      <div data-anatomy="1" className="text-center">
        <p className="font-serif text-base font-semibold">{en ? 'Which plan fits you?' : '哪个方案适合你？'}</p>
        <p className="text-[11px] text-ink-3">{en ? 'Compare features at a glance' : '一表看清功能差异'}</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full border border-line px-2 py-0.5 text-[10px] text-ink-2">
          {en ? `Focus: ${planLabel(active, true)}` : `聚焦：${planLabel(active, false)}`}
        </span>
        <button
          onClick={() => setDiffOnly((d) => !d)}
          aria-pressed={diffOnly}
          className={`rounded-full border px-2.5 py-0.5 text-[10px] transition-colors ${
            diffOnly ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:border-accent'
          }`}
          style={T}
        >
          {diffOnly ? (en ? 'Showing differences' : '只看差异') : en ? 'Differences only' : '只看差异'}
        </button>
      </div>
      <Matrix active={active} diffOnly={diffOnly} onPick={setActive} en={en} />
      <p className="text-center text-[10px] text-ink-3">
        {en ? 'Click a plan to focus its column · toggle the diff filter' : '点方案列聚焦，点右上角只看差异'}
      </p>
    </div>
  );
}

const FeaturesComparisonDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';

  if (mode === 'variants') {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {VARIANTS.map((v) => (
          <div key={v.id} className="relative overflow-hidden rounded-lg border border-line" style={{ height: 210 }}>
            <div className="absolute left-0 top-0 w-[200%] origin-top-left scale-50">
              {v.id === 'cards' ? (
                <Cards active="team" en={en} />
              ) : (
                <Matrix active="team" diffOnly={v.id === 'diff'} en={en} />
              )}
            </div>
            <span className="absolute bottom-1 right-1 rounded bg-paper px-1.5 py-0.5 text-[10px] text-ink-2 shadow-sm">
              {en ? v.en : v.zh}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return <Interactive en={en} />;
};

export default FeaturesComparisonDemo;
