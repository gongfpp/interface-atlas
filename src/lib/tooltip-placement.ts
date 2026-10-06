export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
type Rect = { left: number; top: number; width: number; height: number };
type Size = { width: number; height: number };
const opposite: Record<TooltipPlacement, TooltipPlacement> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

/** 只计算气泡几何；输入/关闭状态仍由各演示持有。 */
export function placeTooltip(anchor: Rect, size: Size, viewport: Rect, preferred: TooltipPlacement = 'bottom', gap = 12, centered = false) {
  const inset = Math.min(8, viewport.width / 2, viewport.height / 2);
  const minX = viewport.left + inset, minY = viewport.top + inset;
  const maxX = viewport.left + viewport.width - inset, maxY = viewport.top + viewport.height - inset;
  const width = Math.min(size.width, maxX - minX), height = Math.min(size.height, maxY - minY);
  const space = { top: anchor.top - minY - gap, bottom: maxY - anchor.top - anchor.height - gap, left: anchor.left - minX - gap, right: maxX - anchor.left - anchor.width - gap };
  const needed = preferred === 'top' || preferred === 'bottom' ? height : width;
  const alternate = opposite[preferred];
  const placement = space[preferred] >= needed || space[preferred] >= space[alternate] ? preferred : alternate;
  let left = anchor.left + (centered ? (anchor.width - width) / 2 : 0);
  let top = placement === 'top' ? anchor.top - gap - height : anchor.top + anchor.height + gap;
  if (placement === 'left' || placement === 'right') {
    left = placement === 'left' ? anchor.left - gap - width : anchor.left + anchor.width + gap;
    top = anchor.top + (anchor.height - height) / 2;
  }
  left = clamp(left, minX, maxX - width); top = clamp(top, minY, maxY - height);
  const arrowInsetX = Math.min(8, width / 2), arrowInsetY = Math.min(8, height / 2);
  return { placement, left, top, width, height,
    arrowX: clamp(anchor.left + anchor.width / 2 - left, arrowInsetX, width - arrowInsetX),
    arrowY: clamp(anchor.top + anchor.height / 2 - top, arrowInsetY, height - arrowInsetY),
  };
}

type Options = { preferred?: TooltipPlacement; gap?: number; matchRootWidth?: boolean; onPlacement?: (placement: TooltipPlacement) => void };

/** 浮层不占文档流；滚动、缩放和内容尺寸变化只更新定位，不滚动或移动焦点。 */
export function observeTooltipPlacement(root: HTMLElement, anchor: HTMLElement, layer: HTMLElement, options: Options = {}) {
  const view = root.ownerDocument.defaultView;
  const content = layer.firstElementChild as HTMLElement | null;
  if (!view || !content) return () => {};
  const { preferred = 'bottom', gap = 12, matchRootWidth = false, onPlacement } = options;
  const originalDisplay = layer.style.display;
  // manual 顶层绕过容器/滤镜和 sticky 的层叠，但不改变 DOM 归属、焦点或关闭契约。
  const topLayer = typeof layer.showPopover === 'function';
  if (topLayer) layer.showPopover();
  else layer.removeAttribute('popover');
  const measure = () => {
    const visual = view.visualViewport;
    const viewport = { left: visual?.offsetLeft ?? 0, top: visual?.offsetTop ?? 0, width: visual?.width ?? root.ownerDocument.documentElement.clientWidth, height: visual?.height ?? view.innerHeight };
    const rootRect = root.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    // 焦点可以仍在屏幕外的触发器上；暂停绘制，不修改交互状态或留下透明大命中区。
    const suspended = anchorRect.bottom <= viewport.top || anchorRect.top >= viewport.top + viewport.height || anchorRect.right <= viewport.left || anchorRect.left >= viewport.left + viewport.width;
    layer.dataset.tooltipSuspended = String(suspended);
    // visibility:hidden 仍可能让初次挂载的 max-content 浮层扩大 WebKit 的滚动范围。
    if (suspended) { layer.style.display = 'none'; layer.style.visibility = 'hidden'; layer.style.padding = '0px'; return; }
    layer.style.display = originalDisplay;
    const maxWidth = Math.max(0, viewport.width - 16), maxHeight = Math.max(0, viewport.height - 16);
    layer.style.width = matchRootWidth ? `${Math.min(rootRect.width, maxWidth)}px` : 'max-content';
    layer.style.maxWidth = `${maxWidth}px`;
    content.style.maxWidth = '100%';
    content.style.maxHeight = `${maxHeight}px`;
    content.style.overflowY = content.scrollHeight > maxHeight ? 'auto' : 'visible';
    const bubble = placeTooltip(anchorRect, { width: content.offsetWidth, height: content.offsetHeight }, viewport, preferred, gap, !matchRootWidth);
    let left = bubble.left, top = bubble.top;
    // 透明 padding 覆盖触发器与气泡之间的间隙，慢速跨越也不会丢失 hover。
    const bridge = { top: 0, right: 0, bottom: 0, left: 0 };
    if (bubble.placement === 'bottom') { bridge.top = clamp(bubble.top - anchorRect.bottom, 0, gap); top -= bridge.top; }
    if (bubble.placement === 'top') bridge.bottom = clamp(anchorRect.top - bubble.top - bubble.height, 0, gap);
    if (bubble.placement === 'right') { bridge.left = clamp(bubble.left - anchorRect.right, 0, gap); left -= bridge.left; }
    if (bubble.placement === 'left') bridge.right = clamp(anchorRect.left - bubble.left - bubble.width, 0, gap);
    Object.assign(layer.style, {
      position: topLayer ? 'fixed' : 'absolute',
      left: `${left - (topLayer ? 0 : rootRect.left + root.clientLeft - root.scrollLeft)}px`,
      top: `${top - (topLayer ? 0 : rootRect.top + root.clientTop - root.scrollTop)}px`,
      padding: `${bridge.top}px ${bridge.right}px ${bridge.bottom}px ${bridge.left}px`,
      visibility: 'visible',
    });
    layer.dataset.tooltipPlacement = bubble.placement;
    layer.style.setProperty('--tooltip-arrow-x', `${bubble.arrowX}px`);
    layer.style.setProperty('--tooltip-arrow-y', `${bubble.arrowY}px`);
    onPlacement?.(bubble.placement);
  };
  measure();
  view.addEventListener('scroll', measure, true);
  view.addEventListener('resize', measure);
  view.visualViewport?.addEventListener('scroll', measure);
  view.visualViewport?.addEventListener('resize', measure);
  const observer = new view.ResizeObserver(measure);
  observer.observe(root); observer.observe(anchor); observer.observe(content);
  return () => {
    view.removeEventListener('scroll', measure, true);
    view.removeEventListener('resize', measure);
    view.visualViewport?.removeEventListener('scroll', measure);
    view.visualViewport?.removeEventListener('resize', measure);
    observer.disconnect();
    if (topLayer && layer.matches(':popover-open')) layer.hidePopover();
    layer.style.display = originalDisplay;
  };
}
