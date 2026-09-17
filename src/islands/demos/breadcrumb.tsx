import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

interface Node {
  folders: string[];
  files: string[];
}

const TREE: Record<string, Node> = {
  首页: { folders: ['组件库', '设计原则'], files: ['README.md'] },
  组件库: { folders: ['导航组件', '表单组件'], files: ['CHANGELOG.md'] },
  设计原则: { folders: [], files: ['一致性.md', '层级.md'] },
  导航组件: { folders: [], files: ['面包屑.tsx', '标签页.tsx', '侧边栏.tsx'] },
  表单组件: { folders: [], files: ['输入框.tsx', '开关.tsx'] },
};

function Separator() {
  return (
    <span data-anatomy="3" className="px-1.5 text-ink-3" aria-hidden="true">
      /
    </span>
  );
}

function Breadcrumb({ path, onNavigate }: { path: string[]; onNavigate: (depth: number) => void }) {
  return (
    <nav aria-label="面包屑" className="flex flex-wrap items-center text-xs">
      {path.map((label, i) => {
        const isLast = i === path.length - 1;
        const isFirst = i === 0;
        return (
          <span key={label + i} className="flex items-center">
            {i > 0 && <Separator />}
            {isLast ? (
              <span data-anatomy="4" aria-current="page" className="font-medium text-ink">
                {label}
              </span>
            ) : (
              <button
                data-anatomy={isFirst ? '1' : '2'}
                onClick={() => onNavigate(i)}
                className="text-ink-2 transition-colors hover:text-accent"
              >
                {label}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}

function Explorer() {
  const [path, setPath] = useState<string[]>(['首页']);
  const current = path[path.length - 1];
  const node = TREE[current] ?? { folders: [], files: [] };

  return (
    <div className="mx-auto max-w-xl rounded-xl border border-line bg-paper p-4 text-sm">
      <Breadcrumb path={path} onNavigate={(depth) => setPath(path.slice(0, depth + 1))} />
      <h3 className="mb-3 mt-2 font-serif text-lg font-semibold">{current}</h3>
      <div className="max-h-36 overflow-y-auto rounded-lg border border-line bg-code-bg p-2">
        {node.folders.map((f) => (
          <button
            key={f}
            onClick={() => setPath([...path, f])}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-ink-2 transition-colors hover:bg-raised hover:text-accent"
          >
            <span aria-hidden="true">📁</span> {f}
          </button>
        ))}
        {node.files.map((f) => (
          <div key={f} className="flex items-center gap-2 px-2 py-1.5 text-xs text-ink-3">
            <span aria-hidden="true">📄</span> {f}
          </div>
        ))}
      </div>
      <p className="mt-2 text-[10px] text-ink-3">点击文件夹进入下级，点击面包屑返回任意上级 / Click folders to descend</p>
    </div>
  );
}

function TruncatedRow() {
  const [expanded, setExpanded] = useState(false);
  const middle = ['组件库', '导航组件'];
  return (
    <nav aria-label="面包屑（截断）" className="flex flex-wrap items-center text-xs">
      <button data-anatomy="1" className="text-ink-2 hover:text-accent">
        首页
      </button>
      <Separator />
      {expanded ? (
        middle.map((m) => (
          <span key={m} className="flex items-center">
            <button data-anatomy="2" className="text-ink-2 hover:text-accent">
              {m}
            </button>
            <Separator />
          </span>
        ))
      ) : (
        <>
          <button
            data-anatomy="2"
            onClick={() => setExpanded(true)}
            aria-label="展开中间层级"
            className="rounded px-1 font-mono text-ink-3 hover:bg-code-bg hover:text-accent"
          >
            …
          </button>
          <Separator />
        </>
      )}
      <span data-anatomy="4" aria-current="page" className="font-medium text-ink">
        面包屑
      </span>
    </nav>
  );
}

const BreadcrumbDemo: DemoComponent = ({ mode }) => {
  if (mode === 'variants') {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-2 text-sm">
        <div className="rounded-xl border border-line bg-paper p-3">
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-3">文字型 Text</p>
          <Breadcrumb path={['首页', '组件库', '导航组件', '面包屑']} onNavigate={() => {}} />
        </div>
        <div className="rounded-xl border border-line bg-paper p-3">
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-3">带图标 With icons</p>
          <Breadcrumb path={['⌂ 首页', '🗂 组件库', '面包屑']} onNavigate={() => {}} />
        </div>
        <div className="rounded-xl border border-line bg-paper p-3">
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-3">截断型 Truncated（点省略号展开）</p>
          <TruncatedRow />
        </div>
      </div>
    );
  }
  return <Explorer />;
};

export default BreadcrumbDemo;
