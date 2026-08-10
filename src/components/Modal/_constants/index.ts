import type { Variants } from 'motion/react';

const getModalMotionVariants = (shouldReduceMotion: boolean | null) => {
  const duration = shouldReduceMotion ? 0 : 0.22;
  const backdropDuration = shouldReduceMotion ? 0 : 0.18;

  const rootVariants: Variants = {
    initial: {},
    animate: {},
    exit: {},
  };

  const backdropVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: backdropDuration, ease: 'easeOut' } },
    exit: { opacity: 0, transition: { duration: backdropDuration, ease: 'easeOut' } },
  };

  const dialogVariants: Variants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { duration, ease: 'easeOut' } },
    exit: { opacity: 0, y: 8, transition: { duration, ease: 'easeOut' } },
  };

  return { rootVariants, backdropVariants, dialogVariants };
};

export { getModalMotionVariants };
