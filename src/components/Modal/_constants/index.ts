import type { Variants } from 'motion/react';
import { MOTION_DURATION, MOTION_EASE, MOTION_FADE_UP } from '@/constants/motion';

const getModalMotionVariants = (shouldReduceMotion: boolean | null) => {
  const duration = shouldReduceMotion ? 0 : MOTION_DURATION;

  const rootVariants: Variants = {
    initial: {},
    animate: {},
    exit: {},
  };

  const backdropVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration, ease: MOTION_EASE } },
    exit: { opacity: 0, transition: { duration, ease: MOTION_EASE } },
  };

  const dialogVariants: Variants = {
    initial: MOTION_FADE_UP.hidden,
    animate: { ...MOTION_FADE_UP.visible, transition: { duration, ease: MOTION_EASE } },
    exit: { ...MOTION_FADE_UP.hidden, transition: { duration, ease: MOTION_EASE } },
  };

  return { rootVariants, backdropVariants, dialogVariants };
};

export { getModalMotionVariants };
