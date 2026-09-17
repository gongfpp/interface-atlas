import { useRef, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Status = 'idle' | 'pending' | 'confirmed';

const LIKES_BASE = 128;

function SequenceCard({ title, steps, ok }: { title: string; steps: string[]; ok: boolean }) {
  return (
    <div className="rounded-lg border border-line bg-raised p-3 text-left">
      <div className="mb-2 text-xs font-medium">{title}</div>
      <ol className="space-y-1.5">
        {steps.map((s, i) => (
          <li key={i} className="flex items-start gap-1.5 text-[10px] text-ink-2">
            <span
              className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[8px] ${
                ok ? 'bg-accent-soft text-accent' : 'bg-code-bg text-ink-2'
              }`}
            >
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}

const OptimisticUiDemo: DemoComponent = ({ mode }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(LIKES_BASE);
  const [status, setStatus] = useState<Status>('idle');
  const [failMode, setFailMode] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const seqRef = useRef(0);

  const toggleLike = () => {
    if (status === 'pending') return;
    const seq = ++seqRef.current;
    const nextLiked = !liked;
    // 乐观更新：立即生效
    setLiked(nextLiked);
    setLikes((n) => n + (nextLiked ? 1 : -1));
    setStatus('pending');
    setTimeout(() => {
      if (seq !== seqRef.current) return;
      if (failMode) {
        // 请求失败：回滚
        setLiked(!nextLiked);
        setLikes((n) => n + (nextLiked ? -1 : 1));
        setStatus('idle');
        setToast('⚠ 请求失败，已恢复原状 · Rolled back');
      } else {
        setStatus('confirmed');
        setToast('✓ 服务器已确认 · Confirmed');
      }
      setTimeout(() => {
        if (seq === seqRef.current) setToast(null);
      }, 2000);
    }, 1200);
  };

  if (mode === 'variants') {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <SequenceCard
          title="成功路径 · Success"
          ok
          steps={[
            '点击 → 数值立即 +1（乐观值，pending 弱化态）',
            '后台发出真实请求',
            '服务器返回成功 → 样式落定为强调色',
          ]}
        />
        <SequenceCard
          title="失败回滚 · Rollback"
          ok={false}
          steps={[
            '点击 → 数值立即 +1（乐观值）',
            '请求超时或返回错误',
            '回滚到原值，并提示「操作失败已恢复」',
          ]}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="rounded-lg border border-line bg-raised p-4">
        <div className="text-xs font-medium">设计周报 · Weekly design report</div>
        <p className="mt-1 text-[10px] text-ink-3">来自 Rin · 今天 09:24</p>
        <div className="mt-3 flex items-center gap-3">
          <button
            data-anatomy="1"
            onClick={toggleLike}
            disabled={status === 'pending'}
            aria-pressed={liked}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-all ${
              liked
                ? 'border-accent bg-accent-soft text-accent'
                : 'border-line text-ink-2 hover:border-accent hover:text-accent'
            } ${status === 'pending' ? 'opacity-60' : ''}`}
          >
            <span aria-hidden="true">{liked ? '♥' : '♡'}</span>
            <span data-anatomy="2" className="font-mono tabular-nums">
              {likes}
            </span>
            {status === 'pending' && (
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 rounded-full border border-line-strong border-t-transparent"
                style={{
                  borderTopColor: 'var(--color-accent, currentColor)',
                  animation: `demo-opt-spin calc(0.8s * var(--demo-speed, 1)) linear infinite`,
                }}
              />
            )}
          </button>
          <label className="flex cursor-pointer items-center gap-1.5 text-[10px] text-ink-3">
            <input type="checkbox" checked={failMode} onChange={(e) => setFailMode(e.target.checked)} />
            模拟请求失败 · Simulate failure
          </label>
        </div>
        <div data-anatomy="3" aria-live="polite" className="mt-3 h-4 text-[10px] text-ink-2">
          {toast ?? (status === 'pending' ? '乐观更新已生效，等待服务器确认…' : '')}
        </div>
      </div>
      <style>{`@keyframes demo-opt-spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
};

export default OptimisticUiDemo;
