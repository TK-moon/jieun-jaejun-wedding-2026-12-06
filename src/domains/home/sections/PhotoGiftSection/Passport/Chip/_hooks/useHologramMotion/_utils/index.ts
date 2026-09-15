interface GravityVector {
  x: number;
  y: number;
  z: number;
}

interface TiltCalibration {
  forward: GravityVector;
  right: GravityVector;
  up: GravityVector;
  screenAngle: number;
}

const RESPONSE_ANGLE = (6 * Math.PI) / 180;
const DEAD_ZONE = (0.15 * Math.PI) / 180;
// The renderer bounds the light separately from the input's movement range.
const MAX_LIGHT_OFFSET = 0.85;

const dot = (a: GravityVector, b: GravityVector) => a.x * b.x + a.y * b.y + a.z * b.z;

const normalize = (vector: GravityVector): GravityVector => {
  const length = Math.hypot(vector.x, vector.y, vector.z);
  return { x: vector.x / length, y: vector.y / length, z: vector.z / length };
};

const getScreenGravity = (
  gravity: DeviceMotionEventAcceleration,
  acceleration: DeviceMotionEventAcceleration | null,
  screenAngle: number,
): GravityVector | null => {
  if (
    gravity.x === null ||
    gravity.y === null ||
    gravity.z === null ||
    !Number.isFinite(gravity.x) ||
    !Number.isFinite(gravity.y) ||
    !Number.isFinite(gravity.z)
  )
    return null;
  const hasAcceleration =
    acceleration &&
    typeof acceleration.x === 'number' &&
    Number.isFinite(acceleration.x) &&
    typeof acceleration.y === 'number' &&
    Number.isFinite(acceleration.y) &&
    typeof acceleration.z === 'number' &&
    Number.isFinite(acceleration.z);
  // Remove translation when the browser supplies gravity-compensated acceleration.
  const x = gravity.x - (hasAcceleration ? acceleration.x! : 0);
  const y = gravity.y - (hasAcceleration ? acceleration.y! : 0);
  const z = gravity.z - (hasAcceleration ? acceleration.z! : 0);
  const length = Math.hypot(x, y, z);
  if (length < 4 || length > 16) return null;
  const radians = (screenAngle * Math.PI) / 180;
  return normalize({
    x: x * Math.cos(radians) + y * Math.sin(radians),
    y: -x * Math.sin(radians) + y * Math.cos(radians),
    z,
  });
};

const createTiltCalibration = (
  gravity: GravityVector,
  screenAngle: number,
  previousRight?: GravityVector,
): TiltCalibration => {
  const forward = normalize(gravity);
  // Project the screen's horizontal axis onto the initial gravity tangent plane.
  // A second axis handles a phone initially held on its side without a singularity.
  const axis =
    previousRight && Math.abs(dot(previousRight, forward)) < 0.95
      ? previousRight
      : Math.abs(forward.x) < 0.9
        ? { x: 1, y: 0, z: 0 }
        : { x: 0, y: 0, z: 1 };
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
    // Unlike tanh, this retains a gradual response at large posture offsets.
    return MAX_LIGHT_OFFSET * (2 / Math.PI) * Math.atan(offset / RESPONSE_ANGLE);
  };
  return {
    x: response(Math.atan2(dot(gravity, calibration.right), depth)),
    y: response(Math.atan2(dot(gravity, calibration.up), depth)),
  };
};

export { getScreenGravity, createTiltCalibration, followTiltCalibration, getTiltInput };
export type { GravityVector, TiltCalibration };
