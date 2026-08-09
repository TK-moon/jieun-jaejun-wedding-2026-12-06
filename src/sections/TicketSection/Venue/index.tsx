import type { FC } from 'react';
import { TICKET } from '../_constants';
import styles from '../index.module.css';

interface Props {}

const Venue: FC<Props> = () => {
  return <p className={styles.venue}>{TICKET.venue}</p>;
};

export { Venue };
