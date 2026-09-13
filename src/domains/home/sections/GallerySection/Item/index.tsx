import { motion, useReducedMotion } from 'motion/react';
import { useRef, useState, type FC, type PropsWithChildren } from 'react';
import { MOTION_DURATION, MOTION_EASE, MOTION_FADE_UP } from '@/constants/motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import styles from './index.module.css';

interface Props extends PropsWithChildren {
  index: number;
  isReady?: boolean;
}

const Item: FC<Props> = (props) => {
  const { index, isReady = true, children } = props;
  const itemRef = useRef<HTMLLIElement>(null);
  const [hasIntersected, setHasIntersected] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const { isSupported } = useIntersectionObserver(
    itemRef,
    (entry) => {
      if (entry.isIntersecting) {
        setHasIntersected(true);
      }
    },
    { threshold: 0.2, rootMargin: '0px 0px -10% 0px' },
  );

  const isVisible = !isSupported || hasIntersected;
  const canAnimate = isReady && (Boolean(shouldReduceMotion) || isVisible);
  const duration = shouldReduceMotion ? 0 : MOTION_DURATION;

  return (
    <li ref={itemRef} className={styles.item}>
      <motion.div
        className={styles.card}
        initial={shouldReduceMotion && isReady ? false : MOTION_FADE_UP.hidden}
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
