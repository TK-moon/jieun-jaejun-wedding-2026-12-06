import { useReducedMotion } from 'motion/react';
import { MOTION_DURATION } from '@/constants/motion';

interface MotionPreference {
  shouldReduceMotion: boolean;
  duration: number;
}

const useMotionPreference = (): MotionPreference => {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const duration = shouldReduceMotion ? 0 : MOTION_DURATION;

  return { shouldReduceMotion, duration };
};

export { useMotionPreference };
export type { MotionPreference };
