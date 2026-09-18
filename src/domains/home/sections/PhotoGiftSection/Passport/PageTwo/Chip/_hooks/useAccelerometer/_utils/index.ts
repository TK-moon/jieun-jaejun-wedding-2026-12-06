interface GravityVector {
  x: number;
  y: number;
  z: number;
}

const normalizeGravity = (vector: GravityVector): GravityVector => {
  const length = Math.hypot(vector.x, vector.y, vector.z);
  return { x: vector.x / length, y: vector.y / length, z: vector.z / length };
};

const isFiniteVector = (vector: DeviceMotionEventAcceleration | null): vector is GravityVector =>
  vector !== null &&
  Number.isFinite(vector.x) &&
  Number.isFinite(vector.y) &&
  Number.isFinite(vector.z);

const hasGravityMagnitude = ({ x, y, z }: GravityVector) => {
  const length = Math.hypot(x, y, z);
  return length >= 4 && length <= 16;
};

const rotateToScreen = ({ x, y, z }: GravityVector, screenAngle: number): GravityVector => {
  const radians = (screenAngle * Math.PI) / 180;
  return normalizeGravity({
    x: x * Math.cos(radians) + y * Math.sin(radians),
    y: -x * Math.sin(radians) + y * Math.cos(radians),
    z,
  });
};

const getScreenGravity = (
  gravity: DeviceMotionEventAcceleration | null,
  acceleration: DeviceMotionEventAcceleration | null,
  screenAngle: number,
): GravityVector | null => {
  if (!isFiniteVector(gravity)) return null;
  // Remove translation when the browser supplies gravity-compensated acceleration.
  if (isFiniteVector(acceleration)) {
    const compensated = {
      x: gravity.x - acceleration.x,
      y: gravity.y - acceleration.y,
      z: gravity.z - acceleration.z,
    };
    if (hasGravityMagnitude(compensated)) return rotateToScreen(compensated, screenAngle);
  }
  // Inconsistent linear acceleration must not discard a usable gravity-inclusive sample.
  if (!hasGravityMagnitude(gravity)) return null;
  return rotateToScreen(gravity, screenAngle);
};

const canUseOrientationWithoutPrompt = () => {
  const orientation = window.DeviceOrientationEvent as
    (typeof DeviceOrientationEvent & { requestPermission?: unknown }) | undefined;
  return window.isSecureContext && !!orientation && !orientation.requestPermission;
};

const getOrientationGravity = (
  beta: number | null,
  gamma: number | null,
  screenAngle: number,
): GravityVector | null => {
  if (beta === null || gamma === null || !Number.isFinite(beta) || !Number.isFinite(gamma)) {
    return null;
  }

  const pitch = (beta * Math.PI) / 180;
  const roll = (gamma * Math.PI) / 180;
  // W3C Z-X-Y rotation matrix's third row: earth's +Z expressed in device axes.
  // Heading (alpha) does not affect gravity. Reuse the existing screen/tilt pipeline.
  return rotateToScreen(
    {
      x: -Math.cos(pitch) * Math.sin(roll),
      y: Math.sin(pitch),
      z: Math.cos(pitch) * Math.cos(roll),
    },
    screenAngle,
  );
};

export {
  getScreenGravity,
  getOrientationGravity,
  canUseOrientationWithoutPrompt,
  normalizeGravity,
};
export type { GravityVector };
