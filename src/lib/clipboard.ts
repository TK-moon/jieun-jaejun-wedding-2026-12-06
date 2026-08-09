const is_clipboard_available = (): boolean => {
  return (
    typeof navigator !== 'undefined' &&
    typeof window !== 'undefined' &&
    window.isSecureContext &&
    typeof navigator.clipboard?.writeText === 'function'
  );
};

export { is_clipboard_available };
