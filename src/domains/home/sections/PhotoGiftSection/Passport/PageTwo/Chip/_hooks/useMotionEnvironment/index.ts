import { useEffect, type RefObject } from 'react';
import { useMotionValue, useReducedMotion } from 'motion/react';
import { useDesktopPointer } from '../../../../_hooks/useDesktopPointer';

interface MotionEnvironment {
  canAnimate: boolean;
  desktopPointer: boolean;
  reducedMotion: boolean;
}

const useMotionEnvironment = (targetRef: RefObject<HTMLElement | null>) => {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const hasDesktopPointer = useDesktopPointer();
  const environment = useMotionValue<MotionEnvironment>({
    canAnimate: false,
    desktopPointer: false,
    reducedMotion: false,
  });
  const motionEnabled = useMotionValue(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    let visible = false;
    const sync = () => {
      const canAnimate = visible && !document.hidden && !shouldReduceMotion;
      environment.set({
        canAnimate,
        desktopPointer: hasDesktopPointer,
        reducedMotion: shouldReduceMotion,
      });
      motionEnabled.set(canAnimate);
    };
    let observer: IntersectionObserver | undefined;
    if (typeof IntersectionObserver === 'undefined') {
      visible = true;
    } else {
      observer = new IntersectionObserver(([entry]) => {
        if (!entry) return;
        visible = entry.isIntersecting;
        sync();
      });
      observer.observe(target.closest('section') ?? target);
    }

    document.addEventListener('visibilitychange', sync);
    sync();

    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [targetRef, environment, motionEnabled, shouldReduceMotion, hasDesktopPointer]);

  return { environment, motionEnabled };
};

export { useMotionEnvironment };
export type { MotionEnvironment };
