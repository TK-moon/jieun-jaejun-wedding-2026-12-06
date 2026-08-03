import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import type { Countdown } from '../_types';

dayjs.extend(utc);
dayjs.extend(timezone);

export const WEDDING_DAY = dayjs.tz('2026-12-06 00:00:00', 'Asia/Seoul');

export const UNITS_MAP: Array<{ key: keyof Countdown; label: string }> = [
  { key: 'days', label: 'DAYS' },
  { key: 'hours', label: 'HOURS' },
  { key: 'minutes', label: 'MINUTES' },
  { key: 'seconds', label: 'SECONDS' },
];
