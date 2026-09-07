import { useRef, useState, type FC, type KeyboardEvent } from 'react';
import { motion, useIsPresent, useReducedMotion } from 'motion/react';
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon/ArrowRightIcon';
import { CloseIcon } from '@/components/icons/CloseIcon/CloseIcon';
import { MOTION_EASE } from '@/constants/motion';
import type { GalleryPhoto } from '../../_types';
import { FADE_DURATION } from '../_constants';
import { useGallerySwipe } from '../_hooks/useGallerySwipe';
import { Photo } from '../Photo/Photo';
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
    <motion.div
      ref={viewportRef}
      className={styles.viewer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : FADE_DURATION, ease: MOTION_EASE }}
      onAnimationComplete={() => {
        enteredRef.current = true;
      }}
      inert={!isPresent}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className={styles.control + ' ' + styles.close}
        aria-label="사진 닫기"
        onClick={onClose}
      >
        <CloseIcon />
      </button>
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
                onReady={() => setPreloadEnabled(true)}
              />
            </div>
          );
        })}
      </motion.div>
      <button
        type="button"
        className={styles.control + ' ' + styles.previous}
        aria-label="이전 사진"
        disabled={selectedIndex === 0}
        onClick={() => changePhoto(-1)}
      >
        <ArrowRightIcon className={styles.previous_icon} />
      </button>
      <button
        type="button"
        className={styles.control + ' ' + styles.next}
        aria-label="다음 사진"
        disabled={selectedIndex === photos.length - 1}
        onClick={() => changePhoto(1)}
      >
        <ArrowRightIcon />
      </button>
    </motion.div>
  );
};

export { Viewer };
