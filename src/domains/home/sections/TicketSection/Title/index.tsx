import type { FC } from 'react';
import { TICKET } from '../_constants';
import styles from './index.module.css';

interface Props {}

const Title: FC<Props> = () => {
  return (
    <div className={styles.title}>
      <p className={styles.title_label}>{TICKET.title}</p>
      <span className={styles.priority}>
        <span className={styles.priority_mark} aria-hidden="true" />
        {TICKET.priority}
      </span>
    </div>
  );
};

export { Title };
