import dayjs from 'dayjs';
import type { Countdown } from '../_types';

export const getCountdown = (targetDate: Date): Countdown => {
  const totalSeconds = Math.max(dayjs(targetDate).diff(dayjs(), 'second'), 0);

  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
  };
};
