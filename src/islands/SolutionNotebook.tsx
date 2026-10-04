import { useState, useSyncExternalStore, type SyntheticEvent } from 'react';
import {
  exportSolutionsMarkdown, getServerSolutionsSnapshot, getSolutionsSnapshot,
  removeSolution, solutionsStorageAvailable, subscribeSolutions, updateSolution,
  type SavedSolution,
} from '@/lib/solutions';
import { solutionVariantLabel } from '@/lib/solution-variant';
import { localePath } from '@/lib/i18n';

const control = 'rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';
const input = 'w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

function SolutionCard({ item, locale, report }: { item: SavedSolution; locale: 'zh' | 'en'; report: (persisted: boolean, action: string) => void }) {
  const zh = locale === 'zh';
  const [editing, setEditing] = useState(false);
  function save(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    report(updateSolution(item.id, { group: String(data.get('group') ?? ''), note: String(data.get('note') ?? '') }), zh ? '方案已更新。' : 'Solution updated.');
    setEditing(false);
  }
  return (
    <article className="min-w-0 rounded-xl border border-line bg-raised p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words font-serif text-lg font-semibold">{item.name}</h3>
          {item.variantScope === 'requirement' && item.previewVariant && <p className="mt-1 text-xs text-ink-3">{zh ? '实际预览形式' : 'Actual preview variant'}：{item.previewVariantName || item.previewVariant}</p>}
          <p className="mt-1 break-words text-sm text-ink-2">{item.styleName} · {item.modeName || item.mode}{item.variant ? ` · ${solutionVariantLabel(item.variantScope, locale)}：${item.variantName || item.variant}` : ''}</p>
        </div>
        <button type="button" className={control} aria-label={`${zh ? '移除方案' : 'Remove solution'} ${item.name}`} onClick={() => report(removeSolution(item.id), zh ? '方案已移除。' : 'Solution removed.')}>{zh ? '移除' : 'Remove'}</button>
      </div>
      {item.requirements.length > 0 && <ul className="mt-3 flex flex-wrap gap-2" aria-label={zh ? '方案要求' : 'Requirements'}>{item.requirements.map((requirement, index) => <li key={`${requirement}-${index}`} className="rounded-md bg-paper px-2 py-1 text-xs text-ink-2">{requirement}</li>)}</ul>}
      {editing ? (
        <form onSubmit={save} className="mt-4 grid gap-3">
          <label className="grid gap-1 text-xs text-ink-2">{zh ? '项目分组' : 'Project group'}<input name="group" defaultValue={item.group} maxLength={120} placeholder={zh ? '例如：个人网站' : 'e.g. Personal website'} className={input} /></label>
          <label className="grid gap-1 text-xs text-ink-2">{zh ? '选择理由' : 'Why this solution'}<textarea name="note" defaultValue={item.note} maxLength={1000} rows={3} placeholder={zh ? '它将用于哪里，为什么适合？' : 'Where will you use it, and why?'} className={input} /></label>
          <div className="flex flex-wrap gap-2"><button type="submit" className={control}>{zh ? '保存修改' : 'Save changes'}</button><button type="button" className={control} onClick={() => setEditing(false)}>{zh ? '取消' : 'Cancel'}</button></div>
        </form>
      ) : (
        <>
          <p className="mt-4 break-words text-xs text-ink-3">{zh ? '项目' : 'Project'} · {item.group || (zh ? '未分组' : 'Ungrouped')}</p>
          {item.note && <p className="mt-2 whitespace-pre-wrap break-words text-sm text-ink-2">{item.note}</p>}
          <div className="mt-4 flex flex-wrap gap-2"><a className={`${control} border-accent text-accent`} href={item.url}>{zh ? '恢复方案' : 'Restore solution'} <span aria-hidden="true">↗</span></a><button type="button" className={control} onClick={() => setEditing(true)}>{zh ? '编辑分组与理由' : 'Edit group and note'}</button></div>
        </>
      )}
      <details className="mt-4 border-t border-line pt-3"><summary className="cursor-pointer text-xs text-ink-2">{zh ? '查看保存的任务说明' : 'View saved implementation brief'}</summary><pre className="mt-3 max-h-64 overflow-y-auto whitespace-pre-wrap break-words text-xs leading-relaxed text-ink-2">{item.prompt}</pre></details>
    </article>
  );
}

export default function SolutionNotebook({ locale }: { locale: 'zh' | 'en' }) {
  const zh = locale === 'zh';
  const solutions = useSyncExternalStore(subscribeSolutions, getSolutionsSnapshot, getServerSolutionsSnapshot);
  const available = useSyncExternalStore(subscribeSolutions, solutionsStorageAvailable, () => true);
  const [group, setGroup] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [manualCopy, setManualCopy] = useState('');
  const groups = [...new Set(solutions.map((item) => item.group))];
  const activeGroup = group !== null && groups.includes(group) ? group : null;
  const visible = activeGroup === null ? solutions : solutions.filter((item) => item.group === activeGroup);
  function report(persisted: boolean, action: string) {
    setMessage(persisted ? action : (zh ? '浏览器未能保存修改；当前页面仍可使用，请立即导出备份，刷新后可能丢失。' : 'The browser could not save this change. Export a backup now; reloading may lose it.'));
  }
  async function copy() {
    const markdown = exportSolutionsMarkdown(visible, locale);
    try {
      await navigator.clipboard.writeText(markdown);
      setManualCopy('');
      setMessage(zh ? '已复制 Markdown，包含配置、理由和完整任务说明。' : 'Markdown copied with configurations, notes, and implementation briefs.');
    } catch {
      setManualCopy(markdown);
      setMessage(zh ? '浏览器未允许复制。请从下面的文本框手动复制，或下载 Markdown。' : 'Clipboard access was unavailable. Copy the text below or download Markdown.');
    }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([exportSolutionsMarkdown(visible, locale)], { type: 'text/markdown;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'interface-atlas-notebook.md';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage(zh ? '已生成 Markdown 下载，包含当前显示的方案。' : 'Markdown download started for the solutions currently shown.');
  }
  return (
    <section aria-labelledby="solution-notebook-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h2 id="solution-notebook-title" className="font-serif text-xl font-semibold">{zh ? '项目参考册' : 'Project notebook'}{solutions.length > 0 && <span className="ml-2 text-sm font-normal text-ink-3">{solutions.length}</span>}</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-2">{zh ? '保留选中的风格、模式、形式与实现说明，再按项目整理。恢复配置时，已输入内容等临时演示状态不会保留。' : 'Keep selected styles, modes, variants, and implementation briefs, organized by project. Restoring a configuration does not restore temporary demo inputs or runtime state.'}</p></div>
        {solutions.length > 0 && <div className="flex flex-wrap gap-2"><button type="button" className={control} onClick={copy}>{zh ? '复制 Markdown' : 'Copy Markdown'}</button><button type="button" className={control} onClick={download}>{zh ? '下载 Markdown' : 'Download Markdown'}</button></div>}
      </div>
      {!available && <p role="alert" className="mt-4 rounded-lg border border-accent bg-raised p-3 text-sm">{zh ? '本地存储不可用，当前改动只在本次页面会话中保留。请下载 Markdown 备份。' : 'Local storage is unavailable. Changes only last for this page session. Download Markdown to keep a backup.'}</p>}
      <p role="status" className="mt-3 text-sm text-ink-2">{message}</p>
      {manualCopy && <label className="mt-3 grid gap-2 text-sm">{zh ? '手动复制 Markdown' : 'Copy Markdown manually'}<textarea readOnly value={manualCopy} rows={8} className={input} onFocus={(event) => event.currentTarget.select()} /></label>}
      {solutions.length === 0 ? <div className="mt-4 rounded-xl border border-dashed border-line p-6"><p className="text-sm leading-relaxed text-ink-2">{zh ? '在组件实验室选好效果，点击「使用当前方案」，再保存到参考册。每个方案都能写下用途和选择理由。' : 'Choose a preview in a component lab, use the current solution, then save it to your notebook. Add a project and a reason for each choice.'}</p><a href={localePath('/components', locale)} className="mt-3 inline-flex text-sm font-medium text-accent">{zh ? '去挑选一个方案 →' : 'Find a solution →'}</a></div> : <>
        <label className="mt-4 flex flex-wrap items-center gap-2 text-sm text-ink-2">{zh ? '项目分组' : 'Project group'}<select className={control} value={activeGroup === null ? 'all' : `group:${activeGroup}`} onChange={(event) => setGroup(event.target.value === 'all' ? null : event.target.value.slice(6))}><option value="all">{zh ? '全部项目' : 'All projects'} ({solutions.length})</option>{groups.map((name) => <option key={name} value={`group:${name}`}>{name || (zh ? '未分组' : 'Ungrouped')} ({solutions.filter((item) => item.group === name).length})</option>)}</select><span className="text-xs text-ink-3">{zh ? '复制与下载包含当前显示的方案' : 'Copy and download include the solutions shown'}</span></label>
        <div className="mt-4 grid gap-4 md:grid-cols-2">{visible.map((item) => <SolutionCard key={item.id} item={item} locale={locale} report={report} />)}</div>
      </>}
    </section>
  );
}
