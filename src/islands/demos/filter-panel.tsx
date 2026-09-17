import { useMemo, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

interface Product {
  name: string;
  cat: '家具' | '灯具' | '收纳';
  tone: '木质' | '金属' | '布艺';
}

const PRODUCTS: Product[] = [
  { name: '橡木边桌', cat: '家具', tone: '木质' },
  { name: '铝制落地灯', cat: '灯具', tone: '金属' },
  { name: '棉麻三人沙发', cat: '家具', tone: '布艺' },
  { name: '藤编收纳筐', cat: '收纳', tone: '布艺' },
  { name: '黄铜台灯', cat: '灯具', tone: '金属' },
  { name: '白蜡木书架', cat: '家具', tone: '木质' },
  { name: '折叠收纳盒', cat: '收纳', tone: '金属' },
  { name: '羊毛懒人椅', cat: '家具', tone: '布艺' },
];

const GROUPS: { key: 'cat' | 'tone'; label: string; options: string[] }[] = [
  { key: 'cat', label: '品类', options: ['家具', '灯具', '收纳'] },
  { key: 'tone', label: '材质', options: ['木质', '金属', '布艺'] },
];

function facetCount(key: 'cat' | 'tone', option: string) {
  return PRODUCTS.filter((p) => p[key] === option).length;
}

function useFilter() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggle = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const clear = () => setSelected(new Set());
  const filtered = useMemo(
    () =>
      PRODUCTS.filter((p) => {
        const cat = [...selected].find((s) => s.startsWith('cat:'))?.slice(4);
        const tone = [...selected].find((s) => s.startsWith('tone:'))?.slice(5);
        return (!cat || p.cat === cat) && (!tone || p.tone === tone);
      }),
    [selected],
  );
  return { selected, toggle, clear, filtered };
}

function Panel({
  selected,
  count,
  toggle,
  clear,
  compact = false,
}: {
  selected: Set<string>;
  count: number;
  toggle: (id: string) => void;
  clear: () => void;
  compact?: boolean;
}) {
  return (
    <div className={`flex flex-col ${compact ? '' : 'border-r border-line'}`}>
      <div className="flex items-center justify-between px-3 py-2">
        <span data-anatomy="3" className="text-[11px] font-medium tabular-nums">{count} 个结果</span>
        <button
          data-anatomy="4"
          onClick={clear}
          className="text-[10px] text-ink-3 underline-offset-2 transition-colors hover:text-accent hover:underline"
        >
          清除全部
        </button>
      </div>
      {GROUPS.map((g) => (
        <div key={g.key} data-anatomy="1" className="border-t border-line px-3 py-2">
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-3">{g.label}</p>
          {g.options.map((opt) => {
            const id = `${g.key}:${opt}`;
            const checked = selected.has(id);
            return (
              <label
                key={opt}
                className="flex cursor-pointer items-center justify-between rounded-md px-1 py-1 text-xs text-ink-2 transition-colors hover:bg-code-bg"
              >
                <span className="flex items-center gap-2">
                  <input
                    data-anatomy="2"
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(id)}
                    className="h-3 w-3 accent-[var(--color-accent)]"
                  />
                  <span className={checked ? 'text-accent' : ''}>{opt}</span>
                </span>
                <span className="text-[10px] tabular-nums text-ink-3">{facetCount(g.key, opt)}</span>
              </label>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function ProductCard({ p }: { p: Product }) {
  return (
    <div className="rounded-lg border border-line bg-raised px-2.5 py-2 text-xs">
      {p.name}
      <span className="ml-1.5 text-[10px] text-ink-3">{p.cat} · {p.tone}</span>
    </div>
  );
}

function SidebarLayout() {
  const { selected, toggle, clear, filtered } = useFilter();
  const chips = [...selected].map((s) => s.replace(/^(cat|tone):/, ''));
  return (
    <div className="flex h-full w-full max-w-md overflow-hidden rounded-xl border border-line bg-paper">
      <div className="w-36 shrink-0 bg-raised">
        <Panel selected={selected} count={filtered.length} toggle={toggle} clear={clear} />
      </div>
      <div className="flex flex-1 flex-col p-3">
        <div className="mb-2 flex min-h-5 flex-wrap items-center gap-1.5">
          {chips.map((c) => (
            <span key={c} className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] text-accent">
              {c} ✕
            </span>
          ))}
        </div>
        <div className="grid flex-1 grid-cols-2 content-start gap-2">
          {filtered.map((p) => (
            <ProductCard key={p.name} p={p} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-2 py-6 text-center text-[11px] text-ink-3">
              没有匹配的商品
              <button onClick={clear} className="ml-1.5 text-accent underline underline-offset-2">
                清除筛选
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DrawerLayout() {
  const { selected, toggle, clear, filtered } = useFilter();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative h-full w-full max-w-md overflow-hidden rounded-xl border border-line bg-paper">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-3 py-2">
          <button
            onClick={() => setOpen((o) => !o)}
            className={`rounded-lg border px-2.5 py-1 text-xs transition-colors ${
              selected.size > 0
                ? 'border-accent bg-accent-soft text-accent'
                : 'border-line text-ink-2 hover:border-accent hover:text-accent'
            }`}
          >
            ⚙ 筛选{selected.size > 0 ? ` · ${selected.size}` : ''}
          </button>
          <span className="text-[11px] tabular-nums text-ink-3">{filtered.length} 个结果</span>
        </div>
        <div className="grid flex-1 grid-cols-2 content-start gap-2 p-3">
          {filtered.slice(0, 4).map((p) => (
            <ProductCard key={p.name} p={p} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-2 py-6 text-center text-[11px] text-ink-3">
              没有匹配的商品
              <button onClick={clear} className="ml-1.5 text-accent underline underline-offset-2">
                清除筛选
              </button>
            </div>
          )}
        </div>
      </div>
      {open && (
        <div className="absolute inset-0 z-10 flex flex-col justify-end bg-black/40" onClick={() => setOpen(false)}>
          <div
            className="rounded-t-2xl bg-raised pb-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'demo-filter-up calc(220ms * var(--demo-speed, 1)) both' }}
          >
            <div className="mx-auto mb-1 mt-2 h-1 w-10 rounded-full bg-ink-3/40" />
            <Panel selected={selected} count={filtered.length} toggle={toggle} clear={clear} compact />
          </div>
        </div>
      )}
    </div>
  );
}

const FilterPanelDemo: DemoComponent = ({ mode }) => {
  const keyframes = <style>{`@keyframes demo-filter-up { from { opacity: 0; transform: translateY(40%) } to { opacity: 1; transform: none } }`}</style>;
  if (mode === 'variants') {
    return (
      <div className="mx-auto h-72 w-full max-w-md">
        {keyframes}
        <p className="mb-1 text-[10px] uppercase tracking-wider text-ink-3">移动端抽屉 Drawer</p>
        <DrawerLayout />
      </div>
    );
  }
  return (
    <div className="flex h-72 items-center justify-center">
      {keyframes}
      <SidebarLayout />
    </div>
  );
};

export default FilterPanelDemo;
