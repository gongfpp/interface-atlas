import { useEffect, useSyncExternalStore } from 'react';
import { getSavedSnapshot, getServerSnapshot, getServerStorageSnapshot, storageAvailable, retryUserdataStorage, pushHistory, subscribe, toggleSaved } from '@/lib/userdata';

interface Props {
  conceptId: string;
  locale: 'zh' | 'en';
}

/** 概念详情页操作：进入即记浏览历史，可切换收藏（localStorage，无账号） */
export default function ConceptActions({ conceptId, locale }: Props) {
  const savedIds = useSyncExternalStore(subscribe, getSavedSnapshot, getServerSnapshot);
  const saved = savedIds.includes(conceptId);
  const storageOK = useSyncExternalStore(subscribe, storageAvailable, getServerStorageSnapshot);
  const zh = locale === 'zh';

  useEffect(() => {
    pushHistory(conceptId);
  }, [conceptId]);

  const idle = 'shrink-0 rounded-full border border-line px-3 py-1.5 text-xs text-ink-2 transition-colors hover:border-accent hover:text-accent';
  const active = 'shrink-0 rounded-full border border-accent bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent';

  return (
    <span className="flex max-w-full shrink-0 flex-wrap items-center gap-2">
      <button
        type="button"
        aria-pressed={saved}
        onClick={() => toggleSaved(conceptId)}
        className={saved ? active : idle}
      >
        {saved ? '★' : '☆'} {saved ? (storageOK ? (zh ? '已收藏' : 'Saved') : (zh ? '本页已收藏' : 'Saved for this page')) : zh ? '收藏' : 'Save'}
      </button>
      {!storageOK && <span className="text-xs text-ink-2" role="status">
        {zh ? '收藏或浏览记录尚未保存，刷新后可能丢失。' : 'Saves or history are not stored and may be lost on reload.'}{' '}
        <button type="button" className="underline hover:text-accent" onClick={retryUserdataStorage}>{zh ? '重试保存' : 'Retry saving'}</button>
      </span>}
    </span>
  );
}
