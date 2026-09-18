import type { FC } from 'react';
import { TICKET } from '../_constants';
import styles from './index.module.css';

interface Props {}

const Meta: FC<Props> = () => {
  return (
    <dl className={styles.meta}>
      <div className={`${styles.meta_item} ${styles.wide}`}>
        <dt>Passenger</dt>
        <dd>{TICKET.passenger}</dd>
      </div>
      <div className={`${styles.meta_item} ${styles.wide}`}>
        <dt>Flight</dt>
        <dd>{TICKET.flight}</dd>
      </div>
      <div className={styles.meta_item}>
        <dt>Seat</dt>
        <dd>{TICKET.seat}</dd>
      </div>
      <div className={styles.meta_item}>
        <dt>Gate</dt>
        <dd>{TICKET.gate}</dd>
      </div>
      <div className={styles.meta_item}>
        <dt>Terminal</dt>
        <dd>{TICKET.terminal}</dd>
      </div>
    </dl>
  );
};

export { Meta };
