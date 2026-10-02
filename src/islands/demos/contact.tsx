import { usePreviewVariant } from '@/islands/shared/previewVariant';
import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

/* 页面结构缩略示意图（wireframe）：色块 + 真实标签 */

const VARIANTS = [
  { id: 'form', zh: '表单为主', en: 'Form-first' },
  { id: 'split', zh: '左右分栏', en: 'Split' },
  { id: 'support', zh: '支持中心式', en: 'Support Hub' },
] as const;

type VariantId = (typeof VARIANTS)[number]['id'];

export const previewVariants = { ids: VARIANTS.map((v) => v.id), default: 'form' };

const METHODS = [
  { icon: '✉', zh: 'hi@acme.com', en: 'hi@acme.com' },
  { icon: '☎', zh: '400-000-0000', en: '+1 400 000 0000' },
  { icon: '⌂', zh: '上海市静安区', en: 'Jing’an, Shanghai' },
];

const FAQS = [
  { zh: '多久能收到回复？', en: 'How fast is the reply?', aZh: '工作日 1 个工作日内。', aEn: 'Within one business day.' },
  { zh: '支持商务合作吗？', en: 'Do you take partnerships?', aZh: '可以，请在留言中说明。', aEn: 'Yes, mention it in your message.' },
];

const SCOPE_STYLE =
  '[data-demo-scope] [class*="transition"] { transition-duration: calc(150ms * var(--demo-speed, 1)); }';

function Form({ en, short = false }: { en: boolean; short?: boolean }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = en ? 'Required' : '必填';
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = en ? 'Invalid email' : '邮箱格式不正确';
    if (!short && !msg.trim()) next.msg = en ? 'Required' : '必填';
    setErrors(next);
    if (Object.keys(next).length === 0) setDone(true);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 rounded-md border border-accent/40 bg-accent-soft p-3 text-center">
        <span className="text-[12px] text-accent">✓</span>
        <p className="text-[9px] font-medium text-accent">{en ? 'Message sent' : '消息已发送'}</p>
        <button onClick={() => setDone(false)} className="text-[8px] text-accent underline">
          {en ? 'Send another' : '再发一条'}
        </button>
      </div>
    );
  }

  const field = (key: string, value: string, set: (v: string) => void, placeholder: string, label: string) => (
    <div>
      <label className="block text-[8px] text-ink-3" htmlFor={`contact-${key}`}>{label}</label>
      <input
        id={`contact-${key}`}
        aria-label={label}
        value={value}
        onChange={(e) => set(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded border bg-paper px-1.5 py-1 text-[9px] outline-none placeholder:text-ink-3 focus:border-accent ${
          errors[key] ? 'border-rose-400' : 'border-line'
        }`}
      />
      {errors[key] && <p className="text-[8px] text-rose-500">{errors[key]}</p>}
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-1.5">
      {field('name', name, setName, en ? 'Your name' : '你的名字', en ? 'Name' : '姓名')}
      {field('email', email, setEmail, 'you@email.com', en ? 'Email' : '邮箱')}
      {!short && field('msg', msg, setMsg, en ? 'How can we help?' : '我们能帮什么？', en ? 'Message' : '留言')}
      <button type="submit" className="w-full rounded bg-accent py-1 text-[10px] font-medium text-white transition-opacity hover:opacity-90">
        {en ? 'Send message' : '发送消息'}
      </button>
    </form>
  );
}

function Faq({ en }: { en: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-1">
      {FAQS.map((f, i) => (
        <div key={f.en} className="rounded border border-line bg-raised">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between px-1.5 py-1 text-[9px] font-medium"
          >
            {en ? f.en : f.zh}
            <span className="text-ink-3">{open === i ? '−' : '+'}</span>
          </button>
          {open === i && <p className="px-1.5 pb-1 text-[8px] text-ink-2">{en ? f.aEn : f.aZh}</p>}
        </div>
      ))}
    </div>
  );
}

function Wireframe({ variant, en }: { variant: VariantId; en: boolean }) {
  const methods = (
    <div className={variant === 'split' ? 'space-y-1' : 'grid grid-cols-3 gap-1.5'}>
      {METHODS.map((m) => (
        <div key={m.en} className="flex items-center gap-1 rounded border border-line bg-raised px-1.5 py-1">
          <span className="text-[10px] text-accent">{m.icon}</span>
          <span className="truncate text-[8px] text-ink-2">{en ? m.en : m.zh}</span>
        </div>
      ))}
    </div>
  );

  const map = (
    <div className="relative h-9 overflow-hidden rounded border border-line bg-ink-3/10">
      <div className="absolute left-1/3 top-1/2 h-px w-2/3 -translate-y-1/2 rotate-12 bg-ink-3/30" />
      <span className="absolute bottom-0.5 right-1 text-[8px] text-ink-3">{en ? 'Map' : '地图'}</span>
      <span className="absolute left-1 top-1 h-2 w-2 rounded-full bg-accent" />
    </div>
  );

  return (
    <div className="flex h-80 w-full flex-col overflow-hidden rounded-lg border border-line bg-paper text-left text-xs">
      <header className="flex h-7 shrink-0 items-center gap-3 border-b border-line bg-raised px-3" data-anatomy="1">
        <span className="h-3 w-3 rounded bg-accent" />
        <span className="font-serif text-[10px] font-semibold">{en ? 'Contact' : '联系我们'}</span>
        <div className="ml-1 flex gap-2">
          {[en ? 'Product' : '产品', en ? 'Pricing' : '价格', en ? 'Support' : '支持'].map((t) => (
            <span key={t} className="text-[9px] text-ink-2">{t}</span>
          ))}
        </div>
      </header>

      <div className="shrink-0 px-3 pt-2" data-anatomy="2">
        <p className="font-serif text-[11px] font-semibold">{en ? 'Talk to us' : '和我们聊聊'}</p>
        <p className="text-[8px] text-ink-3">{en ? 'We reply within one business day.' : '工作日 1 个工作日内回复。'}</p>
      </div>

      {variant === 'split' ? (
        <div className="flex min-h-0 flex-1 gap-3 px-3 pt-2">
          <div className="w-24 shrink-0 space-y-1.5">
            <div data-anatomy="4">{methods}</div>
            <div data-anatomy="5">{map}</div>
          </div>
          <div className="flex-1" data-anatomy="3">
            <Form en={en} />
          </div>
        </div>
      ) : variant === 'support' ? (
        <div className="flex min-h-0 flex-1 flex-col gap-1.5 px-3 pt-2">
          <div data-anatomy="4">
            <div className="grid grid-cols-3 gap-1.5">
              {[en ? 'Chat' : '在线客服', en ? 'Email' : '邮件', en ? 'Docs' : '文档'].map((c) => (
                <div key={c} className="rounded border border-line bg-raised py-1 text-center text-[8px] text-ink-2">{c}</div>
              ))}
            </div>
          </div>
          <div data-anatomy="3"><Form en={en} short /></div>
          <div data-anatomy="5">{map}</div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-1.5 px-3 pt-2">
          <div data-anatomy="3" className="flex-1"><Form en={en} /></div>
          <div data-anatomy="4">{methods}</div>
          <div data-anatomy="5">{map}</div>
        </div>
      )}

      <div className="shrink-0 border-t border-line px-3 py-1.5" data-anatomy="6">
        <Faq en={en} />
      </div>
    </div>
  );
}

const ContactDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  const [variant, setVariant] = usePreviewVariant<VariantId>('form');

  if (mode === 'variants') {
    return (
      <div data-demo-scope className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        <style>{SCOPE_STYLE}</style>
        {VARIANTS.map((v) => (
          <div key={v.id} className="relative overflow-hidden rounded-lg border border-line" style={{ height: 164 }}>
            <div className="absolute left-0 top-0 w-[200%] origin-top-left scale-50">
              <Wireframe variant={v.id} en={en} />
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
    <div data-demo-scope className="mx-auto flex max-w-md flex-col gap-3">
      <style>{SCOPE_STYLE}</style>
      <div className="flex flex-wrap gap-2">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            aria-pressed={variant === v.id}
            onClick={() => setVariant(v.id)}
            className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
              variant === v.id ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:border-accent'
            }`}
          >
            {en ? v.en : v.zh}
          </button>
        ))}
      </div>
      <Wireframe key={`${variant}-${locale}`} variant={variant} en={en} />
      <p className="text-center text-[11px] text-ink-3">
        {en ? 'Submit the form empty to see validation, or open an FAQ' : '空表单提交可看校验，点 FAQ 可展开'}
      </p>
    </div>
  );
};

export default ContactDemo;
