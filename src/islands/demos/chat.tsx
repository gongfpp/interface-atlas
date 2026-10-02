import { usePreviewVariant } from '@/islands/shared/previewVariant';
import { useEffect, useRef, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/* 聊天消息页结构缩略示意图：会话列表 + 消息线程 + 输入区 */

const VARIANTS = [
  { id: 'split', zh: '分栏会话', en: 'Split View' },
  { id: 'focused', zh: '单线程', en: 'Focused' },
  { id: 'bubble', zh: '气泡流', en: 'Bubble Stream' },
] as const;

type VariantId = (typeof VARIANTS)[number]['id'];

export const previewVariants = { ids: VARIANTS.map((v) => v.id), default: 'split' };

type Msg = { id: number; from: 'me' | 'them'; zh: string; en: string };
type Conv = {
  id: string;
  nameZh: string;
  nameEn: string;
  initial: string;
  online: boolean;
  unread: number;
  color: string;
  msgs: Msg[];
};

const CONVS: Conv[] = [
  {
    id: 'a',
    nameZh: '林可',
    nameEn: 'Lin Ke',
    initial: '林',
    online: true,
    unread: 2,
    color: 'bg-accent',
    msgs: [
      { id: 1, from: 'them', zh: '下午的设计稿我看过了，整体没问题。', en: 'I reviewed the design draft — looks good overall.' },
      { id: 2, from: 'me', zh: '好，那我把交付说明补上。', en: 'Great, I will add the delivery notes then.' },
      { id: 3, from: 'them', zh: '辛苦，明天同步进度。', en: 'Thanks, let us sync progress tomorrow.' },
    ],
  },
  {
    id: 'b',
    nameZh: '客服小分队',
    nameEn: 'Support Crew',
    initial: '客',
    online: false,
    unread: 0,
    color: 'bg-ink-3',
    msgs: [
      { id: 1, from: 'them', zh: '今天的工单已经清零。', en: 'The ticket queue is cleared for today.' },
      { id: 2, from: 'me', zh: '收到，谢谢！', en: 'Got it, thanks!' },
    ],
  },
  {
    id: 'c',
    nameZh: '周明',
    nameEn: 'Zhou Ming',
    initial: '周',
    online: true,
    unread: 0,
    color: 'bg-ink-2',
    msgs: [{ id: 1, from: 'them', zh: '会议室改到 3 楼了。', en: 'The meeting room moved to the 3rd floor.' }],
  },
];

const AUTO_REPLY: Msg = { id: 999, from: 'them', zh: '收到，我稍后回复你。', en: 'Got it — will get back to you shortly.' };

function ConversationList({
  convs,
  activeId,
  en,
  onPick,
}: {
  convs: Conv[];
  activeId: string;
  en: boolean;
  onPick: (id: string) => void;
}) {
  return (
    <div data-anatomy="1" className="max-h-64 w-32 shrink-0 overflow-y-auto border-r border-line">
      {convs.map((c) => (
        <button
          key={c.id}
          onClick={() => onPick(c.id)}
          className={`flex w-full items-center gap-2 border-b border-line px-2 py-2 text-left ${
            activeId === c.id ? 'bg-accent-soft' : 'hover:bg-accent-soft'
          }`}
        >
          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] text-white ${c.color}`}>
            {c.initial}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[11px] font-medium text-ink">{en ? c.nameEn : c.nameZh}</span>
            <span className="block truncate text-[9px] text-ink-3">
              {en ? c.msgs[c.msgs.length - 1]?.en : c.msgs[c.msgs.length - 1]?.zh}
            </span>
          </span>
          {c.unread > 0 && (
            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[9px] text-white">
              {c.unread}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function Bubbles({ msgs, en, dense }: { msgs: Msg[]; en: boolean; dense: boolean }) {
  return (
    <div className="flex flex-col gap-2 px-3 py-3">
      <div data-anatomy="4" className="flex items-center gap-2">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[9px] text-ink-3">{en ? 'Today' : '今天'}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      {msgs.map((m) => (
        <div key={m.id} data-anatomy="3" className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
          <span
            className={`max-w-[78%] rounded-2xl px-2.5 py-1.5 text-[11px] leading-snug ${
              m.from === 'me'
                ? 'rounded-br-sm bg-accent text-white'
                : `rounded-bl-sm bg-raised text-ink ${dense ? '' : 'border border-line'}`
            }`}
          >
            {en ? m.en : m.zh}
          </span>
        </div>
      ))}
    </div>
  );
}

function Thread({
  conv,
  en,
  variant,
  onSend,
  draft,
  setDraft,
}: {
  conv: Conv;
  en: boolean;
  variant: VariantId;
  onSend: () => void;
  draft: string;
  setDraft: (v: string) => void;
}) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [conv.id, conv.msgs.length]);

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <header data-anatomy="2" className="flex items-center gap-2 border-b border-line bg-raised px-3 py-2">
        <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] text-white ${conv.color}`}>
          {conv.initial}
        </span>
        <span className="text-xs font-semibold">{en ? conv.nameEn : conv.nameZh}</span>
        {conv.online && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
        <span className="text-[9px] text-ink-3">{conv.online ? (en ? 'online' : '在线') : en ? 'offline' : '离线'}</span>
        <span className="ml-auto text-[10px] text-ink-3">⋯</span>
      </header>

      <div className="max-h-48 flex-1 overflow-y-auto bg-paper">
        <Bubbles msgs={conv.msgs} en={en} dense={variant === 'bubble'} />
        <div ref={endRef} />
      </div>

      <div data-anatomy="5" className="flex items-center gap-2 border-t border-line bg-raised px-2 py-2">
        <button className="flex h-6 w-6 items-center justify-center rounded-full border border-line text-[11px] text-ink-2 hover:border-accent hover:text-accent">
          ＋
        </button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSend();
          }}
          placeholder={en ? 'Write a message…' : '输入消息…'}
          className="min-w-0 flex-1 rounded-full border border-line bg-paper px-3 py-1 text-[11px] text-ink outline-none placeholder:text-ink-3 focus:border-accent"
        />
        <button
          onClick={onSend}
          className="rounded-full bg-accent px-2.5 py-1 text-[11px] text-white hover:opacity-90"
        >
          {en ? 'Send' : '发送'}
        </button>
      </div>
    </div>
  );
}

function MiniThread() {
  return (
    <div className="flex h-[150px] flex-col">
      <div className="flex items-center gap-1 border-b border-line bg-raised px-2 py-1">
        <span className="h-3 w-3 rounded-full bg-accent" />
        <span className="h-1 w-10 rounded-full bg-ink-3/30" />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1.5 px-2">
        <span className="h-4 w-2/3 rounded-xl rounded-bl-sm bg-raised" />
        <span className="ml-auto h-4 w-1/2 rounded-xl rounded-br-sm bg-accent/80" />
        <span className="h-4 w-3/5 rounded-xl rounded-bl-sm bg-raised" />
      </div>
      <div className="flex items-center gap-1 border-t border-line px-2 py-1.5">
        <span className="h-3 flex-1 rounded-full border border-line" />
        <span className="h-3 w-6 rounded-full bg-accent" />
      </div>
    </div>
  );
}

const ChatDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  const [variant, setVariant] = usePreviewVariant<VariantId>('split');
  const [convs, setConvs] = useState<Conv[]>(CONVS);
  const [activeId, setActiveId] = useState('a');
  const [draft, setDraft] = useState('');

  const active = convs.find((c) => c.id === activeId) ?? convs[0];

  const pick = (id: string) => {
    setActiveId(id);
    setConvs((cs) => cs.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const mine: Msg = { id: Date.now(), from: 'me', zh: text, en: text };
    setConvs((cs) => cs.map((c) => (c.id === activeId ? { ...c, msgs: [...c.msgs, mine] } : c)));
    setDraft('');
    window.setTimeout(() => {
      setConvs((cs) =>
        cs.map((c) => (c.id === activeId ? { ...c, msgs: [...c.msgs, { ...AUTO_REPLY, id: Date.now() }] } : c)),
      );
    }, 700);
  };

  if (mode === 'variants') {
    return (
      <div className="grid grid-cols-3 gap-3">
        {VARIANTS.map((v) => (
          <div key={v.id} className="overflow-hidden rounded-lg border border-line bg-paper">
            <div className="flex">
              {v.id === 'split' && (
                <div className="w-14 shrink-0 border-r border-line">
                  {CONVS.map((c) => (
                    <div key={c.id} className="flex items-center gap-1 border-b border-line px-1.5 py-1.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${c.color}`} />
                      <span className="h-1 w-5 rounded-full bg-ink-3/25" />
                    </div>
                  ))}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <MiniThread />
              </div>
            </div>
            <span className="block border-t border-line py-1 text-center text-[9px] text-ink-3">
              {v.zh} / {v.en}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto w-[520px] max-w-full">
      <div className="mb-2 flex flex-wrap gap-1.5">
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
      </div>

      <div className="flex h-64 overflow-hidden rounded-lg border border-line bg-paper text-left">
        {variant === 'split' && <ConversationList convs={convs} activeId={activeId} en={en} onPick={pick} />}
        <Thread conv={active} en={en} variant={variant} onSend={send} draft={draft} setDraft={setDraft} />
      </div>
      <p className="mt-2 text-center text-[11px] text-ink-3">
        {en ? 'Switch conversations and send a message' : '切换会话并发送一条消息试试'}
      </p>
    </div>
  );
};

export default ChatDemo;
