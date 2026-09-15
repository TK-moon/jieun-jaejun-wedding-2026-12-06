import { useEffect } from 'react';
import { useMotionValue, type MotionValue } from 'motion/react';
import { useAnimationFrameLoop } from '@/hooks/useAnimationFrameLoop';
import { REST_SCROLL, getScrollInput, decayScrollInput } from './_utils';

const useScrollMotion = (enabled: MotionValue<boolean>) => {
  const input = useMotionValue(REST_SCROLL);
  const { start, stop } = useAnimationFrameLoop();

  useEffect(() => {
    let listening = false;
    let lastScrollY = window.scrollY;

    const decay = (elapsedMs: number) => {
      if (!enabled.get()) return false;
      const next = decayScrollInput(input.get(), elapsedMs);
      input.set(next);
      return next.y !== 0;
    };

    const onScroll = () => {
      if (!enabled.get()) return;

      const deltaY = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      if (deltaY === 0) return;
      input.set(getScrollInput(input.get(), deltaY, window.innerHeight));
      start(decay);
    };

    const sync = () => {
      if (!enabled.get()) {
        window.removeEventListener('scroll', onScroll);
        listening = false;
        stop();
        input.set(REST_SCROLL);
        return;
      }
      if (listening) return;

      // Entering the visible area must not replay scrolling that happened offscreen.
      lastScrollY = window.scrollY;
      window.addEventListener('scroll', onScroll, { passive: true });
      listening = true;
    };

    const unsubscribe = enabled.on('change', sync);
    sync();
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', onScroll);
      stop();
      input.set(REST_SCROLL);
    };
  }, [enabled, input, start, stop]);

  return input;
};

export { useScrollMotion };
