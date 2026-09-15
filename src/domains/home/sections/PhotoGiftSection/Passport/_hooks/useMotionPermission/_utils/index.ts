// localStorage is scoped to the origin. This records consent history, not browser permission.
const CONSENT_KEY = 'wedding:motion-consent:v1';

interface MotionPermissionApi {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

type MotionPermissionStatus =
  'checking' | 'prompt' | 'requesting' | 'granted' | 'denied' | 'not-required' | 'unavailable';

const getMotionPermissionApi = () =>
  window.DeviceMotionEvent as unknown as MotionPermissionApi | undefined;

const readMotionConsent = () => {
  try {
    return window.localStorage.getItem(CONSENT_KEY) === 'granted';
  } catch {
    return false;
  }
};

const storeMotionConsent = (granted: boolean) => {
  try {
    if (granted) window.localStorage.setItem(CONSENT_KEY, 'granted');
    else window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    // Storage restrictions must not prevent sensor access.
  }
};

export { getMotionPermissionApi, readMotionConsent, storeMotionConsent };
export type { MotionPermissionStatus };
