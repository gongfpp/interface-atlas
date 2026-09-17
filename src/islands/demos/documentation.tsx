import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/* 页面结构缩略示意图（wireframe）：色块 + 真实标签 */

const VARIANTS = [
  { id: 'three-column', zh: '三栏文档', en: 'Three-column' },
  { id: 'sidebar', zh: '侧栏文档', en: 'Sidebar' },
  { id: 'api-reference', zh: 'API 参考', en: 'API Reference' },
  { id: 'single-page', zh: '单页手册', en: 'Single Page' },
] as const;

type VariantId = (typeof VARIANTS)[number]['id'];

const TREE = [
  { group: '入门', items: ['安装', '快速上手'] },
  { group: '指南', items: ['设计令牌', '组件用法', '主题定制'] },
  { group: 'API', items: ['组件列表'] },
];

const TOC = ['基本用法', '代码示例', '注意事项'];

const Bar = ({ w = 'w-full', h = 'h-1.5', cls = 'bg-ink-3/25' }: { w?: string; h?: string; cls?: string }) => (
  <div className={`${h} ${w} rounded-full ${cls}`} />
);

function Tree({ active, onPick, compact = false }: { active: string; onPick: (t: string) => void; compact?: boolean }) {
  return (
    <nav className="space-y-1.5 overflow-hidden p-2" data-anatomy="1">
      {TREE.map(({ group, items }) => (
        <div key={group}>
          <p className="px-1 pb-0.5 text-[8px] uppercase tracking-wider text-ink-3">{group}</p>
          {items.map((t) => (
            <button
              key={t}
              onClick={() => onPick(t)}
              className={`block w-full rounded px-1.5 py-0.5 text-left text-[9px] transition-colors ${
                active === t ? 'bg-accent-soft font-medium text-accent' : 'text-ink-2 hover:bg-code-bg'
              } ${compact ? 'truncate' : ''}`}
            >
              {t}
            </button>
          ))}
        </div>
      ))}
    </nav>
  );
}

function Article({ title }: { title: string }) {
  return (
    <div className="min-w-0 flex-1 space-y-1.5 overflow-hidden p-3" data-anatomy="2">
      <p className="text-[8px] text-ink-3">指南 / 组件用法</p>
      <p className="font-serif text-sm font-semibold">{title}</p>
      <Bar w="w-full" h="h-1" />
      <Bar w="w-5/6" h="h-1" />
      <div className="overflow-hidden rounded-md border border-line bg-code-bg p-2" data-anatomy="3">
        <div className="mb-1 flex items-center justify-between">
          <span className="font-mono text-[8px] text-ink-3">tsx</span>
          <span className="rounded border border-line px-1.5 py-0.5 text-[8px] text-ink-2">复制</span>
        </div>
        <p className="font-mono text-[9px] leading-relaxed text-ink-2">
          <span className="text-accent">import</span> {'{ Button }'} <span className="text-accent">from</span> 'ui';
        </p>
        <p className="font-mono text-[9px] leading-relaxed text-ink-2">&lt;Button variant="primary" /&gt;</p>
      </div>
      <div className="flex gap-1.5 rounded-md border border-line border-l-2 border-l-accent bg-accent-soft/40 p-1.5">
        <span className="text-[9px] text-accent">ⓘ</span>
        <p className="text-[9px] text-ink-2">提示：先阅读设计令牌章节再开始定制。</p>
      </div>
    </div>
  );
}

function Toc({ current, onPick }: { current: string; onPick: (t: string) => void }) {
  return (
    <aside className="w-20 shrink-0 border-l border-line p-2" data-anatomy="4">
      <p className="pb-1 text-[8px] uppercase tracking-wider text-ink-3">本页目录</p>
      {TOC.map((t) => (
        <button
          key={t}
          onClick={() => onPick(t)}
          className={`block w-full truncate rounded px-1.5 py-0.5 text-left text-[9px] transition-colors ${
            current === t ? 'font-medium text-accent' : 'text-ink-2 hover:text-ink'
          }`}
        >
          {t}
        </button>
      ))}
    </aside>
  );
}

function Wireframe({ variant }: { variant: VariantId }) {
  const [page, setPage] = useState('组件用法');
  const [section, setSection] = useState('基本用法');
  const wide = variant === 'three-column';

  if (variant === 'api-reference') {
    return (
      <div className="flex h-72 w-full flex-col overflow-hidden rounded-lg border border-line bg-paper text-left text-xs">
        <header className="flex h-7 shrink-0 items-center gap-2 border-b border-line bg-raised px-3">
          <span className="h-3 w-3 rounded bg-accent" />
          <span className="font-mono text-[9px] text-ink-2">API Reference</span>
        </header>
        <div className="flex-1 space-y-2 overflow-hidden p-3">
          {['<Button>', '<Input>', '<Tabs>'].map((api, i) => (
            <div key={api} className="flex gap-2 rounded-md border border-line bg-raised p-2">
              <div className="w-1/2 space-y-1">
                <p className="font-mono text-[10px] font-medium">{api}</p>
                <Bar w="w-full" h="h-1" />
                <Bar w="w-2/3" h="h-1" />
              </div>
              <div className="w-1/2 rounded bg-code-bg p-1.5">
                <p className="font-mono text-[8px] leading-relaxed text-ink-2">
                  props: {['variant, size', 'type, disabled', 'items, value'][i]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'single-page') {
    return (
      <div className="flex h-72 w-full gap-2 overflow-hidden rounded-lg border border-line bg-paper text-left text-xs">
        <div className="flex-1 space-y-3 overflow-hidden p-3">
          {TOC.map((s, i) => (
            <div key={s} className="space-y-1" data-anatomy="2">
              <p className={`font-serif text-xs font-semibold ${i === 0 ? '' : 'pt-1'}`}>{i + 1}. {s}</p>
              <Bar w="w-full" h="h-1" />
              <Bar w="w-3/4" h="h-1" />
            </div>
          ))}
        </div>
        <Toc current={section} onPick={setSection} />
      </div>
    );
  }

  return (
    <div className="flex h-72 w-full flex-col overflow-hidden rounded-lg border border-line bg-paper text-left text-xs">
      <header className="flex h-7 shrink-0 items-center gap-2 border-b border-line bg-raised px-3">
        <span className="h-3 w-3 rounded bg-accent" />
        <span className="text-[9px] text-ink-2">文档中心</span>
        <span className="ml-auto rounded border border-line px-1.5 py-0.5 text-[8px] text-ink-3">🔍 搜索 ⌘K</span>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-24 shrink-0 border-r border-line bg-raised/50">
          <Tree active={page} onPick={setPage} compact />
        </aside>
        <Article title={page} />
        {wide && <Toc current={section} onPick={setSection} />}
      </div>
      <footer className="flex shrink-0 items-center justify-between border-t border-line px-3 py-1.5" data-anatomy="5">
        <span className="text-[9px] text-ink-2">← 设计令牌</span>
        <span className="text-[9px] text-ink-2">主题定制 →</span>
      </footer>
    </div>
  );
}

const DocumentationDemo: DemoComponent = ({ mode }) => {
  const [variant, setVariant] = useState<VariantId>('three-column');

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
      <p className="text-center text-[11px] text-ink-3">点左侧文档树切换页面；点右侧目录切换章节</p>
    </div>
  );
};

export default DocumentationDemo;
