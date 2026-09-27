import { useCallback, useEffect, useRef, type KeyboardEvent } from 'react';
import type { LabSession } from './types';
import { useSessionState } from './session';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * 共用的交互行为原语：把此前散落在各变体里的展开、对话框、标签页、排序、选择逻辑收敛到一处。
 * 变体只负责视觉，行为语义（键盘、焦点、aria）由这些原语提供；修复一次即全组件生效。
 */

/** 展开/关闭（drawer、popover、bottom-sheet、dropdown…）。 */
export function useDisclosure(session: LabSession, key = 'open', initial = false) {
  const [open, setOpen] = useSessionState(session, key, initial);
  const toggle = useCallback(() => setOpen((v: boolean) => !v), [setOpen]);
  return { open, setOpen, toggle };
}

/** 单选列表 / 标签页的 roving tabindex 与方向键导航。 */
export function useRovingTabs(session: LabSession, count: number, initial = 0, key = 'active') {
  const [active, setActive] = useSessionState(session, key, initial);
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const list = e.currentTarget;
    const tabs = Array.from(list.querySelectorAll<HTMLElement>('[role="tab"], [data-roving]'));
    const from = tabs.indexOf(document.activeElement as HTMLElement);
    const cur = from >= 0 ? from : active;
    let next: number;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (cur + 1) % count;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (cur - 1 + count) % count;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = count - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabs[next]?.focus();
  };
  const tabProps = (i: number) => ({
    role: 'tab' as const,
    tabIndex: active === i ? 0 : -1,
    'aria-selected': active === i,
    onClick: () => setActive(i),
  });
  const panelProps = (i: number) => ({ role: 'tabpanel' as const, hidden: active !== i, tabIndex: 0 });
  return { active, setActive, onKeyDown, tabProps, panelProps };
}

/** 数值排序：把展示值转成数字再排，避免字符串比较出错。 */
export function useSortable<T>(
  session: LabSession,
  rows: T[],
  valueOf: (row: T) => number,
  key = 'asc',
  initial = false,
) {
  const [asc, setAsc] = useSessionState(session, key, initial);
  const sorted = [...rows].sort((a, b) => (asc ? valueOf(a) - valueOf(b) : valueOf(b) - valueOf(a)));
  const toggle = useCallback(() => setAsc((v: boolean) => !v), [setAsc]);
  const headerProps = { 'aria-sort': (asc ? 'ascending' : 'descending') as 'ascending' | 'descending' };
  return { asc, sorted, toggle, headerProps };
}

/** 数组型选择（多选、筛选、已选集合）。 */
export function useSelectionList(session: LabSession, key = 'selected', initial: string[] = []) {
  const [selected, setSelected] = useSessionState<string[]>(session, key, initial);
  const toggle = useCallback(
    (id: string) => setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])),
    [setSelected],
  );
  const clear = useCallback(() => setSelected(() => []), [setSelected]);
  return { selected, setSelected, toggle, clear };
}

/**
 * 内嵌对话框行为：打开移入焦点、Tab 循环、Escape 关闭、关闭归还焦点。
 * 视觉限制在演示容器内，因此不声明 aria-modal（页面其余部分并未 inert）。
 */
export function useDialogBehavior(session: LabSession, key = 'open') {
  const [open, setOpen] = useSessionState(session, key, false);
  const openerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const interacted = useRef(open);

  const openDialog = useCallback(() => {
    openerRef.current = (document.activeElement as HTMLElement) ?? triggerRef.current;
    interacted.current = true;
    setOpen(true);
  }, [setOpen]);
  const closeDialog = useCallback(() => {
    setOpen(false);
    (openerRef.current ?? triggerRef.current)?.focus();
  }, [setOpen]);

  useEffect(() => {
    if (!open || !interacted.current) return;
    requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus());
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeDialog();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeDialog]);

  return { open, openDialog, closeDialog, triggerRef, dialogRef };
}
