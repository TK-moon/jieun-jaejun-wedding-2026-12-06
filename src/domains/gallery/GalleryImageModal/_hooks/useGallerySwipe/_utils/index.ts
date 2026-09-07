import { EDGE_RESISTANCE } from '../../../_constants';

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const applyEdgeResistance = (position: number, min: number, resistance = EDGE_RESISTANCE) => {
  const edge = clamp(position, min, 0);
  return edge + (position - edge) * resistance;
};

export { applyEdgeResistance, clamp };
