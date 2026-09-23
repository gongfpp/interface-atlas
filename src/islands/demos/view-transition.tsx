import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Kind = 'cross-fade' | 'slide' | 'shared-axis';
type View = 'list' | 'detail';

const CARDS = [
  { zh: '设计令牌', en: 'Design tokens', id: 'tokens' },
  { zh: '组件巡检', en: 'Component audit', id: 'audit' },
];

function ViewTransitionPlayground({ en, kind }: { en: boolean; kind: Kind }) {
  const [view, setView] = useState<View>('list');
  const [run, setRun] = useState(0);
  const [exiting, setExiting] = useState<View | null>(null);

  const go = (to: View) => {
    if (to === view) return;
    setExiting(view);
    setRun((r) => r + 1);
    setView(to);
    window.setTimeout(() => setExiting(null), 400);
  };

  const anim = (role: 'out' | 'in' | 'shared') =>
    role === 'shared'
      ? kind === 'shared-axis'
        ? 'vt-shared'
        : 'vt-none'
      : role === 'out'
        ? kind === 'slide'
          ? 'vt-out-slide'
          : kind === 'shared-axis'
            ? 'vt-out-axis'
            : 'vt-out-fade'
        : kind === 'slide'
          ? 'vt-in-slide'
          : kind === 'shared-axis'
            ? 'vt-in-axis'
            : 'vt-in-fade';

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-52 w-full max-w-sm overflow-hidden rounded-xl border border-line bg-paper">
        {exiting && (
          <div
            key={`out-${run}`}
            data-anatomy="1"
            className={`vt-layer ${anim('out')} absolute inset-0 bg-paper p-4`}
          >
            <p className="text-[10px] font-semibold text-ink-3">
              {en ? 'OLD VIEW' : '旧视图'} · {exiting}
            </p>
            <div className="mt-2 space-y-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-6 rounded-lg border border-line bg-raised" />
              ))}
            </div>
          </div>
        )}
        <div key={`in-${run}`} data-anatomy="2" className={`vt-layer ${anim('in')} absolute inset-0 bg-paper p-4`}>
          {view === 'list' ? (
            <>
              <p className="text-[10px] font-semibold text-ink-3">{en ? 'LIST' : '列表'}</p>
              {CARDS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => go('detail')}
                  data-anatomy="3"
                  className={`mt-2 block w-full rounded-lg border border-line bg-raised px-2.5 py-2 text-left text-[11px] text-ink ${anim('shared')}`}
                >
                  {en ? c.en : c.zh}
                </button>
              ))}
            </>
          ) : (
            <>
              <button onClick={() => go('list')} className="text-[10px] text-accent">
                ← {en ? 'Back' : '返回'}
              </button>
              <p
                data-anatomy="3"
                className={`mt-2 rounded-lg border border-line bg-raised px-2.5 py-2 text-[11px] font-semibold text-ink ${anim('shared')}`}
              >
                {en ? 'Design tokens' : '设计令牌'}
              </p>
              <div className="mt-2 space-y-1.5">
                <div className="h-2 w-full rounded bg-ink-3/20" />
                <div className="h-2 w-5/6 rounded bg-ink-3/20" />
                <div className="h-2 w-2/3 rounded bg-ink-3/20" />
              </div>
            </>
          )}
        </div>
      </div>
      <button
        onClick={() => go(view === 'list' ? 'detail' : 'list')}
        className="rounded-full bg-accent px-5 py-2 text-xs font-semibold text-white transition-transform active:scale-95"
      >
        {view === 'list' ? (en ? 'Open detail →' : '打开详情 →') : en ? '← Back to list' : '← 返回列表'}
      </button>
      <p className="text-xs text-ink-3">
        {kind === 'cross-fade'
          ? en
            ? 'Cross-fade: old fades out, new fades in'
            : '交叉淡入：旧淡出、新淡入'
          : kind === 'slide'
            ? en
              ? 'Slide along the navigation axis'
              : '沿导航方向推入推出'
            : en
              ? 'Shared-axis: card morphs, rest shifts'
              : '共享轴：卡片原地形变，其余沿轴移动'}
      </p>
      <style>{`@keyframes vt-out-fade { to { opacity: 0 } }
@keyframes vt-in-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes vt-out-slide { to { opacity: 0; transform: translateX(-14%) } }
@keyframes vt-in-slide { from { opacity: 0; transform: translateX(14%) } to { opacity: 1; transform: none } }
@keyframes vt-out-axis { to { opacity: 0; transform: scale(0.96) translateY(8px) } }
@keyframes vt-in-axis { from { opacity: 0; transform: scale(1.04) translateY(-8px) } to { opacity: 1; transform: none } }
@keyframes vt-shared { from { transform: scale(1.06) } to { transform: scale(1) } }
.vt-layer { animation-duration: calc(0.32s * var(--demo-speed, 1)); animation-timing-function: cubic-bezier(0.32, 0.72, 0, 1); animation-fill-mode: both; }
.vt-out-fade { animation-name: vt-out-fade }
.vt-in-fade { animation-name: vt-in-fade }
.vt-out-slide { animation-name: vt-out-slide }
.vt-in-slide { animation-name: vt-in-slide }
.vt-out-axis { animation-name: vt-out-axis }
.vt-in-axis { animation-name: vt-in-axis }
.vt-shared { animation-name: vt-shared; animation-duration: calc(0.38s * var(--demo-speed, 1)) }
.vt-none { animation: none }
`}</style>
    </div>
  );
}

function VariantSheet({ en }: { en: boolean }) {
  const items: Array<[Kind, string, string]> = [
    ['cross-fade', '交叉淡入', 'Cross-fade'],
    ['slide', '滑动', 'Slide'],
    ['shared-axis', '共享轴', 'Shared-axis'],
  ];
  return (
    <div className="mx-auto grid max-w-xl grid-cols-1 gap-3 text-sm sm:grid-cols-3">
      {items.map(([id, zh, english]) => (
        <div key={id} className="rounded-xl border border-line bg-paper p-3">
          <p className="text-xs font-semibold text-ink">{en ? english : zh}</p>
          <p className="mt-1 text-[10px] text-ink-3">{id}</p>
          <div className="relative mt-2 h-12 overflow-hidden rounded-lg bg-code-bg">
            <div className="absolute inset-y-1 left-1 w-1/2 rounded bg-ink-3/30" />
            <div className="absolute inset-y-1 right-1 w-1/2 rounded bg-accent/50" />
          </div>
        </div>
      ))}
    </div>
  );
}

const ViewTransitionDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <VariantSheet en={en} />;
  return <ViewTransitionPlayground en={en} kind="cross-fade" />;
};

export default ViewTransitionDemo;
