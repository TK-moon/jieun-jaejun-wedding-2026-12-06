import type { MotionInput } from '../../../_types';
import { getDecayFactor } from '../../../_utils/motion';

const REST_SCROLL: MotionInput = { x: 0, y: 0 };
const SCROLL_STRENGTH = 7;
const MAX_SCROLL_OFFSET = 3;
const SCROLL_DECAY_MS = 320;

const getScrollInput = (
  previous: MotionInput,
  deltaY: number,
  viewportHeight: number,
): MotionInput => {
  const y = Math.max(
    -MAX_SCROLL_OFFSET,
    Math.min(
      MAX_SCROLL_OFFSET,
      previous.y + (deltaY / Math.max(1, viewportHeight)) * SCROLL_STRENGTH,
    ),
  );
  return { x: -y * 0.25, y };
};

const decayScrollInput = (input: MotionInput, elapsedMs: number): MotionInput => {
  const decay = getDecayFactor(elapsedMs, SCROLL_DECAY_MS);
  const y = input.y * decay;
  return Math.abs(y) < 0.001 ? REST_SCROLL : { x: input.x * decay, y };
};

export { REST_SCROLL, getScrollInput, decayScrollInput };
