import { motion } from 'motion/react';
import type { FC, PropsWithChildren } from 'react';
import { MOTION_EASE, MOTION_FADE_UP } from '@/constants/motion';
import { useRevealMotion } from './_hooks/useRevealMotion';
import styles from './index.module.css';

interface Props extends PropsWithChildren {
  index: number;
  isReady?: boolean;
}

const Item: FC<Props> = (props) => {
  const { index, isReady, children } = props;
  const { ref, shouldReduceMotion, canAnimate, skipInitial, duration } = useRevealMotion({
    isReady,
  });

  return (
    <li ref={ref} className={styles.item}>
      <motion.div
        className={styles.card}
        initial={skipInitial ? false : MOTION_FADE_UP.hidden}
        animate={canAnimate ? MOTION_FADE_UP.visible : MOTION_FADE_UP.hidden}
        transition={{
          delay: shouldReduceMotion || !canAnimate ? 0 : index * 0.1,
          duration,
          ease: MOTION_EASE,
        }}
      >
        {children}
      </motion.div>
    </li>
  );
};

export { Item };
