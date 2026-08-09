import type { FC } from 'react';
import { Countdown } from './Countdown';
import { Header } from './Header';
import { Meta } from './Meta';
import { Perforation } from './Perforation';
import { Route } from './Route';
import { Schedule } from './Schedule';
import { Stub } from './Stub';
import { Venue } from './Venue';
import styles from './index.module.css';

interface Props {}

const TicketSection: FC<Props> = () => {
  return (
    <section className={styles.container} aria-labelledby="ticket-title">
      <article className={styles.ticket_frame}>
        <Header />

        <div className={styles.body}>
          <Route />
          <Schedule />
          <Countdown />
          <Meta />
          <Venue />
        </div>

        <Perforation />
        <Stub />
      </article>
    </section>
  );
};

export { TicketSection };
