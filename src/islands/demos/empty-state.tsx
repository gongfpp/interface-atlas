import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const INITIAL_PROJECTS = ['官网改版', '移动端 2.0', '数据看板'];

function FolderArt() {
  return (
    <svg
      width="44"
      height="36"
      viewBox="0 0 44 36"
      fill="none"
      aria-hidden="true"
      className="text-ink-3"
    >
      <path
        d="M2 8a3 3 0 0 1 3-3h10l4 5h20a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M15 21l4 4 8-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EmptyBody({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-center py-4 text-center">
      <div data-anatomy="1">
        <FolderArt />
      </div>
      <div data-anatomy="2" className="mt-2">
        <div className={`${compact ? 'text-[11px]' : 'text-xs'} font-medium`}>还没有项目 · No projects yet</div>
        <p className="mt-1 max-w-56 text-[10px] leading-relaxed text-ink-3">
          创建第一个项目，开始整理你的工作。创建后可以邀请协作者。
        </p>
      </div>
      <button
        data-anatomy="3"
        className="mt-3 rounded-md bg-accent px-3 py-1.5 text-[10px] text-white transition-opacity hover:opacity-90"
      >
        新建项目 · New project
      </button>
    </div>
  );
}

function NoResultsBody() {
  const [cleared, setCleared] = useState(false);
  if (cleared) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-6 text-center text-[10px] text-ink-2">
        已清除筛选，显示全部 24 条结果
        <button onClick={() => setCleared(false)} className="mt-2 text-accent underline-offset-2 hover:underline">
          恢复筛选 · Restore filters
        </button>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col items-center justify-center py-4 text-center">
      <div data-anatomy="1">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true" className="text-ink-3">
          <circle cx="17" cy="17" r="10" stroke="currentColor" strokeWidth="1.6" />
          <path d="M24.5 24.5 33 33" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M13 17h8M17 13v8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>
      <div data-anatomy="2" className="mt-2 text-xs font-medium">
        没有找到「readm」的匹配结果
      </div>
      <p className="mt-1 text-[10px] text-ink-3">试试更短的关键词，或清除筛选条件。</p>
      <button
        data-anatomy="3"
        onClick={() => setCleared(true)}
        className="mt-3 rounded-md border border-line px-3 py-1.5 text-[10px] text-ink-2 transition-colors hover:border-accent hover:text-accent"
      >
        清除筛选 · Clear filters
      </button>
    </div>
  );
}

const EmptyStateDemo: DemoComponent = ({ mode }) => {
  const [projects, setProjects] = useState<string[]>(INITIAL_PROJECTS);
  const empty = projects.length === 0;

  if (mode === 'variants') {
    return (
      <div className="grid gap-3 text-left md:grid-cols-3">
        <div className="h-44 rounded-lg border border-line bg-raised">
          <EmptyBody compact />
        </div>
        <div className="h-44 rounded-lg border border-line bg-raised">
          <NoResultsBody />
        </div>
        <div className="flex h-44 items-center justify-center rounded-lg border border-line bg-raised text-[10px] text-ink-3">
          暂无数据 · No data
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium">项目 · Projects</span>
        <button
          onClick={() => setProjects(empty ? INITIAL_PROJECTS : [])}
          className="text-[10px] text-ink-3 underline-offset-2 transition-colors hover:text-accent hover:underline"
        >
          {empty ? '恢复数据 · Restore' : '清空数据 · Clear'}
        </button>
      </div>
      <div className="h-56 rounded-lg border border-line bg-raised">
        {empty ? (
          <EmptyBody />
        ) : (
          <div className="h-full overflow-y-auto px-3">
            {projects.map((p) => (
              <div key={p} className="border-b border-line/60 py-2.5 text-xs last:border-b-0">
                {p}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyStateDemo;
