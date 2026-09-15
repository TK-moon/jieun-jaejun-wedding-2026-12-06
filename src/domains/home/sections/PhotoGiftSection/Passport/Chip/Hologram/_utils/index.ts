import { WIDTH, HEIGHT, TAU } from '../_constants';
import { createFoilMaterial, createFoilRenderer } from './foil';

type HologramPart = 'background' | 'lens-ring' | 'lens' | 'flash';

const createDetailRenderer = (canvas: HTMLCanvasElement, detail: HologramPart) => {
  const context = canvas.getContext('2d');
  if (!context) return;
  const foilEdge =
    detail === 'background'
      ? new Path2D(
          'M7 10h14l5-8h19l5 8h14a5 5 0 0 1 5 5v26a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V15a5 5 0 0 1 5-5Z',
        )
      : undefined;

  return (viewX: number, viewY: number, reflectionAngle: number) => {
    // The part's foil renderer clears and fills this reflection layer first.
    context.save();
    context.scale(WIDTH / 71, HEIGHT / 48);
    const angle = ((reflectionAngle - 135) * Math.PI) / 180;
    const colourPhase = viewX * 0.7 - viewY * 0.55;
    const hue = 180 + colourPhase * 75;

    if (foilEdge) {
      // A thin cut edge keeps the camera reading as a foil sticker on the paper.
      const edge = context.createLinearGradient(0, 0, 71, 48);
      edge.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      edge.addColorStop(0.42, `hsla(${hue}, 70%, 82%, 0.45)`);
      edge.addColorStop(0.72, 'rgba(48, 55, 63, 0.48)');
      edge.addColorStop(1, 'rgba(248, 251, 255, 0.65)');
      context.strokeStyle = edge;
      context.lineWidth = 0.7;
      context.stroke(foilEdge);
    } else if (detail === 'lens-ring') {
      // Input inversion is applied once by the caller, to the whole reflection layer.
      const ringAngle = angle + colourPhase;
      const dx = Math.cos(ringAngle) * 13;
      const dy = Math.sin(ringAngle) * 13;
      const light = context.createLinearGradient(35.5 - dx, 28 - dy, 35.5 + dx, 28 + dy);
      light.addColorStop(0, 'rgba(38, 42, 48, 0.38)');
      light.addColorStop(0.38, 'rgba(248, 251, 255, 0)');
      light.addColorStop(0.65, `hsla(${hue}, 78%, 68%, 0.52)`);
      light.addColorStop(0.84, `hsla(${hue + 80}, 82%, 82%, 0.64)`);
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
      // Fixed Fresnel rings emerge in different colours over the hidden aperture image.
      const exposure = (0.5 + 0.5 * Math.cos(colourPhase)) ** 4;
      const spectral = context.createLinearGradient(28, 21, 43, 35);
      spectral.addColorStop(0, `hsla(${hue + 100}, 85%, 65%, 0.6)`);
      spectral.addColorStop(0.45, 'rgba(250, 253, 255, 0.86)');
      spectral.addColorStop(1, `hsla(${hue - 80}, 80%, 72%, 0.72)`);
      context.strokeStyle = spectral;
      context.globalAlpha = 0.18 + exposure * 0.65;
      context.lineWidth = 0.35;
      for (const radius of [3.8, 5.1, 6.4, 7.7]) {
        context.beginPath();
        context.arc(35.5, 28, radius, 0, TAU);
        context.stroke();
      }

      // A white glint passes over the stationary engraving; the lens itself never slides.
      const glintAngle = angle + colourPhase;
      const lightX = 35.5 + Math.cos(glintAngle) * 4.5;
      const lightY = 28 + Math.sin(glintAngle) * 4.5;
      const glint = context.createRadialGradient(lightX, lightY, 0, lightX, lightY, 4.5);
      glint.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      glint.addColorStop(0.3, 'rgba(240, 252, 255, 0.22)');
      glint.addColorStop(1, 'rgba(240, 252, 255, 0)');
      context.globalAlpha = 0.3 + exposure * 0.4;
      context.fillStyle = glint;
      context.beginPath();
      context.arc(35.5, 28, 9.25, 0, TAU);
      context.fill();
    } else {
      // A narrow sweep belongs only to the flash, moving across its own bounds.
      const sweep = 58.5 + Math.sin(viewX * 1.4 - viewY * 0.6) * 2.4;
      const light = context.createLinearGradient(sweep - 2, 16, sweep + 2, 20);
      light.addColorStop(0, 'rgba(248, 251, 255, 0)');
      light.addColorStop(0.28, `hsla(${hue + 60}, 85%, 70%, 0.45)`);
      light.addColorStop(0.48, 'rgba(248, 251, 255, 0.78)');
      light.addColorStop(0.62, `hsla(${hue - 60}, 85%, 72%, 0.48)`);
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

const createHologramPainter = (hologram: HTMLSpanElement) => {
  const material = createFoilMaterial();
  const createPart = (part: HologramPart, direction: 1 | -1) => {
    const element = hologram.querySelector<HTMLElement>(`[data-hologram-part="${part}"]`);
    const surface = element?.querySelector<HTMLCanvasElement>('[data-hologram-layer="surface"]');
    const reflection = element?.querySelector<HTMLCanvasElement>(
      '[data-hologram-layer="reflection"]',
    );
    if (!surface || !reflection) return;

    const renderFoil = createFoilRenderer(surface, reflection, material);
    const renderDetail = createDetailRenderer(reflection, part);
    return (x: number, y: number, angle: number) => {
      const reflectionX = x * direction;
      const reflectionY = y * direction;
      renderFoil?.(x, y, reflectionX, reflectionY);
      // Reversing both axes also rotates the detail's reflection by 180 degrees.
      renderDetail?.(reflectionX, reflectionY, angle + (direction === -1 ? 180 : 0));
    };
  };
  const parts = [
    createPart('background', 1),
    createPart('lens-ring', -1),
    createPart('lens', 1),
    createPart('flash', -1),
  ];

  return (x: number, y: number, angle: number) => {
    for (const paint of parts) paint?.(x, y, angle);
  };
};

export { createHologramPainter };
