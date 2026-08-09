import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export const DEFAULT_TIME_ZONE = 'Asia/Seoul';

dayjs.tz.setDefault(DEFAULT_TIME_ZONE);

export { dayjs };
