import type { Variants } from 'motion/react';
import { MOTION_DURATION, MOTION_EASE } from '@/constants/motion';

const OVERLAY_BLUR = 8;
const OVERLAY_WASH = 0.28;

const getOverlayMotionVariants = (shouldReduceMotion: boolean | null) => {
  const duration = shouldReduceMotion ? 0 : MOTION_DURATION;
  const transition = { duration, ease: MOTION_EASE };

  const frost = `blur(${OVERLAY_BLUR}px)`;
  const clear = 'blur(0px)';

  const overlayVariants: Variants = {
    hidden: {
      backdropFilter: clear,
      WebkitBackdropFilter: clear,
      '--overlay-alpha': 0,
    },
    visible: {
      backdropFilter: frost,
      WebkitBackdropFilter: frost,
      '--overlay-alpha': OVERLAY_WASH,
      transition,
    },
    exit: {
      backdropFilter: clear,
      WebkitBackdropFilter: clear,
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
