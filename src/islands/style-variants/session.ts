import { useCallback, useState } from 'react';
import type { LabSession } from './types';

/** 创建一个会话：同一组件详情页内跨风格保留业务状态，切换风格不丢失。 */
export function createSession(): LabSession {
  const store = new Map<string, unknown>();
  return {
    get<T>(key: string, fallback: T): T {
      return store.has(key) ? (store.get(key) as T) : fallback;
    },
    set<T>(key: string, value: T) {
      store.set(key, value);
    },
  };
}

/**
 * 与 session 同步的 useState：挂载时从 session 读取，写入时回写 session。
 * 因风格切换会挂载不同的组件实现，业务状态因此得以保留，而不是被销毁。
 */
export function useSessionState<T>(
  session: LabSession | undefined,
  key: string,
  initial: T,
): [T, (next: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => (session ? session.get(key, initial) : initial));
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        session?.set(key, resolved);
        return resolved;
      });
    },
    [session, key],
  );
  return [value, set];
}
