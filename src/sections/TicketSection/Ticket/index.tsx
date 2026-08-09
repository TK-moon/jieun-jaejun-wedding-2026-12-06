import type { FC } from 'react';
import { Countdown } from '../Countdown';
import { Meta } from '../Meta';
import { Perforation } from '../Perforation';
import { Route } from '../Route';
import { Schedule } from '../Schedule';
import { Stub } from '../Stub';
import { Title } from '../Title';
import { Venue } from '../Venue';
import styles from '../index.module.css';

interface Props {}

const Ticket: FC<Props> = () => {
  return (
    <article className={styles.ticket_frame}>
      <Title />
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
  );
};

export { Ticket };
