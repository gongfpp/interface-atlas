import type { DemoComponent } from '@/islands/DemoStage';
import { useState } from 'react';

type Kind = 'polite' | 'assertive' | 'status';

interface Announce {
  id: number;
  kind: Kind;
  text: string;
}

let nextId = 1;

const KIND_META: Record<Kind, [string, string]> = {
  polite: ['礼貌播报', 'Polite live'],
  assertive: ['紧急打断', 'Assertive alert'],
  status: ['状态播报', 'Status'],
};

const AriaLiveDemo: DemoComponent = ({ mode, locale = 'zh' }) => {
  const en = locale === 'en';
  const [log, setLog] = useState<Announce[]>([]);
  const [polite, setPolite] = useState('');
  const [assertive, setAssertive] = useState('');
  const [status, setStatus] = useState('');

  const push = (kind: Kind) => {
    const text =
      kind === 'polite'
        ? en
          ? 'Filter applied — 12 results'
          : '筛选已生效——共 12 条结果'
        : kind === 'assertive'
          ? en
            ? 'Session expires in 2 minutes'
            : '会话将在 2 分钟后过期'
          : en
            ? 'Draft saved'
            : '草稿已保存';
    const entry = { id: nextId++, kind, text };
    setLog((l) => [entry, ...l].slice(0, 4));
    if (kind === 'polite') setPolite(text);
    else if (kind === 'assertive') setAssertive(text);
    else setStatus(text);
  };

  if (mode === 'variants') {
    const kinds: Kind[] = ['polite', 'assertive', 'status'];
    return (
      <div className="mx-auto flex w-full max-w-sm flex-col gap-2">
        {kinds.map((k) => (
          <div key={k} className="rounded-xl border border-line bg-raised px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-ink-3">
              {k === 'polite' ? 'aria-live="polite"' : k === 'assertive' ? 'aria-live="assertive"' : 'role="status"'}
            </p>
            <p className="mt-1 text-xs font-medium text-ink">{KIND_META[k][en ? 1 : 0]}</p>
            <p className="mt-0.5 text-[11px] text-ink-2">
              {k === 'polite'
                ? en
                  ? 'Queues until the user pauses — ordinary results.'
                  : '等用户停顿再念——普通结果用。'
                : k === 'assertive'
                  ? en
                    ? 'Interrupts immediately — critical warnings only.'
                    : '立刻打断朗读——仅限关键警告。'
                  : en
                    ? 'Implicit polite — loading and completion states.'
                    : '隐含 polite——加载与完成状态。'}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
      <div data-anatomy="1" className="flex flex-wrap gap-2">
        {(['polite', 'assertive', 'status'] as Kind[]).map((k) => (
          <button
            key={k}
            onClick={() => push(k)}
            className="flex-1 rounded-lg border border-line bg-raised px-2 py-2 text-[11px] text-ink transition-colors hover:border-accent hover:text-accent"
          >
            {k === 'polite' ? (en ? 'Result count' : '筛选结果') : k === 'assertive' ? (en ? 'Urgent warn' : '紧急警告') : (en ? 'Save state' : '保存状态')}
          </button>
        ))}
      </div>

      <div
        data-anatomy="2"
        className="min-h-16 rounded-xl border border-line bg-code-bg px-3 py-2.5"
        aria-atomic="true"
      >
        <p className="text-[10px] uppercase tracking-wider text-ink-3">
          {en ? 'Live regions (screen-reader channel)' : '实时区域（读屏通道）'}
        </p>
        <div aria-live="polite" aria-atomic="true" className="mt-1 text-[11px] text-ink-2">
          <span className="text-ink-3">polite · </span>
          {polite || '—'}
        </div>
        <div aria-live="assertive" aria-atomic="true" className="mt-0.5 text-[11px] text-ink-2">
          <span className="text-ink-3">assertive · </span>
          {assertive || '—'}
        </div>
        <div role="status" aria-atomic="true" className="mt-0.5 text-[11px] text-ink-2">
          <span className="text-ink-3">status · </span>
          {status || '—'}
        </div>
      </div>

      <div data-anatomy="3" className="rounded-xl border border-line bg-raised px-3 py-2.5">
        <p className="text-[10px] uppercase tracking-wider text-ink-3">
          {en ? 'Would announce' : '读屏会念'}
        </p>
        {log.length === 0 ? (
          <p className="mt-1 text-[11px] text-ink-3">
            {en ? 'Trigger a message above.' : '先点上面的按钮触发一条消息。'}
          </p>
        ) : (
          <ul className="mt-1 space-y-0.5">
            {log.map((a) => (
              <li key={a.id} className="text-[11px] text-ink-2">
                <span className="text-accent">{KIND_META[a.kind][en ? 1 : 0]} · </span>
                {a.text}
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="text-[11px] leading-relaxed text-ink-3">
        {en
          ? 'Live regions must exist before the update — we write text into pre-rendered nodes.'
          : '实时区域必须先存在于 DOM——这里把文本写进预先渲染好的节点。'}
      </p>
    </div>
  );
};

export default AriaLiveDemo;
