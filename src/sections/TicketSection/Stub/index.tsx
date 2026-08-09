import type { FC } from 'react';
import { TICKET } from '../_constants';
import { Barcode } from './Barcode';
import styles from '../index.module.css';

interface Props {}

const Stub: FC<Props> = () => {
  return (
    <div className={styles.stub}>
      <Barcode />
      <p className={styles.stub_code}>{TICKET.stubCode}</p>
    </div>
  );
};

export { Stub };
