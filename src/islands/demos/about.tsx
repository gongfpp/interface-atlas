import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/* 页面结构缩略示意图（wireframe）：色块 + 真实标签 */

const VARIANTS = [
  { id: 'story', zh: '品牌故事', en: 'Brand Story' },
  { id: 'team', zh: '团队展示', en: 'Team Grid' },
  { id: 'timeline', zh: '历程时间线', en: 'Timeline' },
] as const;

type VariantId = (typeof VARIANTS)[number]['id'];

const TEAM = [
  { zh: '林薇', en: 'Lin Wei', roleZh: '设计负责人', roleEn: 'Head of Design', bioZh: '把复杂流程梳理成清晰的界面语言。', bioEn: 'Turns complex flows into clear interface language.' },
  { zh: '陈拓', en: 'Chen Tuo', roleZh: '工程负责人', roleEn: 'Head of Engineering', bioZh: '关注性能与可维护性之间的平衡。', bioEn: 'Balances performance against maintainability.' },
  { zh: '苏晴', en: 'Su Qing', roleZh: '产品负责人', roleEn: 'Head of Product', bioZh: '从用户问题出发定义产品方向。', bioEn: 'Defines product direction from user problems.' },
  { zh: '赵野', en: 'Zhao Ye', roleZh: '用户研究', roleEn: 'User Research', bioZh: '用访谈和可用性测试提供证据。', bioEn: 'Brings evidence from interviews and usability tests.' },
];

const MILESTONES = [
  { year: '2019', zh: '团队成立', en: 'Team founded' },
  { year: '2021', zh: '首个产品上线', en: 'First product shipped' },
  { year: '2023', zh: '用户破十万', en: 'Reached 100k users' },
  { year: '2026', zh: '开放设计系统', en: 'Design system open-sourced' },
];

const Bar = ({ w = 'w-full', h = 'h-1.5', cls = 'bg-ink-3/25' }: { w?: string; h?: string; cls?: string }) => (
  <div className={`${h} ${w} rounded-full ${cls}`} />
);

const SCOPE_STYLE =
  '[data-demo-scope] [class*="transition"] { transition-duration: calc(150ms * var(--demo-speed, 1)); }';

function Wireframe({ variant, en }: { variant: VariantId; en: boolean }) {
  const [member, setMember] = useState(0);
  const [active, setActive] = useState(2);
  const [expanded, setExpanded] = useState(false);
  const [joined, setJoined] = useState(false);

  return (
    <div className="flex h-72 w-full flex-col overflow-hidden rounded-lg border border-line bg-paper text-left text-xs">
      <header className="flex h-7 shrink-0 items-center gap-3 border-b border-line bg-raised px-3" data-anatomy="1">
        <span className="h-3 w-3 rounded bg-accent" />
        <span className="font-serif text-[10px] font-semibold">Acme</span>
        <div className="ml-1 flex gap-2">
          {[en ? 'Product' : '产品', en ? 'About' : '关于', en ? 'Careers' : '招聘'].map((t) => (
            <span key={t} className={`text-[9px] ${t === (en ? 'About' : '关于') ? 'text-accent' : 'text-ink-2'}`}>{t}</span>
          ))}
        </div>
        <span className="ml-auto rounded bg-accent px-1.5 py-0.5 text-[8px] text-white">{en ? 'Contact' : '联系我们'}</span>
      </header>

      <div className="shrink-0 px-3 pt-2" data-anatomy="2">
        <p className="font-serif text-[13px] font-semibold leading-tight">
          {en ? 'We make tools that respect attention' : '我们做尊重注意力的工具'}
        </p>
        <Bar w="w-2/3 mx-auto mt-1 sm:mx-0" h="h-1" />
      </div>

      <div className="flex min-h-0 flex-1 gap-2 px-3 pt-2">
        {variant === 'timeline' ? (
          <div className="flex-1 overflow-hidden" data-anatomy="3">
            <div className="relative ml-2 border-l border-line pl-3">
              {MILESTONES.map((m, i) => (
                <button
                  key={m.year}
                  onClick={() => setActive(i)}
                  className="relative mb-2 block w-full text-left"
                >
                  <span className={`absolute -left-[17px] top-1 h-2 w-2 rounded-full ${active === i ? 'bg-accent' : 'bg-ink-3/40'}`} />
                  <p className={`text-[9px] font-medium ${active === i ? 'text-accent' : 'text-ink-2'}`}>
                    {m.year} · {en ? m.en : m.zh}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden" data-anatomy="3">
            <p className="text-[9px] font-medium text-ink-2">{en ? 'Our story' : '我们的故事'}</p>
            <div className="mt-1 space-y-1">
              <Bar />
              <Bar w="w-11/12" />
              <Bar w="w-3/4" />
              {expanded && (
                <>
                  <Bar w="w-5/6" />
                  <Bar w="w-2/3" />
                </>
              )}
            </div>
            <button onClick={() => setExpanded((v) => !v)} className="mt-1 text-[9px] text-accent">
              {expanded ? (en ? 'Show less' : '收起') : (en ? 'Read more' : '展开全文')}
            </button>
          </div>
        )}
      </div>

      <div className="shrink-0 px-3 pt-1.5" data-anatomy="4">
        {variant === 'team' ? (
          <div>
            <div className="grid grid-cols-4 gap-1.5">
              {TEAM.map((t, i) => (
                <button
                  key={t.en}
                  onClick={() => setMember(i)}
                  className={`flex flex-col items-center gap-1 rounded-md border p-1 transition-colors ${
                    member === i ? 'border-accent bg-accent-soft' : 'border-line bg-raised'
                  }`}
                >
                  <span className="h-6 w-6 rounded-full bg-accent/30" />
                  <span className="text-[8px] font-medium">{en ? t.en : t.zh}</span>
                </button>
              ))}
            </div>
            <p className="mt-1 truncate text-[8px] text-ink-2">
              {en ? TEAM[member].roleEn : TEAM[member].roleZh} · {en ? TEAM[member].bioEn : TEAM[member].bioZh}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {TEAM.map((t) => (
                <span key={t.en} className="h-6 w-6 rounded-full border-2 border-paper bg-accent/30" />
              ))}
            </div>
            <span className="text-[9px] text-ink-2">{en ? 'Meet the team' : '认识团队'}</span>
          </div>
        )}
      </div>

      <div className="grid shrink-0 grid-cols-3 gap-1.5 px-3 py-1.5" data-anatomy="5">
        {[
          { zh: '诚实', en: 'Honest' },
          { zh: '克制', en: 'Restrained' },
          { zh: '开放', en: 'Open' },
        ].map((v) => (
          <div key={v.en} className="rounded border border-line bg-raised p-1 text-center">
            <span className="text-[9px] font-medium">{en ? v.en : v.zh}</span>
          </div>
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-2 border-t border-line px-3 py-2" data-anatomy="6">
        <span className="text-[9px] font-medium">{en ? 'Want to work with us?' : '想和我们一起工作？'}</span>
        <button
          onClick={() => setJoined(true)}
          className={`ml-auto rounded px-2 py-0.5 text-[9px] transition-colors ${
            joined ? 'bg-ink-3/30 text-ink-2' : 'bg-accent text-white hover:opacity-90'
          }`}
        >
          {joined ? (en ? 'Sent ✓' : '已发送 ✓') : (en ? 'Get in touch' : '联系我们')}
        </button>
      </div>
    </div>
  );
}

const AboutDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  const [variant, setVariant] = useState<VariantId>('story');

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
        {en ? 'Switch variants, select a team member or milestone' : '切换形式，点团队成员或时间线节点试试'}
      </p>
    </div>
  );
};

export default AboutDemo;
