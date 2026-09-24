import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/* 帮助中心结构缩略示意图：搜索区 + 主题分类 + 文章列表 + 联系支持 */

const VARIANTS = [
  { id: 'portal', zh: '门户型', en: 'Portal' },
  { id: 'faq', zh: '常见问题', en: 'FAQ' },
  { id: 'docs', zh: '文档型', en: 'Docs' },
] as const;

type VariantId = (typeof VARIANTS)[number]['id'];

const TOPICS = [
  { id: 'start', icon: '▶', zh: '快速上手', en: 'Getting started' },
  { id: 'billing', icon: '¥', zh: '账单与订阅', en: 'Billing' },
  { id: 'team', icon: '◍', zh: '团队与权限', en: 'Team & access' },
  { id: 'api', icon: '{}', zh: '开发与接口', en: 'API & dev' },
];

type Article = { id: number; topic: string; zh: string; en: string; bodyZh: string; bodyEn: string };

const ARTICLES: Article[] = [
  {
    id: 1,
    topic: 'start',
    zh: '如何创建第一个项目',
    en: 'How to create your first project',
    bodyZh: '从工作台右上角点击「新建」，选择模板并命名即可开始。',
    bodyEn: 'Click New in the top-right of the workspace, pick a template and name it to begin.',
  },
  {
    id: 2,
    topic: 'start',
    zh: '导入已有数据',
    en: 'Import existing data',
    bodyZh: '支持 CSV 与 JSON，导入前请先核对表头字段。',
    bodyEn: 'CSV and JSON are supported; verify the header fields before importing.',
  },
  {
    id: 3,
    topic: 'billing',
    zh: '如何升级套餐',
    en: 'How to upgrade your plan',
    bodyZh: '在「设置 → 账单」中选择新套餐，差价按剩余周期折算。',
    bodyEn: 'Choose a new plan in Settings → Billing; the difference is prorated for the remaining cycle.',
  },
  {
    id: 4,
    topic: 'billing',
    zh: '发票如何申请',
    en: 'How to request an invoice',
    bodyZh: '填写抬头与税号后，电子发票会在 3 个工作日内发送。',
    bodyEn: 'After you enter the title and tax ID, an e-invoice is issued within three business days.',
  },
  {
    id: 5,
    topic: 'team',
    zh: '邀请成员并分配角色',
    en: 'Invite members and assign roles',
    bodyZh: '管理员可发送邀请链接，并为成员设置查看、编辑或管理权限。',
    bodyEn: 'Admins can send invite links and grant view, edit or manage permissions.',
  },
  {
    id: 6,
    topic: 'api',
    zh: '生成 API 访问令牌',
    en: 'Generate an API token',
    bodyZh: '令牌仅在创建时显示一次，请立即复制到安全的位置。',
    bodyEn: 'The token is shown only once at creation — copy it somewhere safe immediately.',
  },
];

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-accent-soft text-accent">{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}

const HelpCenterDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  const [variant, setVariant] = useState<VariantId>('portal');
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState<string | null>(null);
  const [openId, setOpenId] = useState<number | null>(1);
  const [articleId, setArticleId] = useState(1);

  const q = query.trim().toLowerCase();
  const filtered = ARTICLES.filter(
    (a) =>
      (!topic || a.topic === topic) &&
      (!q || a.zh.toLowerCase().includes(q) || a.en.toLowerCase().includes(q)),
  );
  const activeArticle = ARTICLES.find((a) => a.id === articleId) ?? ARTICLES[0];

  if (mode === 'variants') {
    return (
      <div className="grid grid-cols-3 gap-3">
        {VARIANTS.map((v) => (
          <div key={v.id} className="overflow-hidden rounded-lg border border-line bg-paper">
            <div className="border-b border-line bg-raised p-2">
              <span className="mb-1 block h-1.5 w-14 rounded-full bg-ink-3/25" />
              <span className="flex h-4 items-center rounded-full border border-line px-2 text-[8px] text-ink-3">
                {en ? 'Search…' : '搜索…'}
              </span>
            </div>
            {v.id === 'portal' && (
              <div className="grid grid-cols-2 gap-1 p-2">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="flex h-8 items-center gap-1 rounded border border-line px-1">
                    <span className="h-3 w-3 rounded bg-accent-soft" />
                    <span className="h-1 w-6 rounded-full bg-ink-3/25" />
                  </span>
                ))}
              </div>
            )}
            {v.id === 'faq' && (
              <div className="space-y-1 p-2">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="block rounded border border-line px-1.5 py-1 text-[8px] text-ink-3">
                    {en ? 'Question' : '问题'} <span className="float-right">+</span>
                  </span>
                ))}
              </div>
            )}
            {v.id === 'docs' && (
              <div className="flex h-[62px]">
                <div className="w-1/3 space-y-1 border-r border-line p-1.5">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="block h-1.5 rounded-full bg-ink-3/20" />
                  ))}
                </div>
                <div className="flex-1 space-y-1 p-1.5">
                  <span className="block h-1.5 w-2/3 rounded-full bg-ink-3/30" />
                  <span className="block h-1 w-full rounded-full bg-ink-3/15" />
                  <span className="block h-1 w-5/6 rounded-full bg-ink-3/15" />
                </div>
              </div>
            )}
            <span className="block border-t border-line py-1 text-center text-[9px] text-ink-3">
              {v.zh} / {v.en}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto w-[560px] max-w-full">
      <div className="mb-2 flex flex-wrap gap-1.5">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            onClick={() => setVariant(v.id)}
            className={`rounded-full border px-2.5 py-0.5 text-xs ${
              variant === v.id ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:border-accent'
            }`}
          >
            {en ? v.en : v.zh}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-paper text-left">
        <div data-anatomy="1" className="bg-raised px-4 py-3">
          <p className="text-sm font-semibold">{en ? 'How can we help?' : '有什么可以帮你？'}</p>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={en ? 'Search articles…' : '搜索文章…'}
            className="mt-2 w-full rounded-md border border-line bg-paper px-3 py-1.5 text-[11px] text-ink outline-none placeholder:text-ink-3 focus:border-accent"
          />
        </div>

        {variant === 'portal' && (
          <>
            <div data-anatomy="2" className="grid grid-cols-4 gap-2 p-3">
              {TOPICS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTopic((cur) => (cur === t.id ? null : t.id))}
                  className={`rounded-md border p-2 text-left ${
                    topic === t.id ? 'border-accent bg-accent-soft' : 'border-line hover:border-accent'
                  }`}
                >
                  <span className="text-[13px] text-accent">{t.icon}</span>
                  <span className="mt-1 block text-[10px] font-medium text-ink">{en ? t.en : t.zh}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3 border-t border-line p-3">
              <div data-anatomy="3" className="min-w-0 flex-1 space-y-2">
                {filtered.length === 0 ? (
                  <p className="py-4 text-center text-[10px] text-ink-3">
                    {en ? 'No matches — try a popular term below' : '没有匹配，试试右侧热门问题'}
                  </p>
                ) : (
                  filtered.map((a) => (
                    <button key={a.id} onClick={() => setArticleId(a.id)} className="block w-full text-left">
                      <span className="text-[11px] font-medium text-ink hover:text-accent">
                        <Highlight text={en ? a.en : a.zh} query={query} />
                      </span>
                      <span className="mt-0.5 block truncate text-[9px] text-ink-3">{en ? a.bodyEn : a.bodyZh}</span>
                    </button>
                  ))
                )}
              </div>
              <div data-anatomy="4" className="w-32 shrink-0 border-l border-line pl-3">
                <p className="mb-1 text-[9px] font-medium uppercase tracking-wide text-ink-3">
                  {en ? 'Popular' : '热门文章'}
                </p>
                <div className="space-y-1">
                  {ARTICLES.slice(0, 3).map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setArticleId(a.id)}
                      className={`block w-full truncate text-left text-[9px] ${
                        articleId === a.id ? 'text-accent' : 'text-ink-2 hover:text-accent'
                      }`}
                    >
                      {en ? a.en : a.zh}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {variant === 'faq' && (
          <div data-anatomy="3" className="space-y-1 p-3">
            {filtered.map((a) => {
              const open = openId === a.id;
              return (
                <div key={a.id} className="rounded-md border border-line">
                  <button
                    onClick={() => setOpenId(open ? null : a.id)}
                    className="flex w-full items-center gap-2 px-2.5 py-2 text-left text-[11px] text-ink"
                  >
                    <span className="flex-1">
                      <Highlight text={en ? a.en : a.zh} query={query} />
                    </span>
                    <span className="text-ink-3">{open ? '−' : '+'}</span>
                  </button>
                  {open && <p className="border-t border-line px-2.5 py-2 text-[10px] text-ink-2">{en ? a.bodyEn : a.bodyZh}</p>}
                </div>
              );
            })}
          </div>
        )}

        {variant === 'docs' && (
          <div className="flex">
            <div data-anatomy="2" className="w-32 shrink-0 border-r border-line p-2">
              {TOPICS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTopic(t.id)}
                  className={`mb-1 block w-full rounded px-1.5 py-1 text-left text-[10px] ${
                    topic === t.id ? 'bg-accent-soft text-accent' : 'text-ink-2 hover:bg-accent-soft'
                  }`}
                >
                  {en ? t.en : t.zh}
                </button>
              ))}
            </div>
            <div data-anatomy="3" className="min-w-0 flex-1 p-3">
              <p className="text-[11px] font-semibold text-ink">{en ? activeArticle.en : activeArticle.zh}</p>
              <p className="mt-1 text-[10px] leading-relaxed text-ink-2">{en ? activeArticle.bodyEn : activeArticle.bodyZh}</p>
            </div>
          </div>
        )}

        <div data-anatomy="5" className="flex flex-wrap items-center gap-2 border-t border-line bg-accent-soft px-4 py-2 text-[11px] text-accent">
          <span>{en ? 'Still stuck?' : '还是没解决？'}</span>
          <button className="rounded border border-accent/40 px-2 py-0.5 hover:bg-accent/10">
            {en ? 'Live chat' : '在线客服'}
          </button>
          <button className="rounded border border-accent/40 px-2 py-0.5 hover:bg-accent/10">
            {en ? 'Open a ticket' : '提交工单'}
          </button>
        </div>

        <footer data-anatomy="6" className="flex items-center gap-3 border-t border-line px-4 py-2 text-[9px] text-ink-3">
          <span>{en ? 'Status: operational' : '服务状态：正常'}</span>
          <span>{en ? 'Community' : '社区'}</span>
          <span>{en ? 'Terms' : '条款'}</span>
          <span className="ml-auto">{en ? '© Acme' : '© Acme'}</span>
        </footer>
      </div>
      <p className="mt-2 text-center text-[11px] text-ink-3">
        {en ? 'Search, pick a topic or expand a question' : '搜索、选择主题或展开问题试试'}
      </p>
    </div>
  );
};

export default HelpCenterDemo;
