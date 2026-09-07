import { useRef, type FC } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Portal } from '@/components/Portal';
import { MOTION_DURATION, MOTION_EASE } from '@/constants/motion';
import type { GalleryPhoto } from '../_types';
import { useGalleryModal } from './_hooks/useGalleryModal';
import { Viewer } from './Viewer';
import styles from './GalleryImageModal.module.css';

interface Props {
  photos: GalleryPhoto[];
  selectedIndex: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const GalleryImageModal: FC<Props> = (props) => {
  const { photos, selectedIndex, onIndexChange, onClose } = props;

  const dialogRef = useRef<HTMLDialogElement>(null);
  const open = selectedIndex !== null && Boolean(photos[selectedIndex]);

  const { finishClose } = useGalleryModal({ open, onClose, dialogRef });
  const shouldReduceMotion = useReducedMotion();

  return (
    <Portal>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label="갤러리 사진 크게 보기"
        onCancel={(event) => {
          event.preventDefault();
          onClose();
        }}
        tabIndex={-1}
      >
        <AnimatePresence onExitComplete={finishClose}>
          {open && selectedIndex !== null ? (
            <motion.div
              key="gallery-viewer"
              className={styles.shell}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : MOTION_DURATION, ease: MOTION_EASE }}
            >
              <Viewer
                photos={photos}
                selectedIndex={selectedIndex}
                onIndexChange={onIndexChange}
                onClose={onClose}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </dialog>
    </Portal>
  );
};

export { GalleryImageModal };
