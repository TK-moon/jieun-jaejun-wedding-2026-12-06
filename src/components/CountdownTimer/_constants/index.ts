import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const WEDDING_DAY = dayjs.tz('2026-12-06 00:00:00', 'Asia/Seoul');
