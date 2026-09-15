import { useEffect, type RefObject } from 'react';
import { useMotionValue } from 'motion/react';

interface MotionEnvironment {
  canAnimate: boolean;
  desktopPointer: boolean;
  reducedMotion: boolean;
}

const useMotionEnvironment = (targetRef: RefObject<HTMLElement | null>) => {
  const environment = useMotionValue<MotionEnvironment>({
    canAnimate: false,
    desktopPointer: false,
    reducedMotion: false,
  });
  const motionEnabled = useMotionValue(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let visible = false;
    const sync = () => {
      const canAnimate = visible && !document.hidden && !reducedMotion.matches;
      environment.set({
        canAnimate,
        desktopPointer: desktopPointer.matches,
        reducedMotion: reducedMotion.matches,
      });
      motionEnabled.set(canAnimate);
    };
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? undefined
        : new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            sync();
          });
    if (observer) observer.observe(target.closest('section') ?? target);
    else visible = true;

    desktopPointer.addEventListener('change', sync);
    reducedMotion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    sync();

    return () => {
      observer?.disconnect();
      desktopPointer.removeEventListener('change', sync);
      reducedMotion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [targetRef, environment, motionEnabled]);

  return { environment, motionEnabled };
};

export { useMotionEnvironment };
export type { MotionEnvironment };
