import type { FC } from 'react';
import { WEDDING_DAY } from '../../components/CountdownTimer/_constants';
import { useCountdown, UNITS_MAP } from '../../hooks/useCountdown';
import { TICKET } from './_constants';
import styles from './index.module.css';

interface Props {}

const TicketSection: FC<Props> = () => {
  const countdown = useCountdown({ targetDate: WEDDING_DAY.toDate() }, { timeZone: 'KST' });

  return (
    <section className={styles.container} aria-labelledby="ticket-title">
      <article className={styles.ticket_frame}>
        <header className={styles.header}>
          <p className={styles.header_title} id="ticket-title">
            {TICKET.title}
          </p>
        </header>

        <div className={styles.body}>
          <div className={styles.route}>
            <div className={styles.endpoint}>
              <p className={styles.code}>{TICKET.from.code}</p>
              <p className={styles.endpoint_name}>{TICKET.from.name}</p>
              <p className={styles.endpoint_meta}>{TICKET.date}</p>
            </div>

            <div className={styles.flight_path} aria-hidden="true">
              <span className={styles.path_line} />
              <svg className={styles.plane} viewBox="0 0 24 24" focusable="false">
                <path
                  d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                  fill="currentColor"
                />
              </svg>
              <span className={styles.path_line} />
            </div>

            <div className={styles.endpoint}>
              <p className={styles.code}>{TICKET.to.code}</p>
              <p className={styles.endpoint_name}>{TICKET.to.name}</p>
              <p className={styles.endpoint_meta}>{TICKET.day}</p>
            </div>
          </div>

          <dl className={styles.meta_row}>
            <div className={styles.meta_item}>
              <dt>Passenger</dt>
              <dd>{TICKET.passenger}</dd>
            </div>
            <div className={styles.meta_item}>
              <dt>Flight</dt>
              <dd>{TICKET.flight}</dd>
            </div>
          </dl>

          <dl className={`${styles.meta_row} ${styles.meta_row_triple}`}>
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

          <p className={styles.venue}>{TICKET.venue}</p>

          <div
            className={styles.countdown}
            role="timer"
            aria-live="off"
            aria-label="Boarding countdown"
          >
            <p className={styles.countdown_caption}>Boarding In</p>
            <dl className={styles.countdown_row}>
              {UNITS_MAP.map(({ key, label }) => (
                <div className={styles.countdown_item} key={key}>
                  <dt>{label}</dt>
                  <dd>{String(countdown[key]).padStart(key === 'days' ? 3 : 2, '0')}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className={styles.perforation} aria-hidden="true">
          <span className={styles.notch_left} />
          <span className={styles.dash} />
          <span className={styles.notch_right} />
        </div>

        <div className={styles.stub}>
          <div className={styles.barcode} aria-hidden="true">
            {BARCODE_BARS.map((width, index) => (
              <span key={index} className={styles.bar} style={{ width }} />
            ))}
          </div>
          <p className={styles.stub_code}>JJ-2026-1206</p>
        </div>
      </article>
    </section>
  );
};

const BARCODE_BARS = [
  '2px',
  '1px',
  '3px',
  '1px',
  '1px',
  '2px',
  '1px',
  '3px',
  '2px',
  '1px',
  '1px',
  '2px',
  '3px',
  '1px',
  '2px',
  '1px',
  '1px',
  '3px',
  '1px',
  '2px',
  '1px',
  '2px',
  '3px',
  '1px',
  '1px',
  '2px',
  '1px',
  '3px',
  '2px',
  '1px',
] as const;

export { TicketSection };
