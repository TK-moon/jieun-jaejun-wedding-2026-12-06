import { useId, type FC } from 'react';
import { Header } from './Header';
import { MapLinks } from './MapLinks';
import { Ticket } from './Ticket';
import styles from './index.module.css';

interface Props {}

const TicketSection: FC<Props> = () => {
  const titleId = useId();

  return (
    <section className={styles.container} aria-labelledby={titleId}>
      <Header titleId={titleId} />
      <Ticket />
      <MapLinks />
    </section>
  );
};

export { TicketSection };
