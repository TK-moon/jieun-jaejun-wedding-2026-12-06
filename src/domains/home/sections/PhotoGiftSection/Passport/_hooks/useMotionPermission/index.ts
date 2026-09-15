import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getMotionPermissionApi,
  readMotionConsent,
  storeMotionConsent,
  type MotionPermissionStatus,
} from './_utils';

const useMotionPermission = () => {
  const [permission, setPermission] = useState<MotionPermissionStatus>('checking');
  const [hasGrantedBefore, setHasGrantedBefore] = useState(readMotionConsent);
  const requestRef = useRef<() => Promise<boolean>>(() => Promise.resolve(false));

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let disposed = false;
    let requesting = false;
    let generation = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const remember = (granted: boolean) => {
      storeMotionConsent(granted);
      setHasGrantedBefore(granted);
    };
    const stopProbe = () => {
      clearTimeout(timer);
      window.removeEventListener('devicemotion', onMotion);
    };
    const applyPermission = (result: 'granted' | 'denied') => {
      setPermission(result);
      remember(result === 'granted');
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
      if (reducedMotion.matches || desktopPointer.matches) {
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

      setPermission('checking');
      window.addEventListener('devicemotion', onMotion, { passive: true });
      const probe = () => {
        if (disposed || version !== generation) return;
        // Never turn a background permission check into a system prompt.
        // A previous navigation click may still carry transient activation.
        if (!navigator.userActivation) {
          setPermission('prompt');
          return;
        }
        if (navigator.userActivation.isActive) {
          timer = setTimeout(probe, 250);
          return;
        }
        void motion.requestPermission!()
          .then((result) => {
            if (!disposed && version === generation) applyPermission(result);
          })
          .catch(() => {
            // A reset/prompt permission needs a real tap; remembered consent is not a grant.
            if (!disposed && version === generation) setPermission('prompt');
          });
      };
      // Exit any synchronous navigation gesture before checking the cached browser grant.
      timer = setTimeout(probe, 0);
    };

    requestRef.current = async () => {
      const motion = getMotionPermissionApi();
      if (disposed || requesting || !motion?.requestPermission) return false;
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
        if (!disposed && version === generation) setPermission('prompt');
        return false;
      } finally {
        requesting = false;
      }
    };

    reducedMotion.addEventListener('change', refresh);
    desktopPointer.addEventListener('change', refresh);
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('pageshow', refresh);
    refresh();

    return () => {
      disposed = true;
      generation++;
      stopProbe();
      requestRef.current = () => Promise.resolve(false);
      reducedMotion.removeEventListener('change', refresh);
      desktopPointer.removeEventListener('change', refresh);
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('pageshow', refresh);
    };
  }, []);

  const requestPermission = useCallback(() => requestRef.current(), []);

  return { permission, hasGrantedBefore, requestPermission };
};

export { useMotionPermission };
