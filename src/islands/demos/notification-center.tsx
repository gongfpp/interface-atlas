import { usePreviewVariant } from '@/islands/shared/previewVariant';
import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/* 通知中心页面结构缩略示意图：真实标签 + 可点击已读 */

const VARIANTS = [
  { id: 'list', zh: '列表', en: 'List' },
  { id: 'inbox-split', zh: '分栏', en: 'Split' },
  { id: 'grouped', zh: '分组', en: 'Grouped' },
] as const;

type VariantId = (typeof VARIANTS)[number]['id'];

export const previewVariants = { ids: VARIANTS.map((v) => v.id), default: 'list' };

type Note = {
  id: number;
  icon: string;
  zh: string;
  en: string;
  bodyZh: string;
  bodyEn: string;
  timeZh: string;
  timeEn: string;
  group: string;
};

const NOTES: Note[] = [
  {
    id: 1,
    icon: '▣',
    zh: '订单已发货',
    en: 'Order shipped',
    bodyZh: '订单 #4821 已发出，预计明天送达。',
    bodyEn: 'Order #4821 is on its way and arrives tomorrow.',
    timeZh: '2 分钟前',
    timeEn: '2m',
    group: '订单',
  },
  {
    id: 2,
    icon: '✦',
    zh: '收到一条评论',
    en: 'New comment',
    bodyZh: '林可回复了你的文章。',
    bodyEn: 'Lin replied to your post.',
    timeZh: '1 小时前',
    timeEn: '1h',
    group: '社区',
  },
  {
    id: 3,
    icon: '¥',
    zh: '账单即将到期',
    en: 'Bill due soon',
    bodyZh: '订阅将在 3 天后自动续费。',
    bodyEn: 'Your subscription renews in three days.',
    timeZh: '3 小时前',
    timeEn: '3h',
    group: '账单',
  },
  {
    id: 4,
    icon: '⚿',
    zh: '新设备登录',
    en: 'New sign-in',
    bodyZh: '检测到来自新设备的登录。',
    bodyEn: 'A sign-in from a new device was detected.',
    timeZh: '昨天',
    timeEn: '1d',
    group: '安全',
  },
];

const GROUPS_ZH: Record<string, string> = { 订单: '订单', 社区: '社区', 账单: '账单', 安全: '安全' };

function Item({
  note,
  read,
  active,
  en,
  selectMode,
  checked,
  onClick,
}: {
  note: Note;
  read: boolean;
  active: boolean;
  en: boolean;
  selectMode: boolean;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      data-anatomy="4"
      onClick={onClick}
      className={`flex w-full items-start gap-2 border-b border-line px-3 py-2 text-left ${
        active ? 'bg-accent-soft' : read ? 'bg-paper' : 'bg-raised'
      } hover:bg-accent-soft`}
    >
      {selectMode && (
        <span
          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[9px] ${
            checked ? 'border-accent bg-accent text-white' : 'border-line-strong text-transparent'
          }`}
        >
          ✓
        </span>
      )}
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[11px] text-accent">
        {note.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className={`truncate text-xs ${read ? 'font-normal text-ink-2' : 'font-semibold text-ink'}`}>
            {en ? note.en : note.zh}
          </span>
          {!read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />}
        </span>
        <span className="mt-0.5 block truncate text-[10px] text-ink-3">{en ? note.bodyEn : note.bodyZh}</span>
      </span>
      <span className="shrink-0 text-[9px] text-ink-3">{en ? note.timeEn : note.timeZh}</span>
    </button>
  );
}

const Empty = ({ en }: { en: boolean }) => (
  <div className="flex flex-col items-center gap-1 py-10 text-center">
    <span className="text-lg">✓</span>
    <span className="text-xs font-medium text-ink-2">{en ? 'All caught up' : '已全部读完'}</span>
    <span className="text-[10px] text-ink-3">{en ? 'No unread notifications' : '没有未读通知了'}</span>
  </div>
);

function ListBody({
  variant,
  en,
  visible,
  read,
  openId,
  onItem,
  selectMode,
  sel,
  onMarkRead,
  onReadOne,
  onArchive,
}: {
  variant: VariantId;
  en: boolean;
  visible: Note[];
  read: number[];
  openId: number;
  onItem: (id: number) => void;
  selectMode: boolean;
  sel: number[];
  onMarkRead: () => void;
  onReadOne: (id: number) => void;
  onArchive: () => void;
}) {
  const list = (
    <div data-anatomy="3" className="max-h-52 overflow-y-auto">
      {visible.length === 0 ? (
        <Empty en={en} />
      ) : variant === 'grouped' ? (
        visible.map((note, i) => {
          const showGroup = i === 0 || visible[i - 1].group !== note.group;
          return (
            <div key={note.id}>
              {showGroup && (
                <p className="bg-paper px-3 pb-0.5 pt-1.5 text-[9px] font-medium uppercase tracking-wide text-ink-3">
                  {en ? note.group : GROUPS_ZH[note.group]}
                </p>
              )}
              <Item
                note={note}
                read={read.includes(note.id)}
                active={openId === note.id}
                en={en}
                selectMode={selectMode}
                checked={sel.includes(note.id)}
                onClick={() => onItem(note.id)}
              />
            </div>
          );
        })
      ) : (
        visible.map((note) => (
          <Item
            key={note.id}
            note={note}
            read={read.includes(note.id)}
            active={openId === note.id}
            en={en}
            selectMode={selectMode}
            checked={sel.includes(note.id)}
            onClick={() => onItem(note.id)}
          />
        ))
      )}
    </div>
  );

  if (variant === 'inbox-split') {
    const open = NOTES.find((n) => n.id === openId) ?? NOTES[0];
    return (
      <div className="flex">
        <div className="w-1/2 border-r border-line">{list}</div>
        <div data-anatomy="6" className="flex w-1/2 flex-col gap-1 p-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft text-[11px] text-accent">
            {open.icon}
          </span>
          <p className="text-xs font-semibold">{en ? open.en : open.zh}</p>
          <p className="text-[10px] leading-relaxed text-ink-2">{en ? open.bodyEn : open.bodyZh}</p>
          <button
            onClick={() => onReadOne(open.id)}
            className="mt-auto self-start rounded border border-line px-2 py-0.5 text-[10px] text-ink-2 hover:border-accent hover:text-accent"
          >
            {en ? 'Mark read' : '标为已读'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {list}
      {selectMode && (
        <div data-anatomy="5" className="flex items-center gap-2 bg-accent-soft px-3 py-1.5 text-[10px] text-accent">
          <span>
            {en ? `${sel.length} selected` : `已选 ${sel.length} 条`}
          </span>
          <button onClick={onMarkRead} className="ml-auto rounded border border-accent/40 px-1.5 py-0.5 hover:bg-accent/10">
            {en ? 'Read' : '已读'}
          </button>
          <button onClick={onArchive} className="rounded border border-accent/40 px-1.5 py-0.5 hover:bg-accent/10">
            {en ? 'Archive' : '归档'}
          </button>
        </div>
      )}
    </div>
  );
}

const NotificationCenterDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  const [variant, setVariant] = usePreviewVariant<VariantId>('list');
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const [read, setRead] = useState<number[]>([4]);
  const [openId, setOpenId] = useState(1);
  const [selectMode, setSelectMode] = useState(false);
  const [sel, setSel] = useState<number[]>([]);

  const unread = NOTES.filter((n) => !read.includes(n.id));
  const visible = tab === 'all' ? NOTES : unread;

  const onItem = (id: number) => {
    if (selectMode) {
      setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    } else {
      setOpenId(id);
      setRead((r) => (r.includes(id) ? r : [...r, id]));
    }
  };
  const markSelected = () => {
    setRead((r) => Array.from(new Set([...r, ...sel])));
    setSel([]);
    setSelectMode(false);
  };
  const archive = () => {
    setSel([]);
    setSelectMode(false);
  };

  const tabs: Array<{ id: 'all' | 'unread'; zh: string; en: string; count: number }> = [
    { id: 'all', zh: '全部', en: 'All', count: NOTES.length },
    { id: 'unread', zh: '未读', en: 'Unread', count: unread.length },
  ];

  if (mode === 'variants') {
    return (
      <div className="grid grid-cols-3 gap-3">
        {VARIANTS.map((v) => (
          <div key={v.id} className="overflow-hidden rounded-lg border border-line bg-paper" style={{ height: 190 }}>
            <div className="flex items-center gap-1 border-b border-line bg-raised px-2 py-1.5">
              <span className="h-2 w-2 rounded bg-accent" />
              <span className="text-[9px] text-ink-2">{en ? 'Notifications' : '通知中心'}</span>
            </div>
            <div className="flex gap-1 border-b border-line px-2 py-1">
              <span className="rounded bg-accent-soft px-1 text-[8px] text-accent">{en ? 'All' : '全部'}</span>
              <span className="px-1 text-[8px] text-ink-3">{en ? 'Unread 3' : '未读 3'}</span>
            </div>
            <div className={v.id === 'inbox-split' ? 'flex' : ''}>
              <div className={v.id === 'inbox-split' ? 'w-1/2' : ''}>
                {v.id === 'grouped' && (
                  <p className="bg-paper px-2 pt-1 text-[7px] uppercase text-ink-3">{en ? 'Orders' : '订单'}</p>
                )}
                {NOTES.slice(0, 3).map((n) => (
                  <div key={n.id} className="flex items-center gap-1.5 border-b border-line px-2 py-1">
                    <span className="h-3 w-3 shrink-0 rounded-full bg-accent-soft" />
                    <span className="truncate text-[8px] text-ink-2">{en ? n.en : n.zh}</span>
                    <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  </div>
                ))}
              </div>
              {v.id === 'inbox-split' && (
                <div className="w-1/2 space-y-1 border-l border-line p-2">
                  <span className="block h-3 w-3 rounded-full bg-accent-soft" />
                  <span className="block h-1 w-3/4 rounded-full bg-ink-3/25" />
                  <span className="block h-1 w-full rounded-full bg-ink-3/20" />
                </div>
              )}
            </div>
            <span className="mt-2 block text-center text-[9px] text-ink-3">
              {v.zh} / {v.en}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto w-[440px] max-w-full">
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            aria-pressed={variant === v.id}
            onClick={() => setVariant(v.id)}
            className={`rounded-full border px-2.5 py-0.5 text-xs ${
              variant === v.id ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:border-accent'
            }`}
          >
            {en ? v.en : v.zh}
          </button>
        ))}
        <button
          onClick={() => {
            setSelectMode((s) => !s);
            setSel([]);
          }}
          className={`ml-auto rounded-full border px-2.5 py-0.5 text-xs ${
            selectMode ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:border-accent'
          }`}
        >
          {en ? 'Select' : '多选'}
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-paper text-left">
        <header data-anatomy="1" className="flex items-center gap-2 border-b border-line bg-raised px-3 py-2">
          <span className="text-sm font-semibold">{en ? 'Notifications' : '通知中心'}</span>
          <span className="rounded-full bg-accent-soft px-1.5 text-[10px] text-accent">{unread.length}</span>
          <button
            onClick={() => setRead(NOTES.map((n) => n.id))}
            className="ml-auto rounded border border-line px-2 py-0.5 text-[10px] text-ink-2 hover:border-accent hover:text-accent"
          >
            {en ? 'Mark all read' : '全部已读'}
          </button>
        </header>

        <div data-anatomy="2" className="flex gap-1 border-b border-line px-2 py-1.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-2.5 py-0.5 text-[11px] ${
                tab === t.id ? 'bg-accent-soft font-medium text-accent' : 'text-ink-2 hover:text-accent'
              }`}
            >
              {en ? t.en : t.zh} {t.count}
            </button>
          ))}
        </div>

        <ListBody
          variant={variant}
          en={en}
          visible={visible}
          read={read}
          openId={openId}
          onItem={onItem}
          selectMode={selectMode}
          sel={sel}
          onMarkRead={markSelected}
          onReadOne={(id) => setRead((r) => (r.includes(id) ? r : [...r, id]))}
          onArchive={archive}
        />
      </div>
    </div>
  );
};

export default NotificationCenterDemo;
