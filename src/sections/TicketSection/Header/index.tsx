import type { FC } from 'react';
import { CalendarIcon } from '../../../components/icons/CalendarIcon/CalendarIcon';
import { dayjs } from '../../../lib/dayjs';
import { WEDDING_INFO } from '../../../constants';
import { downloadWeddingIcs, getCeremonyDateTimeKo } from '../_utils';
import styles from './index.module.css';

interface Props {
  titleId: string;
}

const Header: FC<Props> = (props) => {
  const { titleId } = props;
  const { venue } = WEDDING_INFO;
  const ceremony = dayjs.tz(WEDDING_INFO.ceremony);
  const { date, weekday, time } = getCeremonyDateTimeKo(WEDDING_INFO.ceremony);

  return (
    <header className={styles.header}>
      <p className={styles.eyebrow}>일시 · 장소</p>
      <h2 className={styles.name} id={titleId}>
        {venue.name}
      </h2>
      <p className={styles.hall}>
        {venue.hall} · {venue.floor}
      </p>
      <time className={styles.datetime} dateTime={ceremony.format()}>
        <span className={styles.date}>{date}</span>
        <span className={styles.weekday}>{weekday}</span>
        <span className={styles.time}>{time}</span>
      </time>
      <button className={styles.calendarAdd} type="button" onClick={downloadWeddingIcs}>
        <CalendarIcon />
        <span>캘린더에 추가</span>
      </button>
      <address className={styles.address}>{venue.address}</address>
    </header>
  );
};

export { Header };
