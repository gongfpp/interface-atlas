import { useState } from 'react';
import type { StyleVariantSet } from './types';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** 周一为一周起点；返回首日偏移与当月天数。 */
function monthInfo(year: number, month: number) {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  return { offset, days };
}

function cellsFor(year: number, month: number) {
  const { offset, days } = monthInfo(year, month);
  return [
    ...Array.from({ length: offset }, () => null as number | null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
}

/** 共享的月份/选中日状态；翻月时把选中日夹到当月范围内。 */
function useCalendar(initialMonth: number, initialDay: number) {
  const [ym, setYm] = useState({ y: 2026, m: initialMonth });
  const [day, setDay] = useState(initialDay);
  const { days } = monthInfo(ym.y, ym.m);
  const shift = (delta: number) => {
    setYm((cur) => {
      const next = new Date(cur.y, cur.m + delta, 1);
      const nd = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
      setDay((d) => Math.min(d, nd));
      return { y: next.getFullYear(), m: next.getMonth() };
    });
  };
  return { ym, day, days, setDay, shift };
}

function Minimal() {
  const { ym, day, days, setDay, shift } = useCalendar(8, 14);
  return (
    <div className="mx-auto w-full max-w-sm border border-black/10 bg-white p-5 text-black">
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-sm font-medium">{MONTHS[ym.m]} {ym.y}</p>
        <div className="flex gap-3 font-mono text-xs text-black/60">
          <button type="button" aria-label="Previous month" onClick={() => shift(-1)}>‹</button>
          <button type="button" aria-label="Next month" onClick={() => shift(1)}>›</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center font-mono text-[11px]">
        {DAYS.map((d, i) => <span key={i} className="py-1 text-black/35">{d}</span>)}
        {cellsFor(ym.y, ym.m).map((d, i) =>
          d === null ? <span key={`b${i}`} /> : (
            <button
              key={d}
              type="button"
              aria-pressed={d === day}
              aria-label={`${MONTHS[ym.m]} ${d}, ${ym.y}`}
              onClick={() => setDay(d)}
              className={`mx-auto flex h-7 w-7 items-center justify-center ${d === day ? 'bg-black text-white' : 'hover:bg-black/5'}`}
            >
              {d}
            </button>
          )
        )}
      </div>
      <p className="mt-3 text-[11px] text-black/45">{days} days · selected {day}</p>
    </div>
  );
}

function Bauhaus() {
  const { ym, day, setDay, shift } = useCalendar(8, 11);
  return (
    <div className="mx-auto w-full max-w-sm bg-[#f4f1e8] p-5 text-black" style={{ border: '3px solid #111' }}>
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e03a26] text-sm font-black text-white">{MONTHS[ym.m].slice(0, 1)}</span>
        <p className="text-sm font-black uppercase tracking-widest">{MONTHS[ym.m]} {ym.y}</p>
        <div className="ml-auto flex gap-2 font-black">
          <button type="button" aria-label="Previous month" onClick={() => shift(-1)}>‹</button>
          <button type="button" aria-label="Next month" onClick={() => shift(1)}>›</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] font-bold">
        {DAYS.map((d, i) => <span key={i} className="py-1 text-black/50">{d}</span>)}
        {cellsFor(ym.y, ym.m).map((d, i) =>
          d === null ? <span key={`b${i}`} /> : (
            <button
              key={d}
              type="button"
              aria-pressed={d === day}
              aria-label={`${MONTHS[ym.m]} ${d}, ${ym.y}`}
              onClick={() => setDay(d)}
              className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full ${d === day ? 'bg-[#1f5fbf] text-white' : d % 7 === 0 ? 'bg-[#f2c200]' : ''}`}
            >
              {d}
            </button>
          )
        )}
      </div>
    </div>
  );
}

function Cyberpunk() {
  const { ym, day, setDay, shift } = useCalendar(8, 9);
  return (
    <div className="mx-auto w-full max-w-sm bg-[#05060d] p-5 font-mono text-[#7df9ff]" style={{ border: '1px solid #00ffff', boxShadow: '0 0 24px rgba(0,255,255,.25)' }}>
      <div className="mb-3 flex items-baseline justify-between text-[11px] uppercase tracking-[0.25em]">
        <span>▚ {ym.y}.{String(ym.m + 1).padStart(2, '0')}</span>
        <span className="flex gap-3 text-[#ff2bd6]">
          <button type="button" aria-label="Previous month" onClick={() => shift(-1)}>‹</button>
          <button type="button" aria-label="Next month" onClick={() => shift(1)}>›</button>
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
        {DAYS.map((d, i) => <span key={i} className="text-[#3d7f8c]">{d}</span>)}
        {cellsFor(ym.y, ym.m).map((d, i) =>
          d === null ? <span key={`b${i}`} /> : (
            <button
              key={d}
              type="button"
              aria-pressed={d === day}
              aria-label={`${MONTHS[ym.m]} ${d}, ${ym.y}`}
              onClick={() => setDay(d)}
              className={`border py-1 ${d === day ? 'border-[#ff2bd6] bg-[#ff2bd6]/20 text-[#ff2bd6] shadow-[0_0_12px_#ff2bd6]' : 'border-[#122233] text-[#7df9ff]/70 hover:border-[#00ffff]'}`}
            >
              {String(d).padStart(2, '0')}
            </button>
          )
        )}
      </div>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'minimalism',
    name: { zh: '极简主义', en: 'Minimalism' },
    note: {
      zh: '发丝线分隔的日历网格，选中态只用一块黑色方块，没有任何圆角和阴影；翻月是真实状态。',
      en: 'A hairline-divided calendar grid where the selection is just a black square — no radius, no shadow, with real month paging.',
    },
    Demo: Minimal,
  },
  {
    style: 'bauhaus',
    name: { zh: '包豪斯', en: 'Bauhaus' },
    note: {
      zh: '红黄蓝三原色圆形日期，粗黑外框与几何标题，把日历变成构成练习。',
      en: 'Primary red/blue/yellow circles inside a heavy black frame turn the calendar into a geometric composition.',
    },
    Demo: Bauhaus,
  },
  {
    style: 'cyberpunk',
    name: { zh: '赛博朋克', en: 'Cyberpunk' },
    note: {
      zh: '近黑底、青色霓虹边框和等宽数字，选中日发出洋红色辉光。',
      en: 'Near-black with cyan neon borders and monospaced digits; the selected day emits a magenta glow.',
    },
    Demo: Cyberpunk,
  },
];

export default styleVariants;
