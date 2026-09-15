import { WIDTH, HEIGHT, TAU, SILVER } from '../_constants';
import { createSecurityPatterns } from './securityPatterns';

const noise = (x: number, y: number) => {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

const createFoilMaterial = () => {
  const { engraving, microtext } = createSecurityPatterns();

  return Array.from({ length: WIDTH * HEIGHT }, (_, index) => {
    const x = (index % WIDTH) / WIDTH;
    const y = Math.floor(index / WIDTH) / HEIGHT;
    const cellX = Math.floor(x * 8);
    const cellY = Math.floor(y * 6);
    const facet = noise(cellX, cellY);
    const grain = noise(index % WIDTH, Math.floor(index / WIDTH));
    const gratingAngle = Math.floor(facet * 6) * (Math.PI / 6);
    const radius = Math.hypot((x - 0.5) * 1.48, y - 28 / 48);
    const engraved = engraving[index * 4 + 3] / 255;
    const letters = microtext[index * 4 + 3] / 255;

    return {
      // Grating directions and image masks belong to the material, never to the input.
      gratingX: Math.cos(gratingAngle),
      gratingY: Math.sin(gratingAngle),
      phase: facet * 0.65 + x * 0.32 + radius * 0.6,
      sheenPhase: x * 1.1 - y * 0.45 + facet * 0.12,
      engraved,
      letters,
      grain,
      base: 0.57 + (grain - 0.5) * 0.025 - engraved * 0.045 - letters * 0.02,
      // Fine concentric relief around the optical centre, anchored to the sticker.
      relief: (0.5 + 0.5 * Math.cos(radius * 180)) ** 12,
    };
  });
};

const createFoilRenderer = (
  canvas: HTMLCanvasElement,
  reflectionCanvas: HTMLCanvasElement,
  material: ReturnType<typeof createFoilMaterial>,
) => {
  const context = canvas.getContext('2d', { alpha: false });
  const reflectionContext = reflectionCanvas.getContext('2d');
  if (!context || !reflectionContext) return;

  canvas.width = reflectionCanvas.width = WIDTH;
  canvas.height = reflectionCanvas.height = HEIGHT;
  const baseImage = context.createImageData(WIDTH, HEIGHT);
  const reflection = reflectionContext.createImageData(WIDTH, HEIGHT);
  for (let index = 0; index < material.length; index++) {
    const offset = index * 4;
    for (let channel = 0; channel < 3; channel++) {
      baseImage.data[offset + channel] = SILVER[channel] * material[index].base;
    }
    baseImage.data[offset + 3] = 255;
  }
  // The engraved silver substrate is drawn once and remains completely stationary.
  context.putImageData(baseImage, 0, 0);
  const reflectedColour = [0, 0, 0];

  return (viewX: number, viewY: number, reflectionX: number, reflectionY: number) => {
    // Two fixed image masks emulate optical channels visible at different angles.
    // Input changes optical phase, with no position clamp or texture translation.
    const imagePhase = reflectionX * 0.85 + reflectionY * 0.55;
    const engravingLight = (0.5 + 0.5 * Math.cos(imagePhase)) ** 5;
    const textLight = (0.5 - 0.5 * Math.cos(imagePhase)) ** 5;

    for (let index = 0; index < material.length; index++) {
      const point = material[index];
      const offset = index * 4;
      const incidence = reflectionX * point.gratingX * 0.36 + reflectionY * point.gratingY * 0.42;
      const spectrum = (point.phase + incidence) * TAU;
      const replay = (0.5 + 0.5 * Math.cos(incidence * 3.7 - point.phase * TAU)) ** 3;
      const secondOrder = (0.5 + 0.5 * Math.cos(incidence * 5.3 + point.phase * TAU)) ** 8;
      const sheen = (0.5 + 0.5 * Math.cos(viewX * 0.65 - viewY * 0.4 - point.sheenPhase)) ** 18;
      const imageLight = point.engraved * engravingLight + point.letters * textLight;
      const dormantImage = point.engraved * (1 - engravingLight) + point.letters * (1 - textLight);
      const sparkle = point.grain > 0.985 ? secondOrder * (point.grain - 0.985) * 1600 : 0;
      const colourStrength = 28 + replay * 72 + secondOrder * 20 + imageLight * 60;
      const silverLight =
        22 +
        sheen * 68 +
        imageLight * 38 +
        point.relief * replay * 12 +
        sparkle -
        dormantImage * 10;

      let alpha = 0;
      for (let channel = 0; channel < 3; channel++) {
        // Narrow overlapping RGB bands suggest diffraction, not a flat rainbow overlay.
        const spectralColour = (0.5 + 0.5 * Math.cos(spectrum - (channel * TAU) / 3)) ** 2;
        const base = baseImage.data[offset + channel];
        const reflected = base + silverLight + spectralColour * colourStrength;
        reflectedColour[channel] =
          reflected > 230 ? 230 + 25 * (1 - Math.exp(-(reflected - 230) / 25)) : reflected;
        alpha = Math.max(alpha, (reflectedColour[channel] - base) / (255 - base));
      }
      for (let channel = 0; channel < 3; channel++) {
        const base = baseImage.data[offset + channel];
        reflection.data[offset + channel] =
          alpha > 0 ? base + (reflectedColour[channel] - base) / alpha : 0;
      }
      reflection.data[offset + 3] = alpha * 255;
    }
    reflectionContext.putImageData(reflection, 0, 0);
  };
};

export { createFoilMaterial, createFoilRenderer };
