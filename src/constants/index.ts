import { DEFAULT_TIME_ZONE, dayjs } from '../lib/dayjs';

/**
 * @TODO 임시 전화번호
 * 실제 전화번호로 변경 필요
 */
const PLACEHOLDER_PHONE = '010-0000-0000';

export const WEDDING_INFO = {
  groom: {
    name: {
      ko: '재준',
      en: 'JAEJUN',
      full: '전재준',
    },
    code: 'JJ',
    order: '차남',
    phone: '010-84975954',
    parents: {
      father: {
        name: '전윤구',
        phone: PLACEHOLDER_PHONE,
        account: {
          bank: '농협',
          number: '351-0290-5432-43',
          holder: '전윤구',
        },
      },
      mother: {
        name: '이경아',
        phone: PLACEHOLDER_PHONE,
        account: {
          bank: '국민은행',
          number: '611-24-0270705',
          holder: '이경아',
        },
      },
    },
    account: {
      bank: '국민은행',
      number: '219402-04-284765',
      holder: '전재준',
    },
  },
  bride: {
    name: {
      ko: '지은',
      en: 'JIEUN',
      full: '김지은',
    },
    code: 'JE',
    order: '장녀',
    phone: '010-85287547',
    parents: {
      father: {
        name: '김병회',
        phone: '010-90337547',
      },
      mother: {
        name: '강승아',
        phone: '010-97767547',
        account: {
          bank: '우리은행',
          number: '1002-028-993506',
          holder: '강승아',
        },
      },
    },
    account: {
      bank: '신한은행',
      number: '110-458-922561',
      holder: '김지은',
    },
  },
  ceremony: dayjs.tz('2026-12-06 14:00', 'YYYY-MM-DD HH:mm', DEFAULT_TIME_ZONE).toDate(),
  venue: {
    name: 'THE MERRIDEN',
    nameKo: '더메리든',
    hall: '메리든홀',
    floor: '8F',
    building: 'VISION',
    address: '경기도 성남시 분당구 서현로 180번길 19 비전월드 8층',
    maps: {
      naver: 'https://naver.me/GzE979EN',
      kakao: 'https://place.map.kakao.com/1905917949',
    },
  },
} as const;
