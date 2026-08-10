import { DEFAULT_TIME_ZONE, dayjs } from '../lib/dayjs';

const PLACEHOLDER_PHONE = '010-0000-0000';
const PLACEHOLDER_ACCOUNT_NUMBER = '000-0000-000000';

export const WEDDING_INFO = {
  groom: {
    name: {
      ko: '재준',
      en: 'JAEJUN',
      full: '전재준',
    },
    code: 'JJ',
    order: '차남',
    phone: PLACEHOLDER_PHONE,
    parents: {
      father: {
        name: '전윤구',
        phone: PLACEHOLDER_PHONE,
        account: {
          bank: '○○은행',
          number: PLACEHOLDER_ACCOUNT_NUMBER,
          holder: '전윤구',
        },
      },
      mother: {
        name: '이경아',
        phone: PLACEHOLDER_PHONE,
        account: {
          bank: '○○은행',
          number: PLACEHOLDER_ACCOUNT_NUMBER,
          holder: '이경아',
        },
      },
    },
    account: {
      bank: '국민은행',
      number: '219402-04-284765',
      holder: '전재준',
      kakaoPayUrl: 'https://qr.kakaopay.com/',
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
    phone: PLACEHOLDER_PHONE,
    parents: {
      father: {
        name: '김병회',
        phone: PLACEHOLDER_PHONE,
        account: {
          bank: '○○은행',
          number: PLACEHOLDER_ACCOUNT_NUMBER,
          holder: '김병회',
        },
      },
      mother: {
        name: '강승아',
        phone: PLACEHOLDER_PHONE,
        account: {
          bank: '○○은행',
          number: PLACEHOLDER_ACCOUNT_NUMBER,
          holder: '강승아',
        },
      },
    },
    account: {
      bank: '신한은행',
      number: '110-458-922561',
      holder: '김지은',
      kakaoPayUrl: 'https://qr.kakaopay.com/',
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
