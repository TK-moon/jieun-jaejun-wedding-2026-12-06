import type { FC } from 'react';
import { PHOTO_GIFT } from '../../_constants';
import styles from './index.module.css';

interface Props {}

const Bearer: FC<Props> = () => {
  const { bearerLabel, bearerLabelEn } = PHOTO_GIFT.passport;

  return (
    <div className={styles.bearer}>
      <p className={styles.label}>{bearerLabel}</p>
      <p className={`${styles.label} ${styles.labelEn}`}>{bearerLabelEn}</p>
      <span className={styles.line} aria-hidden="true" />
    </div>
  );
};

export { Bearer };
