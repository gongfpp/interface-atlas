import { useState } from 'react';
import { track } from '@/lib/track';

type Layer = 'basic' | 'design' | 'implementation' | 'agent';

interface Props {
  prompts: Record<Layer, { zh: string; en: string }>;
  locale: 'zh' | 'en';
  conceptName: string;
}

const LAYER_LABEL: Record<Layer, { zh: string; en: string; hint: { zh: string; en: string } }> = {
  basic: { zh: '基础', en: 'Basic', hint: { zh: '描述设计是什么', en: 'What the design is' } },
  design: { zh: '视觉', en: 'Design', hint: { zh: '强调视觉要求', en: 'Visual requirements' } },
  implementation: { zh: '实现', en: 'Implementation', hint: { zh: '强调技术实现', en: 'Technical implementation' } },
  agent: { zh: 'Agent 任务', en: 'Agent task', hint: { zh: '可直接交给 Coding Agent', en: 'Hand to your coding agent' } },
};

function logCopy(layer: Layer, concept: string) {
  track('prompt-copy', { concept, layer });
  try {
    navigator.sendBeacon?.('/api/log-prompt', JSON.stringify({ concept, layer, t: Date.now() }));
  } catch { /* 埋点失败不影响复制 */ }
}

export default function PromptBlock({ prompts, locale, conceptName }: Props) {
  const layers = Object.keys(LAYER_LABEL) as Layer[];
  const [layer, setLayer] = useState<Layer>('agent');
  const [copied, setCopied] = useState(false);
  const text = prompts[layer]?.[locale] ?? '';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      logCopy(layer, conceptName);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* 剪贴板不可用 */ }
  };

  return (
    <div className="rounded-xl border border-line bg-raised">
      <div className="flex flex-wrap gap-1 border-b border-line p-2">
        {layers.map((l) => (
          <button
            key={l}
            onClick={() => setLayer(l)}
            className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
              layer === l ? 'bg-accent-soft text-accent' : 'text-ink-2 hover:bg-code-bg'
            }`}
            title={LAYER_LABEL[l].hint[locale]}
          >
            {LAYER_LABEL[l][locale]}
          </button>
        ))}
        <button
          onClick={copy}
          className="ml-auto rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-paper transition-opacity hover:opacity-85"
        >
          {copied ? '✓' : '⧉'} {copied ? (locale === 'zh' ? '已复制' : 'Copied') : locale === 'zh' ? '复制 Prompt' : 'Copy prompt'}
        </button>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap p-4 font-mono text-[13px] leading-relaxed text-ink-2">
        {text}
      </pre>
      <p className="border-t border-line px-4 py-2 text-[11px] text-ink-3">{LAYER_LABEL[layer].hint[locale]}</p>
    </div>
  );
}
