import { useEffect, useSyncExternalStore } from 'react';
import { getSavedSnapshot, getServerSnapshot, pushHistory, subscribe, toggleSaved } from '@/lib/userdata';

interface Props {
  conceptId: string;
  locale: 'zh' | 'en';
}

/** 概念详情页操作：进入即记浏览历史，可切换收藏（localStorage，无账号） */
export default function ConceptActions({ conceptId, locale }: Props) {
  const savedIds = useSyncExternalStore(subscribe, getSavedSnapshot, getServerSnapshot);
  const saved = savedIds.includes(conceptId);

  useEffect(() => {
    pushHistory(conceptId);
  }, [conceptId]);

  const idle = 'shrink-0 rounded-full border border-line px-3 py-1.5 text-xs text-ink-2 transition-colors hover:border-accent hover:text-accent';
  const active = 'shrink-0 rounded-full border border-accent bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent';

  return (
    <button
      type="button"
      aria-pressed={saved}
      onClick={() => toggleSaved(conceptId)}
      className={saved ? active : idle}
    >
      {saved ? '★' : '☆'} {saved ? (locale === 'zh' ? '已收藏' : 'Saved') : locale === 'zh' ? '收藏' : 'Save'}
    </button>
  );
}
