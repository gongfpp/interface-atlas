import { useEffect, useId, useState, type ReactNode, type KeyboardEvent, type ButtonHTMLAttributes, type HTMLAttributes } from 'react';
import type { Locale } from '@/lib/i18n';
export type DemoProps = { locale: Locale };
// DOM lookup is only used by effects/events. No mutable refs are mixed into render state.
export const menuRoot = (id:string) => document.getElementById(`${id}-root`);
export function useMenu(initial = true) {
  const [open, setOpen] = useState(initial);
  const id = useId();
  const close = (restore = true) => { setOpen(false); if (restore) document.getElementById(`${id}-trigger`)?.focus(); };
  useEffect(() => {
    if (!open) return;
    const root = menuRoot(id);
    // Close after the clicked control runs: these in-flow demos must not move
    // the pointer target between pointerdown and click (including pagination).
    const outside = (event: MouseEvent) => { if (root && !event.composedPath().includes(root)) setOpen(false); };
    document.addEventListener('click', outside);
    const first = root?.querySelector<HTMLElement>('[role="menuitem"]:not([disabled]),[role="menuitemcheckbox"],[role="menuitemradio"],[role="option"]');
    if (first) first.tabIndex = 0;
    return () => document.removeEventListener('click', outside);
  }, [open,id]);
  const keyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return; }
    const target = event.target as HTMLElement;
    if (target.matches('input,textarea,select') && !['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    const scope=target.closest('[role="menu"],[role="listbox"]')??menuRoot(id);
    const items = [...(scope?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"]),[role="menuitemcheckbox"],[role="menuitemradio"],[role="option"]') ?? [])].filter(el => el.getClientRects().length && !el.hasAttribute('disabled'));
    if (!items.length || !['ArrowDown','ArrowUp','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const current = items.indexOf(target);
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : event.key === 'ArrowDown' ? (current + 1) % items.length : (current < 0 ? items.length - 1 : current - 1 + items.length) % items.length;
    items.forEach((item,i) => { item.tabIndex = i === index ? 0 : -1; });
    items[index]?.focus();
  };
  return { open, setOpen, id, close, keyDown };
}
export type MenuState = ReturnType<typeof useMenu>;
export function MenuRoot({ menu, children, className = '', ...props }: { menu: MenuState; children: ReactNode; className?: string } & Omit<HTMLAttributes<HTMLDivElement>, 'onKeyDown'>) {
  return <div {...props} id={`${menu.id}-root`} className={`mc-menu-root ${className}`} onKeyDown={menu.keyDown}>{children}</div>;
}
export function MenuTrigger({ menu, children, ...props }: { menu: MenuState; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} id={`${menu.id}-trigger`} type="button" className={`mc-trigger ${props.className ?? ''}`} aria-haspopup={props['aria-haspopup']??'menu'} aria-expanded={menu.open} aria-controls={menu.id} onClick={() => menu.setOpen(!menu.open)} onKeyDown={event => {
    if (['ArrowDown','ArrowUp'].includes(event.key)) {
      event.preventDefault(); event.stopPropagation(); menu.setOpen(true);
      const last=event.key==='ArrowUp';
      requestAnimationFrame(() => { const items=menuRoot(menu.id)?.querySelectorAll<HTMLElement>('[role^="menuitem"]:not([disabled]),[role="option"]'); const el=last?items?.[items.length-1]:items?.[0]; el?.focus(); });
    }
  }}>{children}<span aria-hidden="true">⌄</span></button>;
}
export function MenuPanel({ menu, children, label, className = '', role = 'menu' }: { menu: MenuState; children: ReactNode; label: string; className?: string; role?: 'menu'|'listbox'|'group' }) {
  return menu.open ? <div id={menu.id} className={`mc-panel ${className}`} role={role} aria-label={label}>{children}</div> : null;
}
export function Item({ children, selected, checked, kind = 'menuitem', ...props }: { children: ReactNode; selected?: boolean; checked?: boolean; kind?: 'menuitem'|'menuitemcheckbox'|'menuitemradio'|'option' } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} type="button" role={kind} tabIndex={-1} className={`mc-item ${props.className ?? ''}`} aria-selected={kind==='option'?Boolean(selected):undefined} aria-checked={kind==='menuitemcheckbox'||kind==='menuitemradio'?Boolean(checked):undefined} data-selected={selected||checked||undefined}>{children}{(selected||checked)&&<span aria-hidden="true">✓</span>}</button>;
}
export const Rule = () => <div className="mc-rule" role="separator" />;
export function Preview({ children, className = '', ...props }: { children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>) { return <div {...props} className={`mc-preview ${className}`}>{children}</div>; }
export const words = (locale: Locale, zh: string, en: string) => locale==='zh'?zh:en;
export const FILES = [{name:'组件说明.md',en:'Components.md',date:'09-01',size:48},{name:'交互规范.fig',en:'Interactions.fig',date:'09-11',size:320},{name:'界面草稿.fig',en:'Interface.fig',date:'09-08',size:128}];
