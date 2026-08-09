import { dayjs } from '../../../lib/dayjs';
import { TIME_ZONE_IDS } from '../_constants';
import type { Countdown, CountdownTimeZone } from '../_types';

export const getCountdown = (
  targetDate: Date | string,
  timeZone: CountdownTimeZone = 'local',
): Countdown => {
  const now = getZonedNow(timeZone);
  const target = getZonedTarget(targetDate, timeZone);
  const totalSeconds = Math.max(target.diff(now, 'second'), 0);

  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
  };
};

const getZonedNow = (timeZone: CountdownTimeZone) => {
  if (timeZone === 'local') {
    return dayjs();
  }

  return dayjs().tz(TIME_ZONE_IDS[timeZone]);
};

const getZonedTarget = (targetDate: Date | string, timeZone: CountdownTimeZone) => {
  if (targetDate instanceof Date) {
    return dayjs(targetDate);
  }

  if (timeZone === 'local') {
    return dayjs(targetDate);
  }

  return dayjs.tz(targetDate, TIME_ZONE_IDS[timeZone]);
};
