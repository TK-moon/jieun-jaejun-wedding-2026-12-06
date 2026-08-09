import { useRef, useState, type FC } from 'react';
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver';
import { Countdown } from '../Countdown';
import { Meta } from '../Meta';
import { Perforation } from '../Perforation';
import { Route } from '../Route';
import { Schedule } from '../Schedule';
import { Stub } from '../Stub';
import { Title } from '../Title';
import { Venue } from '../Venue';
import styles from './index.module.css';

interface Props {}

const Ticket: FC<Props> = () => {
  const ticketRef = useRef<HTMLElement>(null);
  const [hasIntersected, setHasIntersected] = useState(false);

  const { isSupported } = useIntersectionObserver(
    ticketRef,
    (entry) => {
      if (entry.isIntersecting) {
        setHasIntersected(true);
      }
    },
    { threshold: 0.45, rootMargin: '0px 0px -18% 0px' },
  );

  const isVisible = !isSupported || hasIntersected;

  return (
    <article
      ref={ticketRef}
      className={[styles.ticket_frame, isVisible ? styles.is_visible : null]
        .filter(Boolean)
        .join(' ')}
    >
      <Title />
      <div className={styles.body}>
        <Route isVisible={isVisible} />
        <Schedule />
        <Countdown />
        <Meta />
        <Venue />
      </div>
      <Perforation />
      <Stub isVisible={isVisible} />
    </article>
  );
};

export { Ticket };
