const MOTION_DURATION = 0.4;
const MOTION_EASE = [0.25, 1, 0.5, 1] as const;

const MOTION_FADE_UP = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
} as const;

export { MOTION_DURATION, MOTION_EASE, MOTION_FADE_UP };
