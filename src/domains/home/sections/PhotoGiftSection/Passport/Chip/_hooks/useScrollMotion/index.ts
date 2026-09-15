import { useEffect } from 'react';
import { useMotionValue, type MotionValue } from 'motion/react';
import { REST_SCROLL, getScrollInput, decayScrollInput } from './_utils';

const useScrollMotion = (enabled: MotionValue<boolean>) => {
  const input = useMotionValue(REST_SCROLL);

  useEffect(() => {
    let listening = false;
    let lastScrollY = window.scrollY;
    let lastFrameTime = 0;
    let frame = 0;

    const decay = (now: number) => {
      frame = 0;
      if (!enabled.get()) return;
      const next = decayScrollInput(input.get(), now - lastFrameTime);
      lastFrameTime = now;
      input.set(next);
      if (next.y !== 0) frame = requestAnimationFrame(decay);
    };

    const onScroll = () => {
      const deltaY = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      if (deltaY === 0) return;
      input.set(getScrollInput(input.get(), deltaY, window.innerHeight));
      if (!frame) {
        lastFrameTime = performance.now();
        frame = requestAnimationFrame(decay);
      }
    };

    const sync = () => {
      const shouldListen = enabled.get();
      if (shouldListen && !listening) {
        // Entering the visible area must not replay scrolling that happened offscreen.
        lastScrollY = window.scrollY;
        window.addEventListener('scroll', onScroll, { passive: true });
      } else if (!shouldListen && listening) {
        window.removeEventListener('scroll', onScroll);
      }
      listening = shouldListen;
      if (!shouldListen) {
        cancelAnimationFrame(frame);
        frame = 0;
        input.set(REST_SCROLL);
      }
    };

    const unsubscribe = enabled.on('change', sync);
    sync();
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
      input.set(REST_SCROLL);
    };
  }, [enabled, input]);

  return input;
};

export { useScrollMotion };
