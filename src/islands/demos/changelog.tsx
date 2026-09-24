import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/* 页面结构缩略示意图（wireframe）：按版本倒序的更新日志 */

const VARIANTS = [
  { id: 'timeline', zh: '时间线式', en: 'Timeline' },
  { id: 'grouped', zh: '分组折叠', en: 'Grouped' },
  { id: 'feed', zh: '订阅流', en: 'Feed' },
] as const;

type VariantId = (typeof VARIANTS)[number]['id'];
type FilterKey = 'all' | 'added' | 'changed' | 'fixed';

const T: React.CSSProperties = { transitionDuration: 'calc(200ms * var(--demo-speed, 1))' };

const FILTERS: { key: FilterKey; zh: string; en: string }[] = [
  { key: 'all', zh: '全部', en: 'All' },
  { key: 'added', zh: '新增', en: 'Added' },
  { key: 'changed', zh: '改进', en: 'Changed' },
  { key: 'fixed', zh: '修复', en: 'Fixed' },
];

const RELEASES = [
  {
    id: 'v2.4.0',
    date: '2026-08-12',
    latest: true,
    added: [
      { zh: '批量操作支持撤销', en: 'Undo for bulk actions' },
      { zh: '深色模式自动跟随系统', en: 'Dark mode follows the system' },
    ],
    changed: [{ zh: '命令面板可自定义快捷键', en: 'Custom shortcuts in the command palette' }],
    fixed: [],
    breaking: null,
  },
  {
    id: 'v2.3.1',
    date: '2026-07-20',
    latest: false,
    added: [],
    changed: [],
    fixed: [
      { zh: '修复窄屏下表格横向溢出', en: 'Fixed table overflow on narrow screens' },
      { zh: '修复 Safari 中输入法候选框错位', en: 'Fixed IME candidate misplacement in Safari' },
    ],
    breaking: null,
  },
  {
    id: 'v2.3.0',
    date: '2026-07-02',
    latest: false,
    added: [{ zh: '新增团队权限模板', en: 'Team permission templates' }],
    changed: [{ zh: '导出格式默认改为 CSV', en: 'Default export is now CSV' }],
    fixed: [{ zh: '修复长列表滚动卡顿', en: 'Fixed jank in long lists' }],
    breaking: {
      zh: '旧版 API /v1 已移除，请迁移到 /v2。',
      en: 'Legacy /v1 API removed; migrate to /v2.',
    },
  },
] as const;

type Release = (typeof RELEASES)[number];

function Entry({
  r,
  filter,
  open,
  onToggle,
  en,
}: {
  r: Release;
  filter: FilterKey;
  open: boolean;
  onToggle: () => void;
  en: boolean;
}) {
  const groups = [
    { key: 'added', label: en ? 'Added' : '新增', items: r.added },
    { key: 'changed', label: en ? 'Changed' : '改进', items: r.changed },
    { key: 'fixed', label: en ? 'Fixed' : '修复', items: r.fixed },
  ].filter((g) => g.items.length > 0 && (filter === 'all' || filter === g.key));
  const expanded = filter !== 'all' || open;

  return (
    <article
      data-anatomy={r.latest ? '2' : '3'}
      className={`relative rounded-lg border bg-paper ${r.latest ? 'border-accent' : 'border-line'}`}
    >
      <button
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-center gap-2 px-3 py-2 text-left"
      >
        <span data-anatomy="4" className="rounded bg-raised px-1.5 py-0.5 font-mono text-[11px] text-ink">
          {r.id}
        </span>
        <time dateTime={r.date} className="text-[10px] text-ink-3">
          {r.date}
        </time>
        {r.latest && (
          <span className="rounded bg-accent-soft px-1.5 text-[9px] text-accent">{en ? 'Latest' : '最新'}</span>
        )}
        <span className="ml-auto text-ink-3" style={T}>
          {expanded ? '−' : '+'}
        </span>
      </button>
      {expanded && (
        <div className="space-y-2 border-t border-line px-3 py-2">
          {groups.map((g) => (
            <div key={g.key} data-anatomy="5">
              <p className="mb-0.5 text-[9px] font-medium uppercase tracking-wide text-ink-3">{g.label}</p>
              <ul className="list-disc space-y-0.5 pl-4 text-[10px] text-ink-2">
                {g.items.map((it) => (
                  <li key={it.zh}>{en ? it.en : it.zh}</li>
                ))}
              </ul>
            </div>
          ))}
          {r.breaking && filter === 'all' && (
            <p data-anatomy="6" className="rounded border border-line-strong bg-raised px-2 py-1 text-[10px] text-ink-2">
              <span className="font-medium text-accent">{en ? 'Breaking: ' : '破坏性变更：'}</span>
              {en ? r.breaking.en : r.breaking.zh}
            </p>
          )}
          {!groups.length && <p className="text-[10px] text-ink-3">{en ? 'No matching changes.' : '没有符合条件的变更。'}</p>}
        </div>
      )}
    </article>
  );
}

function Mini({ kind, en }: { kind: VariantId; en: boolean }) {
  if (kind === 'feed') {
    return (
      <div className="rounded-lg border border-line bg-paper p-2 text-left">
        <p className="mb-1 text-[10px] font-semibold">{en ? 'Changelog' : '更新日志'}</p>
        {RELEASES.map((r) => (
          <div key={r.id} className="flex items-center gap-2 border-t border-line py-1 text-[9px] first:border-t-0">
            <span className="font-mono text-ink-2">{r.id}</span>
            <span className="text-ink-3">{r.date}</span>
            <span className="ml-auto rounded bg-accent-soft px-1 text-accent">{r.latest ? (en ? 'new' : '新') : '✓'}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-2 text-left">
      {RELEASES.map((r) => (
        <Entry
          key={r.id}
          r={r}
          filter="all"
          open={kind === 'timeline' || r.latest}
          onToggle={() => {}}
          en={en}
        />
      ))}
    </div>
  );
}

const ChangelogDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  const [filter, setFilter] = useState<FilterKey>('all');
  const [open, setOpen] = useState<string | null>('v2.4.0');

  if (mode === 'variants') {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {VARIANTS.map((v) => (
          <div key={v.id} className="relative overflow-hidden rounded-lg border border-line" style={{ height: 210 }}>
            <div className="absolute left-0 top-0 w-[200%] origin-top-left scale-50">
              <Mini kind={v.id} en={en} />
            </div>
            <span className="absolute bottom-1 right-1 rounded bg-paper px-1.5 py-0.5 text-[10px] text-ink-2 shadow-sm">
              {en ? v.en : v.zh}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div data-anatomy="1" className="mb-3 flex items-end justify-between gap-2 text-left">
        <div>
          <p className="font-serif text-base font-semibold">{en ? 'Changelog' : '更新日志'}</p>
          <p className="text-[10px] text-ink-3">{en ? 'Shipped every two weeks' : '每两周发布一次'}</p>
        </div>
        <button
          className="rounded-full border border-line px-2.5 py-0.5 text-[10px] text-ink-2 transition-colors hover:border-accent hover:text-accent"
          style={T}
        >
          {en ? 'Subscribe' : '订阅更新'}
        </button>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={`rounded-full border px-2.5 py-0.5 text-[10px] transition-colors ${
              filter === f.key ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:border-accent'
            }`}
            style={T}
          >
            {en ? f.en : f.zh}
          </button>
        ))}
      </div>

      <div className="relative space-y-2 border-l-2 border-line pl-3" style={{ borderColor: 'var(--color-line)' }}>
        {RELEASES.map((r) => (
          <Entry
            key={r.id}
            r={r}
            filter={filter}
            open={open === r.id}
            onToggle={() => setOpen((o) => (o === r.id ? null : r.id))}
            en={en}
          />
        ))}
      </div>
      <p className="mt-2 text-center text-[10px] text-ink-3">
        {en ? 'Filter by type · click a version to expand' : '按类型筛选，点版本号展开'}
      </p>
    </div>
  );
};

export default ChangelogDemo;
