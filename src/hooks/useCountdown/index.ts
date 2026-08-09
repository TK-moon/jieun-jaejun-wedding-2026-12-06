import { useEffect, useState } from 'react';
import type { Countdown, Options, Params } from './_types';
import { getCountdown } from './_utils';

const useCountdown = (params: Params, options?: Options): Countdown => {
  const { targetDate } = params;
  const timeZone = options?.timeZone ?? 'local';
  const targetKey = targetDate instanceof Date ? targetDate.getTime() : targetDate;
  const [countdown, setCountdown] = useState(() => getCountdown(targetDate, timeZone));

  useEffect(() => {
    const resolvedTarget = typeof targetKey === 'number' ? new Date(targetKey) : targetKey;
    const tick = () => setCountdown(getCountdown(resolvedTarget, timeZone));

    tick();

    const timer = window.setInterval(tick, 1_000);

    return () => window.clearInterval(timer);
  }, [targetKey, timeZone]);

  return countdown;
};

export { useCountdown };
export type { Countdown, CountdownTimeZone, Options, Params } from './_types';
export { UNITS_MAP } from './_constants';
export { getCountdown } from './_utils';
