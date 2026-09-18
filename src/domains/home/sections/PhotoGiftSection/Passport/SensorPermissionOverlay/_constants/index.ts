import type { Variants } from 'motion/react';
import { MOTION_DURATION, MOTION_EASE } from '@/constants/motion';

const OVERLAY_BLUR = 8;
const OVERLAY_WASH = 0.28;

const getOverlayMotionVariants = (shouldReduceMotion: boolean | null) => {
  const duration = shouldReduceMotion ? 0 : MOTION_DURATION;
  const transition = { duration, ease: MOTION_EASE };

  const overlayVariants: Variants = {
    hidden: {
      '--overlay-blur': '0px',
      '--overlay-alpha': 0,
    },
    visible: {
      '--overlay-blur': `${OVERLAY_BLUR}px`,
      '--overlay-alpha': OVERLAY_WASH,
      transition,
    },
    exit: {
      '--overlay-blur': '0px',
      '--overlay-alpha': 0,
      pointerEvents: 'none',
      transition,
    },
  };

  const promptVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition },
    exit: {
      opacity: 0,
      transition: { duration: duration * 0.45, ease: MOTION_EASE },
    },
  };

  return { overlayVariants, promptVariants };
};

export { getOverlayMotionVariants };
