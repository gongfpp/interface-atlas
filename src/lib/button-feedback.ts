export type ButtonFeedbackState = 'idle' | 'pending' | 'success' | 'cancelled';
type Schedule = (finish: () => void, delay: number) => () => void;

/** 按钮样例的本地模拟：不发请求；取消或离开后旧回调不能报成功。 */
export function createButtonFeedback(schedule: Schedule = (finish, delay) => {
  const timer = setTimeout(finish, delay);
  return () => clearTimeout(timer);
}) {
  let state: ButtonFeedbackState = 'idle';
  let cancelTimer: (() => void) | undefined;
  let revision = 0;
  const listeners = new Set<() => void>();
  const update = (next: ButtonFeedbackState) => {
    if (next === state) return;
    state = next;
    for (const listener of listeners) listener();
  };
  const stop = () => {
    revision++;
    cancelTimer?.();
    cancelTimer = undefined;
  };
  const cancel = () => {
    stop();
    update('cancelled');
  };
  return {
    getSnapshot: () => state,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        // 风格切换或离开时释放计时器；已完成的结果可在同一会话继续查看。
        if (listeners.size === 0 && state === 'pending') cancel();
      };
    },
    start() {
      if (state === 'pending') return;
      stop();
      const ownRevision = revision;
      update('pending');
      cancelTimer = schedule(() => {
        if (ownRevision !== revision || state !== 'pending') return;
        cancelTimer = undefined;
        update('success');
      }, 900);
    },
    cancel,
    reset() { stop(); update('idle'); },
  };
}
export type ButtonFeedback = ReturnType<typeof createButtonFeedback>;

export function buttonFeedbackText(state: ButtonFeedbackState, locale: 'zh' | 'en') {
  const text = {
    idle: ['本地演示，不会提交或保存真实数据。', 'Local demo. No real data is submitted or saved.'],
    pending: ['正在模拟保存…可取消本次操作。', 'Simulating a save… You can cancel this action.'],
    success: ['保存模拟已完成；没有提交真实数据。', 'Save simulation complete. No real data was submitted.'],
    cancelled: ['本次演示已取消；可重新尝试。', 'Demo cancelled. You can try again.'],
  };
  return text[state][locale === 'zh' ? 0 : 1];
}
