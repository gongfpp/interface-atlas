import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Presence = 'online' | 'busy' | 'offline';

const PRESENCE: Record<Presence, string> = {
  online: 'bg-emerald-500',
  busy: 'bg-red-500',
  offline: 'bg-ink-3/50',
};

const PALETTE = ['bg-accent-soft text-accent', 'bg-sky-500/15 text-sky-600', 'bg-amber-500/15 text-amber-600', 'bg-emerald-500/15 text-emerald-600'];

function hashColor(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 997;
  return PALETTE[h % PALETTE.length];
}

function Avatar({
  name,
  size = 40,
  src,
  presence,
}: {
  name: string;
  size?: number;
  src?: string;
  presence?: Presence;
}) {
  const [broken, setBroken] = useState(false);
  const initials = name.slice(0, 1);
  const ring = Math.max(2, Math.round(size / 16) + 1);
  return (
    <span className="relative inline-block shrink-0" style={{ width: size, height: size }}>
      {src && !broken ? (
        <img
          data-anatomy="1"
          src={src}
          alt={`${name} 的头像`}
          onError={() => setBroken(true)}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span
          data-anatomy="1"
          role="img"
          aria-label={`${name} 的头像`}
          className={`flex h-full w-full items-center justify-center rounded-full font-serif font-semibold ${hashColor(name)}`}
          style={{ fontSize: size * 0.42 }}
        >
          {initials}
        </span>
      )}
      {presence && (
        <span
          data-anatomy="2"
          aria-label={{ online: '在线', busy: '忙碌', offline: '离线' }[presence]}
          className={`absolute bottom-0 right-0 rounded-full ${PRESENCE[presence]}`}
          style={{
            width: size * 0.3,
            height: size * 0.3,
            boxShadow: `0 0 0 ${ring}px var(--color-paper, #fff)`,
          }}
        />
      )}
    </span>
  );
}

function MemberList() {
  const [presence, setPresence] = useState<Presence>('online');
  const next: Record<Presence, Presence> = { online: 'busy', busy: 'offline', offline: 'online' };
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-4 rounded-xl border border-line bg-raised px-4 py-3">
        <Avatar name="林小满" size={40} presence={presence} />
        <div>
          <p className="text-xs font-medium">林小满</p>
          <p className="text-[10px] text-ink-3">产品设计师 · {presence === 'online' ? '在线' : presence === 'busy' ? '忙碌' : '离线'}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Avatar name="林小满" size={40} presence={presence} />
        <Avatar name="Rin" size={32} presence={presence === 'online' ? 'busy' : 'online'} />
        <Avatar name="Mao" size={24} />
      </div>
      <button
        data-anatomy="3"
        onClick={() => setPresence((p) => next[p])}
        className="rounded-lg border border-line px-2.5 py-1 text-[10px] text-ink-2 transition-colors hover:border-accent hover:text-accent"
      >
        切换状态点 / Cycle presence
      </button>
    </div>
  );
}

function StackGroup() {
  const people = ['林小满', 'Rin', 'Mao', '赵之衡'];
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex -space-x-2.5">
        {people.map((p) => (
          <span key={p} className="rounded-full ring-2 ring-paper">
            <Avatar name={p} size={32} />
          </span>
        ))}
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full bg-code-bg text-[10px] font-medium text-ink-2 ring-2 ring-paper"
          aria-label="还有 5 位成员"
        >
          +5
        </span>
      </div>
      <span className="text-[10px] text-ink-3">9 位协作者 / 9 collaborators</span>
    </div>
  );
}

const AvatarDemo: DemoComponent = ({ mode }) => {
  if (mode === 'variants') {
    return (
      <div className="flex items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-ink-3">首字母 Initials</span>
          <StackGroup />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-ink-3">状态 Presence</span>
          <MemberList />
        </div>
      </div>
    );
  }
  return <MemberList />;
};

export default AvatarDemo;
