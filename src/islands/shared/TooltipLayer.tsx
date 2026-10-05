import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { observeTooltipPlacement, type TooltipPlacement } from '../../lib/tooltip-placement';

export function TooltipLayer({ root, anchor, preferred = 'bottom', gap = 12, matchRootWidth = false, className, children, as: Tag = 'div' }: {
  root: RefObject<HTMLElement | null>;
  anchor: RefObject<HTMLElement | null>;
  preferred?: TooltipPlacement;
  gap?: number;
  matchRootWidth?: boolean;
  className?: string;
  children: ReactNode | ((placement: TooltipPlacement) => ReactNode);
  as?: 'div' | 'span';
}) {
  const layer = useRef<HTMLDivElement & HTMLSpanElement>(null);
  const [placement, setPlacement] = useState(preferred);
  useLayoutEffect(() => {
    if (root.current && anchor.current && layer.current) return observeTooltipPlacement(root.current, anchor.current, layer.current, { preferred, gap, matchRootWidth, onPlacement: setPlacement });
  }, [root, anchor, preferred, gap, matchRootWidth]);
  return <Tag ref={layer} popover="manual" data-tooltip-layer="" className={className} style={{ position: 'absolute', inset: 'auto', margin: 0, border: 0, padding: 0, width: 'max-content', boxSizing: 'content-box', overflow: 'visible', background: 'transparent', color: 'inherit', visibility: 'hidden', zIndex: 50 }}>
    {typeof children === 'function' ? children(placement) : children}
  </Tag>;
}
