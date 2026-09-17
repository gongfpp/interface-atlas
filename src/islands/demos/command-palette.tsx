import { useMemo, useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

interface Command {
  group: string;
  label: string;
  hint?: string;
}

const COMMANDS: Command[] = [
  { group: '命令 / Commands', label: '新建文件', hint: '⌘N' },
  { group: '命令 / Commands', label: '保存全部', hint: '⌘S' },
  { group: '命令 / Commands', label: '切换主题' },
  { group: '页面 / Pages', label: '仪表盘 / Dashboard' },
  { group: '页面 / Pages', label: '设置 / Settings', hint: 'G S' },
  { group: '页面 / Pages', label: '项目列表 / Projects' },
  { group: '最近使用 / Recent', label: '部署记录 / Deploy log' },
  { group: '最近使用 / Recent', label: '团队成员 / Team' },
];

const CommandPaletteDemo: DemoComponent = ({ mode }) => {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return COMMANDS.filter((c) => !q || c.label.toLowerCase().includes(q));
  }, [query]);

  const groups = useMemo(() => {
    const map = new Map<string, Command[]>();
    filtered.forEach((c) => {
      if (!map.has(c.group)) map.set(c.group, []);
      map.get(c.group)!.push(c);
    });
    return [...map.entries()];
  }, [filtered]);

  return (
    <div className="mx-auto max-w-md">
      <div
        data-anatomy="1"
        className="overflow-hidden rounded-xl border border-line-strong bg-raised shadow-2xl"
        role="dialog"
        aria-label="Command palette demo"
      >
        <input
          data-anatomy="1"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
            if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
          }}
          placeholder="输入命令或搜索… / Type a command…"
          className="w-full border-b border-line bg-transparent px-4 py-3 text-sm outline-none placeholder:text-ink-3"
        />
        <div className="max-h-56 overflow-y-auto p-2" role="listbox" data-anatomy="2">
          {groups.length === 0 && (
            <p className="px-3 py-4 text-center text-xs text-ink-3">没有匹配结果 / No matches</p>
          )}
          {groups.map(([group, items]) => (
            <div key={group}>
              <p data-anatomy="2" className="px-2 pb-1 pt-2 text-[10px] uppercase tracking-wider text-ink-3">{group}</p>
              {items.map((c) => {
                const idx = filtered.indexOf(c);
                return (
                  <div
                    key={c.label}
                    role="option"
                    aria-selected={idx === active}
                    onMouseEnter={() => setActive(idx)}
                    className={`flex cursor-default items-center justify-between rounded-lg px-3 py-2 text-sm ${
                      idx === active ? 'bg-accent-soft text-accent' : ''
                    }`}
                  >
                    <span>{c.label}</span>
                    {c.hint && <kbd className="text-[10px] text-ink-3">{c.hint}</kbd>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div data-anatomy="3" className="flex gap-3 border-t border-line px-4 py-2 text-[10px] text-ink-3">
          <span>↑↓ 选择</span><span>↵ 执行</span><span>esc 关闭</span>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-ink-3">试试输入「设置」或「deploy」 / Try typing "settings"</p>
    </div>
  );
};

export default CommandPaletteDemo;
