import type { FC } from 'react';
import { TICKET } from '../_constants';
import { Barcode } from './Barcode';
import styles from './index.module.css';

interface Props {
  isVisible: boolean;
}

const Stub: FC<Props> = (props) => {
  const { isVisible } = props;

  return (
    <div className={styles.stub}>
      <Barcode isVisible={isVisible} />
      <p className={styles.stub_code}>{TICKET.stubCode}</p>
    </div>
  );
};

export { Stub };
