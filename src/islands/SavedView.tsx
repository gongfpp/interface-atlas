import { useSyncExternalStore } from 'react';
import SolutionNotebook from './SolutionNotebook';
import { TYPE_LABELS, localePath } from '@/lib/i18n';
import {
  getHistorySnapshot,
  getSavedSnapshot,
  getServerSnapshot,
  removeSaved,
  subscribe,
} from '@/lib/userdata';

interface Item {
  id: string;
  type: string;
  name: { zh: string; en: string };
}

interface Props {
  concepts: Item[];
  locale: 'zh' | 'en';
}

const HISTORY_PREVIEW = 12;

export default function SavedView({ concepts, locale }: Props) {
  const savedIds = useSyncExternalStore(subscribe, getSavedSnapshot, getServerSnapshot);
  const historyIds = useSyncExternalStore(subscribe, getHistorySnapshot, getServerSnapshot);

  const zh = locale === 'zh';
  const byId = new Map(concepts.map((c) => [c.id, c]));
  const savedItems = savedIds.map((id) => byId.get(id)).filter((x): x is Item => Boolean(x));
  const historyItems = historyIds
    .map((id) => byId.get(id))
    .filter((x): x is Item => Boolean(x))
    .slice(0, HISTORY_PREVIEW);

  const href = (item: Item) => localePath(`/${item.type}/${item.id}`, locale);
  const typeLabel = (item: Item) => TYPE_LABELS[item.type]?.[locale] ?? item.type;
  const sectionTitle = 'mb-4 font-serif text-xl font-semibold';

  return (
    <div className="flex flex-col gap-12 pb-20">
      <SolutionNotebook locale={locale} />
      <section>
        <h2 className={sectionTitle}>
          {zh ? '条目收藏' : 'Saved concepts'}
          {savedItems.length > 0 && <span className="ml-2 text-sm font-normal text-ink-3">{savedItems.length}</span>}
        </h2>
        {savedItems.length === 0 ? (
          <p className="text-sm text-ink-3">
            {zh ? '还没有收藏。在任意概念页点「☆ 收藏」即可加入这里。' : 'Nothing saved yet. Hit “☆ Save” on any concept page.'}
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {savedItems.map((item) => (
              <div key={item.id} className="group flex items-start justify-between gap-2 rounded-lg border border-line bg-raised p-4">
                <div className="min-w-0">
                  <a href={href(item)} className="font-serif font-semibold hover:text-accent">
                    {item.name[locale]}
                  </a>
                  <p className="mt-0.5 text-xs text-ink-3">
                    {typeLabel(item)} · {item.name[locale === 'zh' ? 'en' : 'zh']}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={zh ? '取消收藏' : 'Remove'}
                  onClick={() => removeSaved(item.id)}
                  className="shrink-0 rounded-full px-1.5 text-ink-3 transition-colors hover:text-accent"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className={sectionTitle}>{zh ? '最近浏览' : 'Recently viewed'}</h2>
        {historyItems.length === 0 ? (
          <p className="text-sm text-ink-3">{zh ? '还没有浏览记录。' : 'No history yet.'}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {historyItems.map((item) => (
              <a
                key={item.id}
                href={href(item)}
                className="rounded-full border border-line px-3 py-1 text-sm text-ink-2 transition-colors hover:border-accent hover:text-accent"
              >
                {item.name[locale]}
                <span className="ml-1 text-xs text-ink-3">{typeLabel(item)}</span>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
