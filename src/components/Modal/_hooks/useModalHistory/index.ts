import { useEffect, useId } from 'react';
import { isModalHistoryState, MODAL_HISTORY_KEY } from '../../_utils';

interface Params {
  open: boolean;
  onClose: () => void;
}

const useModalHistory = (params: Params) => {
  const { open, onClose } = params;
  const modalId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    let hasHistoryEntry = true;
    window.history.pushState({ [MODAL_HISTORY_KEY]: modalId }, '');

    const handlePopState = () => {
      hasHistoryEntry = false;
      onClose();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);

      if (hasHistoryEntry && isModalHistoryState(window.history.state, modalId)) {
        hasHistoryEntry = false;
        window.history.back();
      }
    };
  }, [open, onClose, modalId]);
};

export { useModalHistory };
