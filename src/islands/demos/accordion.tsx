import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const FAQ = [
  {
    q: '可以开发票吗？',
    a: '支持。在「账单中心」勾选订单后申请电子发票，1～3 个工作日内发送到邮箱。',
  },
  {
    q: '如何转移项目所有权？',
    a: '项目设置 → 成员 → 将目标成员设为所有者，转移后你将自动降为管理员。',
  },
  {
    q: '免费版有什么限制？',
    a: '免费版最多 3 个项目、5 名成员，单文件上传上限 100 MB，不包含审计日志。',
  },
];

function Section({
  i,
  q,
  a,
  open,
  bordered,
  isLast = false,
  onToggle,
}: {
  i: number;
  q: string;
  a: string;
  open: boolean;
  bordered: boolean;
  isLast?: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={bordered ? 'rounded-xl border border-line bg-raised' : ''}>
      <button
        data-anatomy="1"
        aria-expanded={open}
        aria-controls={`acc-panel-${i}`}
        onClick={onToggle}
        className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs transition-colors"
      >
        <span className={`font-medium ${open ? 'text-accent' : 'text-ink'}`}>{q}</span>
        <span
          data-anatomy="2"
          aria-hidden="true"
          className={`text-ink-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          style={{ transitionDuration: 'calc(200ms * var(--demo-speed, 1))' }}
        >
          ⌄
        </span>
      </button>
      <div
        id={`acc-panel-${i}`}
        data-anatomy="3"
        className={`grid transition-[grid-template-rows] ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        style={{ transitionDuration: 'calc(220ms * var(--demo-speed, 1))' }}
      >
        <div className="overflow-hidden">
          <p className={`px-3.5 text-[11px] leading-relaxed text-ink-2 ${bordered ? 'pb-3' : 'pb-2.5'}`}>{a}</p>
        </div>
      </div>
      {!bordered && !isLast && <div data-anatomy="4" aria-hidden="true" className="border-b border-line" />}
    </div>
  );
}

function AccordionList({ exclusive = true, bordered = false }: { exclusive?: boolean; bordered?: boolean }) {
  const [openId, setOpenId] = useState<number | null>(0);
  const [openSet, setOpenSet] = useState<Set<number>>(new Set([0]));

  const toggle = (i: number) => {
    if (exclusive) setOpenId((cur) => (cur === i ? null : i));
    else
      setOpenSet((s) => {
        const next = new Set(s);
        if (next.has(i)) next.delete(i);
        else next.add(i);
        return next;
      });
  };

  const isOpen = (i: number) => (exclusive ? openId === i : openSet.has(i));

  return (
    <div className="w-full max-w-sm">
      <div className={bordered ? 'space-y-2' : ''}>
        {FAQ.map((item, i) => (
          <Section
            key={item.q}
            i={i}
            q={item.q}
            a={item.a}
            bordered={bordered}
            isLast={i === FAQ.length - 1}
            open={isOpen(i)}
            onToggle={() => toggle(i)}
          />
        ))}
      </div>
    </div>
  );
}

const AccordionDemo: DemoComponent = ({ mode }) => {
  if (mode === 'variants') {
    return (
      <div className="mx-auto flex max-w-md flex-col gap-4">
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-wider text-ink-3">单开 Single（互斥）</p>
          <AccordionList exclusive bordered={false} />
        </div>
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-wider text-ink-3">多开 Multiple + 卡片式 Bordered</p>
          <AccordionList exclusive={false} bordered />
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-center">
      <AccordionList exclusive bordered={false} />
    </div>
  );
};

export default AccordionDemo;
