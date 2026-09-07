import type { FC } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Picture } from '@/components/Picture';
import { WEDDING_INFO } from '@/constants';
import { dayjs } from '@/lib/dayjs';
import { BANNER_MOTION } from './_constants';
import styles from './index.module.css';
import mainImageWebp from './_images/main.webp';
import mainImageJpg from './_images/main.jpg';

interface Props {}

const BannerSection: FC<Props> = () => {
  const ceremony = dayjs.tz(WEDDING_INFO.ceremony);
  const shouldReduceMotion = useReducedMotion();
  const initial = shouldReduceMotion ? false : 'initial';

  return (
    <section className={styles.container}>
      <div className={styles.frame}>
        <motion.p
          className={styles.names}
          variants={BANNER_MOTION.top}
          initial={initial}
          animate="animate"
        >
          {WEDDING_INFO.bride.name.en} &amp; {WEDDING_INFO.groom.name.en}
        </motion.p>
        <motion.p
          className={styles.date}
          variants={BANNER_MOTION.left}
          initial={initial}
          animate="animate"
        >
          {ceremony.format('YYYY. MM. DD.')} {ceremony.format('dddd').toUpperCase()}
        </motion.p>
        <motion.div
          className={styles.main_image}
          variants={BANNER_MOTION.center}
          initial={initial}
          animate="animate"
        >
          <Picture
            webpSrc={mainImageWebp}
            jpgSrc={mainImageJpg}
            alt="Banner"
            width={1200}
            height={1800}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </motion.div>
        <motion.p
          className={styles.venue}
          variants={BANNER_MOTION.right}
          initial={initial}
          animate="animate"
        >
          {WEDDING_INFO.venue.name}
        </motion.p>
        <motion.p
          className={styles.footer}
          variants={BANNER_MOTION.bottom}
          initial={initial}
          animate="animate"
        >
          두 사람의 새로운 여정
        </motion.p>
      </div>
    </section>
  );
};

export { BannerSection };
