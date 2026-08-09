import { useEffect, useRef } from 'react';

interface TimeoutController {
  set: (id: string, callback: () => void, delayMs: number) => void;
  clear: (id: string) => void;
  clearAll: () => void;
  has: (id: string) => boolean;
}

const useTimeout = (): TimeoutController => {
  const timersRef = useRef(new Map<string, number>());

  const clear = (id: string) => {
    const timerId = timersRef.current.get(id);
    if (timerId === undefined) {
      return;
    }

    window.clearTimeout(timerId);
    timersRef.current.delete(id);
  };

  const clearAll = () => {
    for (const timerId of timersRef.current.values()) {
      window.clearTimeout(timerId);
    }
    timersRef.current.clear();
  };

  const set = (id: string, callback: () => void, delayMs: number) => {
    clear(id);

    const timerId = window.setTimeout(() => {
      timersRef.current.delete(id);
      callback();
    }, delayMs);

    timersRef.current.set(id, timerId);
  };

  const has = (id: string) => timersRef.current.has(id);

  useEffect(() => {
    const timers = timersRef.current;

    return () => {
      for (const timerId of timers.values()) {
        window.clearTimeout(timerId);
      }
      timers.clear();
    };
  }, []);

  return { set, clear, clearAll, has };
};

export { useTimeout };
export type { TimeoutController };
