import { useReducedMotion } from 'motion/react';
import { useRef, useState } from 'react';
import { useViewTransitionState } from 'react-router';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

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
  const [hasRevealed, setHasRevealed] = useState(false);

  const shouldReduceMotion = useReducedMotion();
  const isViewTransitioning = useViewTransitionState('.');

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
  const canReveal = isReady && (shouldReduceMotion || (isVisible && !isViewTransitioning));

  if (canReveal && !hasRevealed) {
    setHasRevealed(true);
  }

  return {
    ref,
    canAnimate: hasRevealed || canReveal,
    skipInitial: shouldReduceMotion && isReady,
  };
};

export { useRevealMotion };
