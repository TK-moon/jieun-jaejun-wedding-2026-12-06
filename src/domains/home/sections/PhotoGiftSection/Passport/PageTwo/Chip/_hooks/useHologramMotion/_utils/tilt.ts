import type { MotionInput } from '../../../_types';
import { getSmoothingFactor } from '../../../_utils/motion';
import { normalizeGravity as normalize, type GravityVector } from '../../useAccelerometer/_utils';

interface TiltCalibration {
  forward: GravityVector;
  right: GravityVector;
  up: GravityVector;
  screenAngle: number;
}

interface TiltState {
  gravity: GravityVector;
  calibration: TiltCalibration;
  input: MotionInput;
  stillTimeMs: number;
}

const SENSOR_SMOOTHING_MS = 24;
const POSTURE_FOLLOW_MS = 450;
const RECENTER_DELAY_MS = 180;
const STILL_ANGULAR_SPEED = (2 * Math.PI) / 180;
const RESPONSE_ANGLE = (6 * Math.PI) / 180;
const DEAD_ZONE = (0.15 * Math.PI) / 180;
// Preserve the response near the centre without compressing larger angles.
const TILT_SENSITIVITY = 0.85 * (2 / Math.PI);

const dot = (a: GravityVector, b: GravityVector) => a.x * b.x + a.y * b.y + a.z * b.z;

const getCalibrationAxis = (
  forward: GravityVector,
  previousRight?: GravityVector,
): GravityVector => {
  if (previousRight && Math.abs(dot(previousRight, forward)) < 0.95) return previousRight;
  if (Math.abs(forward.x) < 0.9) return { x: 1, y: 0, z: 0 };
  return { x: 0, y: 0, z: 1 };
};

const createTiltCalibration = (
  gravity: GravityVector,
  screenAngle: number,
  previousRight?: GravityVector,
): TiltCalibration => {
  const forward = normalize(gravity);
  // Project the screen's horizontal axis onto the initial gravity tangent plane.
  // A second axis handles a phone initially held on its side without a singularity.
  const axis = getCalibrationAxis(forward, previousRight);
  const projection = dot(axis, forward);
  const right = normalize({
    x: axis.x - projection * forward.x,
    y: axis.y - projection * forward.y,
    z: axis.z - projection * forward.z,
  });
  const up = {
    x: forward.y * right.z - forward.z * right.y,
    y: forward.z * right.x - forward.x * right.z,
    z: forward.x * right.y - forward.y * right.x,
  };
  return { forward, right, up, screenAngle };
};

const followTiltCalibration = (
  gravity: GravityVector,
  calibration: TiltCalibration,
  blend: number,
): TiltCalibration => {
  if (Math.hypot(gravity.x, gravity.y, gravity.z) < 0.001) return calibration;
  const direction = normalize(gravity);
  const alignment = Math.max(-1, Math.min(1, dot(direction, calibration.forward)));
  const angle = Math.acos(alignment);
  if (angle < 0.00001) return calibration;
  const tangent = {
    x: direction.x - calibration.forward.x * alignment,
    y: direction.y - calibration.forward.y * alignment,
    z: direction.z - calibration.forward.z * alignment,
  };
  // Spherical interpolation also handles lying back or turning the phone over.
  const turn =
    Math.hypot(tangent.x, tangent.y, tangent.z) > 0.001 ? normalize(tangent) : calibration.up;
  const cosine = Math.cos(angle * blend);
  const sine = Math.sin(angle * blend);
  return createTiltCalibration(
    {
      x: calibration.forward.x * cosine + turn.x * sine,
      y: calibration.forward.y * cosine + turn.y * sine,
      z: calibration.forward.z * cosine + turn.z * sine,
    },
    calibration.screenAngle,
    calibration.right,
  );
};

const getTiltInput = (gravity: GravityVector, calibration: TiltCalibration) => {
  const depth = dot(gravity, calibration.forward);
  const response = (angle: number) => {
    const offset = Math.sign(angle) * Math.max(0, Math.abs(angle) - DEAD_ZONE);
    return TILT_SENSITIVITY * (offset / RESPONSE_ANGLE);
  };
  return {
    x: response(Math.atan2(dot(gravity, calibration.right), depth)),
    y: response(Math.atan2(dot(gravity, calibration.up), depth)),
  };
};

const updateTilt = (
  previous: TiltState | undefined,
  gravity: GravityVector,
  screenAngle: number,
  elapsedMs: number,
): TiltState => {
  if (!previous || previous.calibration.screenAngle !== screenAngle) {
    const calibration = createTiltCalibration(gravity, screenAngle);
    return { gravity, calibration, input: getTiltInput(gravity, calibration), stillTimeMs: 0 };
  }

  const elapsed = Math.max(0, elapsedMs);
  const postureElapsed = Math.min(100, elapsed);
  let calibration = previous.calibration;
  // Filter sensor noise independently of the slower posture adjustment below.
  const blend = getSmoothingFactor(elapsed, SENSOR_SMOOTHING_MS);
  const filteredGravity = {
    x: previous.gravity.x + (gravity.x - previous.gravity.x) * blend,
    y: previous.gravity.y + (gravity.y - previous.gravity.y) * blend,
    z: previous.gravity.z + (gravity.z - previous.gravity.z) * blend,
  };

  // Compare the angle travelled with a speed threshold, independent of sensor frequency.
  const lengthProduct =
    Math.hypot(previous.gravity.x, previous.gravity.y, previous.gravity.z) *
    Math.hypot(filteredGravity.x, filteredGravity.y, filteredGravity.z);
  const isMoving =
    dot(previous.gravity, filteredGravity) <
    lengthProduct * Math.cos((STILL_ANGULAR_SPEED * postureElapsed) / 1000);
  const stillTimeMs = isMoving
    ? 0
    : Math.min(RECENTER_DELAY_MS, previous.stillTimeMs + postureElapsed);

  // Calculate this input before moving the neutral posture for the next event.
  const input = getTiltInput(filteredGravity, calibration);
  // Keep a fixed reference while tilting so continued movement cannot be followed away.
  if (stillTimeMs >= RECENTER_DELAY_MS) {
    calibration = followTiltCalibration(
      filteredGravity,
      calibration,
      getSmoothingFactor(postureElapsed, POSTURE_FOLLOW_MS),
    );
  }
  return { gravity: filteredGravity, calibration, input, stillTimeMs };
};

export { updateTilt };
export type { TiltState };
