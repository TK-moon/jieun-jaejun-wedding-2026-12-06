import { startTransition, useEffect, useEffectEvent, useState } from 'react';
import { PRELOAD_FALLBACK_DELAY, PRELOAD_IDLE_TIMEOUT } from '../../_constants';

interface Params {
  active: boolean;
  enabled: boolean;
  canPreload: () => boolean;
}

const useIdleImageLoad = (params: Params) => {
  const { active, enabled, canPreload } = params;
  const [requested, setRequested] = useState(active);
  const isIdleEnough = useEffectEvent(canPreload);

  // Promotion to the current photo loads immediately and stays loaded afterwards.
  if (active && !requested) {
    setRequested(true);
  }

  useEffect(() => {
    if (requested || !enabled) {
      return;
    }

    let cancelled = false;
    let idleId: number | undefined;
    let timerId: number | undefined;

    const schedule = () => {
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(load, { timeout: PRELOAD_IDLE_TIMEOUT });
      } else {
        timerId = window.setTimeout(load, PRELOAD_FALLBACK_DELAY);
      }
    };

    const load = () => {
      if (cancelled) {
        return;
      }

      // An idle deadline can occur between animation frames. Keep gestures first.
      if (!isIdleEnough()) {
        schedule();
        return;
      }

      startTransition(() => setRequested(true));
    };

    schedule();

    return () => {
      cancelled = true;

      if (idleId !== undefined) {
        window.cancelIdleCallback(idleId);
      }

      if (timerId !== undefined) {
        window.clearTimeout(timerId);
      }
    };
  }, [requested, enabled]);

  return requested || active;
};

export { useIdleImageLoad };
