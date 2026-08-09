import { dayjs } from '../../../lib/dayjs';

const WEEKDAYS_KO = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'] as const;

interface CeremonyDateTimeKo {
  date: string;
  weekday: string;
  time: string;
}

const getCeremonyDateTimeKo = (date: Date): CeremonyDateTimeKo => {
  const ceremony = dayjs.tz(date);
  const hour = ceremony.hour();
  const period = hour < 12 ? '오전' : '오후';
  const hour12 = hour % 12 || 12;

  return {
    date: ceremony.format('YYYY년 M월 D일'),
    weekday: WEEKDAYS_KO[ceremony.day()],
    time: `${period} ${hour12}시`,
  };
};

const formatCeremonyDateTimeKo = (date: Date): string => {
  const { date: dateLabel, weekday, time } = getCeremonyDateTimeKo(date);

  return `${dateLabel} ${weekday} ${time}`;
};

export { formatCeremonyDateTimeKo, getCeremonyDateTimeKo };
export { buildWeddingIcs, downloadWeddingIcs } from './calendar';
