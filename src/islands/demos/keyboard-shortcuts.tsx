import { useEffect, useRef, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Variant = 'tooltip-hints' | 'shortcuts-dialog' | 'vim-sequences';

function ShortcutsPlayground({ en, variant }: { en: boolean; variant: Variant }) {
  const [log, setLog] = useState(en ? 'Press a key or click a button.' : '按快捷键或点击按钮。');
  const [dialog, setDialog] = useState(false);
  const [seq, setSeq] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const fire = (msg: string) => setLog(msg);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing =
        t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (typing) return;

      if (e.key === 'Escape' && dialog) {
        setDialog(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setDialog(true);
        return;
      }
      if (variant === 'vim-sequences') {
        if (e.key === 'g' || e.key === 'd') {
          setSeq((s) => (s + e.key).slice(-2));
          return;
        }
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        fire(en ? '⌘K — command palette' : '⌘K — 打开命令面板');
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        fire(en ? '⌘S — saved' : '⌘S — 已保存');
      } else if (e.key === 'g' && !e.metaKey && !e.ctrlKey) {
        fire(en ? 'G — go to dashboard' : 'G — 跳到仪表盘');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dialog, en, variant]);

  useEffect(() => {
    if (variant !== 'vim-sequences') return;
    if (seq === 'gg') {
      fire(en ? 'gg — jump to top' : 'gg — 跳到顶部');
      setSeq('');
    } else if (seq === 'dd') {
      fire(en ? 'dd — delete line' : 'dd — 删除本行');
      setSeq('');
    }
  }, [seq, variant, en]);

  useEffect(() => {
    if (dialog) dialogRef.current?.focus();
  }, [dialog]);

  const kbd = (label: string) => (
    <kbd
      data-anatomy="1"
      className="ml-1 rounded border border-line bg-code-bg px-1 py-0.5 font-mono text-[9px] text-ink-3"
    >
      {label}
    </kbd>
  );

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-line bg-paper p-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => fire(en ? 'Saved via click' : '通过点击保存')}
          data-anatomy="4"
          className="rounded-lg border border-line bg-raised px-2.5 py-1.5 text-[11px] text-ink focus-visible:ring-2 focus-visible:ring-accent"
        >
          {en ? 'Save' : '保存'}
          {variant === 'tooltip-hints' && kbd('⌘S')}
        </button>
        <button
          onClick={() => fire(en ? 'Palette via click' : '通过点击打开面板')}
          className="rounded-lg border border-line bg-raised px-2.5 py-1.5 text-[11px] text-ink focus-visible:ring-2 focus-visible:ring-accent"
        >
          {en ? 'Palette' : '命令面板'}
          {variant === 'tooltip-hints' && kbd('⌘K')}
        </button>
        <button
          ref={triggerRef}
          data-anatomy="2"
          onClick={() => setDialog(true)}
          className="ml-auto rounded-lg bg-accent px-2.5 py-1.5 text-[11px] font-semibold text-white focus-visible:ring-2 focus-visible:ring-accent"
        >
          {en ? 'Shortcuts ?' : '快捷键 ?'}
        </button>
      </div>

      <input
        placeholder={en ? 'Typing here is safe — single-key bindings skip inputs' : '在这里打字不会触发单键绑定'}
        className="mt-3 w-full rounded-lg border border-line bg-raised px-2.5 py-1.5 text-[11px] text-ink outline-none placeholder:text-ink-3 focus-visible:ring-2 focus-visible:ring-accent"
      />

      <p className="mt-3 min-h-8 rounded-lg bg-code-bg px-3 py-2 font-mono text-[10px] text-ink-2">
        {variant === 'vim-sequences' && seq ? `seq: ${seq}… · ` : ''}
        {log}
      </p>

      {dialog && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 p-4">
          <div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={en ? 'Keyboard shortcuts' : '快捷键'}
            data-anatomy="3"
            className="w-full max-w-xs rounded-xl border border-line bg-raised p-4 outline-none"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold text-ink">{en ? 'Keyboard shortcuts' : '快捷键'}</p>
              <button onClick={() => setDialog(false)} className="text-[10px] text-ink-3" aria-label={en ? 'Close' : '关闭'}>
                ✕
              </button>
            </div>
            <ul className="space-y-1.5 text-[11px] text-ink-2">
              {(variant === 'vim-sequences'
                ? [
                    ['gg', en ? 'Jump to top' : '跳到顶部'],
                    ['dd', en ? 'Delete line' : '删除本行'],
                    ['?', en ? 'This dialog' : '本对话框'],
                  ]
                : [
                    ['⌘K', en ? 'Command palette' : '命令面板'],
                    ['⌘S', en ? 'Save' : '保存'],
                    ['G', en ? 'Go to dashboard' : '跳到仪表盘'],
                    ['?', en ? 'This dialog' : '本对话框'],
                  ]
              ).map(([keys, label]) => (
                <li key={keys} className="flex items-center justify-between">
                  <span>{label}</span>
                  <kbd className="rounded border border-line bg-code-bg px-1.5 py-0.5 font-mono text-[10px]">{keys}</kbd>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[9px] text-ink-3">
              {en ? 'Focus returns to the trigger on Esc' : 'Esc 关闭并把焦点还给触发按钮'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function VariantSheet({ en }: { en: boolean }) {
  const items: Array<[Variant, string, string]> = [
    ['tooltip-hints', '工具条标注', 'Tooltip hints'],
    ['shortcuts-dialog', '快捷键对话框', 'Shortcuts dialog'],
    ['vim-sequences', 'vim 式序列', 'Vim-style sequences'],
  ];
  return (
    <div className="mx-auto grid max-w-xl grid-cols-1 gap-3 text-sm sm:grid-cols-3">
      {items.map(([id, zh, english]) => (
        <div key={id} className="rounded-xl border border-line bg-paper p-3">
          <p className="text-xs font-semibold text-ink">{en ? english : zh}</p>
          <p className="mt-1 text-[10px] text-ink-3">{id}</p>
          <div className="mt-2 flex flex-wrap gap-1 rounded-lg bg-code-bg p-2">
            {(id === 'vim-sequences' ? ['g', 'g', 'd', 'd'] : ['⌘K', '⌘S', '?']).map((k) => (
              <kbd key={k} className="rounded border border-line bg-raised px-1.5 py-0.5 font-mono text-[10px] text-ink-2">
                {k}
              </kbd>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const KeyboardShortcutsDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <VariantSheet en={en} />;
  return <ShortcutsPlayground en={en} variant="tooltip-hints" />;
};

export default KeyboardShortcutsDemo;
