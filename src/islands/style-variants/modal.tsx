import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * 内嵌对话框行为：打开时把焦点移入，Tab 循环，Escape 关闭，关闭后焦点归还触发按钮。
 * 视觉被限制在演示容器内，因此不声明 aria-modal（页面其余部分并未 inert）。
 */
function useDialog(session: VariantDemoProps['session']) {
  const [open, setOpen] = useSessionState(session, 'open', false);
  const openerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const interacted = useRef(open);

  const openDialog = () => {
    openerRef.current = (document.activeElement as HTMLElement) ?? triggerRef.current;
    interacted.current = true;
    setOpen(true);
  };
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

function Overlay({
  children,
  onClose,
  dialogRef,
  labelledBy,
  className,
  cardClassName,
}: {
  children: ReactNode;
  onClose: () => void;
  dialogRef: React.RefObject<HTMLDivElement | null>;
  labelledBy: string;
  className: string;
  cardClassName: string;
}) {
  return (
    <div className={className} onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-labelledby={labelledBy}
        onClick={(e) => e.stopPropagation()}
        className={cardClassName}
      >
        {children}
      </div>
    </div>
  );
}

function Glass({ session }: VariantDemoProps) {
  const { open, openDialog, closeDialog, triggerRef, dialogRef } = useDialog(session);
  return (
    <div className="relative mx-auto flex min-h-[220px] w-full max-w-md items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#7c5cff] via-[#ff6ec7] to-[#5ad1ff] p-6 text-white">
      <button ref={triggerRef} type="button" onClick={openDialog} className="rounded-xl border border-white/40 bg-white/20 px-4 py-2 text-xs font-semibold backdrop-blur-md">Open dialog</button>
      {open && (
        <Overlay
          onClose={closeDialog}
          dialogRef={dialogRef}
          labelledBy="glass-modal-title"
          className="absolute inset-0 flex items-center justify-center bg-black/30 p-6 backdrop-blur-sm"
          cardClassName="w-full rounded-2xl border border-white/50 bg-white/25 p-5 backdrop-blur-xl"
        >
          <p id="glass-modal-title" className="text-sm font-semibold">Delete project?</p>
          <p className="mt-1 text-xs text-white/85">This action cannot be undone.</p>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={closeDialog} className="rounded-lg px-3 py-1.5 text-xs text-white/90 hover:bg-white/15">Cancel</button>
            <button type="button" onClick={closeDialog} className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#3a2f6b]">Delete</button>
          </div>
        </Overlay>
      )}
    </div>
  );
}

function Clay({ session }: VariantDemoProps) {
  const { open, openDialog, closeDialog, triggerRef, dialogRef } = useDialog(session);
  return (
    <div className="relative mx-auto flex min-h-[220px] w-full max-w-md items-center justify-center overflow-hidden rounded-[36px] bg-[#e8ecff] p-6">
      <button ref={triggerRef} type="button" onClick={openDialog} className="rounded-2xl bg-[#b8c0ff] px-4 py-2 text-xs font-bold text-[#4b3f8f] shadow-[6px_6px_14px_#c5c9e0,-6px_-6px_14px_#ffffff]">Open</button>
      {open && (
        <Overlay
          onClose={closeDialog}
          dialogRef={dialogRef}
          labelledBy="clay-modal-title"
          className="absolute inset-0 flex items-center justify-center bg-[#c9cff0]/60 p-6"
          cardClassName="w-full rounded-[32px] bg-[#e8ecff] p-6 text-center shadow-[10px_10px_20px_#c5c9e0,-10px_-10px_20px_#ffffff]"
        >
          <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-[#ffb8d9] shadow-[inset_-4px_-4px_8px_#e58fbb,inset_4px_4px_8px_#ffd6e9]" />
          <p id="clay-modal-title" className="text-sm font-bold text-[#4b3f8f]">Save your changes?</p>
          <div className="mt-4 flex justify-center gap-3">
            <button type="button" onClick={closeDialog} className="rounded-2xl bg-[#c9cff0] px-4 py-2 text-xs font-bold text-[#4b3f8f] shadow-[4px_4px_10px_#b0b5d6,-4px_-4px_10px_#ffffff]">Later</button>
            <button type="button" onClick={closeDialog} className="rounded-2xl bg-[#b8c0ff] px-4 py-2 text-xs font-bold text-[#3a2f6b] shadow-[4px_4px_10px_#9aa2e0,-4px_-4px_10px_#ffffff]">Save</button>
          </div>
        </Overlay>
      )}
    </div>
  );
}

function Y2K({ session }: VariantDemoProps) {
  const { open, openDialog, closeDialog, triggerRef, dialogRef } = useDialog(session);
  return (
    <div className="relative mx-auto flex min-h-[220px] w-full max-w-md items-center justify-center overflow-hidden rounded-[28px] bg-gradient-to-br from-[#c7f0ff] to-[#ffd6f5] p-6">
      <button ref={triggerRef} type="button" onClick={openDialog} className="rounded-full border-2 border-white bg-gradient-to-b from-[#bfe9ff] to-[#6aa6ff] px-4 py-2 text-xs font-bold text-white shadow-[0_4px_0_#3d6fb8]">Open</button>
      {open && (
        <Overlay
          onClose={closeDialog}
          dialogRef={dialogRef}
          labelledBy="y2k-modal-title"
          className="absolute inset-0 flex items-center justify-center bg-[#6aa6ff]/25 p-6 backdrop-blur-[2px]"
          cardClassName="relative w-full overflow-hidden rounded-3xl border-2 border-white bg-gradient-to-b from-white/90 to-[#dcecff]/90 p-6 shadow-[0_10px_24px_rgba(70,110,190,.35)]"
        >
          <span className="pointer-events-none absolute -right-4 -top-4 h-14 w-14 rounded-full bg-gradient-to-br from-white to-[#bfe9ff] opacity-80" />
          <p id="y2k-modal-title" className="text-sm font-bold text-[#2b4b8f]">New message ✦</p>
          <p className="mt-1 text-xs text-[#5b76ad]">Chrome, gloss and sparkle.</p>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={closeDialog} className="rounded-full border border-[#9dbcf0] bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#3d6fb8]">Close</button>
            <button type="button" onClick={closeDialog} className="rounded-full bg-gradient-to-b from-[#ff9fe0] to-[#ff5cc8] px-3 py-1.5 text-xs font-bold text-white shadow-[0_3px_0_#c93a9a]">Send</button>
          </div>
        </Overlay>
      )}
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'glassmorphism',
    name: { zh: '玻璃拟态', en: 'Glassmorphism' },
    note: {
      zh: '居中磨砂玻璃卡片浮在彩色渐变上，遮罩自带模糊；打开移入焦点、Esc 关闭、关闭归还焦点。',
      en: 'A centred frosted card floats over a colourful gradient with a blurred scrim — focus moves in, Esc closes, focus returns.',
    },
    Demo: Glass,
  },
  {
    style: 'claymorphism',
    name: { zh: '黏土拟态', en: 'Claymorphism' },
    note: {
      zh: '大圆角奶油色卡片靠双向柔影鼓成黏土块，配一枚凹陷的粉色圆球图标。',
      en: 'A large-radius cream card puffs into clay via dual soft shadows, anchored by a sunken pink orb icon.',
    },
    Demo: Clay,
  },
  {
    style: 'y2k',
    name: { zh: '千禧风', en: 'Y2K' },
    note: {
      zh: '铬色渐变、白色高光泡与圆润大按钮，弹窗像 2000 年代的软件对话框一样有光泽。',
      en: 'Chrome gradients, glossy bubbles and pill buttons make the dialog gleam like early-2000s software.',
    },
    Demo: Y2K,
  },
];

export default styleVariants;
