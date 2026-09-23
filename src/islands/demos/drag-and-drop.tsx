import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Zone = 'inbox' | 'docs' | 'trash';

const INITIAL: Record<Zone, string[]> = {
  inbox: ['季度报告.pdf', '设计稿-v2.fig', '合同扫描件'],
  docs: ['会议纪要.md'],
  trash: [],
};

const ZONE_META: Array<[Zone, string, string]> = [
  ['inbox', '收件箱', 'Inbox'],
  ['docs', '文档库', 'Docs'],
  ['trash', '回收站', 'Trash'],
];

function DragPlayground({ en }: { en: boolean }) {
  const [zones, setZones] = useState(INITIAL);
  const [dragItem, setDragItem] = useState<{ name: string; from: Zone } | null>(null);
  const [over, setOver] = useState<Zone | null>(null);

  const drop = (to: Zone) => {
    if (!dragItem || dragItem.from === to) {
      setDragItem(null);
      setOver(null);
      return;
    }
    setZones((z) => ({
      ...z,
      [dragItem.from]: z[dragItem.from].filter((n) => n !== dragItem.name),
      [to]: [dragItem.name, ...z[to]],
    }));
    setDragItem(null);
    setOver(null);
  };

  return (
    <div className="mx-auto w-full max-w-lg">
      <p className="mb-2 text-xs text-ink-3">
        {en ? 'Drag a card into another bin — ghost stays, target highlights.' : '把卡片拖进其它箱 — 原位留占位，目标箱高亮。'}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {ZONE_META.map(([zone, zh, english]) => (
          <div
            key={zone}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(zone);
            }}
            onDragLeave={() => setOver((o) => (o === zone ? null : o))}
            onDrop={(e) => {
              e.preventDefault();
              drop(zone);
            }}
            data-anatomy={zone === 'inbox' ? '4' : undefined}
            className={`flex min-h-44 flex-col rounded-xl border bg-paper p-2 transition-colors ${
              over === zone ? 'border-accent bg-accent-soft/40' : 'border-line'
            }`}
          >
            <p className="mb-1.5 text-[10px] font-semibold text-ink-2">
              {en ? english : zh}
              <span className="ml-1 text-ink-3">{zones[zone].length}</span>
            </p>
            <div className="flex flex-1 flex-col gap-1.5">
              {zones[zone].map((name) => {
                const isGhost = dragItem?.name === name && dragItem.from === zone;
                return (
                  <div
                    key={name}
                    draggable
                    onDragStart={() => setDragItem({ name, from: zone })}
                    onDragEnd={() => {
                      setDragItem(null);
                      setOver(null);
                    }}
                    data-anatomy={zone === 'inbox' && name === zones.inbox[0] ? '1' : undefined}
                    className={`cursor-grab rounded-lg border border-line bg-raised px-2 py-1.5 text-[11px] text-ink active:cursor-grabbing ${
                      isGhost ? 'opacity-30' : ''
                    }`}
                  >
                    <span data-anatomy={isGhost ? '2' : undefined}>{name}</span>
                  </div>
                );
              })}
              {over === zone && dragItem && (
                <div data-anatomy="3" className="rounded-lg border border-dashed border-accent px-2 py-1.5 text-[10px] text-accent">
                  {en ? 'Drop here' : '放在这里'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VariantSheet({ en }: { en: boolean }) {
  const items: Array<[string, string, string]> = [
    ['drag-to-move', '拖动移动', 'Drag to move'],
    ['drag-to-reorder', '拖动排序', 'Drag to reorder'],
    ['drag-between-lists', '跨列表拖放', 'Drag between lists'],
  ];
  return (
    <div className="mx-auto grid max-w-xl grid-cols-1 gap-3 text-sm sm:grid-cols-3">
      {items.map(([id, zh, english], i) => (
        <div key={id} className="rounded-xl border border-line bg-paper p-3">
          <p className="text-xs font-semibold text-ink">{en ? english : zh}</p>
          <p className="mt-1 text-[10px] text-ink-3">{id}</p>
          <div className="mt-2 flex h-12 items-center gap-1 rounded-lg bg-code-bg px-2">
            <span className="h-5 w-5 rounded bg-accent/70" style={{ transform: `translateX(${i * 6}px)` }} />
            <span className="h-4 flex-1 rounded border border-dashed border-line" />
          </div>
        </div>
      ))}
    </div>
  );
}

const DragAndDropDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <VariantSheet en={en} />;
  return <DragPlayground en={en} />;
};

export default DragAndDropDemo;
