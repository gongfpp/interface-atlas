import type { DemoComponent } from '@/islands/DemoStage';
import { useEffect, useRef, useState } from 'react';

const TOOLS = ['新建', '复制', '移动', '归档'] as const;
const TOOLS_EN = ['New', 'Copy', 'Move', 'Archive'] as const;
const MENU = ['重命名', '复制链接', '移到「草稿」', '删除'] as const;
const MENU_EN = ['Rename', 'Copy link', 'Move to Drafts', 'Delete'] as const;

const KeyboardNavigationDemo: DemoComponent = ({ mode, locale = 'zh' }) => {
  const en = locale === 'en';
  const tools = en ? TOOLS_EN : TOOLS;
  const items = en ? MENU_EN : MENU;
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [menuActive, setMenuActive] = useState(0);
  const [log, setLog] = useState(en ? 'Focus the toolbar with Tab.' : '用 Tab 进入工具栏。');
  const toolRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const menuRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (open) menuRefs.current[menuActive]?.focus();
  }, [open, menuActive]);

  const note = (zh: string, enMsg: string) => setLog(en ? enMsg : zh);

  const onToolKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const delta = e.key === 'ArrowRight' ? 1 : -1;
      const next = (active + delta + tools.length) % tools.length;
      setActive(next);
      toolRefs.current[next]?.focus();
      note(`方向键漫游 → ${tools[next]}`, `Arrow roving → ${tools[next]}`);
      return;
    }
    if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      const next = e.key === 'Home' ? 0 : tools.length - 1;
      setActive(next);
      toolRefs.current[next]?.focus();
      return;
    }
    if (e.key === 'Escape' && open) {
      e.preventDefault();
      closeMenu();
    }
  };

  const closeMenu = () => {
    setOpen(false);
    note('Escape 关闭菜单，焦点回到触发按钮', 'Escape closed the menu, focus returned to the trigger');
    triggerRef.current?.focus();
  };

  const onMenuKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const delta = e.key === 'ArrowDown' ? 1 : -1;
      const next = (menuActive + delta + items.length) % items.length;
      setMenuActive(next);
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      note('菜单内 Tab 不乱跑——先 Escape 再移动', 'Tab is trapped in the menu — Escape first, then move');
    }
  };

  if (mode === 'variants') {
    const rows: Array<[string, string]> = [
      [en ? 'Linear tab order' : '线性 Tab 序', en ? 'DOM order = focus order' : 'DOM 顺序即焦点顺序'],
      [en ? 'Roving tabindex' : '漫游 tabindex', en ? 'One tab stop, arrows roam' : '一个 Tab 站点，方向键漫游'],
      [en ? 'Escape dismiss' : 'Escape 归还焦点', en ? 'Close overlay, restore trigger' : '关闭浮层，焦点回触发器'],
    ];
    return (
      <div className="mx-auto flex w-full max-w-sm flex-col gap-2">
        {rows.map(([title, body], i) => (
          <div key={title} className="rounded-xl border border-line bg-raised px-3 py-2.5">
            <p className="text-xs font-medium text-ink">
              <span className="mr-2 text-[10px] text-accent">0{i + 1}</span>
              {title}
            </p>
            <p className="mt-1 pl-6 text-[11px] text-ink-2">{body}</p>
          </div>
        ))}
        <p className="text-[11px] leading-relaxed text-ink-3">
          {en
            ? 'Page-level controls use tab order; inside a composite, switch to arrows.'
            : '页面级控件走 Tab 序；进入复合组件后改用方向键。'}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
      <div
        data-anatomy="1"
        role="toolbar"
        aria-label={en ? 'File actions' : '文件操作'}
        aria-orientation="horizontal"
        className="flex items-center gap-1 rounded-xl border border-line bg-raised p-1.5"
        onKeyDown={onToolKey}
      >
        {tools.map((tool, i) => (
          <button
            key={tool}
            ref={(el) => {
              toolRefs.current[i] = el;
            }}
            tabIndex={i === active ? 0 : -1}
            onClick={() => {
              setActive(i);
              note(`点击 ${tool}`, `Clicked ${tool}`);
            }}
            className={`flex-1 rounded-lg px-2 py-2 text-[11px] transition-colors ${
              i === active ? 'bg-code-bg text-ink shadow-[0_0_0_2px_var(--color-accent)]' : 'text-ink-2 hover:text-ink'
            }`}
          >
            {tool}
          </button>
        ))}
        <button
          ref={triggerRef}
          data-anatomy="2"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => {
            setOpen(!open);
            setMenuActive(0);
            note(open ? '菜单已关闭' : '菜单已打开，方向键选择', open ? 'Menu closed' : 'Menu open — arrows to pick');
          }}
          className="ml-1 rounded-lg border border-line bg-code-bg px-2.5 py-2 text-[11px] text-ink"
        >
          {en ? 'Actions ▾' : '操作 ▾'}
        </button>
      </div>

      <div className="relative min-h-40 rounded-xl border border-line bg-paper p-3">
        {open && (
          <div
            role="menu"
            aria-label={en ? 'File menu' : '文件菜单'}
            onKeyDown={onMenuKey}
            className="absolute right-3 top-3 z-10 w-36 overflow-hidden rounded-lg border border-line bg-raised shadow-lg"
          >
            {items.map((item, i) => (
              <button
                key={item}
                ref={(el) => {
                  menuRefs.current[i] = el;
                }}
                role="menuitem"
                tabIndex={-1}
                onMouseEnter={() => setMenuActive(i)}
                onClick={() => {
                  closeMenu();
                  note(`执行「${item}」`, `Ran “${item}”`);
                }}
                className={`block w-full px-3 py-2 text-left text-[11px] ${
                  i === menuActive ? 'bg-code-bg text-ink shadow-[inset_2px_0_0_var(--color-accent)]' : 'text-ink-2'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        )}
        <p className="text-[11px] leading-relaxed text-ink-2">
          {en
            ? 'Tab enters the toolbar as one stop. Arrows roam the buttons. Open the menu and Escape walks out.'
            : 'Tab 把工具栏当作一站进入。方向键在按钮间漫游。打开菜单后按 Escape 退出并归还焦点。'}
        </p>
      </div>

      <p data-anatomy="3" className="min-h-4 rounded-lg bg-code-bg px-3 py-2 text-[11px] text-ink-2">
        {log}
      </p>
    </div>
  );
};

export default KeyboardNavigationDemo;
