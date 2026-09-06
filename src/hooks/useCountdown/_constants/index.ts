import { DEFAULT_TIME_ZONE } from '../../../lib/dayjs';
import type { CountdownTimeZone, CountdownUnits } from '../_types';

export const TIME_ZONE_IDS = {
  GMT: 'UTC',
  KST: DEFAULT_TIME_ZONE,
} as const satisfies Record<Exclude<CountdownTimeZone, 'local'>, string>;

export const UNITS_MAP: Array<{ key: keyof CountdownUnits; label: string }> = [
  { key: 'days', label: 'DAYS' },
  { key: 'hours', label: 'HOURS' },
  { key: 'minutes', label: 'MINUTES' },
  { key: 'seconds', label: 'SECONDS' },
];
