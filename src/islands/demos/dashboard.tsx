import { usePreviewVariant } from '@/islands/shared/previewVariant';
import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/* 页面结构缩略示意图（wireframe）：色块 + 真实标签 */

const VARIANTS = [
  { id: 'sidebar', zh: '侧栏', en: 'Sidebar' },
  { id: 'topnav', zh: '顶栏', en: 'Top Nav' },
  { id: 'dense', zh: '高密度', en: 'Dense' },
  { id: 'card', zh: '卡片', en: 'Card' },
  { id: 'analytical', zh: '分析型', en: 'Analytical' },
] as const;

type VariantId = (typeof VARIANTS)[number]['id'];

export const previewVariants = { ids: VARIANTS.map((v) => v.id), default: 'sidebar' };

const Bar = ({ w = 'w-full', h = 'h-1.5', cls = 'bg-ink-3/25' }: { w?: string; h?: string; cls?: string }) => (
  <div className={`${h} ${w} rounded-full ${cls}`} />
);

const Kpi = ({ label }: { label: string }) => (
  <div className="rounded-md border border-line bg-raised p-2" data-anatomy="3">
    <Bar w="w-1/2" h="h-1" />
    <p className="mt-1 text-xs font-semibold">{label}</p>
  </div>
);

const Chart = ({ bars, className = '' }: { bars: number[]; className?: string }) => (
  <div className={`flex items-end gap-1 rounded-md border border-line bg-raised p-2 ${className}`} data-anatomy="4">
    <span className="absolute mt-0.5 ml-1 text-[9px] text-ink-3">图表</span>
    <div className="flex h-full w-full items-end justify-around gap-1 pt-3">
      {bars.map((b, i) => (
        <div key={i} className="w-full rounded-t bg-accent/70 transition-all" style={{ height: `${b}%`, transitionDuration: 'calc(300ms * var(--demo-speed, 1))' }} />
      ))}
    </div>
  </div>
);

const Table = ({ rows }: { rows: number }) => (
  <div className="rounded-md border border-line bg-raised p-2" data-anatomy="5">
    <div className="mb-1.5 flex gap-2">
      {[0, 1, 2, 3].map((i) => (
        <Bar key={i} h="h-1" cls="bg-ink-3/40" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex items-center gap-2 border-t border-line py-1">
        <Bar w="w-10" h="h-1" />
        <Bar w="w-16" h="h-1" />
        <Bar w="w-8" h="h-1" cls="bg-accent/40" />
        <Bar w="w-12" h="h-1" />
      </div>
    ))}
  </div>
);

const Header = ({ nav = false }: { nav?: boolean }) => (
  <header className="flex h-8 shrink-0 items-center gap-3 border-b border-line bg-raised px-3" data-anatomy="1">
    <span className="h-3 w-3 rounded bg-accent" />
    <Bar w="w-10" h="h-1" />
    {nav && (
      <div className="ml-2 flex gap-2" data-anatomy="2">
        {['概览', '订单', '用户', '设置'].map((t) => (
          <span key={t} className="text-[9px] text-ink-2">{t}</span>
        ))}
      </div>
    )}
    <span className="ml-auto text-[9px] text-ink-3" data-anatomy="6">近 7 天 ▾</span>
  </header>
);

const Sidebar = ({ items = ['概览', '订单', '用户', '账单', '设置'] }: { items?: string[] }) => (
  <aside className="flex w-16 shrink-0 flex-col gap-1.5 border-r border-line bg-raised p-2" data-anatomy="2">
    {items.map((t, i) => (
      <span key={t} className={`rounded px-1 py-0.5 text-[9px] ${i === 0 ? 'bg-accent-soft text-accent' : 'text-ink-2'}`}>{t}</span>
    ))}
  </aside>
);

function Wireframe({ variant, range }: { variant: VariantId; range: 0 | 1 }) {
  const barsA = range === 0 ? [40, 65, 50, 80, 55, 90, 70] : [55, 45, 70, 60, 85, 65, 95];
  const barsB = range === 0 ? [30, 55, 45, 70] : [45, 35, 60, 50];
  const kpis = variant === 'dense' ? ['销售额', '订单量', '转化率', '退款率'] : ['销售额', '订单量', '转化率'];

  let content: React.ReactNode;
  if (variant === 'sidebar' || variant === 'dense' || variant === 'analytical') {
    const dense = variant === 'dense';
    content = (
      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={dense ? ['概览', '订单', '用户', '库存', '营销', '账单', '日志', '设置'] : undefined} />
        <div className="flex flex-1 flex-col gap-2 overflow-hidden p-2">
          <div className={`grid gap-2 ${dense ? 'grid-cols-4' : 'grid-cols-3'}`}>
            {kpis.map((k) => <Kpi key={k} label={k} />)}
          </div>
          {variant === 'analytical' ? (
            <div className="flex flex-1 gap-2 overflow-hidden">
              <Chart bars={barsA} className="relative flex-1" />
              <div className="flex w-20 shrink-0 flex-col gap-1 rounded-md border border-line bg-raised p-2" data-anatomy="6">
                <Bar w="w-2/3" h="h-1" cls="bg-ink-3/40" />
                {['渠道', '地区', '设备'].map((f) => (
                  <span key={f} className="text-[9px] text-ink-2">□ {f}</span>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-1 gap-2 overflow-hidden">
              <Chart bars={barsA} className="relative flex-[2]" />
              <Chart bars={barsB} className="relative flex-1" />
            </div>
          )}
          <Table rows={dense ? 4 : 2} />
        </div>
      </div>
    );
  } else if (variant === 'topnav') {
    content = (
      <div className="flex flex-1 flex-col gap-2 overflow-hidden p-2">
        <div className="grid grid-cols-3 gap-2">{kpis.map((k) => <Kpi key={k} label={k} />)}</div>
        <div className="flex flex-1 gap-2 overflow-hidden">
          <Chart bars={barsA} className="relative flex-1" />
          <Chart bars={barsB} className="relative flex-1" />
        </div>
        <Table rows={2} />
      </div>
    );
  } else {
    content = (
      <div className="grid flex-1 grid-cols-3 grid-rows-2 gap-2 overflow-hidden p-2">
        <div className="col-span-1 row-span-2 rounded-md border border-line bg-raised p-2" data-anatomy="4">
          <Bar w="w-1/2" h="h-1" />
          <Chart bars={barsA} className="relative mt-2 h-[70%]" />
        </div>
        {['销售额', '订单量', '活跃用户', '转化率'].map((k) => (
          <div key={k} className="rounded-md border border-line bg-raised p-2" data-anatomy="3">
            <Bar w="w-1/2" h="h-1" />
            <p className="mt-1 text-xs font-semibold">{k}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-72 w-full flex-col overflow-hidden rounded-lg border border-line bg-paper text-left text-xs">
      <Header nav={variant === 'topnav'} />
      {content}
    </div>
  );
}

const DashboardDemo: DemoComponent = ({ mode }) => {
  const [variant, setVariant] = usePreviewVariant<VariantId>('sidebar');
  const [range, setRange] = useState<0 | 1>(0);

  if (mode === 'variants') {
    return (
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        {VARIANTS.map((v) => (
          <div key={v.id} className="relative overflow-hidden rounded-lg border border-line" style={{ height: 148 }}>
            <div className="absolute left-0 top-0 w-[200%] origin-top-left scale-50">
              <Wireframe variant={v.id} range={range} />
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
      <div className="flex flex-wrap items-center gap-2">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            aria-pressed={variant === v.id}
            onClick={() => setVariant(v.id)}
            className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
              variant === v.id ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:border-accent'
            }`}
          >
            {v.zh}
          </button>
        ))}
        <button
          onClick={() => setRange((r) => (r === 0 ? 1 : 0))}
          className="ml-auto rounded-full border border-line px-2.5 py-0.5 text-xs text-ink-2 transition-colors hover:border-accent hover:text-accent"
        >
          {range === 0 ? '近 7 天' : '近 30 天'} ↻
        </button>
      </div>
      <Wireframe variant={variant} range={range} />
    </div>
  );
};

export default DashboardDemo;
