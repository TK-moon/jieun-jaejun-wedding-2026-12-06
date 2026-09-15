import { useEffect, useState } from 'react';
import { useMotionValue, type MotionValue } from 'motion/react';
import { useAbortableTimeout } from '@/hooks/useAbortableTimeout';
import type { MotionPermissionStatus } from '../../../_hooks/useMotionPermission/_utils';
import type { AccelerometerInput, AccelerometerStatus } from './_types';
import { getScreenGravity } from './_utils';

const SENSOR_TIMEOUT_MS = 1800;

const useAccelerometer = (permission: MotionPermissionStatus, enabled: MotionValue<boolean>) => {
  const input = useMotionValue<AccelerometerInput | null>(null);
  const [status, setStatus] = useState<AccelerometerStatus>('idle');
  const { start: startTimeout, cancel: cancelTimeout } = useAbortableTimeout();
  const canUseSensor = permission === 'granted' || permission === 'not-required';

  useEffect(() => {
    if (!canUseSensor) return;

    let listening = false;
    let receivedMotion = false;
    let lastMotionTime = 0;

    const onTimeout = () => {
      if (!enabled.get()) return;

      // Recheck the last sample instead of creating a native timeout for every event.
      const remainingMs = SENSOR_TIMEOUT_MS - (performance.now() - lastMotionTime);
      if (remainingMs > 0) {
        startTimeout(onTimeout, Math.ceil(remainingMs));
        return;
      }

      receivedMotion = false;
      input.set(null);
      setStatus('fallback');
    };

    const onMotion = (event: DeviceMotionEvent) => {
      if (!enabled.get()) return;

      const screenAngle = window.screen.orientation?.angle ?? window.orientation ?? 0;
      const gravity = getScreenGravity(
        event.accelerationIncludingGravity,
        event.acceleration,
        screenAngle,
      );
      if (!gravity) return;

      lastMotionTime = performance.now();
      if (!receivedMotion) {
        receivedMotion = true;
        setStatus('active');
        startTimeout(onTimeout, SENSOR_TIMEOUT_MS);
      }
      input.set({ gravity, screenAngle, time: lastMotionTime });
    };

    const stop = () => {
      window.removeEventListener('devicemotion', onMotion);
      cancelTimeout();
      listening = false;
      receivedMotion = false;
      input.set(null);
    };

    const sync = () => {
      if (!enabled.get()) {
        stop();
        setStatus('idle');
        return;
      }
      if (listening) return;

      listening = true;
      lastMotionTime = performance.now();
      window.addEventListener('devicemotion', onMotion, { passive: true });
      startTimeout(onTimeout, SENSOR_TIMEOUT_MS);
      setStatus('idle');
    };

    const unsubscribe = enabled.on('change', sync);
    sync();
    return () => {
      unsubscribe();
      stop();
    };
  }, [canUseSensor, enabled, input, startTimeout, cancelTimeout]);

  const sensorStatus: AccelerometerStatus = canUseSensor ? status : 'fallback';
  return { input, status: sensorStatus };
};

export { useAccelerometer };
