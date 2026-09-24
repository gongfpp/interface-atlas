import type { DemoComponent } from '@/islands/DemoStage';

const CARDS = [
  { title: '设计令牌', meta: '12 条更新' },
  { title: '组件巡检', meta: '3 个待办' },
  { title: '可用性测试', meta: '报告已出' },
  { title: '动效规范', meta: '草稿中' },
  { title: '无障碍审计', meta: 'A 级通过' },
  { title: '版本发布', meta: 'v2.4.0' },
];

const StaggerRevealDemo: DemoComponent = ({ mode }) => (
  <div className="flex w-full flex-col items-center gap-5">
    <div key={mode} className="grid w-full max-w-md grid-cols-2 gap-2.5 sm:grid-cols-3">
      {CARDS.map((card, i) => (
        <div
          key={card.title}
          className="stagger-item rounded-lg border border-line bg-raised p-3"
          style={{ animationDelay: `calc(${i * 0.09}s * var(--demo-speed, 1))` }}
        >
          <p className="text-xs font-semibold text-ink">{card.title}</p>
          <p className="mt-1 text-[10px] text-ink-3">{card.meta}</p>
        </div>
      ))}
    </div>
    <p className="text-xs text-ink-3">同一 keyframes，仅 animation-delay 交错 90ms；fill-mode both 防闪现</p>
    <style>{`@keyframes stagger-up { from { opacity: 0; transform: translateY(14px) ${mode === 'variants' ? 'scale(0.96)' : ''} } to { opacity: 1; transform: translateY(0) ${mode === 'variants' ? 'scale(1)' : ''} } }
.stagger-item { animation: stagger-up calc(0.45s * var(--demo-speed, 1)) cubic-bezier(0.22, 1, 0.36, 1) both; }`}</style>
  </div>
);

export default StaggerRevealDemo;
