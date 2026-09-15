import type { FC } from 'react';
import { PHOTO_GIFT } from '../../_constants';
import styles from './index.module.css';

interface Props {}

const Mrz: FC<Props> = () => {
  return (
    <div className={styles.mrz} aria-hidden="true">
      {PHOTO_GIFT.passport.mrz.map((line) => (
        <p key={line} className={styles.line}>
          {line}
        </p>
      ))}
    </div>
  );
};

export { Mrz };
