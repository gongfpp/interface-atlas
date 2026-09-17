import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

interface Project {
  id: string;
  name: string;
  owner: string;
  status: string;
  desc: string;
  progress: number;
}

const PROJECTS: Project[] = [
  { id: 'site', name: '官网改版', owner: 'Rin', status: '进行中', desc: '首页视觉与文案重做，预计本周提测。', progress: 64 },
  { id: 'app', name: '移动端 2.0', owner: 'Mao', status: '设计中', desc: '重做信息架构与导航，新增离线缓存。', progress: 32 },
  { id: 'board', name: '数据看板', owner: 'Aki', status: '已上线', desc: '核心指标实时展示，支持自定义订阅。', progress: 100 },
  { id: 'api', name: '开放 API', owner: 'Ren', status: '规划中', desc: '对外暴露核心能力，先跑通鉴权与限流。', progress: 8 },
];

const STATUS_CLS: Record<string, string> = {
  进行中: 'bg-accent-soft text-accent',
  设计中: 'bg-code-bg text-ink-2',
  已上线: 'bg-accent-soft text-accent',
  规划中: 'bg-code-bg text-ink-3',
};

function Detail({ project, compact = false }: { project: Project; compact?: boolean }) {
  return (
    <div className={`flex flex-1 flex-col justify-center ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex items-center gap-2">
        <span className={`${compact ? 'text-xs' : 'text-sm'} font-medium`}>{project.name}</span>
        <span className={`rounded-full px-1.5 py-0.5 text-[9px] ${STATUS_CLS[project.status] ?? 'bg-code-bg text-ink-2'}`}>
          {project.status}
        </span>
      </div>
      <div className="mt-1 text-[10px] text-ink-3">负责人 · Owner：{project.owner}</div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-accent transition-all duration-300" style={{ width: `${project.progress}%` }} />
      </div>
      <p className="mt-2 text-[10px] leading-relaxed text-ink-2">{project.desc}</p>
    </div>
  );
}

function TwoPane({ height, compact = false }: { height: string; compact?: boolean }) {
  const [selected, setSelected] = useState(PROJECTS[0].id);
  const project = PROJECTS.find((p) => p.id === selected) ?? PROJECTS[0];
  return (
    <div className={`flex ${height} overflow-hidden rounded-lg border border-line bg-raised`}>
      <div
        data-anatomy="1"
        className={`overflow-y-auto border-r border-line ${compact ? 'w-28' : 'w-36'} shrink-0`}
        role="listbox"
        aria-label="项目列表"
      >
        {PROJECTS.map((p) => (
          <button
            key={p.id}
            role="option"
            aria-selected={p.id === selected}
            data-anatomy={p.id === selected ? '2' : undefined}
            onClick={() => setSelected(p.id)}
            className={`block w-full border-l-2 px-2.5 py-2 text-left transition-colors ${
              p.id === selected
                ? 'border-accent bg-accent-soft text-accent'
                : 'border-transparent text-ink-2 hover:bg-code-bg hover:text-ink'
            }`}
          >
            <div className={`${compact ? 'text-[10px]' : 'text-xs'} font-medium`}>{p.name}</div>
            <div className="text-[9px] opacity-80">{p.status}</div>
          </button>
        ))}
      </div>
      <div data-anatomy="3" className="flex-1 overflow-y-auto">
        <Detail project={project} compact={compact} />
      </div>
    </div>
  );
}

const MasterDetailDemo: DemoComponent = ({ mode }) => {
  if (mode === 'variants') {
    return (
      <div className="space-y-3 text-left">
        <TwoPane height="h-32" compact />
        <div className="rounded-lg border border-line bg-raised p-3">
          <div className="mb-2 text-[10px] font-medium text-ink-3">窄屏堆叠 · Stacked（列表在上，详情在下）</div>
          <StackedPane />
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto w-full max-w-md">
      <TwoPane height="h-56" />
    </div>
  );
};

function StackedPane() {
  const [selected, setSelected] = useState<string | null>(null);
  const project = PROJECTS.find((p) => p.id === selected);
  return (
    <div className="h-28 overflow-y-auto rounded border border-line/60">
      {project ? (
        <div>
          <button
            onClick={() => setSelected(null)}
            className="px-3 pt-2 text-[10px] text-accent underline-offset-2 hover:underline"
          >
            ← 返回列表 · Back
          </button>
          <Detail project={project} compact />
        </div>
      ) : (
        PROJECTS.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p.id)}
            className="block w-full border-b border-line/60 px-3 py-2 text-left text-xs text-ink-2 transition-colors last:border-b-0 hover:bg-code-bg hover:text-ink"
          >
            {p.name}
            <span className="float-right text-[9px] text-ink-3">{p.status}</span>
          </button>
        ))
      )}
    </div>
  );
}

export default MasterDetailDemo;
