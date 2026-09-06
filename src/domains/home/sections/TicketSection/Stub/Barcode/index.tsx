import type { FC } from 'react';
import { BARCODE_BARS } from './_constants';
import styles from './index.module.css';

interface Props {
  isVisible: boolean;
}

const Barcode: FC<Props> = (props) => {
  const { isVisible } = props;

  return (
    <div
      className={[styles.barcode, isVisible ? styles.is_visible : null].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      {BARCODE_BARS.map((width, index) => (
        <span key={index} className={styles.bar} style={{ width }} />
      ))}
    </div>
  );
};

export { Barcode };
