import { dayjs } from '../../../lib/dayjs';
import { WEDDING_INFO } from '../../../constants';

const CEREMONY_DURATION_HOURS = 2;

const escapeIcsText = (value: string): string => {
  return value
    .replaceAll('\\', '\\\\')
    .replaceAll(';', '\\;')
    .replaceAll(',', '\\,')
    .replaceAll('\n', '\\n');
};

const formatIcsUtc = (date: Date): string => {
  return dayjs(date).utc().format('YYYYMMDD[T]HHmmss[Z]');
};

const buildWeddingIcs = (): string => {
  const start = dayjs.tz(WEDDING_INFO.ceremony);
  const end = start.add(CEREMONY_DURATION_HOURS, 'hour');
  const title = `${WEDDING_INFO.bride.name.ko} · ${WEDDING_INFO.groom.name.ko} 결혼식`;
  const location = `${WEDDING_INFO.venue.name} ${WEDDING_INFO.venue.hall} ${WEDDING_INFO.venue.floor}, ${WEDDING_INFO.venue.address}`;
  const stamp = formatIcsUtc(new Date());

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//jieun-jaejun-wedding//KO',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:wedding-${start.format('YYYYMMDD')}@jieun-jaejun`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${formatIcsUtc(start.toDate())}`,
    `DTEND:${formatIcsUtc(end.toDate())}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `LOCATION:${escapeIcsText(location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
};

const downloadWeddingIcs = (): void => {
  const ics = buildWeddingIcs();
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const fileName = `${WEDDING_INFO.bride.name.ko}-${WEDDING_INFO.groom.name.ko}-결혼식.ics`;

  link.href = url;
  link.download = fileName;
  link.rel = 'noopener';
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
};

export { buildWeddingIcs, downloadWeddingIcs };
