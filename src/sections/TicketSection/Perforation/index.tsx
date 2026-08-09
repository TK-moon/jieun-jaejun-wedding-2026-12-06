import type { FC } from 'react';
import styles from '../index.module.css';

interface Props {}

const Perforation: FC<Props> = () => {
  return (
    <div className={styles.perforation} aria-hidden="true">
      <span className={styles.notch_left} />
      <span className={styles.dash} />
      <span className={styles.notch_right} />
    </div>
  );
};

export { Perforation };
