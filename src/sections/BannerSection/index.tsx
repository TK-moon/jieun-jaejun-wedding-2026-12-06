import type { FC } from 'react';
import { dayjs } from '../../lib/dayjs';
import { WEDDING_INFO } from '../../constants';
import styles from './index.module.css';

interface Props {}

const BannerSection: FC<Props> = () => {
  const ceremony = dayjs.tz(WEDDING_INFO.ceremony);

  return (
    <section className={styles.container}>
      <div className={styles.frame}>
        <p className={styles.names}>
          {WEDDING_INFO.bride.name.en} &amp; {WEDDING_INFO.groom.name.en}
        </p>
        <p className={styles.date}>
          {ceremony.format('YYYY. MM. DD.')} {ceremony.format('dddd').toUpperCase()}
        </p>
        <img src="" alt="Banner" className={styles.main_image} />
        <p className={styles.venue}>{WEDDING_INFO.venue.name}</p>
        <p className={styles.footer}>메시지</p>
      </div>
    </section>
  );
};

export { BannerSection };
