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

const getScreenGravity = (
  gravity: DeviceMotionEventAcceleration | null,
  acceleration: DeviceMotionEventAcceleration | null,
  screenAngle: number,
): GravityVector | null => {
  if (!isFiniteVector(gravity)) return null;
  // Remove translation when the browser supplies gravity-compensated acceleration.
  let { x, y, z } = gravity;
  if (isFiniteVector(acceleration)) {
    x -= acceleration.x;
    y -= acceleration.y;
    z -= acceleration.z;
  }
  const length = Math.hypot(x, y, z);
  if (length < 4 || length > 16) return null;
  const radians = (screenAngle * Math.PI) / 180;
  return normalizeGravity({
    x: x * Math.cos(radians) + y * Math.sin(radians),
    y: -x * Math.sin(radians) + y * Math.cos(radians),
    z,
  });
};

export { getScreenGravity, normalizeGravity };
export type { GravityVector };
