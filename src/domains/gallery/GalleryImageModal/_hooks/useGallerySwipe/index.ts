import { useLayoutEffect, useRef, type RefObject } from 'react';
import { animate, useMotionValue, type PanInfo } from 'motion/react';
import { MOTION_EASE } from '@/constants/motion';
import {
  FLICK_MIN_DISTANCE,
  SLIDE_DURATION,
  SWIPE_DISTANCE,
  SWIPE_VELOCITY,
} from '../../_constants';

interface Params {
  selectedIndex: number;
  photoCount: number;
  onIndexChange: (index: number) => void;
  viewportRef: RefObject<HTMLDivElement | null>;
  enabled: boolean;
  reduceMotion: boolean;
}

const useGallerySwipe = (params: Params) => {
  const { selectedIndex, photoCount, onIndexChange, viewportRef, enabled, reduceMotion } = params;
  const x = useMotionValue(0);
  const widthRef = useRef(0);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const isMovingRef = useRef(false);
  const isDraggingRef = useRef(false);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const resize = () => {
      animationRef.current?.stop();
      isMovingRef.current = false;
      isDraggingRef.current = false;
      widthRef.current = viewport.clientWidth;
      x.jump(-selectedIndex * widthRef.current);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(viewport);

    return () => {
      observer.disconnect();
      animationRef.current?.stop();
      isMovingRef.current = false;
      isDraggingRef.current = false;
    };
  }, [selectedIndex, viewportRef, x]);

  useLayoutEffect(() => {
    if (!enabled) {
      animationRef.current?.stop();
      isMovingRef.current = false;
      isDraggingRef.current = false;
    }
  }, [enabled]);

  const settle = (nextIndex: number) => {
    if (!enabled || isMovingRef.current) {
      return;
    }

    isMovingRef.current = true;
    animationRef.current = animate(x, -nextIndex * widthRef.current, {
      duration: reduceMotion ? 0 : SLIDE_DURATION,
      ease: MOTION_EASE,
      onComplete: () => {
        isMovingRef.current = false;

        // Keep the image nodes mounted until the shared track has arrived.
        if (nextIndex !== selectedIndex) {
          onIndexChange(nextIndex);
        }
      },
    });
  };

  const changePhoto = (step: number) => {
    const nextIndex = selectedIndex + step;

    if (nextIndex >= 0 && nextIndex < photoCount) {
      settle(nextIndex);
    }
  };

  const handlePanStart = () => {
    isDraggingRef.current = enabled && !isMovingRef.current;
  };

  const handlePan = (_event: PointerEvent, info: PanInfo) => {
    if (!isDraggingRef.current) {
      return;
    }

    const atStart = selectedIndex === 0 && info.offset.x > 0;
    const atEnd = selectedIndex === photoCount - 1 && info.offset.x < 0;
    const offset = Math.max(-widthRef.current, Math.min(widthRef.current, info.offset.x));
    x.set(-selectedIndex * widthRef.current + offset * (atStart || atEnd ? 0.12 : 1));
  };

  const handlePanEnd = (_event: PointerEvent, info: PanInfo) => {
    if (!isDraggingRef.current) {
      return;
    }

    isDraggingRef.current = false;
    const distance = Math.abs(info.offset.x);
    const isHorizontal = distance > Math.abs(info.offset.y);
    const isSwipe = distance >= SWIPE_DISTANCE;
    const isFlick = distance >= FLICK_MIN_DISTANCE && Math.abs(info.velocity.x) >= SWIPE_VELOCITY;
    const step = isHorizontal && (isSwipe || isFlick) ? (info.offset.x < 0 ? 1 : -1) : 0;
    settle(Math.max(0, Math.min(photoCount - 1, selectedIndex + step)));
  };

  const canPreload = () => !isMovingRef.current && !isDraggingRef.current;

  return { x, changePhoto, handlePanStart, handlePan, handlePanEnd, canPreload };
};

export { useGallerySwipe };
