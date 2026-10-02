import { usePreviewVariant } from '@/islands/shared/previewVariant';
import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/* 日历页结构缩略示意图：工具栏 + 日期网格 + 事件块 + 今日标记 + 侧栏议程 */

const VIEWS = [
  { id: 'month', zh: '月', en: 'Month' },
  { id: 'week', zh: '周', en: 'Week' },
  { id: 'agenda', zh: '议程', en: 'Agenda' },
] as const;

type ViewId = (typeof VIEWS)[number]['id'];

export const previewVariants = { ids: VIEWS.map((v) => v.id), default: 'month' };

const DAY_ZH = ['一', '二', '三', '四', '五', '六', '日'];
const DAY_EN = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const OFFSET = 2;
const DAYS = 30;
const TODAY = 16;

type Tone = 'accent' | 'soft' | 'mut';
type Ev = { id: number; day: number; zh: string; en: string; tone: Tone };

const EVENTS: Ev[] = [
  { id: 1, day: 3, zh: '设计评审', en: 'Design review', tone: 'accent' },
  { id: 2, day: 8, zh: '版本发布', en: 'Release', tone: 'soft' },
  { id: 3, day: 12, zh: '用户访谈', en: 'User interview', tone: 'mut' },
  { id: 4, day: 16, zh: '站会', en: 'Standup', tone: 'accent' },
  { id: 5, day: 16, zh: '方案同步', en: 'Plan sync', tone: 'soft' },
  { id: 6, day: 22, zh: '季度复盘', en: 'Quarterly retro', tone: 'accent' },
  { id: 7, day: 27, zh: '团队午餐', en: 'Team lunch', tone: 'mut' },
];

const TONE: Record<Tone, string> = {
  accent: 'bg-accent text-white',
  soft: 'bg-accent-soft text-accent',
  mut: 'bg-ink-3/15 text-ink-2',
};

const cells = Array.from({ length: 35 }, (_, i) => i - OFFSET + 1).map((d) => (d >= 1 && d <= DAYS ? d : null));

function EventChip({ ev, en, onPick }: { ev: Ev; en: boolean; onPick: () => void }) {
  return (
    <button
      data-anatomy="3"
      onClick={(e) => {
        e.stopPropagation();
        onPick();
      }}
      className={`block w-full truncate rounded px-1 py-0.5 text-left text-[8px] ${TONE[ev.tone]}`}
    >
      {en ? ev.en : ev.zh}
    </button>
  );
}

function MonthGrid({
  events,
  selected,
  en,
  onSelect,
  onPick,
}: {
  events: Ev[];
  selected: number;
  en: boolean;
  onSelect: (d: number) => void;
  onPick: (id: number) => void;
}) {
  const labels = en ? DAY_EN : DAY_ZH;
  return (
    <div className="flex-1">
      <div className="grid grid-cols-7 border-b border-line bg-raised text-center text-[9px] text-ink-3">
        {labels.map((l, i) => (
          <span key={`${l}-${i}`} className="py-1">
            {l}
          </span>
        ))}
      </div>
      <div data-anatomy="2" role="grid" className="grid grid-cols-7">
        {cells.map((d, i) => (
          <div
            key={i}
            role="gridcell"
            onClick={() => d && onSelect(d)}
            className={`flex min-h-[38px] flex-col gap-0.5 border-b border-r border-line p-1 text-left ${
              d === selected ? 'bg-accent-soft' : d ? 'cursor-pointer hover:bg-accent-soft' : 'bg-paper'
            }`}
          >
            {d && (
              <span
                data-anatomy={d === TODAY ? '4' : undefined}
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] ${
                  d === TODAY ? 'bg-accent font-semibold text-white' : 'text-ink-2'
                }`}
              >
                {d}
              </span>
            )}
            {d &&
              events
                .filter((ev) => ev.day === d)
                .slice(0, 2)
                .map((ev) => <EventChip key={ev.id} ev={ev} en={en} onPick={() => onPick(ev.id)} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

function WeekGrid({ events, selected, en, onPick }: { events: Ev[]; selected: number; en: boolean; onPick: (id: number) => void }) {
  const start = Math.max(1, selected - ((selected - 1) % 7));
  const days = Array.from({ length: 7 }, (_, i) => start + i);
  return (
    <div data-anatomy="2" className="grid flex-1 grid-cols-7 gap-1 p-2">
      {days.map((d) => (
        <div key={d} className={`rounded border border-line p-1 ${d === selected ? 'bg-accent-soft' : 'bg-paper'}`}>
          <span className={`block text-center text-[9px] ${d === TODAY ? 'font-semibold text-accent' : 'text-ink-3'}`}>{d}</span>
          <div className="mt-1 space-y-1">
            {events
              .filter((ev) => ev.day === d)
              .map((ev) => (
                <EventChip key={ev.id} ev={ev} en={en} onPick={() => onPick(ev.id)} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Agenda({ events, en, onPick }: { events: Ev[]; en: boolean; onPick: (id: number) => void }) {
  const days = Array.from(new Set(events.map((e) => e.day))).sort((a, b) => a - b);
  return (
    <div data-anatomy="2" className="max-h-56 flex-1 overflow-y-auto p-2">
      {days.map((d) => (
        <div key={d} className="mb-2">
          <p className={`mb-1 text-[9px] ${d === TODAY ? 'text-accent' : 'text-ink-3'}`}>
            {en ? 'Day' : '日'} {d}
          </p>
          <div className="space-y-1">
            {events
              .filter((ev) => ev.day === d)
              .map((ev) => (
                <EventChip key={ev.id} ev={ev} en={en} onPick={() => onPick(ev.id)} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const CalendarDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  const [view, setView] = usePreviewVariant<ViewId>('month');
  const [selected, setSelected] = useState(TODAY);
  const [events, setEvents] = useState<Ev[]>(EVENTS);
  const [open, setOpen] = useState<number | null>(null);

  const selectedEvents = events.filter((e) => e.day === selected);

  const addEvent = () => {
    setEvents((es) => [
      ...es,
      { id: Date.now(), day: selected, zh: '新事件', en: 'New event', tone: 'accent' as Tone },
    ]);
  };

  if (mode === 'variants') {
    return (
      <div className="grid grid-cols-3 gap-3">
        {VIEWS.map((v) => (
          <div key={v.id} className="overflow-hidden rounded-lg border border-line bg-paper p-2">
            <div className="mb-1 flex items-center gap-1">
              <span className="rounded bg-accent-soft px-1 text-[8px] text-accent">{en ? 'Today' : '今天'}</span>
              <span className="text-[9px] text-ink-3">‹ ›</span>
              <span className="ml-auto h-1.5 w-6 rounded-full bg-ink-3/25" />
            </div>
            {v.id === 'month' && (
              <div className="grid grid-cols-7 gap-px rounded border border-line p-1">
                {Array.from({ length: 21 }).map((_, i) => (
                  <span key={i} className={`h-3 rounded-sm ${i === 9 ? 'bg-accent' : 'bg-ink-3/10'}`} />
                ))}
              </div>
            )}
            {v.id === 'week' && (
              <div className="grid h-[70px] grid-cols-7 gap-px rounded border border-line p-px">
                {Array.from({ length: 7 }).map((_, i) => (
                  <span key={i} className="rounded-sm bg-ink-3/10" />
                ))}
              </div>
            )}
            {v.id === 'agenda' && (
              <div className="space-y-1 rounded border border-line p-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="block h-3 rounded-sm bg-ink-3/10" />
                ))}
              </div>
            )}
            <span className="mt-1 block text-center text-[9px] text-ink-3">
              {v.zh} / {v.en}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto w-[520px] max-w-full">
      <div data-anatomy="1" className="mb-1.5 flex items-center gap-2">
        <button
          onClick={() => setSelected(TODAY)}
          className="rounded border border-line px-2 py-0.5 text-[11px] text-ink-2 hover:border-accent hover:text-accent"
        >
          {en ? 'Today' : '今天'}
        </button>
        <button
          onClick={() => setSelected((s) => Math.max(1, s - 7))}
          className="rounded border border-line px-1.5 py-0.5 text-[11px] text-ink-2 hover:border-accent"
        >
          ‹
        </button>
        <button
          onClick={() => setSelected((s) => Math.min(DAYS, s + 7))}
          className="rounded border border-line px-1.5 py-0.5 text-[11px] text-ink-2 hover:border-accent"
        >
          ›
        </button>
        <span className="text-xs font-semibold">{en ? 'May 2026' : '2026 年 5 月'}</span>
        <div className="ml-auto flex gap-0.5 rounded-full border border-line p-0.5">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              aria-pressed={view === v.id}
              onClick={() => setView(v.id)}
              className={`rounded-full px-2 py-0.5 text-[10px] ${
                view === v.id ? 'bg-accent text-white' : 'text-ink-2 hover:text-accent'
              }`}
            >
              {en ? v.en : v.zh}
            </button>
          ))}
        </div>
        <button
          onClick={addEvent}
          className="rounded bg-accent px-2 py-0.5 text-[10px] text-white hover:opacity-90"
        >
          ＋ {en ? 'New' : '新建'}
        </button>
      </div>

      <div className="flex overflow-hidden rounded-lg border border-line bg-paper text-left">
        {view === 'month' ? (
          <MonthGrid events={events} selected={selected} en={en} onSelect={setSelected} onPick={setOpen} />
        ) : view === 'week' ? (
          <WeekGrid events={events} selected={selected} en={en} onPick={setOpen} />
        ) : (
          <Agenda events={events} en={en} onPick={setOpen} />
        )}

        <aside data-anatomy="5" className="w-28 shrink-0 border-l border-line bg-raised p-2">
          <p className="text-[10px] font-semibold text-ink">
            {en ? 'Day' : '日'} {selected}
          </p>
          <div className="mt-1 space-y-1">
            {selectedEvents.length === 0 ? (
              <p className="text-[9px] text-ink-3">{en ? 'No events' : '暂无日程'}</p>
            ) : (
              selectedEvents.map((ev) => (
                <button
                  key={ev.id}
                  onClick={() => setOpen(ev.id)}
                  className={`block w-full rounded px-1.5 py-0.5 text-left text-[9px] ${
                    open === ev.id ? TONE.accent : TONE[ev.tone]
                  }`}
                >
                  {en ? ev.en : ev.zh}
                </button>
              ))
            )}
          </div>
        </aside>
      </div>
      <p className="mt-2 text-center text-[11px] text-ink-3">
        {en ? 'Pick a date or switch views and add an event' : '选择日期、切换视图或新建事件试试'}
      </p>
    </div>
  );
};

export default CalendarDemo;
