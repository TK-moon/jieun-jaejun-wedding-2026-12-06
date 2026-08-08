import type { FC } from 'react';
import styles from './index.module.css';

interface Props {}

const BannerSection: FC<Props> = () => {
  return (
    <section className={styles.container}>
      <div className={styles.frame}>
        <p className={styles.names}>JIEUN &amp; JAEJUN</p>
        <p className={styles.date}>2026. 12. 06. SUNDAY</p>
        <img src="" alt="Banner" className={styles.main_image} />
        <p className={styles.venue}>THE MERRIDEN</p>
        <p className={styles.footer}></p>
      </div>
    </section>
  );
};

export { BannerSection };
