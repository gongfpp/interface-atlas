import { atlasMenuMotion } from './atlas-motion';

/** 列表进入顶层，避免玻璃面板的独立叠层挡住选项；无 JS 保留原生 select。 */
export function initAtlasSelect(root: HTMLElement, onSelect: (index: number) => void) {
  const select = root.querySelector<HTMLSelectElement>('[data-variant]')!;
  const trigger = root.querySelector<HTMLButtonElement>('[data-variant-trigger]')!;
  const list = root.querySelector<HTMLElement>('[data-variant-list]')!;
  const wrap = trigger.parentElement!;
  const section = wrap.closest<HTMLElement>('.atlas-section')!;
  const options = [...list.querySelectorAll<HTMLElement>('[data-variant-option]')];
  const topLayer = typeof list.showPopover === 'function';
  if (topLayer) { list.setAttribute('popover', 'manual'); list.dataset.topLayer = 'true'; }
  const duration = parseInt(getComputedStyle(root).getPropertyValue('--motion')) || 0;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = 0, search = '', typedAt = 0;
  let animation: Animation | undefined;
  let motion = atlasMenuMotion(root.dataset.slug!, duration);
  const isOpen = () => trigger.getAttribute('aria-expanded') === 'true';
  const highlight = (index: number) => {
    active = Math.max(0, Math.min(index, options.length - 1));
    options.forEach((option, i) => { option.dataset.active = String(i === active); });
    trigger.setAttribute('aria-activedescendant', options[active].id);
    const option = options[active];
    // 只滚动选项容器，不移动页面或触发按钮。
    if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop;
    else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight)
      list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight;
  };
  const finishClose = () => {
    if (topLayer && list.matches(':popover-open')) list.hidePopover();
    list.hidden = true;
    delete section.dataset.menuOpen;
  };
  const close = (animate = true) => {
    if (list.hidden) return;
    if (!isOpen() && animate) return;
    const css = getComputedStyle(list);
    const from = { opacity: css.opacity, transform: css.transform, filter: css.filter, clipPath: css.clipPath };
    animation?.cancel();
    trigger.setAttribute('aria-expanded', 'false');
    trigger.removeAttribute('aria-activedescendant');
    list.inert = true;
    search = '';
    if (!animate || reduced() || !motion.duration || list.hidden) { finishClose(); return; }
    animation = list.animate([from, motion.frames[0]], { duration: Math.min(motion.duration, 100), easing: motion.easing });
    void animation.finished.then(finishClose).catch(() => {});
  };
  const position = () => {
    const box = trigger.getBoundingClientRect();
    const viewport = window.visualViewport;
    const top = viewport?.offsetTop ?? 0, height = viewport?.height ?? innerHeight;
    const left = viewport?.offsetLeft ?? 0, width = viewport?.width ?? innerWidth;
    const below = Math.max(0, top + height - box.bottom - 12);
    const above = Math.max(0, box.top - top - 12);
    // During automatic scrolling the trigger can briefly leave the viewport.
    // Keep the selection alive and reveal it again when the anchor comes back.
    const offscreen = box.bottom <= top || box.top >= top + height;
    list.style.visibility = offscreen ? 'hidden' : '';
    const up = below < 220 && above > below;
    wrap.dataset.up = String(up);
    section.dataset.menuOpen = 'true';
    list.style.maxHeight = `${Math.min(264, up ? above : below)}px`;
    if (topLayer) {
      list.style.width = `${Math.min(box.width, width - 24)}px`;
      list.style.left = `${Math.max(left + 12, Math.min(box.left, left + width - Math.min(box.width, width - 24) - 12))}px`;
      if (!list.matches(':popover-open')) list.showPopover();
      list.style.top = `${up ? box.top - list.offsetHeight - 6 : box.bottom + 6}px`;
    }
    list.style.transformOrigin = up ? '50% 100%' : '50% 0';
  };
  const open = () => {
    // 中止之前输入框焦点触发的平滑滚动，避免新菜单随旧目标移出视口。
    window.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' });
    animation?.cancel();
    list.hidden = false; list.inert = false;
    position();
    trigger.setAttribute('aria-expanded', 'true');
    highlight(Number(select.value));
    motion = atlasMenuMotion(root.dataset.slug!, duration, wrap.dataset.up === 'true');
    if (motion.duration && !reduced()) animation = list.animate(motion.frames, { duration: motion.duration, easing: motion.easing });
  };
  const choose = (index: number) => { onSelect(index); close(); trigger.focus({ preventScroll: true }); };
  trigger.addEventListener('click', () => isOpen() ? close() : open());
  trigger.addEventListener('keydown', event => {
    const key = event.key;
    if (key === 'Tab') { close(false); return; }
    if (key === 'Escape' && isOpen()) { event.preventDefault(); event.stopPropagation(); close(); return; }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) {
      event.preventDefault();
      if (!isOpen()) { open(); if (key.startsWith('Arrow')) return; }
      highlight(key === 'Home' ? 0 : key === 'End' ? options.length - 1 : active + (key === 'ArrowDown' ? 1 : -1));
    } else if ((key === 'Enter' || key === ' ') && isOpen()) {
      event.preventDefault(); choose(active);
    } else if (key.length === 1 && key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.isComposing) {
      event.preventDefault();
      if (!isOpen()) open();
      search = performance.now() - typedAt > 800 ? key : search + key;
      typedAt = performance.now();
      const index = options.findIndex(option => option.textContent!.trim().toLocaleLowerCase().startsWith(search.toLocaleLowerCase()));
      if (index >= 0) highlight(index);
    }
  });
  // 仅阻止鼠标抢走焦点；触屏仍可正常纵向滚动菜单。
  list.addEventListener('mousedown', event => event.preventDefault());
  options.forEach((option, i) => option.addEventListener('click', () => choose(i)));
  document.addEventListener('pointerdown', event => { if (!wrap.contains(event.target as Node)) close(false); });
  document.addEventListener('focusin', event => { if (!wrap.contains(event.target as Node)) close(false); });
  document.addEventListener('wheel', event => { if (!wrap.contains(event.target as Node)) close(false); }, { passive: true });
  // 自动滚动与点击可能在同一帧结束；仍可见的触发器需要重新定位，而非刚打开就关闭。
  document.addEventListener('scroll', event => { if (isOpen() && !list.contains(event.target as Node)) position(); }, true);
  const reanchor = () => { if (isOpen()) position(); };
  window.addEventListener('resize', reanchor);
  window.visualViewport?.addEventListener('resize', reanchor);
  window.visualViewport?.addEventListener('scroll', reanchor);
  window.addEventListener('blur', () => close(false));
  window.addEventListener('pagehide', () => close(false));
  trigger.hidden = false;
  select.hidden = true;
  root.querySelector<HTMLLabelElement>('#atlas-variant-label')!.htmlFor = trigger.id;
  wrap.dataset.enhanced = 'true';
  return () => {
    trigger.querySelector('span')!.textContent = select.selectedOptions[0].textContent;
    options.forEach((option, i) => option.setAttribute('aria-selected', String(i === Number(select.value))));
  };
}
