import { WEDDING_INFO } from '@/constants';
import { dayjs } from '@/lib/dayjs';
import { padMrz } from '../_utils';

const ceremony = dayjs.tz(WEDDING_INFO.ceremony);
const { bride, groom } = WEDDING_INFO;

export const PHOTO_GIFT = {
  label: '이벤트',
  title: '사진 한 장',
  messages: [
    '식장에서 저희 둘의 모습을 사진으로 남겨 주세요.',
    '카카오톡으로 보내 주시면',
    '작은 기프티콘으로 마음을 전하겠습니다.',
  ],
  messagesEn: [
    'Please photograph the two of us at the ceremony',
    'and send it via KakaoTalk.',
    'We will send a small gifticon in return.',
  ],
  steps: [
    { code: '01', text: '신랑·신부를 사진에 담아 주세요' },
    { code: '02', text: '카카오톡으로 보내 주세요' },
    { code: '03', text: '기프티콘을 받아 가세요' },
  ],
  passport: {
    kickerKo: '여권',
    kicker: 'PASSPORT',
    countryKo: '대한민국',
    country: 'REPUBLIC OF KOREA',
    stamp: '사진답례',
    number: `${groom.code}${bride.code}${ceremony.format('MMDD')}`,
    bearerLabel: '소지인의 서명',
    bearerLabelEn: 'Signature of bearer',
    mrz: [
      padMrz(`P<KOR${bride.name.en}<<${groom.name.en}`),
      padMrz(`${groom.code}${bride.code}${ceremony.format('YYMMDD')}<<<GIFT`),
    ],
  },
} as const;
