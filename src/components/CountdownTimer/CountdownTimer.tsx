import type { FC } from 'react';
import { useEffect, useState } from 'react';
import styles from './CountdownTimer.module.css';
import { getCountdown } from './_utils';
import { UNITS_MAP, WEDDING_DAY } from './_constants';

interface Props {}

const CountdownTimer: FC<Props> = () => {
  const [countdown, setCountdown] = useState(getCountdown(WEDDING_DAY.toDate()));

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown(WEDDING_DAY.toDate())), 1_000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={styles.countdown} role="timer" aria-live="off">
      {UNITS_MAP.map(({ key, label }, index) => (
        <div className={styles.segment} key={key}>
          <div className={styles.unit}>
            <span className={styles.value} aria-label={`${countdown[key]} ${label}`}>
              {String(countdown[key]).padStart(key === 'days' ? 3 : 2, '0')}
            </span>
            <span className={styles.label} aria-hidden="true">
              {label}
            </span>
          </div>
          {index < UNITS_MAP.length - 1 ? (
            <span className={styles.divider} aria-hidden="true">
              ·
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export { CountdownTimer };
