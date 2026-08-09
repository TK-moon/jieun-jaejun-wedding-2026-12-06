import { DEFAULT_TIME_ZONE, dayjs } from '../lib/dayjs';

export const WEDDING_INFO = {
  groom: {
    name: {
      ko: '재준',
      en: 'JAEJUN',
    },
    code: 'JJ',
  },
  bride: {
    name: {
      ko: '지은',
      en: 'JIEUN',
    },
    code: 'JE',
  },
  ceremony: dayjs.tz('2026-12-06 12:00', 'YYYY-MM-DD HH:mm', DEFAULT_TIME_ZONE).toDate(),
  venue: {
    name: 'THE MERRIDEN',
    floor: '8F',
    building: 'VISION',
    address: '경기도 성남시 분당구 서현로 180번길 19 비전월드 8층',
    maps: {
      naver: 'https://naver.me/GzE979EN',
      kakao: 'https://place.map.kakao.com/1905917949',
    },
  },
} as const;
