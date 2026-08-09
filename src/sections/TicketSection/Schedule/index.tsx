import type { FC } from 'react';
import { dayjs } from '../../../lib/dayjs';
import { WEDDING_INFO } from '../../../constants';
import styles from './index.module.css';

interface Props {}

const Schedule: FC<Props> = () => {
  const ceremony = dayjs.tz(WEDDING_INFO.ceremony);

  return (
    <div className={styles.schedule}>
      <time className={styles.schedule_date} dateTime={ceremony.format()}>
        <span className={styles.schedule_date_value}>{ceremony.format('YYYY.MM.DD')}</span>
        <span className={styles.schedule_date_day}>{ceremony.format('dddd').toUpperCase()}</span>
        <span className={styles.schedule_date_time}>{ceremony.format('HH:mm')}</span>
      </time>
    </div>
  );
};

export { Schedule };
