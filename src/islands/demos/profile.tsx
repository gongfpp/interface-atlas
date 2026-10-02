import { usePreviewVariant } from '@/islands/shared/previewVariant';
import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/* 页面结构缩略示意图（wireframe）：色块 + 真实标签 */

const VARIANTS = [
  { id: 'card', zh: '卡片式', en: 'Card' },
  { id: 'cover', zh: '封面头图式', en: 'Cover' },
  { id: 'minimal', zh: '极简名片式', en: 'Minimal' },
  { id: 'portfolio', zh: '作品集式', en: 'Portfolio' },
] as const;

type VariantId = (typeof VARIANTS)[number]['id'];

export const previewVariants = { ids: VARIANTS.map((v) => v.id), default: 'cover' };
type Tab = '动态' | '作品' | '关于';

const TABS: Tab[] = ['动态', '作品', '关于'];

const Bar = ({ w = 'w-full', h = 'h-1.5', cls = 'bg-ink-3/25' }: { w?: string; h?: string; cls?: string }) => (
  <div className={`${h} ${w} rounded-full ${cls}`} />
);

const Avatar = ({ size = 'h-10 w-10' }: { size?: string }) => (
  <span className={`${size} flex items-center justify-center rounded-full bg-accent/30 text-[10px] font-medium text-accent ring-2 ring-paper`}>林</span>
);

function Identity({ compact = false }: { compact?: boolean }) {
  return (
    <div className="space-y-1" data-anatomy="2">
      <p className="flex items-center gap-1 text-xs font-semibold">
        林小满 <span className="rounded-full bg-accent-soft px-1 text-[8px] text-accent">已认证</span>
      </p>
      <Bar w={compact ? 'w-28' : 'w-40'} h="h-1" />
      <div className="flex gap-3 pt-0.5 text-[9px] text-ink-2" data-anatomy="3">
        <span><b className="text-ink">128</b> 关注者</span>
        <span><b className="text-ink">86</b> 关注中</span>
        <span><b className="text-ink">42</b> 作品</span>
      </div>
    </div>
  );
}

function FollowButton() {
  const [state, setState] = useState<0 | 1>(0);
  return (
    <button
      onClick={() => setState((s) => (s === 0 ? 1 : 0))}
      className={`rounded px-2.5 py-1 text-[10px] font-medium transition-colors ${
        state === 0 ? 'bg-accent text-white hover:opacity-90' : 'border border-line text-ink-2 hover:border-accent hover:text-accent'
      }`}
      data-anatomy="5"
    >
      {state === 0 ? '+ 关注' : '已关注 ✓'}
    </button>
  );
}

function Wireframe({ variant }: { variant: VariantId }) {
  const [tab, setTab] = useState<Tab>('动态');

  const tabs = TABS.map((t) => (
    <button
      key={t}
      onClick={() => setTab(t)}
      className={`relative pb-1 text-[10px] transition-colors ${
        tab === t ? 'font-medium text-accent' : 'text-ink-2 hover:text-ink'
      }`}
      data-anatomy="4"
    >
      {t}
      {tab === t && <span className="absolute -bottom-px left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-accent" />}
    </button>
  ));

  const stream = (
    <div className="space-y-1.5">
      {tab === '作品' ? (
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-8 rounded bg-accent/25" />
          ))}
        </div>
      ) : tab === '关于' ? (
        <div className="space-y-1 py-1">
          <Bar w="w-full" h="h-1" />
          <Bar w="w-5/6" h="h-1" />
          <Bar w="w-2/3" h="h-1" />
        </div>
      ) : (
        [0, 1].map((i) => (
          <div key={i} className="flex gap-2 rounded-md border border-line bg-raised p-1.5">
            <span className="h-4 w-4 shrink-0 rounded-full bg-ink-3/20" />
            <div className="flex-1 space-y-1">
              <Bar w="w-1/2" h="h-1" />
              <Bar w="w-3/4" h="h-1" />
            </div>
          </div>
        ))
      )}
    </div>
  );

  if (variant === 'cover') {
    return (
      <div className="h-72 w-full overflow-hidden rounded-lg border border-line bg-paper text-left text-xs">
        <div className="h-20 bg-accent/25" data-anatomy="1" />
        <div className="relative px-4">
          <div className="-mt-5 flex items-end justify-between">
            <Avatar />
            <FollowButton />
          </div>
          <div className="mt-2"><Identity /></div>
        </div>
        <div className="mt-3 flex gap-3 border-b border-line px-4">{tabs}</div>
        <div className="p-4">{stream}</div>
      </div>
    );
  }
  if (variant === 'card') {
    return (
      <div className="flex h-72 w-full items-center justify-center rounded-lg border border-line bg-paper p-4 text-left text-xs">
        <div className="w-full max-w-56 space-y-2 rounded-xl border border-line bg-raised p-4 text-center shadow-sm">
          <div className="mx-auto w-fit"><Avatar size="h-12 w-12" /></div>
          <div className="flex justify-center"><Identity /></div>
          <FollowButton />
          <div className="flex justify-center gap-3 border-t border-line pt-2">{tabs}</div>
          {stream}
        </div>
      </div>
    );
  }
  if (variant === 'minimal') {
    return (
      <div className="flex h-72 w-full items-center justify-center rounded-lg border border-line bg-paper p-4 text-left text-xs">
        <div className="w-40 space-y-2">
          <Avatar size="h-10 w-10" />
          <Identity />
          {['个人网站', 'Newsletter', 'GitHub'].map((l) => (
            <div key={l} className="flex items-center justify-between rounded border border-line px-2 py-1 text-[9px] text-ink-2">
              <span>{l}</span><span className="text-ink-3">↗</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="h-72 w-full overflow-hidden rounded-lg border border-line bg-paper text-left text-xs">
      <div className="flex items-center gap-3 border-b border-line p-4">
        <Avatar />
        <div className="flex-1"><Identity /></div>
        <FollowButton />
      </div>
      <div className="flex gap-3 border-b border-line px-4 pt-2">{tabs}</div>
      <div className="grid grid-cols-3 gap-1.5 p-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className={`h-12 rounded ${i % 4 === 0 ? 'bg-accent/30' : 'bg-ink-3/10'}`} />
        ))}
      </div>
    </div>
  );
}

const ProfileDemo: DemoComponent = ({ mode }) => {
  const [variant, setVariant] = usePreviewVariant<VariantId>('cover');

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
            aria-pressed={variant === v.id}
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
      <p className="text-center text-[11px] text-ink-3">点「关注」切换状态；页签可切换内容</p>
    </div>
  );
};

export default ProfileDemo;
