import { usePreviewVariant } from '@/islands/shared/previewVariant';
import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/* 页面结构缩略示意图（wireframe）：色块 + 真实标签 */

const VARIANTS = [
  { id: 'standard', zh: '标准文章', en: 'Standard' },
  { id: 'long-form', zh: '长文带目录', en: 'Long-form' },
  { id: 'tutorial', zh: '教程步骤', en: 'Tutorial' },
] as const;

type VariantId = (typeof VARIANTS)[number]['id'];

export const previewVariants = { ids: VARIANTS.map((v) => v.id), default: 'standard' };

const SECTIONS = [
  { zh: '引言', en: 'Intro' },
  { zh: '结构', en: 'Structure' },
  { zh: '配色', en: 'Color' },
  { zh: '结语', en: 'Closing' },
];

const Bar = ({ w = 'w-full', h = 'h-1.5', cls = 'bg-ink-3/25' }: { w?: string; h?: string; cls?: string }) => (
  <div className={`${h} ${w} rounded-full ${cls}`} />
);

const SCOPE_STYLE =
  '[data-demo-scope] [class*="transition"] { transition-duration: calc(150ms * var(--demo-speed, 1)); }';

const Body = ({ active, en, tutorial = false }: { active: number; en: boolean; tutorial?: boolean }) => (
  <div className="min-h-0 flex-1 overflow-hidden" data-anatomy="4">
    {tutorial ? (
      <div className="space-y-1.5">
        {[0, 1, 2].map((s) => (
          <div
            key={s}
            className={`rounded-md border p-1.5 transition-colors ${
              active === s ? 'border-accent bg-accent-soft' : 'border-line bg-raised'
            }`}
          >
            <p className="text-[9px] font-medium">
              {s + 1}. {en ? ['Install the package', 'Wire the provider', 'Render the page'][s] : ['安装依赖', '接入 Provider', '渲染页面'][s]}
            </p>
            <div className="mt-1 rounded bg-code-bg px-1.5 py-1 font-mono text-[8px] text-ink-2">
              {['npm i acme', '<Provider>', 'export default Page'][s]}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="space-y-2 pr-1">
        {SECTIONS.map((sec, i) => (
          <div key={sec.en} className={`rounded-md p-1 ${active === i ? 'bg-accent-soft' : ''}`}>
            <p className="font-serif text-[10px] font-semibold text-ink">{en ? sec.en : sec.zh}</p>
            <div className="mt-1 space-y-1">
              <Bar />
              <Bar w="w-11/12" />
              <Bar w="w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

function Wireframe({ variant, en }: { variant: VariantId; en: boolean }) {
  const [active, setActive] = useState(0);
  const [shared, setShared] = useState(false);

  const toc = (
    <div className={variant === 'long-form' ? 'w-20 shrink-0 space-y-1 border-r border-line pr-2' : 'mb-1.5 flex flex-wrap gap-1'} data-anatomy="3">
      {SECTIONS.map((s, i) => (
        <button
          key={s.en}
          onClick={() => setActive(i)}
          className={`block rounded px-1.5 py-0.5 text-left text-[8px] transition-colors ${
            active === i ? 'bg-accent-soft text-accent' : 'text-ink-3 hover:text-accent'
          }`}
        >
          {en ? s.en : s.zh}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex h-72 w-full flex-col overflow-hidden rounded-lg border border-line bg-paper text-left text-xs">
      <header className="flex h-7 shrink-0 items-center gap-2 border-b border-line bg-raised px-3" data-anatomy="1">
        <span className="text-[10px] text-ink-2">‹ {en ? 'Back' : '返回'}</span>
        <span className="ml-1 font-serif text-[10px] font-semibold">{en ? 'Acme Blog' : 'Acme 博客'}</span>
        <button
          onClick={() => setShared((s) => !s)}
          className={`ml-auto rounded-full border px-2 py-0.5 text-[9px] transition-colors ${
            shared ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:border-accent'
          }`}
        >
          {shared ? (en ? 'Copied ✓' : '已复制 ✓') : (en ? 'Share' : '分享')}
        </button>
      </header>

      <div className="shrink-0 px-3 pt-2" data-anatomy="2">
        <p className="font-serif text-[13px] font-semibold leading-tight">
          {en ? 'Designing calm interfaces' : '设计安静的界面'}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-accent/30" />
          <span className="text-[9px] text-ink-2">{en ? 'Lin Wei' : '林薇'}</span>
          <span className="text-[8px] text-ink-3">{en ? 'Aug 12 · 8 min read' : '8月12日 · 阅读 8 分钟'}</span>
        </div>
      </div>

      {variant === 'tutorial' ? (
        <div className="flex min-h-0 flex-1 gap-2 px-3 pt-2">
          {toc}
          <Body active={active} en={en} tutorial />
        </div>
      ) : variant === 'long-form' ? (
        <div className="flex min-h-0 flex-1 gap-3 px-3 pt-2">
          {toc}
          <Body active={active} en={en} />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col px-3 pt-2">
          {toc}
          <Body active={active} en={en} />
        </div>
      )}

      <div className="mx-3 my-2 flex shrink-0 items-center gap-2 rounded-md border border-line bg-raised p-1.5" data-anatomy="5">
        <span className="h-6 w-6 rounded-full bg-accent/30" />
        <div>
          <p className="text-[9px] font-medium">{en ? 'Lin Wei · Design Engineer' : '林薇 · 设计工程师'}</p>
          <Bar w="w-24" h="h-1" />
        </div>
      </div>

      <div className="flex shrink-0 gap-2 border-t border-line px-3 py-2" data-anatomy="6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex-1 rounded border border-line bg-raised p-1">
            <p className="truncate text-[8px] font-medium">{en ? ['On color', 'On grids', 'On motion'][i] : ['谈配色', '谈栅格', '谈动效'][i]}</p>
            <Bar w="w-2/3" h="h-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

const BlogPostDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  const [variant, setVariant] = usePreviewVariant<VariantId>('standard');

  if (mode === 'variants') {
    return (
      <div data-demo-scope className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        <style>{SCOPE_STYLE}</style>
        {VARIANTS.map((v) => (
          <div key={v.id} className="relative overflow-hidden rounded-lg border border-line" style={{ height: 148 }}>
            <div className="absolute left-0 top-0 w-[200%] origin-top-left scale-50">
              <Wireframe variant={v.id} en={en} />
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
    <div data-demo-scope className="mx-auto flex max-w-md flex-col gap-3">
      <style>{SCOPE_STYLE}</style>
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
            {en ? v.en : v.zh}
          </button>
        ))}
      </div>
      <Wireframe key={`${variant}-${locale}`} variant={variant} en={en} />
      <p className="text-center text-[11px] text-ink-3">
        {en ? 'Click a TOC item to jump, or share to copy the link' : '点目录跳转章节，点分享复制链接'}
      </p>
    </div>
  );
};

export default BlogPostDemo;
