import { motion } from 'motion/react';
import type { FC } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon/ArrowRightIcon';
import { ROUTES } from '@/constants/routes';
import styles from './index.module.css';

interface Props {
  index: number;
  isSectionVisible: boolean;
  shouldReduceMotion: boolean | null;
}

const EASE = 'easeOut' as const;

const Cover: FC<Props> = (props) => {
  const { index, isSectionVisible, shouldReduceMotion } = props;
  const canAnimate = Boolean(shouldReduceMotion) || isSectionVisible;

  return (
    <motion.div
      className={styles.motion}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={canAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        delay: shouldReduceMotion || !canAnimate ? 0 : (index + 1) * 0.1,
        duration: shouldReduceMotion ? 0 : 0.55,
        ease: EASE,
      }}
    >
      <Link className={styles.cover} to={ROUTES.gallery} aria-label="전체 사진 보기">
        <span className={styles.spine} aria-hidden="true" />
        <span className={styles.pages} aria-hidden="true" />
        <span className={styles.kicker}>더 많은 순간</span>
        <span className={styles.body}>
          <span className={styles.copy}>전체 보기</span>
          <span className={styles.rule} aria-hidden="true" />
        </span>
        <span className={styles.arrow} aria-hidden="true">
          <ArrowRightIcon />
        </span>
      </Link>
    </motion.div>
  );
};

export { Cover };
