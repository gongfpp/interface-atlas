import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const inputCls =
  'w-full rounded-md border border-line bg-code-bg px-2.5 py-1.5 text-xs outline-none placeholder:text-ink-3 focus:border-accent';

function ExcerptPanel() {
  const [expanded, setExpanded] = useState(false);
  const items = ['标题与封面规范', '作者与版权信息', '发布时间与定时', expanded ? '标签与分类' : '', expanded ? '评论开关' : '', expanded ? 'SEO 摘要' : ''].filter(
    Boolean,
  );
  return (
    <div className="rounded-lg border border-line bg-raised p-3">
      <div className="mb-1 text-xs font-medium">摘要 + 显示更多 · Excerpt</div>
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it} className="text-[11px] text-ink-2">
            · {it}
          </li>
        ))}
      </ul>
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="mt-2 text-[10px] text-accent underline-offset-2 hover:underline"
      >
        {expanded ? '收起 · Show less' : '显示全部 6 条 · Show all 6'}
      </button>
    </div>
  );
}

function StepwisePanel() {
  const [step, setStep] = useState(0);
  const steps = [
    { title: '1 · 基础信息', body: '填写名称与简介，这一步只有两个字段。' },
    { title: '2 · 可见范围', body: '选择公开或私密，其余高级设置下一步再处理。' },
    { title: '3 · 确认创建', body: '检查摘要信息，点击创建即完成。' },
  ];
  const cur = steps[step];
  return (
    <div className="rounded-lg border border-line bg-raised p-3">
      <div className="mb-1 text-xs font-medium">分步呈现 · Stepwise</div>
      <div className="mb-2 flex gap-1">
        {steps.map((_, i) => (
          <span key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-accent' : 'bg-line'}`} />
        ))}
      </div>
      <div className="text-[11px] font-medium">{cur.title}</div>
      <p className="mt-0.5 text-[10px] text-ink-2">{cur.body}</p>
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-md border border-line px-2 py-0.5 text-[10px] text-ink-2 disabled:opacity-40"
        >
          上一步
        </button>
        <button
          onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
          className="rounded-md bg-accent px-2 py-0.5 text-[10px] text-white disabled:opacity-40"
        >
          下一步
        </button>
      </div>
    </div>
  );
}

const ProgressiveDisclosureDemo: DemoComponent = ({ mode }) => {
  const [open, setOpen] = useState(false);

  if (mode === 'variants') {
    return (
      <div className="grid gap-4 text-left md:grid-cols-2">
        <ExcerptPanel />
        <StepwisePanel />
      </div>
    );
  }

  return (
    <div data-anatomy="1" className="mx-auto w-full max-w-sm rounded-lg border border-line bg-raised p-4">
      <div className="mb-3 text-xs font-medium">新建文章 · New post</div>
      <div className="space-y-2.5">
        <input aria-label="标题" placeholder="标题" className={inputCls} />
        <textarea aria-label="正文" placeholder="正文…" rows={2} className={`${inputCls} resize-none`} />
        <button
          data-anatomy="2"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="flex items-center gap-1.5 text-xs text-accent"
        >
          <span aria-hidden="true" className={`inline-block transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>
            ▸
          </span>
          高级选项 · Advanced options
        </button>
        <div data-anatomy="3" className={open ? 'space-y-2.5 border-t border-line pt-2.5' : 'hidden'}>
          <input aria-label="标签" placeholder="标签（逗号分隔）" className={inputCls} />
          <div className="flex items-center gap-2 text-[11px] text-ink-2">
            <span className="text-ink-3">可见范围</span>
            <label className="flex items-center gap-1">
              <input type="radio" name="ptr-visibility" defaultChecked /> 公开
            </label>
            <label className="flex items-center gap-1">
              <input type="radio" name="ptr-visibility" /> 仅自己
            </label>
          </div>
        </div>
        <button className="w-full rounded-md bg-accent py-1.5 text-xs text-white transition-opacity hover:opacity-90">
          发布 · Publish
        </button>
      </div>
    </div>
  );
};

export default ProgressiveDisclosureDemo;
