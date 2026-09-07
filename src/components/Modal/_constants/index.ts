import type { Variants } from 'motion/react';
import { MOTION_DURATION, MOTION_EASE } from '@/constants/motion';

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
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { duration, ease: MOTION_EASE } },
    exit: { opacity: 0, y: 8, transition: { duration, ease: MOTION_EASE } },
  };

  return { rootVariants, backdropVariants, dialogVariants };
};

export { getModalMotionVariants };
