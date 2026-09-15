import { useEffect, useState, type RefObject } from 'react';
import type { MotionValue } from 'motion/react';
import type { AccelerometerInput } from '../../../_hooks/useAccelerometer/_types';
import { createHologramPainter } from '../../../Hologram/_utils';
import type { MotionEnvironment } from '../useMotionEnvironment';
import { REST_FRAME, getPointerInput, getNextFrame, type MotionInput } from './_utils/motion';
import { updateTilt, type TiltState } from './_utils/tilt';

const useHologramMotion = (
  hologramRef: RefObject<HTMLSpanElement | null>,
  accelerometerInput: MotionValue<AccelerometerInput | null>,
  environment: MotionValue<MotionEnvironment>,
) => {
  const [mode, setMode] = useState<'pointer' | 'reduced' | null>(null);

  useEffect(() => {
    const hologram = hologramRef.current;
    if (!hologram) return;

    const paint = createHologramPainter(hologram);
    let pointerListening = false;
    let tilt: TiltState | undefined;
    let lastMotionTime = 0;

    let frame = 0;
    let lastFrameTime = 0;
    let current = REST_FRAME;
    let target: MotionInput = REST_FRAME;
    const canAnimate = () => environment.get().canAnimate;

    const animate = (now: number) => {
      frame = 0;
      if (!canAnimate()) return;
      current = getNextFrame(current, target, now - lastFrameTime);
      lastFrameTime = now;
      paint(current.x, current.y, current.angle);
      if (current.needsFrame) {
        frame = requestAnimationFrame(animate);
      }
    };

    const move = (input: MotionInput) => {
      if (!canAnimate()) return;
      target = input;
      if (!frame) {
        lastFrameTime = performance.now();
        frame = requestAnimationFrame(animate);
      }
    };

    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      current = REST_FRAME;
      target = REST_FRAME;
      paint(current.x, current.y, current.angle);
    };

    const onSensorInput = (input: AccelerometerInput | null) => {
      if (!input) {
        tilt = undefined;
        if (!environment.get().desktopPointer) reset();
        return;
      }
      if (!canAnimate() || environment.get().desktopPointer) return;

      tilt = updateTilt(tilt, input.gravity, input.screenAngle, input.time - lastMotionTime);
      lastMotionTime = input.time;
      move(tilt.input);
    };

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      move(getPointerInput(event.clientX, event.clientY, window.innerWidth, window.innerHeight));
    };

    const sync = () => {
      const { canAnimate, desktopPointer, reducedMotion } = environment.get();
      const shouldTrackPointer = canAnimate && desktopPointer;
      if (shouldTrackPointer && !pointerListening) {
        window.addEventListener('pointermove', onPointer, { passive: true });
      } else if (!shouldTrackPointer && pointerListening) {
        window.removeEventListener('pointermove', onPointer);
      }
      pointerListening = shouldTrackPointer;

      if (!canAnimate) {
        reset();
      }

      setMode(reducedMotion ? 'reduced' : desktopPointer ? 'pointer' : null);
    };

    const unsubscribeEnvironment = environment.on('change', sync);
    const unsubscribeInput = accelerometerInput.on('change', onSensorInput);
    sync();
    onSensorInput(accelerometerInput.get());

    return () => {
      unsubscribeEnvironment();
      unsubscribeInput();
      window.removeEventListener('pointermove', onPointer);
      cancelAnimationFrame(frame);
    };
  }, [hologramRef, accelerometerInput, environment]);

  return { mode };
};

export { useHologramMotion };
