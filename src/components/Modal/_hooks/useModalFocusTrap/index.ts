import { useEffect, useEffectEvent, type RefObject } from 'react';
import { focusInitialElement, trapTabKey } from '../../_utils';

interface Params {
  open: boolean;
  onClose: () => void;
  dialogRef: RefObject<HTMLElement | null>;
}

const useModalFocusTrap = (params: Params) => {
  const { open, onClose, dialogRef } = params;
  const closeModal = useEffectEvent(onClose);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
        return;
      }

      if (!dialogRef.current) {
        return;
      }

      trapTabKey(event, dialogRef.current);
    };

    document.addEventListener('keydown', handleKeyDown);

    const focusFrame = requestAnimationFrame(() => {
      if (dialogRef.current) {
        focusInitialElement(dialogRef.current);
      }
    });

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open, dialogRef]);
};

export { useModalFocusTrap };
