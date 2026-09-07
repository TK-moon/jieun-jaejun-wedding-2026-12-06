import { useEffect, useRef, useState, type FC, type KeyboardEvent } from 'react';
import { motion, useIsPresent, useReducedMotion } from 'motion/react';
import { MOTION_DURATION } from '@/constants/motion';
import type { GalleryPhoto } from '../../_types';
import { useGallerySwipe } from '../_hooks/useGallerySwipe';
import { Photo } from '../Photo';
import { CloseButton } from './CloseButton';
import { NextButton } from './NextButton';
import { PreviousButton } from './PreviousButton';
import styles from './Viewer.module.css';

interface Props {
  photos: GalleryPhoto[];
  selectedIndex: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const Viewer: FC<Props> = (props) => {
  const { photos, selectedIndex, onIndexChange, onClose } = props;
  const viewportRef = useRef<HTMLDivElement>(null);
  const enteredRef = useRef(false);
  const [preloadEnabled, setPreloadEnabled] = useState(false);
  const isPresent = useIsPresent();
  const reduceMotion = Boolean(useReducedMotion());
  const { x, changePhoto, handlePanStart, handlePan, handlePanEnd, canPreload } = useGallerySwipe({
    selectedIndex,
    photoCount: photos.length,
    onIndexChange,
    viewportRef,
    enabled: isPresent,
    reduceMotion,
  });
  const firstIndex = Math.max(0, selectedIndex - (preloadEnabled ? 1 : 0));
  const lastIndex = Math.min(photos.length - 1, selectedIndex + (preloadEnabled ? 1 : 0));

  useEffect(() => {
    if (reduceMotion) {
      enteredRef.current = true;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      enteredRef.current = true;
    }, MOTION_DURATION * 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [reduceMotion]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      changePhoto(event.key === 'ArrowLeft' ? -1 : 1);
      return;
    }

    if (event.key === 'Tab') {
      const buttons = Array.from(
        event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'),
      ).filter((button) => !button.closest('[inert]'));
      const first = buttons[0];
      const last = buttons[buttons.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  };

  return (
    <div ref={viewportRef} className={styles.viewer} inert={!isPresent} onKeyDown={handleKeyDown}>
      <CloseButton onClose={onClose} />
      <motion.div
        className={styles.track}
        style={{ x }}
        onPanStart={handlePanStart}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
      >
        {photos.slice(firstIndex, lastIndex + 1).map((photo, offset) => {
          const index = firstIndex + offset;
          const active = index === selectedIndex;

          return (
            <div
              key={photo.id}
              className={styles.slide}
              style={{ left: index * 100 + '%' }}
              aria-hidden={!active}
              inert={!active}
            >
              <Photo
                photo={photo}
                active={active}
                preloadEnabled={isPresent}
                canPreload={() => enteredRef.current && canPreload()}
                onReady={() => {
                  if (isPresent) {
                    setPreloadEnabled(true);
                  }
                }}
              />
            </div>
          );
        })}
      </motion.div>
      <PreviousButton disabled={selectedIndex === 0} onClick={() => changePhoto(-1)} />
      <NextButton disabled={selectedIndex === photos.length - 1} onClick={() => changePhoto(1)} />
    </div>
  );
};

export { Viewer };
