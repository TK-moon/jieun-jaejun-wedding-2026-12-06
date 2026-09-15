const SUPPORTS_ABORT_SIGNAL_TIMEOUT =
  typeof AbortController !== 'undefined' &&
  typeof AbortSignal !== 'undefined' &&
  typeof AbortSignal.timeout === 'function';

export { SUPPORTS_ABORT_SIGNAL_TIMEOUT };
