import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { animate, useMotionValue, type PanInfo } from 'motion/react';
import { MOTION_DURATION, MOTION_EASE } from '@/constants/motion';
import {
  EDGE_RESISTANCE,
  FLICK_MIN_DISTANCE,
  SWIPE_DISTANCE,
  SWIPE_VELOCITY,
} from '../../_constants';
import { applyEdgeResistance, clamp } from './_utils';

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
  const targetIndexRef = useRef(selectedIndex);
  const dragStartXRef = useRef<number | null>(null);
  const [originIndex, setOriginIndex] = useState(selectedIndex);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport || !enabled) {
      return;
    }

    const resize = () => {
      dragStartXRef.current = null;
      widthRef.current = viewport.clientWidth;
      x.jump(-targetIndexRef.current * widthRef.current);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(viewport);

    return () => {
      observer.disconnect();
      x.stop();
      dragStartXRef.current = null;
    };
  }, [enabled, viewportRef, x]);

  const stopAtCurrentPosition = () => {
    x.stop();
    dragStartXRef.current = null;
    // Retain the visible slides even when rapid input moves the target far ahead.
    setOriginIndex(clamp(-x.get() / widthRef.current, 0, photoCount - 1));
  };

  const settle = (nextIndex: number) => {
    if (!enabled || !widthRef.current) {
      return;
    }

    stopAtCurrentPosition();
    targetIndexRef.current = nextIndex;
    onIndexChange(nextIndex);
    animate(x, -nextIndex * widthRef.current, {
      duration: reduceMotion ? 0 : MOTION_DURATION,
      ease: MOTION_EASE,
      onComplete: () => setOriginIndex(nextIndex),
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
    // Undo edge resistance once so a new drag can continue an interrupted rebound.
    dragStartXRef.current = applyEdgeResistance(
      x.get(),
      -(photoCount - 1) * widthRef.current,
      1 / EDGE_RESISTANCE,
    );
  };

  const handlePan = (_event: PointerEvent, info: PanInfo) => {
    if (dragStartXRef.current === null) {
      return;
    }

    const offset = clamp(info.offset.x, -widthRef.current, widthRef.current);
    x.set(
      applyEdgeResistance(dragStartXRef.current + offset, -(photoCount - 1) * widthRef.current),
    );
  };

  const handlePanEnd = (_event: PointerEvent, info: PanInfo) => {
    if (dragStartXRef.current === null) {
      return;
    }

    const distance = Math.abs(info.offset.x);
    const isHorizontal = distance > Math.abs(info.offset.y);
    const isSwipe = distance >= SWIPE_DISTANCE;
    const isFlick = distance >= FLICK_MIN_DISTANCE && Math.abs(info.velocity.x) >= SWIPE_VELOCITY;
    const step = isHorizontal && (isSwipe || isFlick) ? (info.offset.x < 0 ? 1 : -1) : 0;
    settle(clamp(targetIndexRef.current + step, 0, photoCount - 1));
  };

  const canPreload = () => !x.isAnimating() && dragStartXRef.current === null;

  return { x, originIndex, changePhoto, handlePanStart, handlePan, handlePanEnd, canPreload };
};

export { useGallerySwipe };
