import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { useAbortableTimeout } from '@/hooks/useAbortableTimeout';
import { useDesktopPointer } from '../useDesktopPointer';
import {
  getMotionPermissionApi,
  querySensorPermission,
  type MotionPermissionStatus,
} from './_utils';

const useMotionPermission = () => {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const hasDesktopPointer = useDesktopPointer();
  const [permission, setPermission] = useState<MotionPermissionStatus>('checking');
  const requestRef = useRef<() => Promise<boolean>>(() => Promise.resolve(false));
  const { start: scheduleProbe, cancel: cancelProbe } = useAbortableTimeout();

  useEffect(() => {
    let disposed = false;
    let requesting = false;
    let generation = 0;

    const stopProbe = () => {
      cancelProbe();
      window.removeEventListener('devicemotion', onMotion);
    };
    const applyPermission = (result: 'granted' | 'denied') => {
      setPermission(result);
      stopProbe();
    };
    const onMotion = (event: DeviceMotionEvent) => {
      const gravity = event.accelerationIncludingGravity;
      if (
        !gravity ||
        ![gravity.x, gravity.y, gravity.z].every(
          (value) => typeof value === 'number' && Number.isFinite(value),
        )
      )
        return;
      generation++;
      applyPermission('granted');
    };

    const refresh = () => {
      if (disposed || requesting || document.hidden) return;
      stopProbe();
      const version = ++generation;
      const motion = getMotionPermissionApi();
      if (shouldReduceMotion || hasDesktopPointer) {
        setPermission('not-required');
        return;
      }
      if (!window.isSecureContext || !motion) {
        setPermission('unavailable');
        return;
      }
      if (!motion.requestPermission) {
        setPermission('not-required');
        return;
      }
      const requestPermission = motion.requestPermission.bind(motion);

      setPermission('checking');
      window.addEventListener('devicemotion', onMotion, { passive: true });

      const probeBrowserGrant = () => {
        if (disposed || version !== generation) return;
        // Never turn a background permission check into a system prompt.
        // A previous navigation click may still carry transient activation.
        if (!navigator.userActivation) {
          setPermission('prompt');
          return;
        }
        if (navigator.userActivation.isActive) {
          scheduleProbe(probeBrowserGrant, 250);
          return;
        }
        void requestPermission()
          .then((result) => {
            if (disposed || version !== generation) return;
            applyPermission(result);
          })
          .catch(() => {
            if (disposed || version !== generation) return;
            setPermission('prompt');
          });
      };

      void querySensorPermission().then((state) => {
        if (disposed || version !== generation) return;
        if (state === 'granted' || state === 'denied') {
          applyPermission(state);
          return;
        }
        if (state === 'prompt') {
          setPermission('prompt');
          return;
        }
        scheduleProbe(probeBrowserGrant, 0);
      });
    };

    requestRef.current = async () => {
      if (disposed || requesting) return false;
      const motion = getMotionPermissionApi();
      if (!motion?.requestPermission) return false;
      stopProbe();
      const version = ++generation;
      requesting = true;
      setPermission('requesting');
      try {
        // No await before this call: Safari requires the button's user activation.
        const result = await motion.requestPermission();
        if (disposed || version !== generation) return false;
        applyPermission(result);
        return result === 'granted';
      } catch {
        if (disposed || version !== generation) return false;
        applyPermission('denied');
        return false;
      } finally {
        requesting = false;
      }
    };

    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('pageshow', refresh);
    refresh();

    return () => {
      disposed = true;
      generation++;
      stopProbe();
      requestRef.current = () => Promise.resolve(false);
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('pageshow', refresh);
    };
  }, [scheduleProbe, cancelProbe, shouldReduceMotion, hasDesktopPointer]);

  const requestPermission = useCallback(() => requestRef.current(), []);

  return { permission, requestPermission };
};

export { useMotionPermission };
