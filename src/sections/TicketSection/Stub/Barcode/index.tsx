import type { FC } from 'react';
import { BARCODE_BARS } from './_constants';
import styles from './index.module.css';

interface Props {}

const Barcode: FC<Props> = () => {
  return (
    <div className={styles.barcode} aria-hidden="true">
      {BARCODE_BARS.map((width, index) => (
        <span key={index} className={styles.bar} style={{ width }} />
      ))}
    </div>
  );
};

export { Barcode };
