import type { FC } from 'react';
import { CalendarIcon } from '../../../components/icons/CalendarIcon/CalendarIcon';
import { CopyIcon } from '../../../components/icons/CopyIcon/CopyIcon';
import { WEDDING_INFO } from '../../../constants';
import { useToast } from '../../../hooks/useToast';
import { is_clipboard_available } from '../../../lib/clipboard';
import { dayjs } from '../../../lib/dayjs';
import { downloadWeddingIcs, getCeremonyDateTimeKo } from '../_utils';
import styles from './index.module.css';

interface Props {
  titleId: string;
}

const Header: FC<Props> = (props) => {
  const { titleId } = props;

  const toast = useToast();

  const { venue } = WEDDING_INFO;
  const ceremony = dayjs.tz(WEDDING_INFO.ceremony);
  const { date, weekday, time } = getCeremonyDateTimeKo(WEDDING_INFO.ceremony);

  const canCopy = is_clipboard_available();

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(venue.address);
      toast.show({ id: 'copy-address', content: '주소를 복사했어요' });
    } catch {
      toast.show({ id: 'copy-address', content: '주소 복사에 실패했어요' });
    }
  };

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
      <div className={styles.addressRow}>
        <address className={styles.address}>{venue.address}</address>
        {canCopy ? (
          <button
            className={styles.copyAddress}
            type="button"
            onClick={handleCopyAddress}
            aria-label="주소 복사"
          >
            <CopyIcon />
          </button>
        ) : null}
      </div>
    </header>
  );
};

export { Header };
