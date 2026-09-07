import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { animate, useMotionValue, type PanInfo } from 'motion/react';
import { MOTION_DURATION, MOTION_EASE } from '@/constants/motion';
import { FLICK_MIN_DISTANCE, SWIPE_DISTANCE, SWIPE_VELOCITY } from '../../_constants';

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
  const targetIndexRef = useRef(selectedIndex);
  const dragStartXRef = useRef(0);
  const [originIndex, setOriginIndex] = useState(selectedIndex);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport || !enabled) {
      return;
    }

    const resize = () => {
      animationRef.current?.stop();
      isMovingRef.current = false;
      isDraggingRef.current = false;
      widthRef.current = viewport.clientWidth;
      x.jump(-targetIndexRef.current * widthRef.current);
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
  }, [enabled, viewportRef, x]);

  const stopAtCurrentPosition = () => {
    animationRef.current?.stop();
    isMovingRef.current = false;
    // Retain the visible slides even when rapid input moves the target far ahead.
    setOriginIndex(Math.max(0, Math.min(photoCount - 1, -x.get() / widthRef.current)));
  };

  const settle = (nextIndex: number) => {
    if (!enabled || !widthRef.current) {
      return;
    }

    stopAtCurrentPosition();
    targetIndexRef.current = nextIndex;
    onIndexChange(nextIndex);
    isMovingRef.current = true;
    animationRef.current = animate(x, -nextIndex * widthRef.current, {
      duration: reduceMotion ? 0 : MOTION_DURATION,
      ease: MOTION_EASE,
      onComplete: () => {
        isMovingRef.current = false;

        setOriginIndex(nextIndex);
      },
    });
  };

  const changePhoto = (step: number) => {
    const nextIndex = targetIndexRef.current + step;

    if (nextIndex >= 0 && nextIndex < photoCount) {
      settle(nextIndex);
    }
  };

  const handlePanStart = () => {
    if (!enabled || !widthRef.current) {
      return;
    }

    stopAtCurrentPosition();
    dragStartXRef.current = x.get();
    isDraggingRef.current = true;
  };

  const handlePan = (_event: PointerEvent, info: PanInfo) => {
    if (!isDraggingRef.current) {
      return;
    }

    const minX = -(photoCount - 1) * widthRef.current;
    const startX = dragStartXRef.current;
    // Undo edge resistance before applying a new drag so interrupted rebounds stay continuous.
    const originX =
      startX > 0 ? startX / 0.12 : startX < minX ? minX + (startX - minX) / 0.12 : startX;
    const offset = Math.max(-widthRef.current, Math.min(widthRef.current, info.offset.x));
    const nextX = originX + offset;
    x.set(nextX > 0 ? nextX * 0.12 : nextX < minX ? minX + (nextX - minX) * 0.12 : nextX);
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
    settle(Math.max(0, Math.min(photoCount - 1, targetIndexRef.current + step)));
  };

  const canPreload = () => !isMovingRef.current && !isDraggingRef.current;

  return { x, originIndex, changePhoto, handlePanStart, handlePan, handlePanEnd, canPreload };
};

export { useGallerySwipe };
