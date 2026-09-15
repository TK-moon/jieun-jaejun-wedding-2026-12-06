import { useCallback, useEffect, useRef } from 'react';

interface AnimationLoop {
  frameId: number;
}

// Return true to continue on the next frame, or false to finish.
type FrameCallback = (elapsedMs: number) => boolean;

const useAnimationFrameLoop = () => {
  const loopRef = useRef<AnimationLoop | null>(null);

  const stop = useCallback(() => {
    const loop = loopRef.current;
    if (!loop) return;

    cancelAnimationFrame(loop.frameId);
    loopRef.current = null;
  }, []);

  // Calling start while a loop is running leaves that loop and its callback unchanged.
  const start = useCallback(
    (onFrame: FrameCallback) => {
      if (loopRef.current) return;

      const loop: AnimationLoop = { frameId: 0 };
      loopRef.current = loop;
      let lastFrameTime = performance.now();

      const animate = (now: number) => {
        if (loopRef.current !== loop) return;

        const elapsedMs = now - lastFrameTime;
        lastFrameTime = now;
        const shouldContinue = onFrame(elapsedMs);

        // The callback may stop this loop or start a new one through a subscriber.
        if (loopRef.current !== loop) return;

        if (!shouldContinue) {
          stop();
          return;
        }

        loop.frameId = requestAnimationFrame(animate);
      };

      loop.frameId = requestAnimationFrame(animate);
    },
    [stop],
  );

  useEffect(() => stop, [stop]);

  return { start, stop };
};

export { useAnimationFrameLoop };
