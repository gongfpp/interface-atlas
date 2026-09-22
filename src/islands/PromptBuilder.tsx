import { useMemo, useState } from 'react';
import { useClipboard } from './shared/useClipboard';
import { track } from '@/lib/track';

interface StyleOption {
  id: string;
  name: string;
  guide: string;
}

interface Props {
  conceptName: string;
  agentPrompt: string;
  styles: StyleOption[];
  locale: 'zh' | 'en';
}

type Toggle = 'dark' | 'reducedMotion' | 'noDeps' | 'runChecks';

const LABELS: Record<Toggle, { zh: string; en: string }> = {
  dark: { zh: '支持深色模式', en: 'Dark mode support' },
  reducedMotion: { zh: '尊重 prefers-reduced-motion', en: 'Respect prefers-reduced-motion' },
  noDeps: { zh: '不新增依赖', en: 'No new dependencies' },
  runChecks: { zh: '完成后运行现有检查并列出修改文件', en: 'Run existing checks and list modified files' },
};

export default function PromptBuilder({ conceptName, agentPrompt, styles, locale }: Props) {
  const zh = locale === 'zh';
  const [styleId, setStyleId] = useState('');
  const [toggles, setToggles] = useState<Record<Toggle, boolean>>({
    dark: true,
    reducedMotion: true,
    noDeps: true,
    runChecks: true,
  });

  const text = useMemo(() => {
    const parts: string[] = [agentPrompt.trim()];
    const style = styles.find((s) => s.id === styleId);
    if (style) {
      parts.push('', zh ? `视觉风格：${style.name}` : `Visual style: ${style.name}`, style.guide.trim());
    }
    const active = (Object.keys(toggles) as Toggle[]).filter((k) => toggles[k]);
    if (active.length) {
      parts.push(
        '',
        zh ? '附加要求：' : 'Additional requirements:',
        ...active.map((k) => `- ${LABELS[k][locale]}`),
      );
    }
    return parts.join('\n');
  }, [agentPrompt, styles, styleId, toggles, zh, locale]);

  const { copy, copied, failed } = useClipboard(text, () => track('prompt-builder-copy', { concept: conceptName, style: styleId || 'none' }));

  return (
    <div className="rounded-xl border border-line bg-raised">
      <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
        <label className="text-xs text-ink-3" htmlFor="pb-style">
          {zh ? '风格' : 'Style'}
        </label>
        <select
          id="pb-style"
          value={styleId}
          onChange={(e) => setStyleId(e.target.value)}
          className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs text-ink outline-none focus:border-accent"
        >
          <option value="">{zh ? '不指定风格' : 'No style'}</option>
          {styles.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={copy}
          className="ml-auto rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-paper transition-opacity hover:opacity-85"
        >
          {copied ? '✓' : '⧉'} {copied ? (zh ? '已复制' : 'Copied') : zh ? '复制 Prompt' : 'Copy prompt'}
        </button>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 border-b border-line p-3">
        {(Object.keys(toggles) as Toggle[]).map((k) => (
          <label key={k} className="flex items-center gap-1.5 text-xs text-ink-2">
            <input
              type="checkbox"
              checked={toggles[k]}
              onChange={(e) => setToggles((prev) => ({ ...prev, [k]: e.target.checked }))}
              className="accent-accent"
            />
            {LABELS[k][locale]}
          </label>
        ))}
      </div>

      <p role="status" className="px-4 pt-2 text-xs text-accent">{failed ? (zh ? '无法访问剪贴板，请选中下方文本手动复制。' : 'Clipboard unavailable. Select the text below to copy manually.') : copied ? (zh ? '已复制，可粘贴到你的项目中。' : 'Copied. Paste it into your project.') : ''}</p>
      <pre className="max-h-72 overflow-auto whitespace-pre-wrap p-4 font-mono text-xs leading-relaxed text-ink-2">
        {text}
      </pre>
    </div>
  );
}
