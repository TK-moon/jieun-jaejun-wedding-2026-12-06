import { useEffect, useState } from 'react';
import { useMotionValue, type MotionValue } from 'motion/react';
import type { MotionPermissionStatus } from '../useMotionPermission/_utils';
import type { AccelerometerInput, AccelerometerStatus } from './_types';
import { getScreenGravity } from './_utils';

const useAccelerometer = (permission: MotionPermissionStatus, enabled: MotionValue<boolean>) => {
  const input = useMotionValue<AccelerometerInput | null>(null);
  const [status, setStatus] = useState<AccelerometerStatus>('idle');

  useEffect(() => {
    const canUseSensor = permission === 'granted' || permission === 'not-required';
    let listening = false;
    let receivedMotion = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const onTimeout = () => {
      receivedMotion = false;
      input.set(null);
      setStatus('fallback');
    };

    const onMotion = (event: DeviceMotionEvent) => {
      const screenAngle = window.screen.orientation?.angle ?? window.orientation ?? 0;
      const gravity = getScreenGravity(
        event.accelerationIncludingGravity,
        event.acceleration,
        screenAngle,
      );
      if (!gravity) return;

      if (!receivedMotion) {
        receivedMotion = true;
        setStatus('active');
      }
      // Fall back again if a previously working sensor stops sending valid samples.
      clearTimeout(timeout);
      timeout = setTimeout(onTimeout, 1800);
      input.set({ gravity, screenAngle, time: performance.now() });
    };

    const stop = () => {
      window.removeEventListener('devicemotion', onMotion);
      clearTimeout(timeout);
      listening = false;
      receivedMotion = false;
      input.set(null);
    };

    const sync = () => {
      const shouldListen = canUseSensor && enabled.get();
      if (shouldListen && !listening) {
        listening = true;
        window.addEventListener('devicemotion', onMotion, { passive: true });
        timeout = setTimeout(onTimeout, 1800);
      } else if (!shouldListen && listening) {
        stop();
      }
      setStatus(!canUseSensor ? 'fallback' : receivedMotion ? 'active' : 'idle');
    };

    const unsubscribe = enabled.on('change', sync);
    sync();
    return () => {
      unsubscribe();
      stop();
    };
  }, [permission, enabled, input]);

  return { input, status };
};

export { useAccelerometer };
