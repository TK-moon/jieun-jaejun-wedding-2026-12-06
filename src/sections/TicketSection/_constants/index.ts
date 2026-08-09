import { dayjs } from '../../../lib/dayjs';
import { WEDDING_INFO } from '../../../constants';

const ceremony = dayjs.tz(WEDDING_INFO.ceremony);

export const TICKET = {
  title: 'BOARDING PASS',
  from: {
    code: WEDDING_INFO.bride.code,
    name: WEDDING_INFO.bride.name.en,
  },
  to: {
    code: WEDDING_INFO.groom.code,
    name: WEDDING_INFO.groom.name.en,
  },
  passenger: 'INVITED GUEST',
  flight: 'WEDDING',
  venue: WEDDING_INFO.venue.name,
  seat: 'WITH US',
  gate: WEDDING_INFO.venue.floor,
  terminal: WEDDING_INFO.venue.building,
  stubCode: `${WEDDING_INFO.groom.code}-${ceremony.format('YYYY-MMDD')}`,
} as const;
