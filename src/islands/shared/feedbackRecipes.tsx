import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { createTooltipInteraction, tooltipHasHoverPointer, tooltipIsVisible, updateTooltipInteraction, type TooltipAction } from '../../lib/tooltip-interaction';
import type { VariantDemoProps } from '../style-variants/types';
import { useSessionState } from '../style-variants/session';
import { RecipeFrame, recipe, recipeVariant, type RecipeStyleId } from './styleRecipe';
import { TooltipLayer } from './TooltipLayer';

type Props = VariantDemoProps & { style: RecipeStyleId };
export type FeedbackKind = 'alert' | 'bottom-sheet' | 'command-palette' | 'drawer' | 'dropdown' | 'fab' | 'lightbox' | 'modal' | 'popover' | 'progress-bar' | 'split-button' | 'toast' | 'tooltip';
const title: Record<FeedbackKind, [string, string]> = {
  alert: ['状态通知', 'Status notice'], 'bottom-sheet': ['底部操作面板', 'Bottom action sheet'], 'command-palette': ['命令面板', 'Command palette'], drawer: ['侧边设置抽屉', 'Settings drawer'], dropdown: ['操作下拉', 'Action dropdown'], fab: ['浮动操作', 'Floating action'], lightbox: ['画廊灯箱', 'Gallery lightbox'], modal: ['确认对话框', 'Confirmation dialog'], popover: ['关联信息浮层', 'Related information'], 'progress-bar': ['任务进度', 'Task progress'], 'split-button': ['组合操作按钮', 'Split action button'], toast: ['轻提示', 'Toast notification'], tooltip: ['辅助提示', 'Help tooltip'],
};
const text = (locale: 'zh' | 'en', values: [string, string]) => values[locale === 'zh' ? 0 : 1];
function Status({ children }: { children: React.ReactNode }) { return <p role="status" aria-atomic="true" className="min-h-10 text-xs leading-relaxed">{children}</p>; }

function AlertRecipe({ style, locale, session }: Props) {
  const r = recipe(style);
  const [state, setState] = useSessionState(session, 'alertState', 'failed');
  const [visible, setVisible] = useSessionState(session, 'alertVisible', true);
  return <RecipeFrame style={style} locale={locale} title={text(locale, title.alert)}>
    {visible && <div className={r.item} role="status"><h5 className="font-bold">{text(locale, state === 'failed' ? ['演示同步已暂停', 'Demo sync paused'] : ['本地重试演示完成', 'Local retry demonstration complete'])}</h5><p className="mt-2 text-sm">{text(locale, ['无需网络。重试只会更新此处的演示状态。', 'No network required. Retry only updates this demonstration.'])}</p></div>}
    <div className="flex flex-wrap gap-3"><button type="button" className={r.control} disabled={!visible || state === 'resolved'} onClick={() => setState('resolved')}>{text(locale, ['重试演示', 'Retry demo'])}</button><button type="button" className={r.secondary} onClick={() => setVisible(!visible)}>{text(locale, visible ? ['隐藏通知', 'Hide notice'] : ['显示通知', 'Show notice'])}</button><button type="button" className={r.secondary} onClick={() => { setState('failed'); setVisible(true); }}>{text(locale, ['重置', 'Reset'])}</button></div>
  </RecipeFrame>;
}

/** 只约束当前演示内部的对话框，不伪造页面其他区域已 inert。 */
function useInlineDialog(session: VariantDemoProps['session']) {
  const [open, setOpen] = useSessionState(session, 'open', false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>('button, input, select, [tabindex="0"]')?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);
  const close = () => { setOpen(false); trigger.current?.focus(); };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return; }
    if (event.key !== 'Tab') return;
    const nodes = Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input, select, [tabindex="0"]') ?? []);
    const first = nodes[0]; const last = nodes[nodes.length - 1];
    if (event.shiftKey && event.target === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && event.target === last) { event.preventDefault(); first?.focus(); }
  };
  return { open, setOpen, triggerRef: trigger, panelRef: panel, close, onKeyDown };
}

function DialogRecipe({ style, locale, session, kind }: Props & { kind: 'modal' | 'drawer' | 'bottom-sheet' }) {
  const r = recipe(style); const { open: isOpen, setOpen, triggerRef, panelRef, close, onKeyDown } = useInlineDialog(session); const id = useId();
  const [saved, setSaved] = useSessionState(session, 'dialogChoice', false);
  const [result, setResult] = useSessionState(session, 'dialogOutcome', 'idle');
  const open = () => { setResult('idle'); setOpen(true); };
  const cancel = () => { setResult('cancelled'); close(); };
  return <RecipeFrame style={style} locale={locale} title={text(locale, title[kind])}>
    <button type="button" ref={triggerRef} aria-expanded={isOpen} aria-controls={id} aria-haspopup="dialog" className={r.control} onClick={open}>{text(locale, ['打开演示', 'Open demo'])}</button>
    <div className={`relative flex min-h-52 border p-3 ${r.divider} ${kind === 'bottom-sheet' ? 'items-end' : kind === 'drawer' ? 'justify-end' : 'items-center justify-center'}`}>
      {!isOpen && <p className={`self-center text-sm ${r.muted}`}>{text(locale, ['打开后可确认或取消；Esc 也可关闭。', 'Open to confirm or cancel. Escape also closes.'])}</p>}
      {isOpen && <div ref={panelRef} id={id} role="dialog" aria-labelledby={`${id}-title`} onKeyDown={(event) => { if (event.key === 'Escape') { setResult('cancelled'); } onKeyDown(event); }} className={`min-w-0 ${r.item} ${kind === 'drawer' ? 'w-4/5' : 'w-full'}`}>
        <h5 id={`${id}-title`} className="text-lg font-bold">{text(locale, ['保存此演示选项？', 'Save this demo choice?'])}</h5><p className="my-3 text-xs leading-relaxed">{text(locale, ['确认只改变本地选项，取消保留上次结果。', 'Confirm changes the local choice; cancel preserves the previous result.'])}</p>
        <div className="flex flex-wrap gap-2"><button type="button" className={r.secondary} onClick={cancel}>{text(locale, ['取消', 'Cancel'])}</button><button type="button" className={r.control} onClick={() => { setSaved(true); setResult('confirmed'); close(); }}>{text(locale, ['确认演示', 'Confirm demo'])}</button></div>
      </div>}
    </div>
    <Status>{text(locale, result === 'cancelled' ? ['已取消，选项未修改。', 'Cancelled. Choice unchanged.'] : result === 'confirmed' ? ['已在本次演示中确认。', 'Confirmed in this demo.'] : ['尚未执行操作。', 'No action yet.'])} {text(locale, saved ? ['当前选项：已保存', 'Current choice: saved'] : ['当前选项：未保存', 'Current choice: unsaved'])}</Status>
    <button type="button" className={r.secondary} onClick={() => { setSaved(false); setResult('idle'); close(); }}>{text(locale, ['重置演示', 'Reset demo'])}</button>
  </RecipeFrame>;
}

function MenuRecipe({ style, locale, session, kind }: Props & { kind: 'dropdown' | 'split-button' | 'fab' }) {
  const r = recipe(style); const id = useId(); const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useSessionState(session, 'open', false);
  const [action, setAction] = useSessionState(session, 'menuAction', -1);
  const labels = locale === 'zh' ? ['新建草稿', '创建副本', '归档示例'] : ['New draft', 'Create copy', 'Archive example'];
  const close = () => { setOpen(false); trigger.current?.focus(); };
  const choose = (index: number) => { setAction(index); close(); };
  return <RecipeFrame style={style} locale={locale} title={text(locale, title[kind])}>
    <div className={kind === 'fab' ? `relative min-h-96 border p-3 ${r.divider}` : 'space-y-3'} onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); close(); } }}>
      <div className={`flex flex-wrap gap-1 ${kind === 'fab' ? 'absolute bottom-3 right-3 justify-end' : ''}`}>
        {kind === 'split-button' && <button type="button" className={r.control} onClick={() => choose(0)}>{labels[0]}</button>}
        <button ref={trigger} type="button" aria-expanded={open} aria-controls={id} aria-label={text(locale, ['展开演示操作', 'Expand demo actions'])} className={`${r.control} ${kind === 'fab' ? 'h-14 w-14 rounded-full text-2xl' : ''}`} onClick={() => setOpen(!open)}>{kind === 'fab' ? (open ? '×' : '+') : text(locale, ['更多操作 ▾', 'More actions ▾'])}</button>
      </div>
      {open && <div id={id} className={`mt-3 grid gap-2 ${r.item} ${kind === 'fab' ? 'absolute inset-x-3 bottom-20 max-h-64 overflow-y-auto' : ''}`} aria-label={text(locale, ['本地演示操作', 'Local demo actions'])}>{labels.map((label, index) => <button type="button" key={label} className={`${r.secondary} text-left`} onClick={() => choose(index)}>{label}</button>)}<button type="button" className={r.secondary} onClick={close}>{text(locale, ['取消', 'Cancel'])}</button></div>}
    </div>
    <Status>{action < 0 ? text(locale, ['请选择操作，未改变任何真实文件。', 'Choose an action. No real files are changed.']) : text(locale, ['本地演示已选择：', 'Selected in local demo: ']) + labels[action]}</Status>
    <button type="button" className={r.secondary} onClick={() => { setAction(-1); close(); }}>{text(locale, ['撤销演示操作', 'Undo demo action'])}</button>
  </RecipeFrame>;
}

function PaletteRecipe({ style, locale, session }: Props) {
  const r = recipe(style); const id = useId();
  const [query, setQuery] = useSessionState(session, 'commandQuery', '');
  const [active, setActive] = useSessionState(session, 'commandActive', 0);
  const [result, setResult] = useSessionState(session, 'commandResult', -1);
  const labels = locale === 'zh' ? ['新建草稿', '查看帮助', '切换布局'] : ['New draft', 'View help', 'Switch layout'];
  const hits = labels.map((label, index) => ({ label, index })).filter((item) => item.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  const selected = Math.min(active, Math.max(0, hits.length - 1));
  const run = (index: number) => { setResult(index); setQuery(''); setActive(0); };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setActive(hits.length ? (selected + (event.key === 'ArrowDown' ? 1 : hits.length - 1)) % hits.length : 0); }
    else if (event.key === 'Enter' && hits[selected]) { event.preventDefault(); run(hits[selected].index); }
    else if (event.key === 'Escape') { event.preventDefault(); setQuery(''); setActive(0); }
  };
  return <RecipeFrame style={style} locale={locale} title={text(locale, title['command-palette'])}>
    <label htmlFor={id} className="block text-sm font-semibold">{text(locale, ['搜索本地命令', 'Search local commands'])}</label>
    <input id={id} className={r.field} role="combobox" aria-autocomplete="list" aria-expanded={hits.length > 0} aria-controls={`${id}-list`} aria-activedescendant={hits[selected] ? `${id}-option-${hits[selected].index}` : undefined} value={query} onChange={(event) => { setQuery(event.target.value); setActive(0); }} onKeyDown={onKeyDown} />
    <div role="listbox" id={`${id}-list`} aria-label={text(locale, ['可用命令', 'Available commands'])} className="grid gap-2">{hits.map((item, index) => <button type="button" role="option" id={`${id}-option-${item.index}`} aria-selected={index === selected} tabIndex={-1} key={item.index} className={`${index === selected ? r.active : r.item} text-left`} onClick={() => run(item.index)}>{item.label}</button>)}</div>
    {!hits.length && <p className="text-sm">{text(locale, ['没有匹配命令，请修改搜索。', 'No matching commands. Change the search.'])}</p>}
    <Status>{result < 0 ? text(locale, ['用上下方向键和 Enter 选择；Esc 清空。', 'Use arrows and Enter to choose; Escape clears.']) : text(locale, ['已在本地演示：', 'Demonstrated locally: ']) + labels[result]}</Status>
    <button type="button" className={r.secondary} onClick={() => { setQuery(''); setActive(0); setResult(-1); }}>{text(locale, ['重置命令', 'Reset command'])}</button>
  </RecipeFrame>;
}

function LightboxRecipe({ style, locale, session }: Props) {
  const r = recipe(style); const id = useId(); const { open: isOpen, setOpen, triggerRef, panelRef, close, onKeyDown } = useInlineDialog(session);
  const [index, setIndex] = useSessionState(session, 'index', 0);
  const patterns = ['bg-gradient-to-br from-[#bf6148] to-[#ffe3a8]', 'bg-gradient-to-br from-[#386881] to-[#b1efc7]', 'bg-gradient-to-br from-[#775295] to-[#f4bbd8]'];
  const labels = locale === 'zh' ? ['日落色彩习作', '森林色彩习作', '暮色色彩习作'] : ['Sunset colour study', 'Forest colour study', 'Dusk colour study'];
  const change = (delta: number) => setIndex((index + delta + patterns.length) % patterns.length);
  return <RecipeFrame style={style} locale={locale} title={text(locale, title.lightbox)}>
    <button type="button" ref={triggerRef} className={r.control} aria-haspopup="dialog" aria-expanded={isOpen} aria-controls={id} onClick={() => setOpen(true)}>{text(locale, ['打开图像演示', 'Open image demo'])}</button>
    {isOpen && <div id={id} ref={panelRef} role="dialog" aria-labelledby={`${id}-caption`} className={r.item} onKeyDown={(event) => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); change(event.key === 'ArrowLeft' ? -1 : 1); } else onKeyDown(event); }}>
      <div className={`aspect-[4/3] border-4 border-white/70 ${patterns[index]}`} role="img" aria-label={labels[index]} /><h5 id={`${id}-caption`} className="my-3 text-sm font-bold">{labels[index]} · {index + 1}/3</h5>
      <div className="flex flex-wrap gap-2"><button type="button" className={r.secondary} onClick={() => change(-1)}>{text(locale, ['上一张', 'Previous'])}</button><button type="button" className={r.secondary} onClick={() => change(1)}>{text(locale, ['下一张', 'Next'])}</button><button type="button" className={r.control} onClick={close}>{text(locale, ['关闭', 'Close'])}</button></div>
    </div>}
  </RecipeFrame>;
}

function PopoverRecipe({ style, locale, session }: Props) {
  const r = recipe(style); const id = useId(); const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useSessionState(session, 'open', false);
  const close = () => { setOpen(false); trigger.current?.focus(); };
  return <RecipeFrame style={style} locale={locale} title={text(locale, title.popover)}><div onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); close(); } }}>
    <button type="button" ref={trigger} aria-expanded={open} aria-controls={id} className={r.control} onClick={() => setOpen(!open)}>{text(locale, ['查看图谱说明', 'View atlas information'])}</button>
    {open && <div id={id} role="region" aria-label={text(locale, ['图谱说明', 'Atlas information'])} className={`mt-3 ${r.item}`}><h5 className="font-semibold">{text(locale, ['参考与实现', 'Reference and implementation'])}</h5><p className="my-3 text-sm">{text(locale, ['这里展示关联说明，点击关闭或按 Esc 返回触发按钮。', 'This is contextual information. Close or press Escape to return to the trigger.'])}</p><button type="button" className={r.secondary} onClick={close}>{text(locale, ['关闭说明', 'Close information'])}</button></div>}
  </div></RecipeFrame>;
}

function ProgressRecipe({ style, locale, session }: Props) {
  const r = recipe(style); const [pct, setPct] = useSessionState(session, 'pct', 40);
  return <RecipeFrame style={style} locale={locale} title={text(locale, title['progress-bar'])}>
    <div className="flex items-center justify-between gap-3 text-sm"><span>{text(locale, ['本地演示进度', 'Local demo progress'])}</span><output>{pct}%</output></div>
    <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={text(locale, ['演示任务', 'Demo task'])} className={`overflow-hidden ${r.item} !p-1`}><div hidden={pct === 0} className={`h-6 !min-h-0 !min-w-0 !border-0 !p-0 ${r.active}`} style={{ width: `${pct}%`, minWidth: pct ? '0.5rem' : 0 }} /></div>
    <div className="flex flex-wrap gap-2"><button type="button" className={r.control} disabled={pct >= 100} onClick={() => setPct(Math.min(100, pct + 20))}>{text(locale, ['推进 20%', 'Advance 20%'])}</button><button type="button" className={r.secondary} disabled={pct <= 0} onClick={() => setPct(Math.max(0, pct - 20))}>{text(locale, ['退回 20%', 'Go back 20%'])}</button><button type="button" className={r.secondary} onClick={() => setPct(0)}>{text(locale, ['重置', 'Reset'])}</button></div>
    <Status>{text(locale, pct === 100 ? ['演示进度已完成，可以重置再试。', 'Demo progress complete. Reset to try again.'] : ['由按钮手动推进，没有后台任务。', 'Advanced manually with the controls. No background task.'])}</Status>
  </RecipeFrame>;
}

function ToastRecipe({ style, locale, session }: Props) {
  const r = recipe(style); const [visible, setVisible] = useSessionState(session, 'visible', false); const [undone, setUndone] = useSessionState(session, 'toastUndone', false);
  return <RecipeFrame style={style} locale={locale} title={text(locale, title.toast)}>
    <button type="button" className={r.control} onClick={() => { setUndone(false); setVisible(true); }}>{text(locale, ['触发轻提示', 'Show toast'])}</button>
    {visible && <div className={r.item}><p role="status" aria-atomic="true" className="text-sm font-semibold">{text(locale, undone ? ['已撤销本地演示操作。', 'Local demo action undone.'] : ['演示项目已归档，可以撤销。', 'Demo item archived. You can undo this.'])}</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" disabled={undone} className={r.secondary} onClick={() => setUndone(true)}>{text(locale, ['撤销', 'Undo'])}</button><button type="button" className={r.secondary} onClick={() => setVisible(false)}>{text(locale, ['关闭提示', 'Dismiss'])}</button></div></div>}
  </RecipeFrame>;
}

function TooltipRecipe({ style, locale }: Props) {
  const r = recipe(style); const id = useId(); const root = useRef<HTMLDivElement>(null); const trigger = useRef<HTMLButtonElement>(null);
  const [interaction, setInteraction] = useState(createTooltipInteraction);
  const update = useCallback((action: TooltipAction) => setInteraction((state) => updateTooltipInteraction(state, action)), []);
  const open = tooltipIsVisible(interaction);
  useEffect(() => {
    if (!interaction.dismissed || !interaction.hovered) return;
    // Esc 会移除当前悬停的提示节点，React 可能收不到它离开整个区域的事件。
    // 用后续真实指针位置补齐离开；焦点仍由 blur 结束，不能顺带解除 Esc 抑制。
    const onPointerMove = (event: PointerEvent) => {
      if (tooltipHasHoverPointer(event.pointerType) && event.target instanceof Node && !root.current?.contains(event.target)) update('pointer-leave');
    };
    document.addEventListener('pointermove', onPointerMove);
    return () => document.removeEventListener('pointermove', onPointerMove);
  }, [interaction.dismissed, interaction.hovered, update]);
  useEffect(() => {
    if (!open) return;
    // 悬停并不移动焦点，Esc 也要能在焦点位于别处时关闭当前提示。
    const onKeyDown = (event: globalThis.KeyboardEvent) => { if (event.key === 'Escape') update('dismiss'); };
    const onOutsidePointer = (event: PointerEvent) => { if (event.target instanceof Node && !root.current?.contains(event.target)) update('dismiss'); };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onOutsidePointer);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onOutsidePointer);
    };
  }, [open, update]);
  return <RecipeFrame style={style} locale={locale} title={text(locale, title.tooltip)}>
    <div ref={root} onPointerEnter={(event) => { if (tooltipHasHoverPointer(event.pointerType)) update('pointer-enter'); }} onPointerLeave={(event) => { if (tooltipHasHoverPointer(event.pointerType)) update('pointer-leave'); }} onPointerCancel={(event) => { if (tooltipHasHoverPointer(event.pointerType)) update('pointer-leave'); }} className="relative py-3">
      <button ref={trigger} type="button" className={r.control} aria-describedby={open ? id : undefined} onFocus={() => update('focus')} onBlur={() => update('blur')} onClick={() => update('activate')} onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); update('dismiss'); } }}>{text(locale, ['悬停、聚焦或点按提示', 'Hover, focus or tap for help'])}</button>
      {open && <TooltipLayer root={root} anchor={trigger} matchRootWidth><div role="tooltip" id={id} className={`text-sm ${r.item}`}>{text(locale, ['这条说明补充控件含义；再次点按或按 Esc 可以关闭。', 'This hint explains the control. Tap again or press Escape to dismiss.'])}</div></TooltipLayer>}
    </div>
  </RecipeFrame>;
}

export function feedbackVariant(kind: FeedbackKind, style: RecipeStyleId, note: { zh: string; en: string }) {
  return recipeVariant(style, function FeedbackDemo(props: VariantDemoProps) {
    const full = { ...props, style };
    switch (kind) {
      case 'alert': return <AlertRecipe {...full} />;
      case 'modal': case 'drawer': case 'bottom-sheet': return <DialogRecipe {...full} kind={kind} />;
      case 'dropdown': case 'split-button': case 'fab': return <MenuRecipe {...full} kind={kind} />;
      case 'command-palette': return <PaletteRecipe {...full} />;
      case 'lightbox': return <LightboxRecipe {...full} />;
      case 'popover': return <PopoverRecipe {...full} />;
      case 'progress-bar': return <ProgressRecipe {...full} />;
      case 'toast': return <ToastRecipe {...full} />;
      case 'tooltip': return <TooltipRecipe {...full} />;
    }
  }, note);
}
