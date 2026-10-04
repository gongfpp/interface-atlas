import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

const DAYS_EN = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const DAYS_ZH = ['一', '二', '三', '四', '五', '六', '日'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_ZH = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

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
function useCalendar(session: VariantDemoProps['session'], initialMonth: number, initialDay: number) {
  const [ym, setYm] = useSessionState(session, 'yearMonth', { y: 2026, m: initialMonth });
  const [day, setDay] = useSessionState(session, 'day', initialDay);
  const { days } = monthInfo(ym.y, ym.m);
  const shift = (delta: number) => {
    const next = new Date(ym.y, ym.m + delta, 1);
    const nextDays = monthInfo(next.getFullYear(), next.getMonth()).days;
    setDay((current) => Math.min(current, nextDays));
    setYm({ y: next.getFullYear(), m: next.getMonth() });
  };
  return { ym, day, days, setDay, shift };
}

function Minimal({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const DAYS = en ? DAYS_EN : DAYS_ZH;
  const MONTHS = en ? MONTHS_EN : MONTHS_ZH;
  const { ym, day, days, setDay, shift } = useCalendar(session, 8, 14);
  return (
    <div className="mx-auto w-full max-w-sm border border-black/10 bg-white p-5 text-black">
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-sm font-medium">{MONTHS[ym.m]} {ym.y}</p>
        <div className="flex gap-3 font-mono text-xs text-black/60">
          <button type="button" aria-label={en ? 'Previous month' : '上个月'} onClick={() => shift(-1)}>‹</button>
          <button type="button" aria-label={en ? 'Next month' : '下个月'} onClick={() => shift(1)}>›</button>
        </div>
      </div>
      <div className="focus-visible:outline-2 focus-visible:outline-offset-2 grid grid-cols-7 gap-y-1 text-center font-mono text-[11px]">
        {DAYS.map((d, i) => <span key={i} className="py-1 text-black/35">{d}</span>)}
        {cellsFor(ym.y, ym.m).map((d, i) =>
          d === null ? <span key={`b${i}`} /> : (
            <button
              key={d}
              type="button"
              aria-pressed={d === day}
              aria-label={en ? `${MONTHS[ym.m]} ${d}, ${ym.y}` : `${ym.y}年${MONTHS[ym.m]}${d}日`}
              onClick={() => setDay(d)}
              className={`focus-visible:outline-2 focus-visible:outline-offset-2 mx-auto flex h-7 w-7 items-center justify-center ${d === day ? 'bg-black text-white' : 'hover:bg-black/5'}`}
            >
              {d}
            </button>
          )
        )}
      </div>
      <p className="mt-3 text-[11px] text-black/45">{en ? `${days} days · ${day ? `selected ${day}` : 'No date selected'}` : `${days} 天 · ${day ? `已选 ${day}` : '尚未选择日期'}`}</p>
      <button type="button" onClick={() => setDay(0)} className="mt-3 min-h-11 border border-current px-3 text-xs focus-visible:outline-2 focus-visible:outline-offset-2">{en ? 'Clear date' : '清除日期'}</button>
      <p className="mt-2 text-xs">{en ? 'Local interaction demo. No date is booked.' : '本地交互演示，不创建预约。'}</p>
    </div>
  );
}

function Bauhaus({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const DAYS = en ? DAYS_EN : DAYS_ZH;
  const MONTHS = en ? MONTHS_EN : MONTHS_ZH;
  const { ym, day, setDay, shift } = useCalendar(session, 8, 11);
  return (
    <div className="mx-auto w-full max-w-sm bg-[#f4f1e8] p-5 text-black" style={{ border: '3px solid #111' }}>
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e03a26] text-sm font-black text-white">{MONTHS[ym.m].slice(0, 1)}</span>
        <p className="text-sm font-black uppercase tracking-widest">{MONTHS[ym.m]} {ym.y}</p>
        <div className="ml-auto flex gap-2 font-black">
          <button type="button" aria-label={en ? 'Previous month' : '上个月'} onClick={() => shift(-1)}>‹</button>
          <button type="button" aria-label={en ? 'Next month' : '下个月'} onClick={() => shift(1)}>›</button>
        </div>
      </div>
      <div className="focus-visible:outline-2 focus-visible:outline-offset-2 grid grid-cols-7 gap-1 text-center font-mono text-[10px] font-bold">
        {DAYS.map((d, i) => <span key={i} className="py-1 text-black/50">{d}</span>)}
        {cellsFor(ym.y, ym.m).map((d, i) =>
          d === null ? <span key={`b${i}`} /> : (
            <button
              key={d}
              type="button"
              aria-pressed={d === day}
              aria-label={en ? `${MONTHS[ym.m]} ${d}, ${ym.y}` : `${ym.y}年${MONTHS[ym.m]}${d}日`}
              onClick={() => setDay(d)}
              className={`focus-visible:outline-2 focus-visible:outline-offset-2 mx-auto flex h-7 w-7 items-center justify-center rounded-full ${d === day ? 'bg-[#1f5fbf] text-white' : d % 7 === 0 ? 'bg-[#f2c200]' : ''}`}
            >
              {d}
            </button>
          )
        )}
      </div>
      <button type="button" onClick={() => setDay(0)} className="mt-3 min-h-11 border border-current px-3 text-xs focus-visible:outline-2 focus-visible:outline-offset-2">{en ? 'Clear date' : '清除日期'}</button>
      <p className="mt-2 text-xs">{en ? 'Local interaction demo. No date is booked.' : '本地交互演示，不创建预约。'}</p>
    </div>
  );
}

function Cyberpunk({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const DAYS = en ? DAYS_EN : DAYS_ZH;
  const { ym, day, setDay, shift } = useCalendar(session, 8, 9);
  return (
    <div className="mx-auto w-full max-w-sm bg-[#05060d] p-5 font-mono text-[#7df9ff]" style={{ border: '1px solid #00ffff', boxShadow: '0 0 24px rgba(0,255,255,.25)' }}>
      <div className="mb-3 flex items-baseline justify-between text-[11px] uppercase tracking-[0.25em]">
        <span>▚ {ym.y}.{String(ym.m + 1).padStart(2, '0')}</span>
        <span className="flex gap-3 text-[#ff2bd6]">
          <button type="button" aria-label={en ? 'Previous month' : '上个月'} onClick={() => shift(-1)}>‹</button>
          <button type="button" aria-label={en ? 'Next month' : '下个月'} onClick={() => shift(1)}>›</button>
        </span>
      </div>
      <div className="focus-visible:outline-2 focus-visible:outline-offset-2 grid grid-cols-7 gap-1 text-center text-[10px]">
        {DAYS.map((d, i) => <span key={i} className="text-[#3d7f8c]">{d}</span>)}
        {cellsFor(ym.y, ym.m).map((d, i) =>
          d === null ? <span key={`b${i}`} /> : (
            <button
              key={d}
              type="button"
              aria-pressed={d === day}
              aria-label={en ? `${MONTHS_EN[ym.m]} ${d}, ${ym.y}` : `${ym.y}年${MONTHS_ZH[ym.m]}${d}日`}
              onClick={() => setDay(d)}
              className={`focus-visible:outline-2 focus-visible:outline-offset-2 border py-1 ${d === day ? 'border-[#ff2bd6] bg-[#ff2bd6]/20 text-[#ff2bd6] shadow-[0_0_12px_#ff2bd6]' : 'border-[#122233] text-[#7df9ff]/70 hover:border-[#00ffff]'}`}
            >
              {String(d).padStart(2, '0')}
            </button>
          )
        )}
      </div>
      <button type="button" onClick={() => setDay(0)} className="mt-3 min-h-11 border border-current px-3 text-xs focus-visible:outline-2 focus-visible:outline-offset-2">{en ? 'Clear date' : '清除日期'}</button>
      <p className="mt-2 text-xs">{en ? 'Local interaction demo. No date is booked.' : '本地交互演示，不创建预约。'}</p>
    </div>
  );
}


function Expanded({ session, locale, style }: VariantDemoProps & { style: RecipeStyleId }) {
  const zh = locale === 'zh';
  const r = recipe(style);
  const { ym, day, setDay, shift } = useCalendar(session, 8, 14);
  const months = zh ? MONTHS_ZH : MONTHS_EN;
  const days = zh ? DAYS_ZH : DAYS_EN;
  return <RecipeFrame style={style} locale={locale} title={zh ? '选择日期' : 'Choose a date'}>
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <button type="button" aria-label={zh ? '上个月' : 'Previous month'} onClick={() => shift(-1)} className={r.secondary}>‹</button>
      <p aria-live="polite" className="text-sm font-semibold">{months[ym.m]} {ym.y}</p>
      <button type="button" aria-label={zh ? '下个月' : 'Next month'} onClick={() => shift(1)} className={r.secondary}>›</button>
    </div>
    <div className="grid grid-cols-7 gap-1 text-center text-xs">
      {days.map((label, i) => <span key={i} className={`py-2 ${r.muted}`}>{label}</span>)}
      {cellsFor(ym.y, ym.m).map((date, i) => date === null ? <span key={`blank-${i}`} /> : <button key={date} type="button" aria-pressed={day === date} aria-label={zh ? `${ym.y}年${ym.m + 1}月${date}日` : `${months[ym.m]} ${date}, ${ym.y}`} onClick={() => setDay(date)} className={`focus-visible:outline-2 focus-visible:outline-offset-2 min-h-11 !min-w-0 !p-1 ${day === date ? r.active : r.item}`}>{date}</button>)}
    </div>
    <p role="status" className={`mt-4 text-sm ${r.muted}`}>{day ? (zh ? `已选：${ym.y}年${ym.m + 1}月${day}日` : `Selected: ${months[ym.m]} ${day}, ${ym.y}`) : (zh ? '尚未选择日期' : 'No date selected')}</p>
    <button type="button" onClick={() => setDay(0)} className={`focus-visible:outline-2 focus-visible:outline-offset-2 mt-3 ${r.secondary}`}>{zh ? '清除日期' : 'Clear date'}</button>
  </RecipeFrame>;
}

const styleVariants: StyleVariantSet = [
  {
    style: 'minimalism',
    name: {"zh":"极简主义","en":"Minimalism"},
    note: {
      zh: '发丝线分隔的日历网格，选中态只用一块黑色方块，没有任何圆角和阴影；翻月是真实状态。',
      en: 'A hairline-divided calendar grid where the selection is just a black square — no radius, no shadow, with real month paging.',
    },
    Demo: Minimal,
  },
  {
    style: 'bauhaus',
    name: {"zh":"包豪斯","en":"Bauhaus"},
    note: {
      zh: '红黄蓝三原色圆形日期，粗黑外框与几何标题，把日历变成构成练习。',
      en: 'Primary red/blue/yellow circles inside a heavy black frame turn the calendar into a geometric composition.',
    },
    Demo: Bauhaus,
  },
  {
    style: 'cyberpunk',
    name: {"zh":"赛博朋克","en":"Cyberpunk"},
    note: {
      zh: '近黑底、青色霓虹边框和等宽数字，选中日发出洋红色辉光。',
      en: 'Near-black with cyan neon borders and monospaced digits; the selected day emits a magenta glow.',
    },
    Demo: Cyberpunk,
  },
  recipeVariant('flat-design', (props) => <Expanded {...props} style="flat-design" />, { zh: "纯色块与清晰层级，不依赖阴影；日期格、月份导航和选中日使用同一几何体系，真实翻月与清除日期。", en: "Solid blocks and clear hierarchy without shadows; date cells, month controls and the active day share the geometry, with real paging and clear." }),
  recipeVariant('swiss-style', (props) => <Expanded {...props} style="swiss-style" />, { zh: "编号网格、直角边界与红色强调；日期格、月份导航和选中日使用同一几何体系，真实翻月与清除日期。", en: "An indexed grid, square edges and a red accent; date cells, month controls and the active day share the geometry, with real paging and clear." }),
  recipeVariant('neobrutalism', (props) => <Expanded {...props} style="neobrutalism" />, { zh: "粗黑描边、硬投影与高对比选中；日期格、月份导航和选中日使用同一几何体系，真实翻月与清除日期。", en: "Heavy black outlines, hard shadows and bold selection; date cells, month controls and the active day share the geometry, with real paging and clear." }),
  recipeVariant('neumorphism', (props) => <Expanded {...props} style="neumorphism" />, { zh: "同色曲面、双向阴影与实体边界；日期格、月份导航和选中日使用同一几何体系，真实翻月与清除日期。", en: "Shared soft surfaces, paired shadows and explicit borders; date cells, month controls and the active day share the geometry, with real paging and clear." }),
  recipeVariant('organic', (props) => <Expanded {...props} style="organic" />, { zh: "大地色与不规则圆角，柔和而清楚；日期格、月份导航和选中日使用同一几何体系，真实翻月与清除日期。", en: "Earth tones and irregular corners, soft yet clear; date cells, month controls and the active day share the geometry, with real paging and clear." }),
];

export default styleVariants;
