// Remaining motion after elapsedMs, using the given decay time constant.
const getDecayFactor = (elapsedMs: number, durationMs: number) =>
  Math.exp(-Math.max(0, elapsedMs) / durationMs);

// Fraction of the distance to move toward a target during this frame.
const getSmoothingFactor = (elapsedMs: number, durationMs: number) =>
  1 - getDecayFactor(elapsedMs, durationMs);

export { getDecayFactor, getSmoothingFactor };
