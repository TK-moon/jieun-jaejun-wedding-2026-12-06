import type { Variants } from 'motion/react';

const EASE = 'easeOut' as const;

const BANNER_MOTION: {
  center: Variants;
  top: Variants;
  right: Variants;
  bottom: Variants;
  left: Variants;
} = {
  center: {
    initial: { opacity: 0, scale: 0.97 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { delay: 0.22, duration: 0.55, ease: EASE },
    },
  },
  top: {
    initial: { opacity: 0, y: -12 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { delay: 0, duration: 0.45, ease: EASE },
    },
  },
  right: {
    initial: { opacity: 0, x: 12 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { delay: 0.48, duration: 0.4, ease: EASE },
    },
  },
  bottom: {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.52, duration: 0.4, ease: EASE },
    },
  },
  left: {
    initial: { opacity: 0, x: -12, rotate: 180 },
    animate: {
      opacity: 1,
      x: 0,
      rotate: 180,
      transition: { delay: 0.42, duration: 0.4, ease: EASE },
    },
  },
};

export { BANNER_MOTION };
