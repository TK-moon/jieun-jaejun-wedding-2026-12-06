const isClipboardAvailable = (): boolean => {
  return (
    typeof navigator !== 'undefined' &&
    typeof window !== 'undefined' &&
    window.isSecureContext &&
    typeof navigator.clipboard?.writeText === 'function'
  );
};

export { isClipboardAvailable };
