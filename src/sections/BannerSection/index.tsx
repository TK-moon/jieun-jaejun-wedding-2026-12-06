import type { FC } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { dayjs } from '../../lib/dayjs';
import { WEDDING_INFO } from '../../constants';
import styles from './index.module.css';

interface Props {}

const EASE = 'easeOut' as const;

const BannerSection: FC<Props> = () => {
  const ceremony = dayjs.tz(WEDDING_INFO.ceremony);
  const shouldReduceMotion = useReducedMotion();
  const duration = shouldReduceMotion ? 0 : undefined;

  return (
    <section className={styles.container}>
      <div className={styles.frame}>
        <motion.p
          className={styles.names}
          initial={shouldReduceMotion ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: duration ?? 0.45, ease: EASE }}
        >
          {WEDDING_INFO.bride.name.en} &amp; {WEDDING_INFO.groom.name.en}
        </motion.p>
        <motion.p
          className={styles.date}
          initial={shouldReduceMotion ? false : { opacity: 0, x: -12, rotate: 180 }}
          animate={{ opacity: 1, x: 0, rotate: 180 }}
          transition={{
            delay: shouldReduceMotion ? 0 : 0.42,
            duration: duration ?? 0.4,
            ease: EASE,
          }}
        >
          {ceremony.format('YYYY. MM. DD.')} {ceremony.format('dddd').toUpperCase()}
        </motion.p>
        <motion.img
          src=""
          alt="Banner"
          className={styles.main_image}
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: shouldReduceMotion ? 0 : 0.22,
            duration: duration ?? 0.55,
            ease: EASE,
          }}
        />
        <motion.p
          className={styles.venue}
          initial={shouldReduceMotion ? false : { opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: shouldReduceMotion ? 0 : 0.48,
            duration: duration ?? 0.4,
            ease: EASE,
          }}
        >
          {WEDDING_INFO.venue.name}
        </motion.p>
        <motion.p
          className={styles.footer}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: shouldReduceMotion ? 0 : 0.52,
            duration: duration ?? 0.4,
            ease: EASE,
          }}
        >
          두 사람의 새로운 여정
        </motion.p>
      </div>
    </section>
  );
};

export { BannerSection };
