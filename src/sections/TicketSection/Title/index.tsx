import type { FC } from 'react';
import { TICKET } from '../_constants';
import styles from './index.module.css';

interface Props {}

const Title: FC<Props> = () => {
  return (
    <div className={styles.title}>
      <p className={styles.title_label}>{TICKET.title}</p>
    </div>
  );
};

export { Title };
