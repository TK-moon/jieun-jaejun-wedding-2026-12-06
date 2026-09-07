import { useEffect, useEffectEvent, useId, useRef, type RefObject } from 'react';

interface Params {
  open: boolean;
  onClose: () => void;
  dialogRef: RefObject<HTMLDialogElement | null>;
}

const useGalleryModal = (params: Params) => {
  const { open, onClose, dialogRef } = params;
  const modalId = useId();
  const closeModal = useEffectEvent(onClose);
  const releaseRef = useRef<(() => void) | null>(null);

  const finishClose = () => {
    if (!open) {
      releaseRef.current?.();
      releaseRef.current = null;
    }
  };

  useEffect(
    () => () => {
      releaseRef.current?.();
      releaseRef.current = null;
    },
    [],
  );

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!open || !dialog || releaseRef.current) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    let hasHistoryEntry = true;

    // Native dialog provides focus containment and makes the page behind it inert.
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    window.history.pushState({ ...window.history.state, galleryModal: modalId }, '');

    const handlePopState = () => {
      hasHistoryEntry = false;
      closeModal();
    };

    window.addEventListener('popstate', handlePopState);

    // Release the native dialog, history and focus only after the exit fade.
    releaseRef.current = () => {
      window.removeEventListener('popstate', handlePopState);
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus({ preventScroll: true });

      if (hasHistoryEntry && window.history.state?.galleryModal === modalId) {
        window.history.back();
      }
    };
  }, [open, modalId, dialogRef]);

  return { finishClose };
};

export { useGalleryModal };
