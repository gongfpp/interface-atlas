import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/* 页面结构缩略示意图（wireframe）：色块 + 真实标签 */

const VARIANTS = [
  { id: 'hero', zh: '经典 Hero', en: 'Hero' },
  { id: 'feature-grid', zh: '功能矩阵', en: 'Feature Grid' },
  { id: 'long-scroll', zh: '长滚动', en: 'Long Scroll' },
  { id: 'waitlist', zh: '候补列表', en: 'Waitlist' },
] as const;

type VariantId = (typeof VARIANTS)[number]['id'];

const Bar = ({ w = 'w-full', h = 'h-1.5', cls = 'bg-ink-3/25' }: { w?: string; h?: string; cls?: string }) => (
  <div className={`${h} ${w} rounded-full ${cls}`} />
);

const Nav = () => (
  <nav className="flex h-7 shrink-0 items-center gap-3 border-b border-line bg-raised px-3" data-anatomy="1">
    <span className="h-3 w-3 rounded bg-accent" />
    <Bar w="w-8" h="h-1" />
    {['功能', '价格', '博客'].map((t) => (
      <span key={t} className="text-[9px] text-ink-2">{t}</span>
    ))}
    <span className="ml-auto rounded bg-accent px-1.5 py-0.5 text-[9px] text-white">注册</span>
  </nav>
);

const CtaButton = ({ onClick, done }: { onClick: () => void; done: boolean }) => (
  <button
    onClick={onClick}
    className={`rounded px-2 py-1 text-[10px] font-medium transition-colors ${
      done ? 'bg-ink-3/30 text-ink-2' : 'bg-accent text-white hover:opacity-90'
    }`}
    data-anatomy="5"
  >
    {done ? '已加入 ✓' : '免费开始'}
  </button>
);

const Footer = () => (
  <footer className="flex h-6 shrink-0 items-center gap-3 border-t border-line bg-raised px-3" data-anatomy="6">
    <Bar w="w-10" h="h-1" />
    <Bar w="w-8" h="h-1" />
    <Bar w="w-8" h="h-1" />
    <span className="ml-auto text-[8px] text-ink-3">© Acme</span>
  </footer>
);

function Wireframe({ variant, joined, onJoin }: { variant: VariantId; joined: boolean; onJoin: () => void }) {
  return (
    <div className="flex h-72 w-full flex-col overflow-hidden rounded-lg border border-line bg-paper text-left text-xs">
      <Nav />
      {variant === 'hero' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-8 text-center" data-anatomy="2">
          <p className="font-serif text-base font-semibold">更快地交付你的产品</p>
          <Bar w="w-2/3" h="h-1" />
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded border border-line px-2 py-1 text-[9px] text-ink-3">you@email.com</span>
            <CtaButton onClick={onJoin} done={joined} />
          </div>
          <div className="mt-2 flex gap-2" data-anatomy="4">
            {['A 客户', 'B 客户', 'C 客户', 'D 客户'].map((l) => (
              <span key={l} className="rounded bg-ink-3/10 px-1.5 py-0.5 text-[8px] text-ink-3">{l}</span>
            ))}
          </div>
        </div>
      )}
      {variant === 'feature-grid' && (
        <div className="flex flex-1 flex-col gap-2 overflow-hidden p-3">
          <div className="text-center" data-anatomy="2">
            <p className="font-serif text-sm font-semibold">为团队而生的工具箱</p>
            <Bar w="w-1/2 mx-auto mt-1" h="h-1" />
          </div>
          <div className="grid flex-1 grid-cols-3 gap-2" data-anatomy="3">
            {['协作', '自动化', '报表', '集成', '安全', '模板'].map((f) => (
              <div key={f} className="flex flex-col gap-1 rounded-md border border-line bg-raised p-2">
                <span className="h-3 w-3 rounded bg-accent/60" />
                <span className="text-[9px] font-medium">{f}</span>
                <Bar w="w-3/4" h="h-1" />
              </div>
            ))}
          </div>
          <div className="flex justify-center" data-anatomy="5">
            <CtaButton onClick={onJoin} done={joined} />
          </div>
        </div>
      )}
      {variant === 'long-scroll' && (
        <div className="flex-1 space-y-2 overflow-hidden p-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex h-[30%] items-center gap-3 rounded-md border border-line bg-raised p-2" data-anatomy={i === 0 ? '2' : '3'}>
              <div className={`h-full w-1/3 rounded ${i % 2 === 0 ? 'bg-accent/25' : 'bg-ink-3/15'}`} />
              <div className="flex-1 space-y-1.5">
                <p className="text-[10px] font-medium">{['一屏讲一个卖点', '截图就是证明', '数字替你说话'][i]}</p>
                <Bar w="w-full" h="h-1" />
                <Bar w="w-2/3" h="h-1" />
              </div>
            </div>
          ))}
          <div className="flex items-center justify-center gap-2 pt-1" data-anatomy="5">
            <CtaButton onClick={onJoin} done={joined} />
          </div>
        </div>
      )}
      {variant === 'waitlist' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-8 text-center" data-anatomy="2">
          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[9px] text-accent">即将上线</span>
          <p className="font-serif text-base font-semibold">加入候补名单</p>
          <Bar w="w-2/3" h="h-1" />
          <div className="mt-1 flex items-center gap-2" data-anatomy="5">
            <span className="rounded border border-line px-2 py-1 text-[9px] text-ink-3">you@email.com</span>
            <CtaButton onClick={onJoin} done={joined} />
          </div>
          <p className="text-[8px] text-ink-3">已有 2,847 人排队</p>
        </div>
      )}
      <Footer />
    </div>
  );
}

const LandingPageDemo: DemoComponent = ({ mode }) => {
  const [variant, setVariant] = useState<VariantId>('hero');
  const [joined, setJoined] = useState(false);

  if (mode === 'variants') {
    return (
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {VARIANTS.map((v) => (
          <div key={v.id} className="relative overflow-hidden rounded-lg border border-line" style={{ height: 148 }}>
            <div className="absolute left-0 top-0 w-[200%] origin-top-left scale-50">
              <Wireframe variant={v.id} joined={false} onJoin={() => {}} />
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
            onClick={() => setVariant(v.id)}
            className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
              variant === v.id ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:border-accent'
            }`}
          >
            {v.zh}
          </button>
        ))}
      </div>
      <Wireframe variant={variant} joined={joined} onJoin={() => setJoined(true)} />
      <p className="text-center text-[11px] text-ink-3">点「免费开始」看 CTA 状态反馈</p>
    </div>
  );
};

export default LandingPageDemo;
