import { useState, useSyncExternalStore } from 'react';
import { createButtonFeedback, type ButtonFeedback } from '../../lib/button-feedback';
import type { LabSession } from '../style-variants/types';

/** 风格共用结果；实际计时器归控制器管理，最后一个预览卸载时取消。 */
export function useButtonFeedback(session?: LabSession) {
  const [feedback] = useState(() => {
    const current = session?.get<ButtonFeedback | null>('button-feedback', null);
    if (current) return current;
    const created = createButtonFeedback();
    session?.set('button-feedback', created);
    return created;
  });
  const state = useSyncExternalStore(feedback.subscribe, feedback.getSnapshot, feedback.getSnapshot);
  return { state, busy: state === 'pending', start: feedback.start, cancel: feedback.cancel };
}
