import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const NAV = [
  { group: '概览', items: ['仪表盘', '分析报表', '活动日志'] },
  { group: '管理', items: ['成员', '项目', '账单'] },
  { group: '系统', items: ['设置', '集成'] },
];

const SidebarDemo: DemoComponent = ({ mode }) => {
  const [collapsed, setCollapsed] = useState(mode === 'variants');
  const [active, setActive] = useState('仪表盘');

  return (
    <div className="flex h-72 overflow-hidden rounded-xl border border-line bg-paper text-sm">
      <aside
        className={`flex shrink-0 flex-col border-r border-line bg-raised transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-52'
        }`}
        data-anatomy="1"
      >
        <div className="flex h-11 items-center gap-2 border-b border-line px-4">
          <span className="h-5 w-5 shrink-0 rounded bg-accent" />
          {!collapsed && <span className="truncate font-serif font-semibold">Acme 后台</span>}
        </div>
        <nav className="flex-1 overflow-y-auto p-2" data-anatomy="3">
          {NAV.map(({ group, items }) => (
            <div key={group} className="mb-2">
              {!collapsed && (
                <p className="px-2 pb-1 pt-2 text-[10px] uppercase tracking-wider text-ink-3">{group}</p>
              )}
              {items.map((item) => (
                <button
                  key={item}
                  onClick={() => setActive(item)}
                  aria-current={active === item ? 'page' : undefined}
                  className={`flex w-full items-center rounded-lg px-2 py-1.5 text-left transition-colors ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    active === item
                      ? 'border-l-2 border-accent bg-accent-soft text-accent'
                      : 'text-ink-2 hover:bg-code-bg'
                  }`}
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                  {!collapsed && <span className="ml-2 truncate">{item}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div data-anatomy="4" className="flex items-center gap-2 border-t border-line p-2">
          <span className="h-7 w-7 shrink-0 rounded-full bg-ink-3/30" />
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-xs font-medium">Rin</p>
              <p className="truncate text-[10px] text-ink-3">管理员</p>
            </div>
          )}
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <div className="flex h-11 items-center border-b border-line px-4">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="rounded-md border border-line px-2 py-0.5 text-xs text-ink-2 hover:border-accent hover:text-accent"
          >
            {collapsed ? '»' : '«'} 折叠
          </button>
          <span className="ml-3 text-xs text-ink-3">{active}</span>
        </div>
        <div className="grid flex-1 grid-cols-3 gap-3 p-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-lg border border-line bg-raised p-3">
              <div className="mb-2 h-2 w-2/3 rounded bg-ink-3/25" />
              <div className="h-6 w-1/2 rounded bg-ink-3/15" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarDemo;
