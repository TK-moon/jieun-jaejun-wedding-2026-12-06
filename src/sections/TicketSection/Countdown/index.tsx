import type { FC } from 'react';
import { WEDDING_INFO } from '../../../constants';
import { UNITS_MAP, useCountdown } from '../../../hooks/useCountdown';
import styles from '../index.module.css';

interface Props {}

const Countdown: FC<Props> = () => {
  const countdown = useCountdown({ targetDate: WEDDING_INFO.ceremony }, { timeZone: 'KST' });

  return (
    <div className={styles.countdown} role="timer" aria-live="off" aria-label="Boarding countdown">
      <p className={styles.countdown_caption}>Boarding In</p>
      <dl className={styles.countdown_row}>
        {UNITS_MAP.map(({ key, label }, index) => (
          <div className={styles.countdown_segment} key={key}>
            <div className={styles.countdown_item}>
              <dt>{label}</dt>
              <dd>{String(countdown[key]).padStart(key === 'days' ? 3 : 2, '0')}</dd>
            </div>
            {index < UNITS_MAP.length - 1 ? (
              <span className={styles.countdown_divider} aria-hidden="true">
                :
              </span>
            ) : null}
          </div>
        ))}
      </dl>
    </div>
  );
};

export { Countdown };
