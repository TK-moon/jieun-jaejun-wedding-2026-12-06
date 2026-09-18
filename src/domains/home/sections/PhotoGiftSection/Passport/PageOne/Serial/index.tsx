import type { FC } from 'react';
import { PHOTO_GIFT } from '../../../_constants';
import styles from './index.module.css';

interface Props {}

const Serial: FC<Props> = () => {
  return (
    <p className={styles.serial} aria-hidden="true">
      {PHOTO_GIFT.passport.number}
    </p>
  );
};

export { Serial };
