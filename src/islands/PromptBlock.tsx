import { useMemo, useState } from 'react';
import { useClipboard } from './shared/useClipboard';
import { beacon, track } from '@/lib/track';

type Layer = 'basic' | 'design' | 'implementation' | 'agent';

interface StyleOption {
  id: string;
  name: string;
  guide: string;
}

interface Props {
  prompts: Record<Layer, { zh: string; en: string }>;
  locale: 'zh' | 'en';
  conceptName: string;
  styles: StyleOption[];
}

const LAYER_LABEL: Record<Layer, { zh: string; en: string; hint: { zh: string; en: string } }> = {
  basic: { zh: '基础', en: 'Basic', hint: { zh: '描述设计是什么', en: 'What the design is' } },
  design: { zh: '视觉', en: 'Design', hint: { zh: '强调视觉要求', en: 'Visual requirements' } },
  implementation: { zh: '实现', en: 'Implementation', hint: { zh: '强调技术实现', en: 'Technical implementation' } },
  agent: { zh: 'Agent 任务', en: 'Agent task', hint: { zh: '可直接交给 Coding Agent，可叠加风格与附加要求', en: 'Hand to your coding agent — stack a style and extra requirements on top' } },
};

type Toggle = 'dark' | 'reducedMotion' | 'noDeps' | 'runChecks';

const TOGGLE_LABEL: Record<Toggle, { zh: string; en: string }> = {
  dark: { zh: '支持深色模式', en: 'Dark mode support' },
  reducedMotion: { zh: '尊重 prefers-reduced-motion', en: 'Respect prefers-reduced-motion' },
  noDeps: { zh: '不新增依赖', en: 'No new dependencies' },
  runChecks: { zh: '完成后运行现有检查并列出修改文件', en: 'Run existing checks and list modified files' },
};

export default function PromptBlock({ prompts, locale, conceptName, styles }: Props) {
  const zh = locale === 'zh';
  const layers = Object.keys(LAYER_LABEL) as Layer[];
  const [layer, setLayer] = useState<Layer>('agent');
  const [styleId, setStyleId] = useState('');
  const [toggles, setToggles] = useState<Record<Toggle, boolean>>({
    dark: true,
    reducedMotion: true,
    noDeps: true,
    runChecks: true,
  });

  // 只有 Agent 任务层会被风格与附加要求增强；其余三层是纯概念描述。
  const text = useMemo(() => {
    const base = prompts[layer]?.[locale] ?? '';
    if (layer !== 'agent') return base;
    const parts: string[] = [base.trim()];
    const style = styles.find((s) => s.id === styleId);
    if (style) {
      parts.push('', zh ? `视觉风格：${style.name}` : `Visual style: ${style.name}`, style.guide.trim());
    }
    const active = (Object.keys(toggles) as Toggle[]).filter((k) => toggles[k]);
    if (active.length) {
      parts.push('', zh ? '附加要求：' : 'Additional requirements:', ...active.map((k) => `- ${TOGGLE_LABEL[k][locale]}`));
    }
    return parts.join('\n');
  }, [prompts, layer, locale, styles, styleId, toggles, zh]);

  const { copy, copied, failed } = useClipboard(text, () => {
    track('prompt-copy', { concept: conceptName, layer, style: styleId || 'none' });
    beacon('/api/log-prompt', { concept: conceptName, layer });
  });

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
          {copied ? '✓' : '⧉'} {copied ? (zh ? '已复制' : 'Copied') : zh ? '复制 Prompt' : 'Copy prompt'}
        </button>
      </div>

      {layer === 'agent' && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line p-3">
          <label className="flex min-w-0 items-center gap-2 text-xs text-ink-3">
            {zh ? '风格' : 'Style'}
            <select
              value={styleId}
              onChange={(e) => setStyleId(e.target.value)}
              className="min-w-0 max-w-full rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs text-ink outline-none focus:border-accent"
            >
              <option value="">{zh ? '不指定风格' : 'No style'}</option>
              {styles.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {(Object.keys(toggles) as Toggle[]).map((k) => (
              <label key={k} className="flex items-center gap-1.5 text-xs text-ink-2">
                <input
                  type="checkbox"
                  checked={toggles[k]}
                  onChange={(e) => setToggles((prev) => ({ ...prev, [k]: e.target.checked }))}
                  className="accent-accent"
                />
                {TOGGLE_LABEL[k][locale]}
              </label>
            ))}
          </div>
        </div>
      )}

      <p role="status" className="px-4 pt-2 text-xs text-accent">
        {failed
          ? zh
            ? '无法访问剪贴板，请选中下方文本手动复制。'
            : 'Clipboard unavailable. Select the text below to copy manually.'
          : copied
            ? zh
              ? '已复制，可粘贴到你的项目中。'
              : 'Copied. Paste it into your project.'
            : ''}
      </p>
      <pre className="max-h-96 overflow-auto whitespace-pre-wrap p-4 font-mono text-[13px] leading-relaxed text-ink-2">
        {text}
      </pre>
      <p className="border-t border-line px-4 py-2 text-[11px] text-ink-3">{LAYER_LABEL[layer].hint[locale]}</p>
    </div>
  );
}
