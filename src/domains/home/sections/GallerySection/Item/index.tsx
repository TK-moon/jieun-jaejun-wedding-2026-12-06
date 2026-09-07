import { motion } from 'motion/react';
import type { FC, PropsWithChildren } from 'react';
import { MOTION_DURATION, MOTION_EASE } from '@/constants/motion';
import styles from './index.module.css';

interface Props extends PropsWithChildren {
  index: number;
  canAnimate: boolean;
  shouldReduceMotion: boolean | null;
}

const HIDDEN = { opacity: 0, y: 20 };
const VISIBLE = { opacity: 1, y: 0 };

const Item: FC<Props> = (props) => {
  const { index, canAnimate, shouldReduceMotion, children } = props;

  return (
    <li className={styles.item}>
      <motion.div
        className={styles.card}
        initial={shouldReduceMotion ? false : HIDDEN}
        animate={canAnimate ? VISIBLE : HIDDEN}
        transition={{
          delay: shouldReduceMotion || !canAnimate ? 0 : (index + 1) * 0.1,
          duration: shouldReduceMotion ? 0 : MOTION_DURATION,
          ease: MOTION_EASE,
        }}
      >
        {children}
      </motion.div>
    </li>
  );
};

export { Item };
