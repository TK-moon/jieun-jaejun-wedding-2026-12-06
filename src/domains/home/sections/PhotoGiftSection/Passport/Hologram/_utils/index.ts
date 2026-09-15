// A small, deterministic foil texture. All layers share the camera silhouette,
// but their surface normals and optical phases respond differently to the view.
const WIDTH = 142;
const HEIGHT = 96;
const TAU = Math.PI * 2;
const SILVER = [174, 176, 179];

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
      normalX: Math.sin(x * 11 + y * 5) * 0.32 + (facet - 0.5) * 0.1,
      normalY: Math.cos(y * 13 - x * 4) * 0.3 + (noise(cellY, cellX + 19) - 0.5) * 0.1,
      phase: x * 1.6 + y * 0.65 + Math.sin(x * 8 - y * 6) * 0.28 + facet * 0.04,
      groove: Math.sin((x * 96 + y * 58) * TAU) * 0.012,
      brushing: Math.sin((y * 115 + Math.sin(x * 9) * 0.15) * TAU) * 0.5 + (grain - 0.5) * 0.3,
    };
  });

  const base = [0, 0, 0];
  const lit = [0, 0, 0];

  return (viewX: number, viewY: number, reflectionX: number, reflectionY: number) => {
    // Bound both axes together: diagonal/extreme input must not move the light
    // beyond the foil normals and extinguish every specular highlight.
    const lightScale = 0.38 / Math.hypot(0.28, reflectionX, reflectionY);
    const lightX = reflectionX * lightScale;
    const lightY = reflectionY * lightScale;
    const viewPhase = viewX * 1.45 - viewY * 1.1;
    const diffractionX = reflectionX * 0.3;
    const diffractionY = reflectionY * 0.24;

    for (let index = 0; index < surface.length; index++) {
      const point = surface[index];
      const { x, y, grain, normalX, normalY, phase, groove, brushing } = point;
      const incidence = normalX * viewX + normalY * viewY;
      const spectrum = (phase + viewPhase + incidence * 0.85) * TAU;
      // Crossed diffraction waves slide in opposite directions as the view changes.
      const waveA = Math.sin((x + diffractionX) * 44 + (y - diffractionY) * 31);
      const waveB = Math.sin(Math.hypot(x - 0.3 - diffractionX, y - 0.65 + diffractionY) * 72);
      const diffraction = (waveA * waveB + 1) * 0.5;
      const deltaX = normalX - lightX;
      const deltaY = normalY - lightY;
      const distance = deltaX ** 2 + deltaY ** 2;
      const specular = Math.exp(-distance * 12);
      // Soft ambient reflection preserves the embossed pattern away from the main light.
      const ambientReflection = 0.5 + normalX * 0.65 - normalY * 0.45;
      // A stretched highlight follows the foil's polishing direction.
      const alongGrain = deltaX * 0.94 + deltaY * 0.34;
      const acrossGrain = deltaY * 0.94 - deltaX * 0.34;
      const highlight = Math.exp(-(alongGrain ** 2 * 24 + acrossGrain ** 2 * 85));
      // Keep the centre silver-white, with a faint spectrum on the reflection's shoulders.
      const iridescence = specular * (1 - specular) * 4;
      // Sparse grains light up only near their reflection angle; no timed flashing.
      const sparkle = grain > 0.985 ? Math.exp(-distance * 70) * (grain - 0.985) * 24 : 0;
      const brightness =
        0.77 + ambientReflection * 0.08 + diffraction * 0.065 + specular * 0.12 + groove;
      const offset = index * 4;

      let alpha = 0;
      for (let channel = 0; channel < 3; channel++) {
        const colour = Math.cos(spectrum + (channel * TAU) / 3);
        const metal = SILVER[channel];
        // The material stays neutral; only the reflected light carries a subtle colour shift.
        base[channel] = metal * (0.74 + groove) + brushing * 1.2;
        const reflected =
          metal * brightness +
          specular * 70 +
          highlight * (22 + brushing * 5) +
          colour * iridescence * 8 +
          sparkle * 80;
        // Roll off bright peaks gently so the metal retains detail near white.
        lit[channel] =
          reflected > 230 ? 230 + 25 * (1 - Math.exp(-(reflected - 230) / 25)) : reflected;
        image.data[offset + channel] = base[channel];
        alpha = Math.max(alpha, (lit[channel] - base[channel]) / (255 - base[channel]));
      }
      // Express the foil light as a transparent layer over its material.
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
    const tilt = Math.min(1, Math.hypot(viewX, viewY));

    if (detail === 'lens-ring') {
      // Input inversion is applied once by the caller, to the whole reflection layer.
      const ringAngle = angle + viewX * 0.7 - viewY * 0.55;
      const dx = Math.cos(ringAngle) * 13;
      const dy = Math.sin(ringAngle) * 13;
      const light = context.createLinearGradient(35.5 - dx, 28 - dy, 35.5 + dx, 28 + dy);
      light.addColorStop(0, 'rgba(38, 42, 48, 0.22)');
      light.addColorStop(0.38, 'rgba(248, 251, 255, 0)');
      light.addColorStop(0.75, 'rgba(248, 251, 255, 0.28)');
      light.addColorStop(1, 'rgba(248, 251, 255, 0.80)');
      context.strokeStyle = light;
      context.lineWidth = 3.5;
      context.beginPath();
      context.arc(35.5, 28, 11, 0, TAU);
      context.stroke();
      // Thin opposing bevels suggest an embossed rim without a heavy outline.
      const bevel = context.createLinearGradient(35.5 - dx, 28 - dy, 35.5 + dx, 28 + dy);
      bevel.addColorStop(0, 'rgba(248, 251, 255, 0.42)');
      bevel.addColorStop(0.5, 'rgba(248, 251, 255, 0)');
      bevel.addColorStop(1, 'rgba(38, 42, 48, 0.26)');
      context.strokeStyle = bevel;
      context.lineWidth = 0.65;
      context.beginPath();
      context.arc(35.5, 28, 9.65, 0, TAU);
      context.stroke();
      context.strokeStyle = light;
      context.lineWidth = 0.55;
      context.beginPath();
      context.arc(35.5, 28, 12.4, 0, TAU);
      context.stroke();
    } else if (detail === 'lens') {
      // Curved reflections taper into the glass instead of reading as a painted white arc.
      // Limit displacement radially so the bright arc remains inside the lens mask.
      const displacement = 1.6 / Math.max(1, Math.hypot(viewX, viewY));
      const centreX = 35.5 + viewX * displacement;
      const centreY = 28 + viewY * displacement;
      const radius = 6 + tilt * 0.6;
      const lightX = centreX + Math.cos(angle) * radius;
      const lightY = centreY + Math.sin(angle) * radius;
      const reflection = context.createRadialGradient(lightX, lightY, 0, lightX, lightY, 5);
      reflection.addColorStop(0, `rgba(248, 251, 255, ${0.72 + tilt * 0.18})`);
      reflection.addColorStop(0.45, 'rgba(248, 251, 255, 0.38)');
      reflection.addColorStop(1, 'rgba(248, 251, 255, 0)');
      context.strokeStyle = reflection;
      context.lineWidth = 1.4 + tilt * 0.35;
      context.lineCap = 'round';
      context.beginPath();
      context.arc(centreX, centreY, radius, angle - 0.85, angle + 0.85);
      context.stroke();
      // A faint displaced return reflection hints at the second glass surface.
      context.globalAlpha = 0.22;
      context.lineWidth = 0.65;
      context.beginPath();
      context.arc(
        centreX - viewX * 0.8,
        centreY - viewY * 0.8,
        radius - 1.25,
        angle - 0.7,
        angle + 0.7,
      );
      context.stroke();
    } else {
      // A narrow sweep belongs only to the flash, moving across its own bounds.
      const sweep = 58.5 + Math.sin(viewX * 1.4 - viewY * 0.6) * 2.4;
      const light = context.createLinearGradient(sweep - 2, 16, sweep + 2, 20);
      light.addColorStop(0, 'rgba(248, 251, 255, 0)');
      light.addColorStop(0.28, 'rgba(248, 251, 255, 0.16)');
      light.addColorStop(0.48, 'rgba(248, 251, 255, 0.78)');
      light.addColorStop(0.62, 'rgba(248, 251, 255, 0.32)');
      light.addColorStop(1, 'rgba(248, 251, 255, 0)');
      context.fillStyle = light;
      context.fillRect(55, 16, 7, 4);
      // Shallow prism grooves catch the same moving light inside the flash window.
      context.globalAlpha = 0.3;
      for (let x = 55.8; x < 62; x += 1.2) {
        context.fillRect(x, 16.4, 0.25, 3.2);
      }
    }
    context.restore();
  };
};

export { createHologramRenderer, createDetailRenderer };
export type { HologramDetail };
