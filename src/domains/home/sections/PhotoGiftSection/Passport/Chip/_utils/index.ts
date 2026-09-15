import type { AccelerometerStatus } from '../../_hooks/useAccelerometer/_types';

type ChipStatus = AccelerometerStatus | 'pointer' | 'scroll' | 'reduced';

const HOLOGRAM_STATUS_DESCRIPTIONS = {
  active: '휴대폰을 기울이거나 스크롤하면 카메라의 빛이 달라져요.',
  pointer: '마우스를 움직이거나 스크롤하면 카메라의 빛이 달라져요.',
  reduced: '동작 줄이기 설정에 따라 정적인 홀로그램을 표시해요.',
  scroll: '스크롤하면 카메라의 빛이 달라져요.',
  idle: '사진 이벤트 카메라 홀로그램',
  fallback: '사진 이벤트 카메라 홀로그램',
} as const satisfies Record<ChipStatus, string>;

const getHologramStatusDescription = (status: ChipStatus) => HOLOGRAM_STATUS_DESCRIPTIONS[status];

export { getHologramStatusDescription };
export type { ChipStatus };
