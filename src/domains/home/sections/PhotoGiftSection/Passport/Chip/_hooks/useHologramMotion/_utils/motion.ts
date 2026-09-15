import type { MotionInput } from '../../../_types';
import { getSmoothingFactor } from '../../../_utils/motion';
import type { MotionEnvironment } from '../../useMotionEnvironment';

type HologramMode = 'pointer' | 'scroll' | 'reduced' | null;

const getHologramMode = (environment: MotionEnvironment, sensorActive: boolean): HologramMode => {
  if (environment.reducedMotion) return 'reduced';
  if (sensorActive) return null;
  if (environment.desktopPointer) return 'pointer';
  return 'scroll';
};

interface MotionFrame extends MotionInput {
  angle: number;
  needsFrame: boolean;
}

const RENDER_SMOOTHING_MS = 22;
const REST_FRAME: MotionFrame = { x: 0, y: 0, angle: 0, needsFrame: false };

const clampInput = ({ x, y }: MotionInput): MotionInput => ({
  x: Math.max(-1, Math.min(1, x)),
  y: Math.max(-1, Math.min(1, y)),
});

const getPointerInput = (
  clientX: number,
  clientY: number,
  width: number,
  height: number,
): MotionInput =>
  clampInput({
    x: (clientX / width) * 2 - 1,
    y: (clientY / height) * 2 - 1,
  });

const combineMotionInputs = (primary: MotionInput, scroll: MotionInput): MotionInput => ({
  x: primary.x + scroll.x,
  y: primary.y + scroll.y,
});

const getRotationDelta = (target: MotionInput, currentAngle: number) => {
  // Keep the last direction near the centre, where atan2 becomes unstable.
  if (Math.hypot(target.x, target.y) < 0.06) return 0;
  const angle = (Math.atan2(target.y, target.x) * 180) / Math.PI + 135;
  return ((((angle - currentAngle) % 360) + 540) % 360) - 180;
};

const getNextFrame = (
  current: MotionFrame,
  target: MotionInput,
  elapsedMs: number,
): MotionFrame => {
  const blend = getSmoothingFactor(elapsedMs, RENDER_SMOOTHING_MS);
  const x = current.x + (target.x - current.x) * blend;
  const y = current.y + (target.y - current.y) * blend;
  const angle = current.angle + getRotationDelta(target, current.angle) * blend;

  return {
    x,
    y,
    angle,
    needsFrame:
      Math.abs(target.x - x) + Math.abs(target.y - y) > 0.002 ||
      Math.abs(getRotationDelta(target, angle)) > 0.1,
  };
};

export { REST_FRAME, getPointerInput, combineMotionInputs, getNextFrame, getHologramMode };
export type { HologramMode };
