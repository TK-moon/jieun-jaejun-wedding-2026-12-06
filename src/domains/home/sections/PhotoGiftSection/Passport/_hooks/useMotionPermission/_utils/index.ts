interface MotionPermissionApi {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

type MotionPermissionStatus =
  'checking' | 'prompt' | 'requesting' | 'granted' | 'denied' | 'not-required' | 'unavailable';

type SensorPermissionState = 'granted' | 'denied' | 'prompt';

const getMotionPermissionApi = () =>
  window.DeviceMotionEvent as unknown as MotionPermissionApi | undefined;

const querySensorPermission = async (): Promise<SensorPermissionState | null> => {
  if (!navigator.permissions?.query) return null;

  try {
    const status = await navigator.permissions.query({
      name: 'accelerometer' as PermissionName,
    });

    if (status.state === 'granted' || status.state === 'denied' || status.state === 'prompt') {
      return status.state;
    }

    return null;
  } catch {
    return null;
  }
};

export { getMotionPermissionApi, querySensorPermission };
export type { MotionPermissionStatus };
