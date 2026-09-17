import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const NOW = new Date();

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function fmt(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function DayCell({
  day,
  month,
  state,
  onClick,
}: {
  day: number;
  month: number;
  state: 'idle' | 'today' | 'selected' | 'inrange';
  onClick: () => void;
}) {
  const base =
    'flex h-7 w-7 items-center justify-center rounded-full text-[11px] transition-colors';
  const cls =
    state === 'selected'
      ? `${base} bg-accent text-white`
      : state === 'today'
        ? `${base} border border-accent text-accent`
        : state === 'inrange'
          ? `${base} bg-accent-soft text-accent`
          : `${base} text-ink-2 hover:bg-code-bg`;
  return (
    <button onClick={onClick} aria-label={`${month + 1} 月 ${day} 日`} className={cls}>
      {day}
    </button>
  );
}

function CalendarGrid({
  view,
  selected,
  onPick,
  inRange,
  isEdge,
  anatomy,
}: {
  view: { y: number; m: number };
  selected?: Date;
  onPick?: (d: Date) => void;
  inRange?: (d: Date) => boolean;
  isEdge?: (d: Date) => boolean;
  anatomy?: string;
}) {
  const first = new Date(view.y, view.m, 1).getDay();
  const days = new Date(view.y, view.m + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: first }, () => null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
  return (
    <div data-anatomy={anatomy}>
      <div className="mb-1 grid grid-cols-7 text-center text-[10px] text-ink-3">
        {WEEKDAYS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 justify-items-center gap-y-0.5">
        {cells.map((d, i) => {
          if (d === null) return <span key={`x${i}`} />;
          const date = new Date(view.y, view.m, d);
          const isToday = sameDay(date, NOW);
          const isSelected = selected ? sameDay(date, selected) : isEdge?.(date) ?? false;
          const state = isSelected ? 'selected' : isToday ? 'today' : inRange?.(date) ? 'inrange' : 'idle';
          return (
            <DayCell
              key={d}
              day={d}
              month={view.m}
              state={state}
              onClick={() => onPick?.(date)}
            />
          );
        })}
      </div>
    </div>
  );
}

function MonthHeader({
  view,
  setView,
  anatomy,
}: {
  view: { y: number; m: number };
  setView: (v: { y: number; m: number }) => void;
  anatomy?: string;
}) {
  const move = (delta: number) => {
    const next = new Date(view.y, view.m + delta, 1);
    setView({ y: next.getFullYear(), m: next.getMonth() });
  };
  return (
    <div data-anatomy={anatomy} className="mb-1 flex items-center justify-between">
      <button onClick={() => move(-1)} aria-label="上个月" className="rounded px-1.5 py-0.5 text-xs text-ink-3 hover:bg-code-bg hover:text-ink">
        ‹
      </button>
      <span className="text-xs font-medium text-ink">
        {view.y} 年 {view.m + 1} 月
      </span>
      <button onClick={() => move(1)} aria-label="下个月" className="rounded px-1.5 py-0.5 text-xs text-ink-3 hover:bg-code-bg hover:text-ink">
        ›
      </button>
    </div>
  );
}

function TriggerPicker() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Date | null>(new Date(2026, 8, 17));
  const [view, setView] = useState({ y: 2026, m: 8 });

  return (
    <div className="relative w-60 text-sm">
      <button
        data-anatomy="1"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex h-9 w-full items-center justify-between rounded-lg border border-line bg-raised px-3 text-xs hover:border-accent"
      >
        <span className={selected ? 'text-ink' : 'text-ink-3'}>{selected ? fmt(selected) : '请选择日期'}</span>
        <span aria-hidden="true" className="text-ink-3">📅</span>
      </button>
      {open && (
        <div data-anatomy="3" className="absolute z-10 mt-1 w-full rounded-xl border border-line bg-raised p-2 shadow-lg">
          <MonthHeader view={view} setView={setView} anatomy="2" />
          <CalendarGrid
            view={view}
            selected={selected ?? undefined}
            onPick={(d) => {
              setSelected(d);
              setOpen(false);
            }}
            anatomy="4"
          />
        </div>
      )}
      <p className="mt-2 text-[11px] text-ink-3">{open ? '点击日期选择' : selected ? `已选：${fmt(selected)}` : '点击选择日期'}</p>
    </div>
  );
}

function RangePicker() {
  const [view, setView] = useState({ y: 2026, m: 8 });
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);

  const pick = (d: Date) => {
    if (!start || (start && end)) {
      setStart(d);
      setEnd(null);
    } else if (d < start) {
      setStart(d);
    } else {
      setEnd(d);
    }
  };

  return (
    <div className="w-60 text-sm">
      <MonthHeader view={view} setView={setView} />
      <CalendarGrid
        view={view}
        onPick={pick}
        isEdge={(d) => !!(start && sameDay(d, start)) || !!(end && sameDay(d, end))}
        inRange={(d) => !!(start && end && d > start && d < end)}
      />
      <p className="mt-2 border-t border-line pt-2 text-[11px] text-ink-3">
        {start && end ? `区间：${fmt(start)} → ${fmt(end)}` : start ? `起点 ${fmt(start)}，再点终点` : '点击第一个日期'}
      </p>
    </div>
  );
}

const DatePickerDemo: DemoComponent = ({ mode }) => {
  if (mode === 'variants') {
    return (
      <div className="mx-auto flex max-w-xl flex-wrap justify-center gap-6 text-sm">
        <div>
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-3">内嵌日历 Inline</p>
          <div className="rounded-xl border border-line bg-paper p-3">
            <InlineCalendar />
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-3">范围选择 Range</p>
          <div className="rounded-xl border border-line bg-paper p-3">
            <RangePicker />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-center py-2">
      <TriggerPicker />
    </div>
  );
};

function InlineCalendar() {
  const [view, setView] = useState({ y: 2026, m: 8 });
  const [selected, setSelected] = useState<Date | null>(new Date(2026, 8, 17));
  return (
    <div className="w-60">
      <MonthHeader view={view} setView={setView} />
      <CalendarGrid view={view} selected={selected ?? undefined} onPick={(d) => setSelected(d)} />
    </div>
  );
}

export default DatePickerDemo;
