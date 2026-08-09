import type { FC } from 'react';
import { TICKET } from '../_constants';
import styles from '../index.module.css';

interface Props {}

const Header: FC<Props> = () => {
  return (
    <header className={styles.header}>
      <p className={styles.header_title} id="ticket-title">
        {TICKET.title}
      </p>
    </header>
  );
};

export { Header };
