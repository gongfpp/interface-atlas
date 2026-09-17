import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const LINKS = ['产品', '文档', '定价', '博客'];

function Brand() {
  return (
    <span data-anatomy="1" className="flex shrink-0 items-center gap-2">
      <span className="h-5 w-5 rounded bg-accent" />
      <span className="font-serif text-sm font-semibold">Acme</span>
    </span>
  );
}

function NavLinks({ active, onSelect, className = '' }: {
  active: string;
  onSelect: (v: string) => void;
  className?: string;
}) {
  return (
    <nav data-anatomy="2" className={`flex items-center gap-1 ${className}`} aria-label="主导航">
      {LINKS.map((link) => (
        <button
          key={link}
          onClick={() => onSelect(link)}
          aria-current={active === link ? 'page' : undefined}
          className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
            active === link ? 'bg-accent-soft text-accent' : 'text-ink-2 hover:text-ink'
          }`}
        >
          {link}
        </button>
      ))}
    </nav>
  );
}

function SearchAndUser() {
  return (
    <div className="ml-auto flex shrink-0 items-center gap-2">
      <input
        data-anatomy="3"
        placeholder="搜索…"
        aria-label="搜索"
        className="h-7 w-24 rounded-md border border-line bg-code-bg px-2 text-xs outline-none placeholder:text-ink-3 focus:border-accent"
      />
      <button
        data-anatomy="4"
        className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-3/30 text-[10px]"
        aria-label="用户菜单"
      >
        R
      </button>
    </div>
  );
}

/** 通用导航条：centered 时链接绝对居中 */
function NavBar({ centered = false }: { centered?: boolean }) {
  const [active, setActive] = useState('产品');
  return (
    <header className="relative flex h-11 items-center border-b border-line bg-raised px-3">
      <Brand />
      <NavLinks
        active={active}
        onSelect={setActive}
        className={centered ? 'absolute left-1/2 -translate-x-1/2' : 'ml-2'}
      />
      <SearchAndUser />
    </header>
  );
}

/** 默认形态：含汉堡菜单的标准导航 + 内容区 */
function StandardNav() {
  const [active, setActive] = useState('产品');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="mx-auto max-w-xl overflow-hidden rounded-xl border border-line bg-paper text-sm">
      <header className="border-b border-line bg-raised">
        <div className="flex h-11 items-center gap-3 px-3">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="打开菜单"
            aria-expanded={menuOpen}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-line text-xs text-ink-2 hover:border-accent hover:text-accent"
          >
            ☰
          </button>
          <Brand />
          <NavLinks active={active} onSelect={setActive} className="ml-2" />
          <SearchAndUser />
        </div>
        <div
          className="overflow-hidden border-line transition-all"
          style={{
            maxHeight: menuOpen ? '10rem' : '0rem',
            borderBottomWidth: menuOpen ? 1 : 0,
            transitionDuration: 'calc(200ms * var(--demo-speed, 1))',
          }}
        >
          <nav className="flex flex-col gap-0.5 p-2" aria-label="移动端导航">
            {LINKS.map((link) => (
              <button
                key={link}
                onClick={() => {
                  setActive(link);
                  setMenuOpen(false);
                }}
                aria-current={active === link ? 'page' : undefined}
                className={`rounded-md px-2 py-1.5 text-left text-xs ${
                  active === link ? 'bg-accent-soft text-accent' : 'text-ink-2'
                }`}
              >
                {link}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <div className="p-4">
        <p className="mb-3 text-xs text-ink-3">内容区 — 当前「{active}」</p>
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-lg border border-line bg-raised p-3">
              <div className="mb-2 h-2 w-2/3 rounded bg-ink-3/25" />
              <div className="h-5 w-1/2 rounded bg-ink-3/15" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** 透明悬浮形态：压在首屏内容上 */
function OverlayBar() {
  const [active, setActive] = useState('产品');
  return (
    <div className="relative h-24 overflow-hidden rounded-xl bg-code-bg">
      <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-ink/20 to-transparent p-3 pt-14">
        <p className="mb-2 h-2 w-1/3 rounded bg-ink-3/20" />
        <p className="h-2 w-2/3 rounded bg-ink-3/15" />
      </div>
      <header className="absolute inset-x-0 top-0 flex h-11 items-center px-3">
        <Brand />
        <NavLinks active={active} onSelect={setActive} className="ml-6" />
        <SearchAndUser />
      </header>
    </div>
  );
}

function VariantFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-[10px] uppercase tracking-wider text-ink-3">{label}</p>
      <div className="overflow-hidden rounded-xl border border-line bg-paper">{children}</div>
    </div>
  );
}

const NavbarDemo: DemoComponent = ({ mode }) => {
  if (mode === 'variants') {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-3 text-sm">
        <VariantFrame label="标准 Standard">
          <NavBar />
        </VariantFrame>
        <VariantFrame label="居中 Centered">
          <NavBar centered />
        </VariantFrame>
        <VariantFrame label="透明悬浮 Overlay">
          <OverlayBar />
        </VariantFrame>
      </div>
    );
  }
  return <StandardNav />;
};

export default NavbarDemo;
