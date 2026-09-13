import { useRef, useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useMotionPreference } from '@/hooks/useMotionPreference';

interface Params {
  isReady?: boolean;
}

const OBSERVER: IntersectionObserverInit = {
  threshold: 0.2,
  rootMargin: '0px 0px -10% 0px',
};

const useRevealMotion = (params: Params = {}) => {
  const { isReady = true } = params;

  const ref = useRef<HTMLLIElement>(null);
  const [hasIntersected, setHasIntersected] = useState(false);

  const { shouldReduceMotion, duration } = useMotionPreference();

  const { isSupported } = useIntersectionObserver(
    ref,
    (entry) => {
      if (entry.isIntersecting) {
        setHasIntersected(true);
      }
    },
    OBSERVER,
  );

  const isVisible = !isSupported || hasIntersected;

  return {
    ref,
    shouldReduceMotion,
    canAnimate: isReady && (shouldReduceMotion || isVisible),
    skipInitial: shouldReduceMotion && isReady,
    duration,
  };
};

export { useRevealMotion };
