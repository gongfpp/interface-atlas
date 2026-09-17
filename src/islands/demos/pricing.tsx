import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/* 页面结构缩略示意图（wireframe）：色块 + 真实标签 */

const VARIANTS = [
  { id: 'tiers', zh: '简单分层', en: 'Tiers' },
  { id: 'billing-toggle', zh: '月年切换', en: 'Billing Toggle' },
  { id: 'comparison', zh: '功能对比', en: 'Comparison' },
  { id: 'freemium', zh: '免费增值', en: 'Freemium' },
] as const;

type VariantId = (typeof VARIANTS)[number]['id'];

const Bar = ({ w = 'w-full', h = 'h-1.5', cls = 'bg-ink-3/25' }: { w?: string; h?: string; cls?: string }) => (
  <div className={`${h} ${w} rounded-full ${cls}`} />
);

const TIERS = [
  { id: 'free', zh: '免费', price: [0, 0] as const, features: ['3 个项目', '基础报表'] },
  { id: 'pro', zh: '专业', price: [59, 49] as const, features: ['无限项目', '高级报表', '优先支持'] },
  { id: 'ent', zh: '企业', price: [199, 169] as const, features: ['SSO / SAML', '专属顾问', 'SLA 保障'] },
];

function TierCard({
  tier,
  annual,
  selected,
  onSelect,
  compact = false,
}: {
  tier: (typeof TIERS)[number];
  annual: boolean;
  selected: boolean;
  onSelect: () => void;
  compact?: boolean;
}) {
  const highlight = tier.id === 'pro';
  return (
    <button
      onClick={onSelect}
      data-anatomy="3"
      className={`flex flex-col gap-1.5 rounded-md border bg-raised p-2.5 text-left transition-all ${
        highlight ? 'border-accent' : 'border-line'
      } ${selected ? 'ring-2 ring-accent/50' : ''} ${highlight && !compact ? 'scale-[1.03] shadow-md' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium">{tier.zh}</span>
        {highlight && <span className="rounded-full bg-accent px-1.5 py-0.5 text-[8px] text-white">最受欢迎</span>}
      </div>
      <p className="font-serif text-base font-semibold">
        ¥{annual ? tier.price[1] : tier.price[0]}
        <span className="text-[8px] font-normal text-ink-3">/月</span>
      </p>
      {tier.features.map((f) => (
        <span key={f} className="flex items-center gap-1 text-[9px] text-ink-2">
          <span className="text-accent">✓</span>
          {f}
        </span>
      ))}
      <span className={`mt-auto rounded py-1 text-center text-[9px] ${highlight ? 'bg-accent text-white' : 'border border-line text-ink-2'}`}>
        选择{tier.zh}
      </span>
    </button>
  );
}

function Wireframe({ variant }: { variant: VariantId }) {
  const [annual, setAnnual] = useState(true);
  const [selected, setSelected] = useState('pro');
  const showToggle = variant !== 'tiers';
  const showTable = variant === 'comparison';
  const tiers = variant === 'freemium' ? TIERS.slice(0, 2) : TIERS;

  return (
    <div className="flex h-72 w-full flex-col gap-2 overflow-hidden rounded-lg border border-line bg-paper p-3 text-left text-xs">
      <div className="text-center" data-anatomy="1">
        <p className="font-serif text-sm font-semibold">选择适合你的方案</p>
        <Bar w="w-1/2 mx-auto mt-1" h="h-1" />
      </div>
      {showToggle && (
        <div className="mx-auto flex items-center gap-2 text-[9px]" data-anatomy="2">
          <span className={annual ? 'text-ink-3' : 'font-medium text-accent'}>月付</span>
          <button
            onClick={() => setAnnual((a) => !a)}
            aria-pressed={annual}
            className={`relative h-4 w-7 rounded-full transition-colors ${annual ? 'bg-accent' : 'bg-ink-3/30'}`}
          >
            <span
              className="absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all"
              style={{ left: annual ? '14px' : '2px', transitionDuration: 'calc(150ms * var(--demo-speed, 1))' }}
            />
          </button>
          <span className={annual ? 'font-medium text-accent' : 'text-ink-3'}>
            年付 <span className="rounded bg-accent-soft px-1 text-accent">-17%</span>
          </span>
        </div>
      )}
      <div className={`grid gap-2 ${variant === 'freemium' ? 'grid-cols-2' : 'grid-cols-3'} flex-1`}>
        {tiers.map((t) => (
          <TierCard
            key={t.id}
            tier={t}
            annual={annual}
            selected={selected === t.id}
            onSelect={() => setSelected(t.id)}
          />
        ))}
      </div>
      {showTable && (
        <div className="rounded-md border border-line bg-raised p-2" data-anatomy="4">
          <div className="grid grid-cols-4 gap-1 text-[8px] text-ink-3">
            <span>功能</span><span>免费</span><span className="text-accent">专业</span><span>企业</span>
            {['成员数', '报表', 'SSO'].map((f) => (
              <div key={f} className="col-span-4 grid grid-cols-4 gap-1 border-t border-line py-0.5 text-[9px] text-ink-2">
                <span>{f}</span><span>✓</span><span className="text-accent">✓</span><span>✓</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-center gap-2" data-anatomy="5">
        {['可以开发票吗？', '能随时取消吗？'].map((q) => (
          <span key={q} className="rounded-full border border-line px-2 py-0.5 text-[8px] text-ink-2">？{q}</span>
        ))}
      </div>
    </div>
  );
}

const PricingDemo: DemoComponent = ({ mode }) => {
  const [variant, setVariant] = useState<VariantId>('billing-toggle');

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
      <p className="text-center text-[11px] text-ink-3">拨动月/年开关看价格变化；点卡片选择套餐</p>
    </div>
  );
};

export default PricingDemo;
