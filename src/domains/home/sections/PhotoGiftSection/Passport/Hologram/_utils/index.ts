// A small, deterministic foil texture. All layers share the camera silhouette,
// but their surface normals and optical phases respond differently to the view.
const WIDTH = 142;
const HEIGHT = 96;
const TAU = Math.PI * 2;
const SILVER = [150, 166, 166];
const CHAMPAGNE = [177, 165, 136];

const noise = (x: number, y: number) => {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

const createHologramRenderer = (canvas: HTMLCanvasElement, reflectionCanvas: HTMLCanvasElement) => {
  const context = canvas.getContext('2d', { alpha: false });
  const reflectionContext = reflectionCanvas.getContext('2d');
  if (!context || !reflectionContext) return;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  reflectionCanvas.width = WIDTH;
  reflectionCanvas.height = HEIGHT;
  const image = context.createImageData(WIDTH, HEIGHT);
  const reflection = reflectionContext.createImageData(WIDTH, HEIGHT);
  const surface = Array.from({ length: WIDTH * HEIGHT }, (_, index) => {
    const x = (index % WIDTH) / WIDTH;
    const y = Math.floor(index / WIDTH) / HEIGHT;
    const cellX = Math.floor(x * 23);
    const cellY = Math.floor(y * 17);
    const facet = noise(cellX, cellY);
    const grain = noise(index % WIDTH, Math.floor(index / WIDTH));
    return {
      x,
      y,
      grain,
      // Embossed ripples and differently oriented foil fragments.
      normalX: Math.sin(x * 11 + y * 5) * 0.32 + (facet - 0.5) * 0.24,
      normalY: Math.cos(y * 13 - x * 4) * 0.3 + (noise(cellY, cellX + 19) - 0.5) * 0.24,
      phase: x * 1.6 + y * 0.65 + Math.sin(x * 8 - y * 6) * 0.28 + facet * 0.04,
      groove: Math.sin((x * 96 + y * 58) * TAU) * 0.012,
    };
  });

  const base = [0, 0, 0];
  const lit = [0, 0, 0];

  return (viewX: number, viewY: number, reflectionX: number, reflectionY: number) => {
    const lightX = reflectionX * 0.95;
    const lightY = reflectionY * 0.95;
    const viewPhase = viewX * 1.45 - viewY * 1.1;
    const diffractionX = reflectionX * 0.18;
    const diffractionY = reflectionY * 0.14;

    for (let index = 0; index < surface.length; index++) {
      const point = surface[index];
      const { x, y, grain, normalX, normalY, phase, groove } = point;
      const incidence = normalX * viewX + normalY * viewY;
      const spectrum = (phase + viewPhase + incidence * 0.85) * TAU;
      // Crossed diffraction waves slide in opposite directions as the view changes.
      const waveA = Math.sin((x + diffractionX) * 44 + (y - diffractionY) * 31);
      const waveB = Math.sin(Math.hypot(x - 0.3 - diffractionX, y - 0.65 + diffractionY) * 72);
      const diffraction = (waveA * waveB + 1) * 0.5;
      const distance = (normalX - lightX) ** 2 + (normalY - lightY) ** 2;
      const specular = Math.exp(-distance * 15);
      // Sparse grains light up only near their reflection angle; no timed flashing.
      const sparkle = grain > 0.97 ? Math.exp(-distance * 55) * (grain - 0.97) * 20 : 0;
      const brightness = 0.82 + diffraction * 0.06 + specular * 0.12 + groove;
      const warmth = (Math.sin(viewPhase * 1.2 + phase * 0.6) + 1) * 0.5;
      const offset = index * 4;

      let alpha = 0;
      for (let channel = 0; channel < 3; channel++) {
        const colour = Math.cos(spectrum + (channel * TAU) / 3);
        const metal = SILVER[channel] + (CHAMPAGNE[channel] - SILVER[channel]) * warmth;
        // Material colour has the same input on all four parts.
        base[channel] = (metal + colour * 4) * (0.82 + groove);
        lit[channel] = Math.min(
          255,
          (metal + colour * (4 + specular * 14)) * brightness + specular * 45 + sparkle * 90,
        );
        image.data[offset + channel] = base[channel];
        alpha = Math.max(alpha, (lit[channel] - base[channel]) / (255 - base[channel]));
      }
      // Express the existing foil light as a transparent layer over its material.
      // Source-over composition reproduces the original appearance for normal inputs.
      for (let channel = 0; channel < 3; channel++) {
        reflection.data[offset + channel] =
          alpha > 0 ? base[channel] + (lit[channel] - base[channel]) / alpha : 0;
      }
      image.data[offset + 3] = 255;
      reflection.data[offset + 3] = alpha * 255;
    }
    context.putImageData(image, 0, 0);
    reflectionContext.putImageData(reflection, 0, 0);
  };
};

type HologramDetail = 'lens-ring' | 'lens' | 'flash';

const createDetailRenderer = (canvas: HTMLCanvasElement, detail: HologramDetail) => {
  const context = canvas.getContext('2d');
  if (!context) return;

  return (viewX: number, viewY: number, reflectionAngle: number) => {
    // The part's foil renderer clears and fills this reflection layer first.
    context.save();
    context.scale(WIDTH / 71, HEIGHT / 48);
    const angle = ((reflectionAngle - 135) * Math.PI) / 180;

    if (detail === 'lens-ring') {
      // Input inversion is applied once by the caller, to the whole reflection layer.
      const ringAngle = angle;
      const dx = Math.cos(ringAngle) * 13;
      const dy = Math.sin(ringAngle) * 13;
      const light = context.createLinearGradient(35.5 - dx, 28 - dy, 35.5 + dx, 28 + dy);
      light.addColorStop(0, 'rgba(40, 45, 43, 0.10)');
      light.addColorStop(0.38, 'rgba(255, 253, 249, 0)');
      light.addColorStop(0.75, 'rgba(255, 253, 249, 0.10)');
      light.addColorStop(1, 'rgba(255, 253, 249, 0.38)');
      context.strokeStyle = light;
      context.lineWidth = 3.5;
      context.beginPath();
      context.arc(35.5, 28, 11, 0, TAU);
      context.stroke();
    } else if (detail === 'lens') {
      // The glass has no shaded disk: a moving arc alone reveals the lens.
      context.strokeStyle = 'rgba(255, 253, 249, 0.28)';
      context.lineWidth = 1.5;
      context.lineCap = 'round';
      context.beginPath();
      context.arc(35.5, 28, 6, angle - 0.58, angle + 0.58);
      context.stroke();
    } else {
      // A narrow sweep belongs only to the flash, moving across its own bounds.
      const sweep = 58.5 + viewX * 3 - viewY;
      const light = context.createLinearGradient(sweep - 2, 16, sweep + 2, 20);
      light.addColorStop(0, 'rgba(255, 253, 249, 0)');
      light.addColorStop(0.5, 'rgba(255, 253, 249, 0.32)');
      light.addColorStop(1, 'rgba(255, 253, 249, 0)');
      context.fillStyle = light;
      context.fillRect(55, 16, 7, 4);
    }
    context.restore();
  };
};

export { createHologramRenderer, createDetailRenderer };
export type { HologramDetail };
