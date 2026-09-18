import { WIDTH, HEIGHT, TAU } from '../_constants';

const createMask = (draw: (context: CanvasRenderingContext2D) => void) => {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext('2d');
  if (!context) return new Uint8ClampedArray(WIDTH * HEIGHT * 4);

  context.scale(WIDTH / 71, HEIGHT / 48);
  context.strokeStyle = '#fff';
  context.fillStyle = '#fff';
  draw(context);
  return context.getImageData(0, 0, WIDTH, HEIGHT).data;
};

const createSecurityPatterns = () => {
  const engraving = createMask((context) => {
    // Interlaced fine lines are fixed in the foil; only their reflection changes.
    context.lineWidth = 0.23;
    for (let ring = 0; ring < 9; ring++) {
      context.beginPath();
      for (let step = 0; step <= 240; step++) {
        const angle = (step / 240) * TAU;
        const radius = 13.8 + ring * 0.7 + Math.sin(angle * 10 + ring * 0.5) * 1.2;
        const x = 35.5 + Math.cos(angle) * radius;
        const y = 28 + Math.sin(angle) * radius;
        if (step === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
    }

    // A second image plane: six fixed aperture blades inside the lens.
    context.lineWidth = 0.45;
    for (let blade = 0; blade < 6; blade++) {
      const angle = (blade / 6) * TAU;
      context.beginPath();
      context.moveTo(35.5 + Math.cos(angle) * 7.8, 28 + Math.sin(angle) * 7.8);
      context.lineTo(35.5 + Math.cos(angle + 0.55) * 3.5, 28 + Math.sin(angle + 0.55) * 3.5);
      context.lineTo(35.5 + Math.cos(angle + 1.6) * 7.8, 28 + Math.sin(angle + 1.6) * 7.8);
      context.stroke();
    }
  });

  const microtext = createMask((context) => {
    context.translate(35.5, 24);
    context.rotate(-Math.PI / 9);
    context.font = '500 3px sans-serif';
    context.textBaseline = 'middle';
    for (let row = -5; row <= 5; row++) {
      for (let column = -3; column <= 3; column++) {
        context.fillText('PHOTO GIFT', column * 23 + (row % 2) * 11.5, row * 6);
      }
    }
  });

  return { engraving, microtext };
};

export { createSecurityPatterns };
