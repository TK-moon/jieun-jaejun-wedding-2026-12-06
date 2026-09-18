import { useEffect, useState } from 'react';
import { useMotionValue, type MotionValue } from 'motion/react';
import { useAbortableTimeout } from '@/hooks/useAbortableTimeout';
import type { MotionPermissionStatus } from '../../../../_hooks/useMotionPermission/_utils';
import type { AccelerometerInput, AccelerometerStatus } from './_types';
import {
  getScreenGravity,
  getOrientationGravity,
  canUseOrientationWithoutPrompt,
  type GravityVector,
} from './_utils';

const SENSOR_TIMEOUT_MS = 1800;

const useAccelerometer = (permission: MotionPermissionStatus, enabled: MotionValue<boolean>) => {
  const input = useMotionValue<AccelerometerInput | null>(null);
  const [status, setStatus] = useState<AccelerometerStatus>('idle');
  const { start: startTimeout, cancel: cancelTimeout } = useAbortableTimeout();
  const canUseSensor = permission === 'granted' || permission === 'not-required';

  useEffect(() => {
    if (!canUseSensor) return;

    let listening = false;
    let orientationListening = false;
    let receivedMotion = false;
    let lastMotionTime = 0;
    let source: 'motion' | 'orientation' | null = null;

    const stopOrientation = () => {
      window.removeEventListener('deviceorientation', onOrientation);
      orientationListening = false;
    };

    const onTimeout = () => {
      if (!enabled.get()) return;

      // Recheck the last sample instead of creating a native timeout for every event.
      const remainingMs = SENSOR_TIMEOUT_MS - (performance.now() - lastMotionTime);
      if (remainingMs > 0) {
        startTimeout(onTimeout, Math.ceil(remainingMs));
        return;
      }

      receivedMotion = false;
      source = null;
      input.set(null);
      setStatus('fallback');

      // Some browsers expose orientation while motion samples remain unavailable.
      // Do not add an extra permission request or change Safari's permission flow.
      if (!orientationListening && canUseOrientationWithoutPrompt()) {
        window.addEventListener('deviceorientation', onOrientation, { passive: true });
        orientationListening = true;
      }
    };

    const publish = (
      gravity: GravityVector,
      screenAngle: number,
      nextSource: 'motion' | 'orientation',
    ) => {
      // A source switch needs a fresh neutral pose, not a jump between coordinate systems.
      if (source !== null && source !== nextSource) input.set(null);
      source = nextSource;
      lastMotionTime = performance.now();
      if (!receivedMotion) {
        receivedMotion = true;
        setStatus('active');
        startTimeout(onTimeout, SENSOR_TIMEOUT_MS);
      }
      input.set({ gravity, screenAngle, time: lastMotionTime });
    };

    const onOrientation = (event: DeviceOrientationEvent) => {
      if (!enabled.get() || !orientationListening) return;

      const screenAngle = window.screen.orientation?.angle ?? window.orientation ?? 0;
      const gravity = getOrientationGravity(event.beta, event.gamma, screenAngle);
      if (gravity) publish(gravity, screenAngle, 'orientation');
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

      // Valid motion always takes priority, including after fallback has started.
      stopOrientation();
      publish(gravity, screenAngle, 'motion');
    };

    const stop = () => {
      window.removeEventListener('devicemotion', onMotion);
      stopOrientation();
      cancelTimeout();
      listening = false;
      receivedMotion = false;
      source = null;
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
