import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/* 页面结构缩略示意图（wireframe）：按部门分组的团队成员页 */

const VARIANTS = [
  { id: 'grid', zh: '照片网格', en: 'Grid' },
  { id: 'roster', zh: '名册式', en: 'Roster' },
  { id: 'feature', zh: '焦点式', en: 'Featured' },
] as const;

type VariantId = (typeof VARIANTS)[number]['id'];
type DeptId = 'all' | 'eng' | 'design' | 'ops';

const T: React.CSSProperties = { transitionDuration: 'calc(200ms * var(--demo-speed, 1))' };

const DEPTS: { id: DeptId; zh: string; en: string }[] = [
  { id: 'all', zh: '全部', en: 'All' },
  { id: 'eng', zh: '工程', en: 'Engineering' },
  { id: 'design', zh: '设计', en: 'Design' },
  { id: 'ops', zh: '运营', en: 'Operations' },
];

const MEMBERS = [
  {
    id: 'lin',
    zh: '林舟',
    en: 'Zhou Lin',
    dept: 'eng' as const,
    role: { zh: '联合创始人 · CTO', en: 'Co-founder · CTO' },
    bio: { zh: '写了第一版内核，长期关注可访问性与性能预算。', en: 'Wrote the first kernel; long focused on accessibility and performance budgets.' },
  },
  {
    id: 'su',
    zh: '苏禾',
    en: 'He Su',
    dept: 'design' as const,
    role: { zh: '设计负责人', en: 'Head of Design' },
    bio: { zh: '把模糊需求翻译成可验证的界面，偏爱克制的排版。', en: 'Turns fuzzy briefs into testable interfaces; prefers restrained typography.' },
  },
  {
    id: 'chen',
    zh: '陈望',
    en: 'Wang Chen',
    dept: 'eng' as const,
    role: { zh: '资深工程师', en: 'Staff Engineer' },
    bio: { zh: '负责渲染管线与构建工具，热衷删除无用代码。', en: 'Owns the rendering pipeline and build tooling; loves deleting dead code.' },
  },
  {
    id: 'ning',
    zh: '周宁',
    en: 'Ning Zhou',
    dept: 'ops' as const,
    role: { zh: '运营负责人', en: 'Head of Operations' },
    bio: { zh: '让发布节奏可预测，维护团队与用户的反馈闭环。', en: 'Keeps releases predictable and closes the loop with users.' },
  },
  {
    id: 'he',
    zh: '何一',
    en: 'Yi He',
    dept: 'design' as const,
    role: { zh: '产品设计师', en: 'Product Designer' },
    bio: { zh: '专注表单与数据可视化，习惯先做原型再谈方案。', en: 'Focuses on forms and data viz; prototypes before debating.' },
  },
  {
    id: 'zheng',
    zh: '郑澜',
    en: 'Lan Zheng',
    dept: 'eng' as const,
    role: { zh: '前端工程师', en: 'Frontend Engineer' },
    bio: { zh: '维护组件库与主题系统，相信好边界胜过好工具。', en: 'Maintains the component library and theming; good boundaries beat good tools.' },
  },
] as const;

type Member = (typeof MEMBERS)[number];

const initials = (m: Member, en: boolean) => {
  if (en) return m.en.split(' ').map((w) => w[0]).join('').slice(0, 2);
  return m.zh.slice(0, 1);
};

const Avatar = ({ m, en, size = 'md' }: { m: Member; en: boolean; size?: 'md' | 'lg' }) => (
  <span
    data-anatomy="4"
    className={`flex shrink-0 items-center justify-center rounded-full bg-accent-soft font-serif font-semibold text-accent ${
      size === 'lg' ? 'h-14 w-14 text-lg' : 'h-9 w-9 text-sm'
    }`}
    aria-hidden="true"
  >
    {initials(m, en)}
  </span>
);

function MemberCard({
  m,
  en,
  selected,
  onSelect,
}: {
  m: Member;
  en: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      aria-pressed={selected}
      data-anatomy="3"
      className={`flex flex-col items-center gap-1.5 rounded-lg border bg-paper p-3 text-center transition-transform hover:-translate-y-0.5 ${
        selected ? 'border-accent' : 'border-line'
      }`}
      style={T}
    >
      <Avatar m={m} en={en} />
      <span className="text-[11px] font-medium">{en ? m.en : m.zh}</span>
      <span data-anatomy="5" className="text-[9px] leading-tight text-ink-3">
        {en ? m.role.en : m.role.zh}
      </span>
    </button>
  );
}

function Mini({ kind, en }: { kind: VariantId; en: boolean }) {
  const en0 = en;
  if (kind === 'roster') {
    return (
      <div className="space-y-2 text-left">
        {DEPTS.filter((d) => d.id !== 'all').map((d) => (
          <div key={d.id} data-anatomy="2">
            <p className="mb-1 text-[9px] font-medium uppercase tracking-wide text-ink-3">{en0 ? d.en : d.zh}</p>
            <div className="space-y-1">
              {MEMBERS.filter((m) => m.dept === d.id).map((m) => (
                <div key={m.id} className="flex items-center gap-2 rounded border border-line bg-paper px-2 py-1">
                  <Avatar m={m} en={en0} />
                  <span className="text-[10px] font-medium">{en0 ? m.en : m.zh}</span>
                  <span data-anatomy="5" className="ml-auto text-[9px] text-ink-3">
                    {en0 ? m.role.en : m.role.zh}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (kind === 'feature') {
    const m = MEMBERS[0];
    return (
      <div className="rounded-lg border border-line bg-paper p-3 text-left" data-anatomy="3">
        <div className="flex items-center gap-3">
          <Avatar m={m} en={en0} size="lg" />
          <div>
            <p className="text-sm font-semibold">{en0 ? m.en : m.zh}</p>
            <p data-anatomy="5" className="text-[10px] text-ink-3">
              {en0 ? m.role.en : m.role.zh}
            </p>
          </div>
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-ink-2">{en0 ? m.bio.en : m.bio.zh}</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-2">
      {MEMBERS.map((m) => (
        <MemberCard key={m.id} m={m} en={en0} selected={false} onSelect={() => {}} />
      ))}
    </div>
  );
}

const TeamDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  const [dept, setDept] = useState<DeptId>('all');
  const [selected, setSelected] = useState<string | null>('lin');

  const shown = dept === 'all' ? MEMBERS : MEMBERS.filter((m) => m.dept === dept);
  const active = shown.find((m) => m.id === selected) ?? shown[0];

  if (mode === 'variants') {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {VARIANTS.map((v) => (
          <div key={v.id} className="relative overflow-hidden rounded-lg border border-line" style={{ height: 200 }}>
            <div className="absolute left-0 top-0 w-[200%] origin-top-left scale-50">
              <Mini kind={v.id} en={en} />
            </div>
            <span className="absolute bottom-1 right-1 rounded bg-paper px-1.5 py-0.5 text-[10px] text-ink-2 shadow-sm">
              {en ? v.en : v.zh}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md text-left">
      <div data-anatomy="1" className="mb-3 text-center">
        <p className="font-serif text-base font-semibold">{en ? 'The people behind it' : '做产品的人'}</p>
        <p className="text-[10px] text-ink-3">{en ? 'A small team of 6 across 3 disciplines' : '六个人，三个职能'}</p>
      </div>

      <div data-anatomy="2" className="mb-3 flex flex-wrap justify-center gap-1.5">
        {DEPTS.map((d) => (
          <button
            key={d.id}
            onClick={() => setDept(d.id)}
            aria-pressed={dept === d.id}
            className={`rounded-full border px-2.5 py-0.5 text-[10px] transition-colors ${
              dept === d.id ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:border-accent'
            }`}
            style={T}
          >
            {en ? d.en : d.zh}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {shown.map((m) => (
          <MemberCard key={m.id} m={m} en={en} selected={m.id === active?.id} onSelect={() => setSelected(m.id)} />
        ))}
      </div>

      {active && (
        <div className="mt-3 rounded-lg border border-line bg-raised p-3">
          <p className="text-[11px] font-medium">
            {en ? active.en : active.zh}
            <span data-anatomy="5" className="ml-2 font-normal text-ink-3">
              {en ? active.role.en : active.role.zh}
            </span>
          </p>
          <p className="mt-1 text-[10px] leading-relaxed text-ink-2">{en ? active.bio.en : active.bio.zh}</p>
        </div>
      )}

      <div data-anatomy="6" className="mt-3 flex justify-center">
        <button className="rounded-md bg-accent px-3 py-1 text-[10px] font-medium text-white transition-colors hover:opacity-90" style={T}>
          {en ? 'Join us — 3 open roles' : '加入我们 · 3 个开放职位'}
        </button>
      </div>
    </div>
  );
};

export default TeamDemo;
