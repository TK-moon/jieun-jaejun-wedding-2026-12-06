import type { FC, PropsWithChildren } from 'react';
import styles from './Hero.module.css';

interface Props extends PropsWithChildren {}

const Hero: FC<Props> = ({ children }) => {
  return (
    <section className={styles.hero} aria-labelledby="couple-names">
      <h1 className={styles.title} id="couple-names">
        JIEUN &amp; JAEJUN
      </h1>
      <div className={styles.titleRule} aria-hidden="true" />
      <p className={styles.date}>2026. 12. 06. SUNDAY</p>
      {children}
    </section>
  );
};

export { Hero };
