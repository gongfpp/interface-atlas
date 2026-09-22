import { useState } from 'react';
import { useClipboard } from './shared/useClipboard';
import { beacon, track } from '@/lib/track';

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
  beacon('/api/log-prompt', { concept, layer });
}

export default function PromptBlock({ prompts, locale, conceptName }: Props) {
  const layers = Object.keys(LAYER_LABEL) as Layer[];
  const [layer, setLayer] = useState<Layer>('agent');
  const text = prompts[layer]?.[locale] ?? '';

  const { copy, copied, failed } = useClipboard(text, () => logCopy(layer, conceptName));

  return (
    <div className="rounded-xl border border-line bg-raised">
      <div className="flex flex-wrap gap-1 border-b border-line p-2">
        {layers.map((l) => (
          <button
            key={l}
            aria-pressed={layer === l}
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
      <p role="status" className="px-4 pt-2 text-xs text-accent">{failed ? (locale === 'zh' ? '无法访问剪贴板，请选中下方文本手动复制。' : 'Clipboard unavailable. Select the text below to copy manually.') : copied ? (locale === 'zh' ? '已复制，可粘贴到你的项目中。' : 'Copied. Paste it into your project.') : ''}</p>
      <pre className="overflow-x-auto whitespace-pre-wrap p-4 font-mono text-[13px] leading-relaxed text-ink-2">
        {text}
      </pre>
      <p className="border-t border-line px-4 py-2 text-[11px] text-ink-3">{LAYER_LABEL[layer].hint[locale]}</p>
    </div>
  );
}
