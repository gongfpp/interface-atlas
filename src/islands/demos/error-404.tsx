import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const VARIANTS = [
  { id: 'minimal', zh: '极简提示', en: 'Minimal' },
  { id: 'search', zh: '带搜索', en: 'With Search' },
  { id: 'illustrated', zh: '插图引导', en: 'Illustrated' },
] as const;

type VariantId = (typeof VARIANTS)[number]['id'];

const TEXT = {
  zh: {
    code: '404',
    title: '找不到这个页面',
    body: '地址可能拼错了，或者这个页面已经被移走。',
    search: '搜索你要找的内容…',
    suggestions: ['热门：定价方案', '热门：使用文档', '热门：联系我们', '热门：回到首页'],
    home: '返回首页',
    returning: '正在返回…',
    empty: '没有匹配结果，先返回首页吧。',
    hint: '输入搜索或点推荐链接试试',
  },
  en: {
    code: '404',
    title: 'This page is missing',
    body: 'The address may be mistyped, or the page has moved.',
    search: 'Search for what you need…',
    suggestions: ['Popular: Pricing', 'Popular: Documentation', 'Popular: Contact us', 'Popular: Home'],
    home: 'Back home',
    returning: 'Going home…',
    empty: 'No matches — head back home.',
    hint: 'Try the search or a suggested link',
  },
};

type Copy = (typeof TEXT)['zh'];

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-72 w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-line bg-paper p-5 text-center text-xs">
    {children}
  </div>
);

function PageBody({
  variant,
  copy,
  query,
  onQuery,
  returning,
  onHome,
}: {
  variant: VariantId;
  copy: Copy;
  query: string;
  onQuery: (v: string) => void;
  returning: boolean;
  onHome: () => void;
}) {
  const matches = copy.suggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      {variant === 'illustrated' && (
        <div className="mb-3 flex h-16 w-24 items-center justify-center rounded-lg bg-accent-soft" data-anatomy="3">
          <span className="font-serif text-2xl text-accent">?</span>
        </div>
      )}
      <p className="font-serif text-4xl font-bold text-accent" data-anatomy="1">
        {copy.code}
      </p>
      <p className="mt-2 font-serif text-sm font-semibold" data-anatomy="2">
        {copy.title}
      </p>
      <p className="mt-1 text-[11px] text-ink-2">{copy.body}</p>
      {variant !== 'minimal' && (
        <div className="mt-3 w-full max-w-[16rem]" data-anatomy="4">
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={copy.search}
            className="w-full rounded-md border border-line bg-raised px-2 py-1 text-[11px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-accent"
          />
        </div>
      )}
      {variant === 'search' && (
        <div className="mt-2 flex w-full max-w-[18rem] flex-wrap justify-center gap-1" data-anatomy="5">
          {(query ? matches : copy.suggestions.slice(0, 3)).map((s) => (
            <button
              key={s}
              onClick={() => onQuery(s.split('：').pop() ?? s)}
              className="rounded-full border border-line px-2 py-0.5 text-[10px] text-ink-2 transition-colors hover:border-accent hover:text-accent"
            >
              {s}
            </button>
          ))}
          {query && matches.length === 0 && <span className="text-[10px] text-ink-3">{copy.empty}</span>}
        </div>
      )}
      {variant === 'illustrated' && (
        <div className="mt-2 flex flex-wrap justify-center gap-1" data-anatomy="5">
          {copy.suggestions.slice(1, 4).map((s) => (
            <span key={s} className="rounded-full bg-ink-3/10 px-2 py-0.5 text-[10px] text-ink-2">
              {s}
            </span>
          ))}
        </div>
      )}
      <button
        onClick={onHome}
        className="mt-3 rounded bg-accent px-3 py-1 text-[11px] font-medium text-white hover:opacity-90"
        data-anatomy="6"
      >
        {returning ? copy.returning : copy.home}
      </button>
    </>
  );
}

const Error404Demo: DemoComponent = ({ mode, locale = 'zh' }) => {
  const copy = TEXT[locale];
  const [variant, setVariant] = useState<VariantId>('search');
  const [query, setQuery] = useState('');
  const [returning, setReturning] = useState(false);

  if (mode === 'variants') {
    return (
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        {VARIANTS.map((v) => (
          <div key={v.id} className="relative overflow-hidden rounded-lg border border-line" style={{ height: 148 }}>
            <div className="absolute left-0 top-0 w-[200%] origin-top-left scale-50">
              <Card>
                <PageBody
                  variant={v.id}
                  copy={copy}
                  query=""
                  onQuery={() => {}}
                  returning={false}
                  onHome={() => {}}
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
            onClick={() => {
              setVariant(v.id);
              setQuery('');
              setReturning(false);
            }}
            className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
              variant === v.id ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:border-accent'
            }`}
          >
            {v.zh} / {v.en}
          </button>
        ))}
      </div>
      <Card>
        <PageBody
          variant={variant}
          copy={copy}
          query={query}
          onQuery={setQuery}
          returning={returning}
          onHome={() => setReturning(true)}
        />
      </Card>
      <p className="text-center text-[11px] text-ink-3">{copy.hint}</p>
    </div>
  );
};

export default Error404Demo;
