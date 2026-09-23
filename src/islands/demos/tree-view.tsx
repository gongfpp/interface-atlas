import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

type Node = {
  id: string;
  zh: string;
  en: string;
  icon?: string;
  children?: Node[];
};

const TREE: Node = {
  id: 'root',
  zh: '界面图谱',
  en: 'Interface Atlas',
  children: [
    {
      id: 'content',
      zh: '内容',
      en: 'Content',
      children: [
        { id: 'components', zh: '组件', en: 'Components', icon: '◧' },
        { id: 'patterns', zh: '模式', en: 'Patterns', icon: '◨' },
        { id: 'styles', zh: '风格', en: 'Styles', icon: '◩' },
      ],
    },
    {
      id: 'src',
      zh: '源码',
      en: 'Source',
      children: [
        {
          id: 'islands',
          zh: 'islands',
          en: 'islands',
          icon: '▣',
          children: [
            { id: 'demos', zh: 'demos', en: 'demos', icon: '▤' },
            { id: 'shared', zh: 'shared', en: 'shared', icon: '▤' },
          ],
        },
        { id: 'pages', zh: 'pages', en: 'pages', icon: '▣' },
      ],
    },
    { id: 'readme', zh: 'README.md', en: 'README.md', icon: '≡' },
  ],
};

function TreeNode({
  node,
  depth,
  en,
  selected,
  onSelect,
  expandedSet,
  onToggle,
  multi,
  checked,
  onCheck,
}: {
  node: Node;
  depth: number;
  en: boolean;
  selected: string | null;
  onSelect: (id: string) => void;
  expandedSet: Set<string>;
  onToggle: (id: string) => void;
  multi: boolean;
  checked: Set<string>;
  onCheck: (id: string) => void;
}) {
  const hasChildren = !!node.children?.length;
  const open = expandedSet.has(node.id);
  const label = en ? node.en : node.zh;

  return (
    <li role="treeitem" aria-expanded={hasChildren ? open : undefined} aria-selected={selected === node.id}>
      <div
        data-anatomy="2"
        className={`flex items-center gap-1 rounded-md px-1 py-1 text-xs ${
          selected === node.id ? 'bg-accent-soft text-accent' : 'text-ink-2 hover:bg-code-bg'
        }`}
        style={{ paddingLeft: 4 + depth * 12 }}
      >
        {hasChildren ? (
          <button
            data-anatomy="3"
            type="button"
            aria-label={open ? (en ? 'Collapse' : '折叠') : en ? 'Expand' : '展开'}
            onClick={() => onToggle(node.id)}
            className="w-4 shrink-0 text-ink-3 transition-transform"
            style={{
              transform: open ? 'rotate(90deg)' : undefined,
              transitionDuration: 'calc(150ms * var(--demo-speed, 1))',
            }}
          >
            ▸
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}
        {multi ? (
          <input
            type="checkbox"
            checked={checked.has(node.id)}
            onChange={() => onCheck(node.id)}
            aria-label={label}
            className="mr-1 accent-[color:var(--color-accent,#0a0)]"
          />
        ) : null}
        {node.icon && <span aria-hidden="true" className="text-ink-3">{node.icon}</span>}
        <button type="button" onClick={() => onSelect(node.id)} className="truncate text-left">
          {label}
        </button>
      </div>
      {hasChildren && open && (
        <ul data-anatomy="4" role="group" className="border-l border-line/70 ml-3">
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              en={en}
              selected={selected}
              onSelect={onSelect}
              expandedSet={expandedSet}
              onToggle={onToggle}
              multi={multi}
              checked={checked}
              onCheck={onCheck}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function Tree({
  root,
  en,
  multi = false,
  fileIcons = true,
}: {
  root: Node;
  en: boolean;
  multi?: boolean;
  fileIcons?: boolean;
}) {
  const [expandedSet, setExpandedSet] = useState<Set<string>>(new Set(['root', 'content']));
  const [selected, setSelected] = useState<string | null>('components');
  const [checked, setChecked] = useState<Set<string>>(new Set(['components']));

  const onToggle = (id: string) =>
    setExpandedSet((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const onCheck = (id: string) =>
    setChecked((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const displayRoot = fileIcons ? root : { ...root, children: root.children?.map((c) => ({ ...c, icon: undefined, children: c.children?.map((g) => ({ ...g, icon: undefined })) })) };

  return (
    <ul
      data-anatomy="1"
      role="tree"
      aria-label={en ? 'Project tree' : '项目树'}
      aria-multiselectable={multi || undefined}
      className="w-full max-w-xs overflow-hidden rounded-lg border border-line bg-raised p-2"
    >
      <TreeNode
        node={displayRoot}
        depth={0}
        en={en}
        selected={selected}
        onSelect={setSelected}
        expandedSet={expandedSet}
        onToggle={onToggle}
        multi={multi}
        checked={checked}
        onCheck={onCheck}
      />
    </ul>
  );
}

const TreeViewDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  const [variant, setVariant] = useState<'single' | 'multi' | 'file'>('file');

  if (mode === 'variants') {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-3">
        <div className="flex gap-1.5">
          {(
            [
              ['single', en ? 'Single' : '单选'],
              ['multi', en ? 'Multi' : '多选'],
              ['file', en ? 'File tree' : '文件树'],
            ] as ['single' | 'multi' | 'file', string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={variant === id}
              onClick={() => setVariant(id)}
              className={`rounded-md border px-2 py-1 text-xs ${
                variant === id ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <Tree root={TREE} en={en} multi={variant === 'multi'} fileIcons={variant === 'file'} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-2 rounded-xl border border-line bg-paper p-3">
      <p className="text-xs font-medium text-ink-2">{en ? 'Project files' : '项目文件'}</p>
      <Tree root={TREE} en={en} fileIcons />
      <p className="text-[10px] text-ink-3">
        {en ? 'Expand branches; selection is independent of expand state' : '可展开分支；展开状态与选中状态相互独立'}
      </p>
    </div>
  );
};

export default TreeViewDemo;
