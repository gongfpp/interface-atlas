import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Kind = 'minimal' | 'granular' | 'wall';

function ConsentBanner({
  en,
  kind,
  prefs,
  onAccept,
  onReject,
  onManage,
  onClose,
}: {
  en: boolean;
  kind: Kind;
  prefs: boolean;
  onAccept: () => void;
  onReject: () => void;
  onManage: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className={`rounded-xl border border-line bg-raised p-3 shadow-lg ${
        kind === 'wall' ? 'mx-auto max-w-sm' : ''
      }`}
    >
      <p data-anatomy="1" className="text-[11px] leading-relaxed text-ink-2">
        {en
          ? 'We use cookies for analytics and ads. Necessary cookies always stay on. Choose what to allow before continuing.'
          : '我们使用 Cookie 做分析与广告。必要 Cookie 始终开启。继续前请做出选择。'}
      </p>
      {prefs && (
        <div data-anatomy="3" className="mt-2 space-y-1.5 rounded-lg bg-code-bg px-2.5 py-2">
          {[
            [en ? 'Necessary' : '必要', true],
            [en ? 'Analytics' : '分析', false],
            [en ? 'Marketing' : '营销', false],
          ].map(([label, locked], i) => (
            <label key={i} className="flex items-center justify-between text-[11px] text-ink-2">
              <span>
                {label as string}
                {locked ? <span className="ml-1 text-[9px] text-ink-3">{en ? 'locked' : '锁定'}</span> : null}
              </span>
              <input type="checkbox" defaultChecked={!!locked} disabled={!!locked} className="accent-accent" />
            </label>
          ))}
        </div>
      )}
      <div data-anatomy="2" className="mt-3 flex flex-wrap items-center gap-1.5">
        <button
          onClick={onAccept}
          className="rounded-lg bg-accent px-3 py-1.5 text-[11px] font-semibold text-white"
        >
          {en ? 'Accept all' : '接受全部'}
        </button>
        <button
          onClick={onReject}
          className="rounded-lg border border-line px-3 py-1.5 text-[11px] text-ink-2"
        >
          {en ? 'Reject' : '拒绝'}
        </button>
        {kind === 'granular' && (
          <button onClick={onManage} className="rounded-lg px-2 py-1.5 text-[11px] text-ink-3 underline underline-offset-2">
            {prefs ? (en ? 'Hide options' : '收起选项') : (en ? 'Manage' : '管理偏好')}
          </button>
        )}
        {kind !== 'wall' && (
          <button onClick={onClose} className="ml-auto text-[10px] text-ink-3" aria-label={en ? 'Close' : '关闭'}>
            ✕
          </button>
        )}
      </div>
      <p data-anatomy="4" className="mt-2 font-mono text-[9px] text-ink-3">
        {en ? 'consent = localStorage["cookie-consent"]' : 'consent = localStorage["cookie-consent"]'}
      </p>
    </div>
  );
}

function ConsentPlayground({ en, kind }: { en: boolean; kind: Kind }) {
  const [visible, setVisible] = useState(true);
  const [prefs, setPrefs] = useState(kind === 'granular');
  const [log, setLog] = useState(en ? 'Waiting for a choice…' : '等待用户选择…');

  const decide = (value: string) => {
    setVisible(false);
    setLog(en ? `Stored consent="${value}" — tracking scripts may now load.` : `已记录 consent="${value}" — 此后才可加载追踪脚本。`);
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3">
      <div className="rounded-xl border border-line bg-paper p-3">
        <p className="text-xs font-medium text-ink">{en ? 'Article body' : '页面正文'}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-ink-3">
          {en
            ? 'Content stays usable. The banner is a legal gate, not a system alert — it must be answered before non-essential cookies are set.'
            : '正文保持可用。同意条是法律门槛而非系统告警 — 未做出选择前不得落下非必要 Cookie。'}
        </p>
      </div>
      {visible ? (
        <ConsentBanner
          en={en}
          kind={kind}
          prefs={prefs}
          onAccept={() => decide('all')}
          onReject={() => decide('necessary')}
          onManage={() => setPrefs((p) => !p)}
          onClose={() => {
            setVisible(false);
            setLog(en ? 'Dismissed without consent — no tracking yet.' : '已关闭但未同意 — 仍未加载追踪。');
          }}
        />
      ) : (
        <button
          onClick={() => {
            setVisible(true);
            setPrefs(kind === 'granular');
          }}
          className="self-start text-[11px] text-accent underline underline-offset-2"
        >
          {en ? 'Reopen banner' : '重新打开同意条'}
        </button>
      )}
      <p className="min-h-8 rounded-lg bg-code-bg px-3 py-2 font-mono text-[10px] text-ink-2">{log}</p>
    </div>
  );
}

function VariantSheet({ en }: { en: boolean }) {
  const items: Array<[Kind, string, string]> = [
    ['minimal', '最简告知', 'Minimal notice'],
    ['granular', '颗粒度选择', 'Granular choices'],
    ['wall', '墙式', 'Wall-style'],
  ];
  return (
    <div className="mx-auto grid max-w-xl grid-cols-1 gap-3 text-sm sm:grid-cols-3">
      {items.map(([kind, zh, english]) => (
        <div key={kind} className="rounded-xl border border-line bg-paper p-3">
          <p className="text-xs font-semibold text-ink">{en ? english : zh}</p>
          <p className="mt-1 text-[10px] text-ink-3">{kind}</p>
          <div className="mt-2 rounded-lg border border-line bg-raised p-2">
            <div className="h-1.5 w-3/4 rounded bg-ink-3/30" />
            <div className="mt-1 h-1.5 w-1/2 rounded bg-ink-3/20" />
            <div className="mt-2 flex gap-1">
              <span className="h-3 w-8 rounded bg-accent/80" />
              <span className="h-3 w-6 rounded border border-line" />
              {kind === 'granular' && <span className="h-3 w-6 rounded bg-code-bg" />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const CookieConsentDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <VariantSheet en={en} />;
  return <ConsentPlayground en={en} kind="granular" />;
};

export default CookieConsentDemo;
