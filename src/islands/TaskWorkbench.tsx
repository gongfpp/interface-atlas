import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import type { Locale } from '@/lib/i18n';
import { useClipboard } from './shared/useClipboard';

// SSR controls stay inert until React has attached their event handlers.
const subscribeReady = () => () => {};
const clientReady = () => true;
const serverReady = () => false;
const useReady = () => useSyncExternalStore(subscribeReady, clientReady, serverReady);

const words = (locale: Locale) => (zh: string, en: string) => locale === 'zh' ? zh : en;

export function TaskPrompt({ prompt, locale }: { prompt: string; locale: Locale }) {
  const ready = useReady();
  const l = words(locale);
  const { copy, copied, failed } = useClipboard(prompt, () => {});
  return <section className="task-prompt" aria-label={l('任务说明', 'Task brief')}>
    <h2>{l('把这条路径带到项目里', 'Bring this path into your project')}</h2>
    <p>{l('这是一份任务说明，包含精选组件与实现要求。复制后补充你的技术栈和真实数据。', 'This task brief includes the curated components and implementation requirements. Add your stack and real data after copying.')}</p>
    <details><summary>{l('查看完整说明', 'Read the complete brief')}</summary><pre>{prompt}</pre></details>
    <button className="task-primary" type="button" disabled={!ready} onClick={copy}>{copied ? l('已复制', 'Copied') : l('复制任务说明', 'Copy task brief')}</button>
    <p role="status">{failed ? l('复制失败，请展开说明并手动复制。', 'Copy failed. Expand the brief and copy it manually.') : copied ? l('任务说明已复制。', 'Task brief copied.') : ''}</p>
  </section>;
}

type UploadState = 'empty' | 'ready' | 'uploading' | 'error' | 'success';
function UploadFlow({ locale }: { locale: Locale }) {
  const ready = useReady();
  const l = words(locale);
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const [file, setFile] = useState('');
  const [state, setState] = useState<UploadState>('empty');
  const [progress, setProgress] = useState(0);
  const [fail, setFail] = useState(true);
  useEffect(() => () => clearInterval(timer.current), []);
  const select = (name: string) => { setFile(name); setState('ready'); setProgress(0); };
  const clear = () => { clearInterval(timer.current); setFile(''); setState('empty'); setProgress(0); if (input.current) input.current.value = ''; };
  const upload = () => {
    setState('uploading'); setProgress(0);
    let next = 0;
    timer.current = setInterval(() => {
      next += 20; setProgress(next);
      if (next >= 100) { clearInterval(timer.current); setState(fail ? 'error' : 'success'); setFail(false); }
    }, 160);
  };
  const statuses: Record<UploadState, string> = {
    empty: l('等待选择文件', 'Choose a file to begin'),
    ready: l('已选择文件，可以开始演示', 'File selected, ready to start'),
    uploading: l('正在模拟上传…', 'Simulating upload…'),
    error: l('模拟连接失败。文件仍保留，重试即可继续。', 'Simulated connection failure. Your file selection is retained; retry to continue.'),
    success: l('演示上传完成。文件没有传到服务器。', 'Demo upload complete. No file was sent to a server.'),
  };
  return <section className="task-flow" data-testid="upload-flow" aria-busy={!ready} aria-labelledby={`${id}-title`}>
    <div className="task-flow-heading"><span className="task-number">01</span><div><h3 id={`${id}-title`}>{l('文件上传', 'File upload')}</h3><p>{l('选择 → 上传中 → 失败 → 重试 → 完成 → 删除', 'Choose → upload → failure → retry → complete → remove')}</p></div></div>
    <p className="task-note">{l('本地状态演示：只读取文件名，不读取内容、不联网。也可以使用示例文件。', 'Local state demo: only the file name is read. No content is read or sent. You can also use a sample file.')}</p>
    <div className="task-file-box">
      <label htmlFor={`${id}-file`}>{l('选择文件', 'Choose file')}</label>
      <input ref={input} id={`${id}-file`} type="file" disabled={!ready || state === 'uploading'} onChange={e => { const chosen = e.target.files?.[0]; if (chosen) select(chosen.name); }} />
      <button type="button" disabled={!ready || state === 'uploading'} onClick={() => { if (input.current) input.current.value = ''; select('portfolio.pdf'); }}>{l('使用示例文件', 'Use sample file')}</button>
    </div>
    {file && <p className="task-file-name">{file}</p>}
    <label className="task-check"><input type="checkbox" checked={fail} disabled={!ready || state === 'uploading'} onChange={e => setFail(e.target.checked)} />{l('下一次上传模拟失败（一次）', 'Fail the next upload once')}</label>
    {state === 'uploading' && <progress value={progress} max={100} aria-label={l('上传进度', 'Upload progress')} />}
    <p role="status" className={state === 'error' ? 'task-error' : 'task-feedback'}>{ready ? statuses[state] : l('正在准备演示…', 'Preparing the demo…')}</p>
    <div className="task-actions">
      {(state === 'ready' || state === 'error') && <button className="task-primary" type="button" onClick={upload}>{state === 'error' ? l('重试上传', 'Retry upload') : l('开始上传', 'Start upload')}</button>}
      {state === 'uploading' && <button type="button" onClick={() => { clearInterval(timer.current); setState('ready'); setProgress(0); }}>{l('取消上传', 'Cancel upload')}</button>}
      {file && state !== 'uploading' && <button type="button" onClick={clear}>{state === 'success' ? l('删除文件', 'Remove file') : l('移除选择', 'Clear selection')}</button>}
    </div>
  </section>;
}

function ProfileFlow({ locale }: { locale: Locale }) {
  const ready = useReady();
  const l = words(locale);
  const id = useId();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const nameInput = useRef<HTMLInputElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const leaveDialog = useRef<HTMLDialogElement>(null);
  const leaveButton = useRef<HTMLButtonElement>(null);
  const reopenButton = useRef<HTMLButtonElement>(null);
  const [discarded, setDiscarded] = useState(false);
  const [saved, setSaved] = useState({ name: 'Lin', email: 'lin@example.com' });
  const [draft, setDraft] = useState(saved);
  const [state, setState] = useState<'editing' | 'saving' | 'error' | 'success' | 'left'>('editing');
  const [fail, setFail] = useState(true);
  const [errors, setErrors] = useState({ name: '', email: '' });
  const dirty = draft.name !== saved.name || draft.email !== saved.email;
  useEffect(() => { if (state === 'left') reopenButton.current?.focus(); }, [state]);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  const save = () => {
    const next = { name: draft.name.trim() ? '' : l('请填写姓名。', 'Enter a name.'), email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim()) ? '' : l('请填写有效邮箱，例如 lin@example.com。', 'Enter a valid email, such as lin@example.com.') };
    setErrors(next);
    if (next.name || next.email) { (next.name ? nameInput : emailInput).current?.focus(); return; }
    setState('saving');
    timer.current = setTimeout(() => { if (fail) { setState('error'); setFail(false); } else { setSaved(draft); setState('success'); } }, 800);
  };
  const dismiss = () => { leaveDialog.current?.close(); leaveButton.current?.focus(); };
  return <section className="task-flow" data-testid="profile-flow" aria-busy={!ready} aria-labelledby={`${id}-title`}>
    <div className="task-flow-heading"><span className="task-number">02</span><div><h3 id={`${id}-title`}>{l('编辑资料', 'Edit profile')}</h3><p>{l('填写 → 校验 → 保存中 → 失败 → 重试 → 完成', 'Edit → validate → save → failure → retry → complete')}</p></div></div>
    <p className="task-note">{l('资料只保留在本页内存，刷新会恢复初始值。修改后试试「离开编辑」；真正离开页面时由浏览器提示。', 'Values remain in this page’s memory and reset on refresh. Make a change and try “Leave editor”; the browser handles warnings when leaving the actual page.')}</p>
    {state === 'left' ? <div className="task-left"><p role="status">{discarded ? l('已离开编辑，未保存的修改已放弃。', 'Editor closed. Unsaved edits were discarded.') : l('已离开编辑，上次保存的内容仍保留在本页。', 'Editor closed. Previously saved values remain in this page.')}</p><button type="button" ref={reopenButton} onClick={() => { setState('editing'); requestAnimationFrame(() => nameInput.current?.focus()); }}>{l('重新编辑', 'Edit again')}</button></div> : <form noValidate onSubmit={e => { e.preventDefault(); save(); }}>
      <div className="task-field"><label htmlFor={`${id}-name`}>{l('姓名', 'Name')}</label><input id={`${id}-name`} ref={nameInput} autoComplete="off" value={draft.name} disabled={!ready || state === 'saving'} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${id}-name-error` : undefined} onChange={e => { setDraft({ ...draft, name: e.target.value }); setErrors({ ...errors, name: '' }); setState('editing'); }} />{errors.name && <p className="task-error" id={`${id}-name-error`}>{errors.name}</p>}</div>
      <div className="task-field"><label htmlFor={`${id}-email`}>{l('邮箱', 'Email')}</label><input id={`${id}-email`} ref={emailInput} type="email" autoComplete="off" value={draft.email} disabled={!ready || state === 'saving'} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? `${id}-email-error` : undefined} onChange={e => { setDraft({ ...draft, email: e.target.value }); setErrors({ ...errors, email: '' }); setState('editing'); }} />{errors.email && <p className="task-error" id={`${id}-email-error`}>{errors.email}</p>}</div>
      <label className="task-check"><input type="checkbox" checked={fail} disabled={!ready || state === 'saving'} onChange={e => setFail(e.target.checked)} />{l('下一次保存模拟失败（一次）', 'Fail the next save once')}</label>
      <p role="status" className={state === 'error' ? 'task-error' : 'task-feedback'}>{!ready ? l('正在准备演示…', 'Preparing the demo…') : state === 'saving' ? l('正在模拟保存…', 'Simulating save…') : state === 'error' ? l('模拟保存失败，内容已保留。可以再次保存。', 'Simulated save failed. Your edits are preserved; save again to retry.') : state === 'success' ? l('已在本页演示中保存。', 'Saved in this page’s demo.') : dirty ? l('有未保存的修改', 'You have unsaved changes') : l('修改字段，开始体验', 'Edit a field to begin')}</p>
      <div className="task-actions"><button type="submit" className="task-primary" disabled={!ready || state === 'saving' || !dirty}>{state === 'saving' ? l('保存中…', 'Saving…') : state === 'error' ? l('重试保存', 'Retry save') : l('保存资料', 'Save profile')}</button><button type="button" ref={leaveButton} disabled={!ready || state === 'saving'} onClick={() => { if (dirty) leaveDialog.current?.showModal(); else { setDiscarded(false); setState('left'); } }}>{l('离开编辑', 'Leave editor')}</button></div>
    </form>}
    <dialog ref={leaveDialog} className="task-dialog" aria-labelledby={`${id}-leave-title`} onCancel={() => leaveButton.current?.focus()}>
      <h3 id={`${id}-leave-title`}>{l('放弃未保存的修改？', 'Discard unsaved changes?')}</h3><p>{l('继续编辑可以保留刚才填写的内容。', 'Continue editing to keep what you entered.')}</p>
      <div className="task-actions"><button type="button" autoFocus onClick={dismiss}>{l('继续编辑', 'Keep editing')}</button><button type="button" onClick={() => { setDraft(saved); setErrors({ name: '', email: '' }); setDiscarded(true); setState('left'); leaveDialog.current?.close(); }}>{l('放弃修改并离开', 'Discard and leave')}</button></div>
    </dialog>
  </section>;
}

export function WorkflowLab({ locale }: { locale: Locale }) {
  const l = words(locale);
  return <section className="task-workflows" aria-labelledby="workflow-heading"><div className="task-section-heading"><p className="task-eyebrow">TRY THE WHOLE FLOW</p><h2 id="workflow-heading">{l('把一个流程完整走一遍', 'Try a complete workflow')}</h2><p>{l('默认第一次失败，第二次成功。你可以切换失败开关，观察组件如何协作。', 'The first attempt fails by default and the retry succeeds. Toggle the failure controls to see how the components work together.')}</p></div><div className="task-workflow-grid"><UploadFlow locale={locale} /><ProfileFlow locale={locale} /></div></section>;
}

export function ExplainedExamples({ locale }: { locale: Locale }) {
  const ready = useReady();
  const l = words(locale);
  const [factor, setFactor] = useState<'priority' | 'spacing'>('priority');
  return <section className="task-examples" aria-labelledby="examples-heading"><div className="task-section-heading"><p className="task-eyebrow">ONE CHANGE, CLEARER INTENT</p><h2 id="examples-heading">{l('一次只改变一个因素', 'Change one factor at a time')}</h2><p>{l('相同的内容，对照操作层级与分组间距。以下是视觉示意，不会提交资料。', 'Compare action hierarchy and spacing with identical content. These are visual specimens; they do not submit data.')}</p></div>
    <div className="task-actions" role="group" aria-label={l('对照因素', 'Comparison factor')}><button type="button" disabled={!ready} aria-pressed={factor === 'priority'} onClick={() => setFactor('priority')}>{l('按钮主次', 'Action hierarchy')}</button><button type="button" disabled={!ready} aria-pressed={factor === 'spacing'} onClick={() => setFactor('spacing')}>{l('分组间距', 'Grouping and spacing')}</button></div>
    <div className="task-example-grid">{[false, true].map(good => <figure key={String(good)}><figcaption><strong>{good ? l('调整后', 'After') : l('调整前', 'Before')}</strong><span>{factor === 'priority' ? good ? l('只突出当前主操作', 'Emphasize the primary action') : l('所有操作都抢注意力', 'Every action demands attention') : good ? l('组内紧凑，组间留白', 'Tight groups, generous separation') : l('字段之间的关系不清楚', 'Field relationships are unclear')}</span></figcaption>
      <div className={`task-specimen ${factor === 'spacing' ? good ? 'task-spacing-good' : 'task-spacing-bad' : ''}`}>
        <p className="task-specimen-title">{l('个人资料', 'Profile details')}</p>
        <div className="task-specimen-field"><span>{l('显示名称', 'Display name')}</span><div>Lin</div><small>{l('对团队成员可见', 'Visible to your team')}</small></div>
        <div className="task-specimen-field"><span>{l('联系邮箱', 'Contact email')}</span><div>lin@example.com</div><small>{l('用于接收重要通知', 'For important notifications')}</small></div>
        <div className="task-actions" aria-label={l('按钮外观示意', 'Button appearance specimen')}><span className="task-example-button task-filled">{l('保存资料', 'Save profile')}</span><span className={`task-example-button ${factor === 'priority' && !good ? 'task-filled' : ''}`}>{l('取消', 'Cancel')}</span></div>
      </div></figure>)}</div>
    <p className="task-example-reason" aria-live="polite">{factor === 'priority' ? l('变化位置：底部操作区。保留「保存资料」的实心填充，弱化「取消」；用户更容易判断下一步。这不意味着隐藏取消，也不适合把危险操作伪装成普通主操作。', 'Changed area: the action row. Keep a filled “Save profile” and reduce the emphasis of “Cancel” to clarify the next step. Keep cancellation visible, and distinguish destructive actions from ordinary primary actions.') : l('变化位置：字段与帮助文字之间、两个字段组之间。让标签、输入和说明靠近，让不同字段之间拉开距离。信息密度较高时可以缩小间距，但仍需保持这种关系。', 'Changed area: between each field and its help, and between field groups. Keep related parts close and separate different groups. Dense interfaces can use smaller gaps while preserving that relationship.')}</p>
  </section>;
}
