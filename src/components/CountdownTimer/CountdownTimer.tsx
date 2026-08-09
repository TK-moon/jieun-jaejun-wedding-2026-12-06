import type { FC } from 'react';
import { useCountdown, UNITS_MAP } from '../../hooks/useCountdown';
import { WEDDING_DAY } from './_constants';
import styles from './CountdownTimer.module.css';

interface Props {}

const CountdownTimer: FC<Props> = () => {
  const countdown = useCountdown({ targetDate: WEDDING_DAY.toDate() }, { timeZone: 'KST' });

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
