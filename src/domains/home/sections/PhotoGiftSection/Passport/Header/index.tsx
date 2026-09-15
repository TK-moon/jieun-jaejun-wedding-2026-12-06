import type { FC } from 'react';
import { PHOTO_GIFT } from '../../_constants';
import styles from './index.module.css';

interface Props {}

const Header: FC<Props> = () => {
  const { kickerKo, kicker, countryKo, country } = PHOTO_GIFT.passport;

  return (
    <header className={styles.header}>
      <p className={styles.document}>
        <span className={styles.kickerKo}>{kickerKo}</span>
        <span className={styles.kicker}>{kicker}</span>
      </p>
      <p className={styles.country}>
        <span className={styles.countryKo}>{countryKo}</span>
        <span>{country}</span>
      </p>
    </header>
  );
};

export { Header };
