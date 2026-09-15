import { useEffect, useState, type RefObject } from 'react';
import type { MotionValue } from 'motion/react';
import { useAnimationFrameLoop } from '@/hooks/useAnimationFrameLoop';
import type { AccelerometerInput } from '../../../_hooks/useAccelerometer/_types';
import { createHologramPainter } from '../../../Hologram/_utils';
import type { MotionEnvironment } from '../useMotionEnvironment';
import {
  REST_FRAME,
  getPointerInput,
  combineMotionInputs,
  getNextFrame,
  type MotionInput,
} from './_utils/motion';
import { updateTilt, type TiltState } from './_utils/tilt';

const useHologramMotion = (
  hologramRef: RefObject<HTMLSpanElement | null>,
  accelerometerInput: MotionValue<AccelerometerInput | null>,
  scrollInput: MotionValue<MotionInput>,
  environment: MotionValue<MotionEnvironment>,
) => {
  const [mode, setMode] = useState<'pointer' | 'scroll' | 'reduced' | null>(null);
  const { start, stop } = useAnimationFrameLoop();

  useEffect(() => {
    const hologram = hologramRef.current;
    if (!hologram) return;

    const paint = createHologramPainter(hologram);
    let pointerListening = false;
    let tilt: TiltState | undefined;
    let lastMotionTime = 0;

    let current = REST_FRAME;
    let target: MotionInput = REST_FRAME;
    let primaryInput: MotionInput = REST_FRAME;
    const canAnimate = () => environment.get().canAnimate;

    const animate = (elapsedMs: number) => {
      if (!canAnimate()) return false;
      current = getNextFrame(current, target, elapsedMs);
      paint(current.x, current.y, current.angle);
      return current.needsFrame;
    };

    const move = () => {
      if (!canAnimate()) return;
      target = combineMotionInputs(primaryInput, scrollInput.get());
      start(animate);
    };

    const reset = () => {
      stop();
      current = REST_FRAME;
      target = REST_FRAME;
      primaryInput = REST_FRAME;
      paint(current.x, current.y, current.angle);
    };

    const onSensorInput = (input: AccelerometerInput | null) => {
      if (!input) {
        tilt = undefined;
        primaryInput = REST_FRAME;
        sync();
        move();
        return;
      }
      if (!canAnimate()) return;

      const firstInput = !tilt;
      tilt = updateTilt(tilt, input.gravity, input.screenAngle, input.time - lastMotionTime);
      lastMotionTime = input.time;
      primaryInput = tilt.input;
      if (firstInput) sync();
      move();
    };

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || accelerometerInput.get()) return;
      primaryInput = getPointerInput(
        event.clientX,
        event.clientY,
        window.innerWidth,
        window.innerHeight,
      );
      move();
    };

    const sync = () => {
      const { canAnimate, desktopPointer, reducedMotion } = environment.get();
      const sensorActive = accelerometerInput.get() !== null;
      const shouldTrackPointer = canAnimate && desktopPointer && !sensorActive;
      if (shouldTrackPointer && !pointerListening) {
        window.addEventListener('pointermove', onPointer, { passive: true });
      } else if (!shouldTrackPointer && pointerListening) {
        window.removeEventListener('pointermove', onPointer);
      }
      pointerListening = shouldTrackPointer;

      if (!canAnimate) {
        reset();
      }

      setMode(
        reducedMotion ? 'reduced' : sensorActive ? null : desktopPointer ? 'pointer' : 'scroll',
      );
    };

    const unsubscribeEnvironment = environment.on('change', sync);
    const unsubscribeInput = accelerometerInput.on('change', onSensorInput);
    const unsubscribeScroll = scrollInput.on('change', move);
    sync();
    onSensorInput(accelerometerInput.get());

    return () => {
      unsubscribeEnvironment();
      unsubscribeInput();
      unsubscribeScroll();
      window.removeEventListener('pointermove', onPointer);
      stop();
    };
  }, [hologramRef, accelerometerInput, scrollInput, environment, start, stop]);

  return { mode };
};

export { useHologramMotion };
