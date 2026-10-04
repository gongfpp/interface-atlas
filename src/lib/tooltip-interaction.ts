/** 提示的输入状态只属于当前挂载，不进入跨风格业务会话。 */
export interface TooltipInteraction {
  hovered: boolean;
  focused: boolean;
  activated: boolean;
  dismissed: boolean;
}
export type TooltipAction = 'pointer-enter' | 'pointer-leave' | 'focus' | 'blur' | 'activate' | 'dismiss';
export const createTooltipInteraction = (): TooltipInteraction => ({ hovered: false, focused: false, activated: false, dismissed: false });
export const tooltipIsVisible = (state: TooltipInteraction) => !state.dismissed && (state.hovered || state.focused || state.activated);
export const tooltipHasHoverPointer = (pointerType: string) => pointerType === 'mouse' || pointerType === 'pen';

export function updateTooltipInteraction(state: TooltipInteraction, action: TooltipAction): TooltipInteraction {
  let next: TooltipInteraction;
  switch (action) {
    case 'pointer-enter': next = { ...state, hovered: true }; break;
    case 'pointer-leave': next = { ...state, hovered: false }; break;
    case 'focus': next = { ...state, focused: true }; break;
    case 'blur': next = { ...state, focused: false, activated: false }; break;
    // 首次激活与 focus/hover 分开，避免点按在先到的 focus 之后立即反向关闭。
    case 'activate': next = state.activated && !state.dismissed
      ? { ...state, activated: false, dismissed: true }
      : { ...state, activated: true, dismissed: false }; break;
    case 'dismiss': next = { ...state, activated: false, dismissed: true }; break;
  }
  // Esc 的关闭意图持续到本轮 hover/focus 都结束；新的显式激活可提前重开。
  if (!next.hovered && !next.focused && !next.activated) next.dismissed = false;
  return next;
}
