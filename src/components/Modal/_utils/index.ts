const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => element.getClientRects().length > 0,
  );
};

const focusInitialElement = (container: HTMLElement) => {
  const focusableElements = getFocusableElements(container);
  (focusableElements[0] ?? container).focus();
};

const trapTabKey = (event: KeyboardEvent, container: HTMLElement) => {
  if (event.key !== 'Tab') {
    return;
  }

  const focusableElements = getFocusableElements(container);

  if (focusableElements.length === 0) {
    event.preventDefault();
    container.focus();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  const activeElement = document.activeElement;

  if (event.shiftKey && (activeElement === firstElement || activeElement === container)) {
    event.preventDefault();
    lastElement.focus();
    return;
  }

  if (!event.shiftKey && activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
};

const MODAL_HISTORY_KEY = '__modal';

interface ModalHistoryState {
  [MODAL_HISTORY_KEY]: string;
}

const isModalHistoryState = (state: unknown, modalId: string): state is ModalHistoryState => {
  if (typeof state !== 'object' || state === null) {
    return false;
  }

  return (state as ModalHistoryState)[MODAL_HISTORY_KEY] === modalId;
};

export {
  focusInitialElement,
  getFocusableElements,
  isModalHistoryState,
  MODAL_HISTORY_KEY,
  trapTabKey,
};
