import { useRef, type FC } from 'react';
import { AnimatePresence } from 'motion/react';
import { Portal } from '@/components/Portal/Portal';
import type { GalleryPhoto } from '../_types';
import { useGalleryModal } from './_hooks/useGalleryModal';
import { Viewer } from './Viewer/Viewer';
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
            <Viewer
              key="gallery-viewer"
              photos={photos}
              selectedIndex={selectedIndex}
              onIndexChange={onIndexChange}
              onClose={onClose}
            />
          ) : null}
        </AnimatePresence>
      </dialog>
    </Portal>
  );
};

export { GalleryImageModal };
