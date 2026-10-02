import { usePreviewVariant } from '@/islands/shared/previewVariant';
import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const VARIANTS = [
  { id: 'accordion', zh: '折叠问答', en: 'Accordion' },
  { id: 'categorized', zh: '分类问答', en: 'Categorized' },
  { id: 'searchable', zh: '可搜索', en: 'Searchable' },
] as const;

type VariantId = (typeof VARIANTS)[number]['id'];

export const previewVariants = { ids: VARIANTS.map((v) => v.id), default: 'accordion' };

const TEXT = {
  zh: {
    heading: '常见问题',
    intro: '先看看这里，也许已经有答案。',
    search: '搜索问题…',
    categories: ['全部', '账号', '计费', '功能'],
    items: [
      { q: '如何重置密码？', a: '在登录页点「忘记密码」，按邮件链接设置新密码。', cat: '账号' },
      { q: '支持哪些付款方式？', a: '支持信用卡、支付宝与对公转账。', cat: '计费' },
      { q: '如何邀请团队成员？', a: '在设置页进入成员管理，输入邮箱发送邀请。', cat: '功能' },
      { q: '可以导出我的数据吗？', a: '可以，在设置页的数据导出中生成 CSV 文件。', cat: '功能' },
    ],
    empty: '没有匹配的问题，请联系支持。',
    support: '没找到答案？联系支持',
    hint: '搜索、切分类、点问题展开答案',
  },
  en: {
    heading: 'Frequently asked',
    intro: 'Look here first — the answer may already exist.',
    search: 'Search questions…',
    categories: ['All', 'Account', 'Billing', 'Features'],
    items: [
      { q: 'How do I reset my password?', a: 'On the login page choose Forgot password, then follow the email link.', cat: 'Account' },
      { q: 'Which payment methods are supported?', a: 'Credit cards, bank transfer and major wallets are supported.', cat: 'Billing' },
      { q: 'How do I invite teammates?', a: 'Open member management in settings and send an email invite.', cat: 'Features' },
      { q: 'Can I export my data?', a: 'Yes — generate a CSV from data export in settings.', cat: 'Features' },
    ],
    empty: 'No matching question — please contact support.',
    support: 'Still stuck? Contact support',
    hint: 'Search, switch category, click a question',
  },
};

type Copy = (typeof TEXT)['zh'];

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-72 w-full flex-col overflow-hidden rounded-lg border border-line bg-paper p-4 text-left text-xs">
    {children}
  </div>
);

function FaqBody({
  variant,
  copy,
  open,
  onToggle,
  query,
  onQuery,
  category,
  onCategory,
}: {
  variant: VariantId;
  copy: Copy;
  open: string | null;
  onToggle: (q: string) => void;
  query: string;
  onQuery: (v: string) => void;
  category: number;
  onCategory: (i: number) => void;
}) {
  const activeCat = copy.categories[category];
  const items = copy.items.filter((it) => {
    const byCat = category === 0 || it.cat === activeCat;
    const q = query.trim().toLowerCase();
    const byQuery = !q || it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q);
    return byCat && byQuery;
  });

  return (
    <>
      <p className="font-serif text-sm font-semibold" data-anatomy="1">
        {copy.heading}
      </p>
      <p className="mt-0.5 text-[10px] text-ink-3">{copy.intro}</p>
      {variant === 'searchable' && (
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={copy.search}
          className="mt-2 w-full rounded-md border border-line bg-raised px-2 py-1 text-[11px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-accent"
          data-anatomy="2"
        />
      )}
      {variant === 'categorized' && (
        <div className="mt-2 flex flex-wrap gap-1" data-anatomy="3">
          {copy.categories.map((c, i) => (
            <button
              key={c}
              onClick={() => onCategory(i)}
              className={`rounded-full border px-2 py-0.5 text-[10px] transition-colors ${
                category === i ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:border-accent'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      <div className="mt-2 flex-1 space-y-1.5 overflow-hidden" data-anatomy="4">
        {items.map((it) => {
          const isOpen = open === it.q;
          return (
            <div key={it.q} className="rounded-md border border-line bg-raised">
              <button
                onClick={() => onToggle(it.q)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-2 px-2 py-1.5 text-left"
              >
                <span className="text-[11px] font-medium text-ink">{it.q}</span>
                <span className="shrink-0 text-[10px] text-ink-3">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <p className="border-t border-line px-2 py-1.5 text-[10px] leading-relaxed text-ink-2" data-anatomy="5">
                  {it.a}
                </p>
              )}
            </div>
          );
        })}
        {items.length === 0 && <p className="text-[10px] text-ink-3">{copy.empty}</p>}
      </div>
      <button className="mt-2 shrink-0 self-start text-[10px] font-medium text-accent hover:underline" data-anatomy="6">
        {copy.support}
      </button>
    </>
  );
}

const FaqDemo: DemoComponent = ({ mode, locale = 'zh' }) => {
  const copy = TEXT[locale];
  const [variant, setVariant] = usePreviewVariant<VariantId>('accordion');
  const [open, setOpen] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(0);

  const reset = (v: VariantId) => {
    setVariant(v);
    setOpen(null);
    setQuery('');
    setCategory(0);
  };

  if (mode === 'variants') {
    return (
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        {VARIANTS.map((v) => (
          <div key={v.id} className="relative overflow-hidden rounded-lg border border-line" style={{ height: 148 }}>
            <div className="absolute left-0 top-0 w-[200%] origin-top-left scale-50">
              <Card>
                <FaqBody
                  variant={v.id}
                  copy={copy}
                  open={copy.items[0].q}
                  onToggle={() => {}}
                  query=""
                  onQuery={() => {}}
                  category={0}
                  onCategory={() => {}}
                />
              </Card>
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
            aria-pressed={variant === v.id}
            onClick={() => reset(v.id)}
            className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
              variant === v.id ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:border-accent'
            }`}
          >
            {v.zh} / {v.en}
          </button>
        ))}
      </div>
      <Card>
        <FaqBody
          variant={variant}
          copy={copy}
          open={open}
          onToggle={(q) => setOpen((o) => (o === q ? null : q))}
          query={query}
          onQuery={setQuery}
          category={category}
          onCategory={setCategory}
        />
      </Card>
      <p className="text-center text-[11px] text-ink-3">{copy.hint}</p>
    </div>
  );
};

export default FaqDemo;
