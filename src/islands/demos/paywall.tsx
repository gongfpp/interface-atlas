import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Kind = 'hard-wall' | 'metered' | 'upgrade-teaser';

const PARAS = [
  {
    zh: '设计系统不是组件仓库，而是一套共享决策。真正难的不是画按钮，而是让十个团队在同一处停下、做出同一判断。',
    en: 'A design system is not a component warehouse but a set of shared decisions. The hard part is not drawing a button — it is getting ten teams to stop at the same place and judge alike.',
  },
  {
    zh: '把 Token 当接口维护：改一处、全端跟随。命名要表达意图而非外观，否则换肤时会全线崩塌。',
    en: 'Treat tokens as interfaces: change once, follow everywhere. Name them for intent rather than looks, or a reskin will shatter the lot.',
  },
  {
    zh: '评审节奏比规范文档更关键。每周一次的组件诊所，比沉睡在仓库里的五十页指南更能拦住走形。',
    en: 'Review cadence matters more than the spec PDF. A weekly component clinic prevents drift better than fifty pages sleeping in a repo.',
  },
  {
    zh: '当采用率停滞，先看贡献成本，而不是继续加组件。摩擦在哪里，生态就停在哪里。',
    en: 'When adoption stalls, look at contribution cost before shipping more components. Wherever friction sits, the ecosystem freezes.',
  },
];

function PaywallPlayground({ en, kind }: { en: boolean; kind: Kind }) {
  const [subscribed, setSubscribed] = useState(false);
  const [used, setUsed] = useState(2);
  const quota = 3;
  const gated = !subscribed && (kind === 'hard-wall' ? true : kind === 'metered' ? used >= quota : true);
  const previewCount = kind === 'upgrade-teaser' ? 2 : kind === 'metered' ? 2 : 2;

  return (
    <div className="mx-auto w-full max-w-md">
      <div data-anatomy="4" className="mb-2 flex items-center gap-2 text-[10px] text-ink-3">
        <span>{en ? `Free reads ${used}/${quota}` : `免费额度 ${used}/${quota}`}</span>
        <span className="h-1 flex-1 overflow-hidden rounded-full bg-line">
          <span
            className="block h-full bg-accent transition-all"
            style={{
              width: `${Math.min(100, (used / quota) * 100)}%`,
              transitionDuration: 'calc(0.3s * var(--demo-speed, 1))',
            }}
          />
        </span>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-line bg-paper">
        <div data-anatomy="1" className="p-4">
          <p className="text-sm font-semibold text-ink">{en ? 'Tokens as Interfaces' : '把 Token 当接口'}</p>
          {PARAS.slice(0, previewCount).map((p, i) => (
            <p key={i} className="mt-2 text-[11px] leading-relaxed text-ink-2">
              {en ? p.en : p.zh}
            </p>
          ))}
          {!gated &&
            PARAS.slice(previewCount).map((p, i) => (
              <p key={i} className="mt-2 text-[11px] leading-relaxed text-ink-2">
                {en ? p.en : p.zh}
              </p>
            ))}
          {gated &&
            kind === 'upgrade-teaser' &&
            PARAS.slice(previewCount, previewCount + 1).map((p, i) => (
              <p key={i} className="mt-2 select-none text-[11px] leading-relaxed text-ink-2 blur-[3px]">
                {en ? p.en : p.zh}
              </p>
            ))}
        </div>

        {gated && (
          <div
            data-anatomy="2"
            className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 bg-gradient-to-t from-paper via-paper/95 to-transparent px-4 pb-4 pt-10"
          >
            <p className="text-xs font-semibold text-ink">
              {kind === 'metered'
                ? en
                  ? 'Free quota used up'
                  : '免费额度已用完'
                : en
                  ? 'Continue with Pro'
                  : '订阅后继续阅读'}
            </p>
            <p className="text-[10px] text-ink-3">
              {en ? 'Unlimited articles · team spaces · source files' : '无限阅读 · 团队空间 · 源文件下载'}
            </p>
            <div data-anatomy="3" className="flex items-center gap-2">
              <button
                onClick={() => setSubscribed(true)}
                className="rounded-full bg-accent px-4 py-1.5 text-[11px] font-semibold text-white"
              >
                {en ? 'Subscribe ¥28/mo' : '订阅 ¥28/月'}
              </button>
              <button className="rounded-full border border-line px-3 py-1.5 text-[11px] text-ink-2">
                {en ? 'Learn more' : '了解更多'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {kind === 'metered' && !subscribed && (
          <button
            onClick={() => setUsed((u) => Math.min(quota, u + 1))}
            className="rounded-lg border border-line px-2.5 py-1 text-[11px] text-ink-2"
          >
            {en ? 'Read next article' : '再读一篇'}
          </button>
        )}
        {subscribed && (
          <button
            onClick={() => {
              setSubscribed(false);
              setUsed(2);
            }}
            className="rounded-lg border border-line px-2.5 py-1 text-[11px] text-ink-2"
          >
            {en ? 'Reset demo' : '重置演示'}
          </button>
        )}
      </div>
    </div>
  );
}

function VariantSheet({ en }: { en: boolean }) {
  const items: Array<[Kind, string, string]> = [
    ['hard-wall', '硬性截断', 'Hard wall'],
    ['metered', '计量限制', 'Metered limit'],
    ['upgrade-teaser', '升级提示', 'Upgrade teaser'],
  ];
  return (
    <div className="mx-auto grid max-w-xl grid-cols-1 gap-3 text-sm sm:grid-cols-3">
      {items.map(([kind, zh, english]) => (
        <div key={kind} className="rounded-xl border border-line bg-paper p-3">
          <p className="text-xs font-semibold text-ink">{en ? english : zh}</p>
          <p className="mt-1 text-[10px] text-ink-3">{kind}</p>
          <div className="mt-2 space-y-1 rounded-lg bg-code-bg p-2">
            <div className="h-1.5 w-full rounded bg-ink-3/30" />
            <div className="h-1.5 w-4/5 rounded bg-ink-3/25" />
            {kind !== 'hard-wall' && <div className={`h-1.5 w-3/5 rounded bg-ink-3/20 ${kind === 'upgrade-teaser' ? 'blur-[2px]' : ''}`} />}
            <div className="mt-1 h-3 w-10 rounded-full bg-accent/80" />
          </div>
        </div>
      ))}
    </div>
  );
}

const PaywallDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <VariantSheet en={en} />;
  return <PaywallPlayground en={en} kind="metered" />;
};

export default PaywallDemo;
