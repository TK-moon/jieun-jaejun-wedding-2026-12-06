import type { GravityVector } from '../_utils';

interface AccelerometerInput {
  gravity: GravityVector;
  screenAngle: number;
  time: number;
}

type AccelerometerStatus = 'idle' | 'active' | 'fallback';

export type { AccelerometerInput, AccelerometerStatus };
