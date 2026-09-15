import { useCallback, useEffect, useRef } from 'react';
import { SUPPORTS_ABORT_SIGNAL_TIMEOUT } from './_constants';

const useAbortableTimeout = () => {
  const cancelRef = useRef<(() => void) | null>(null);

  const cancel = useCallback(() => {
    const cancelPendingTimeout = cancelRef.current;
    cancelRef.current = null;
    cancelPendingTimeout?.();
  }, []);

  const start = useCallback(
    (onTimeout: () => void, delayMs: number) => {
      cancel();

      const finish = () => {
        cancel();
        onTimeout();
      };

      if (!SUPPORTS_ABORT_SIGNAL_TIMEOUT) {
        const timerId = window.setTimeout(finish, delayMs);
        cancelRef.current = () => window.clearTimeout(timerId);
        return;
      }

      const controller = new AbortController();
      const timeoutSignal = AbortSignal.timeout(delayMs);
      timeoutSignal.addEventListener('abort', finish, {
        once: true,
        signal: controller.signal,
      });

      cancelRef.current = () => controller.abort();
    },
    [cancel],
  );

  useEffect(() => cancel, [cancel]);

  return { start, cancel };
};

export { useAbortableTimeout };
