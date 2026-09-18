import { cubicBezier, scroll } from 'motion';
import { useEffect, useRef } from 'react';

// Match --gallery-reveal-ease and the CSS fade/rise ranges (30% / 50%).
const revealEase = cubicBezier(0.37, 0, 0.63, 1);
const FADE_END_PROGRESS = 0.6;

const useRevealMotion = () => {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Keep this detection aligned with the CSS @supports condition.
    const supportsViewTimeline =
      CSS.supports('view-timeline-name', '--gallery-item') &&
      CSS.supports('animation-timeline', '--gallery-item') &&
      CSS.supports('animation-range', 'cover 0% cover 50%');
    if (supportsViewTimeline) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let stop: VoidFunction | undefined;

    const sync = () => {
      stop?.();
      stop = undefined;
      element.style.removeProperty('--gallery-reveal-progress');
      element.style.removeProperty('--gallery-reveal-opacity');
      if (reducedMotion.matches) return;

      stop = scroll(
        (progress: number) => {
          element.style.setProperty('--gallery-reveal-progress', String(revealEase(progress)));
          element.style.setProperty(
            '--gallery-reveal-opacity',
            String(Math.min(progress / FADE_END_PROGRESS, 1)),
          );
        },
        {
          target: element,
          // Match the native view timeline's cover 0% → 50% range.
          offset: ['start end', 'center center'],
        },
      );
    };

    sync();
    reducedMotion.addEventListener('change', sync);
    return () => {
      stop?.();
      reducedMotion.removeEventListener('change', sync);
      element.style.removeProperty('--gallery-reveal-progress');
      element.style.removeProperty('--gallery-reveal-opacity');
    };
  }, []);

  return ref;
};

export { useRevealMotion };
