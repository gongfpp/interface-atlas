import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const VARIANTS = [
  { id: 'minimal', zh: '极简错误', en: 'Minimal' },
  { id: 'retry', zh: '带重试', en: 'With Retry' },
  { id: 'status', zh: '状态与支持', en: 'Status & Support' },
] as const;

type VariantId = (typeof VARIANTS)[number]['id'];

const TEXT = {
  zh: {
    code: '500',
    title: '服务暂时出了点问题',
    body: '不是你的操作问题，我们正在恢复。',
    retry: '重试',
    retrying: '重试中…',
    attempts: '已尝试',
    times: '次',
    detail: '查看故障详情',
    hide: '收起详情',
    detailBody: '影响范围：数据写入。最近更新：刚刚。请求 ID 已记录。',
    support: '联系支持',
    hint: '点「重试」累积尝试次数，展开看详情',
  },
  en: {
    code: '500',
    title: 'The service hit a snag',
    body: 'This is not your fault — we are recovering.',
    retry: 'Retry',
    retrying: 'Retrying…',
    attempts: 'Attempts',
    times: '',
    detail: 'View status detail',
    hide: 'Hide detail',
    detailBody: 'Impact: data writes. Last update: just now. Request ID logged.',
    support: 'Contact support',
    hint: 'Click Retry to count attempts, expand for detail',
  },
};

type Copy = (typeof TEXT)['zh'];

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-72 w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-line bg-paper p-5 text-center text-xs">
    {children}
  </div>
);

function PageBody({
  variant,
  copy,
  attempts,
  retrying,
  onRetry,
  detailOpen,
  onToggleDetail,
}: {
  variant: VariantId;
  copy: Copy;
  attempts: number;
  retrying: boolean;
  onRetry: () => void;
  detailOpen: boolean;
  onToggleDetail: () => void;
}) {
  return (
    <>
      {variant === 'status' && (
        <div className="mb-3 flex w-full max-w-[18rem] items-center gap-2 rounded-md border border-line bg-accent-soft px-3 py-1.5 text-left" data-anatomy="4">
          <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
          <span className="text-[10px] text-accent">{copy.detailBody}</span>
        </div>
      )}
      <p className="font-serif text-4xl font-bold text-accent" data-anatomy="1">
        {copy.code}
      </p>
      <p className="mt-2 font-serif text-sm font-semibold" data-anatomy="2">
        {copy.title}
      </p>
      <p className="mt-1 text-[11px] text-ink-2">{copy.body}</p>
      <div className="mt-3 flex items-center gap-2" data-anatomy="3">
        <button
          onClick={onRetry}
          className={`rounded px-3 py-1 text-[11px] font-medium transition-colors ${
            retrying ? 'bg-ink-3/30 text-ink-2' : 'bg-accent text-white hover:opacity-90'
          }`}
        >
          {retrying ? copy.retrying : copy.retry}
        </button>
        {variant === 'retry' && attempts > 0 && (
          <span className="text-[10px] text-ink-3" aria-live="polite">
            {copy.attempts} {attempts} {copy.times}
          </span>
        )}
      </div>
      {variant === 'status' && (
        <>
          <button onClick={onToggleDetail} className="mt-3 text-[10px] text-ink-3 underline hover:text-accent">
            {detailOpen ? copy.hide : copy.detail}
          </button>
          {detailOpen && (
            <p className="mt-1 max-w-[18rem] text-[10px] text-ink-2" data-anatomy="4">
              {copy.detailBody}
            </p>
          )}
          <button className="mt-3 text-[11px] font-medium text-accent hover:underline" data-anatomy="5">
            {copy.support}
          </button>
        </>
      )}
    </>
  );
}

const Error500Demo: DemoComponent = ({ mode, locale = 'zh' }) => {
  const copy = TEXT[locale];
  const [variant, setVariant] = useState<VariantId>('retry');
  const [attempts, setAttempts] = useState(0);
  const [retrying, setRetrying] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const retry = () => {
    setAttempts((a) => a + 1);
    setRetrying((r) => !r);
  };

  if (mode === 'variants') {
    return (
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        {VARIANTS.map((v) => (
          <div key={v.id} className="relative overflow-hidden rounded-lg border border-line" style={{ height: 148 }}>
            <div className="absolute left-0 top-0 w-[200%] origin-top-left scale-50">
              <Card>
                <PageBody
                  variant={v.id}
                  copy={copy}
                  attempts={1}
                  retrying={false}
                  onRetry={() => {}}
                  detailOpen={false}
                  onToggleDetail={() => {}}
                />
              </Card>
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
            onClick={() => {
              setVariant(v.id);
              setAttempts(0);
              setRetrying(false);
              setDetailOpen(false);
            }}
            className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
              variant === v.id ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:border-accent'
            }`}
          >
            {v.zh} / {v.en}
          </button>
        ))}
      </div>
      <Card>
        <PageBody
          variant={variant}
          copy={copy}
          attempts={attempts}
          retrying={retrying}
          onRetry={retry}
          detailOpen={detailOpen}
          onToggleDetail={() => setDetailOpen((d) => !d)}
        />
      </Card>
      <p className="text-center text-[11px] text-ink-3">{copy.hint}</p>
    </div>
  );
};

export default Error500Demo;
