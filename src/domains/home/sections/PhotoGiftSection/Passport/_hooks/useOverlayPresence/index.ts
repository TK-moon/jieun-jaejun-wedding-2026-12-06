import { useEffect, useRef, useState } from 'react';
import { useAbortableTimeout } from '@/hooks/useAbortableTimeout';
import type { MotionPermissionStatus } from '../useMotionPermission/_utils';
import { SYSTEM_DIALOG_DISMISS_MS } from './_constants';

const isPromptPermission = (permission: MotionPermissionStatus) =>
  permission === 'prompt' || permission === 'requesting';

const useOverlayPresence = (permission: MotionPermissionStatus) => {
  const isPrompting = isPromptPermission(permission);
  const [isVisible, setIsVisible] = useState(isPrompting);
  const [isExiting, setIsExiting] = useState(false);
  const requestedRef = useRef(false);
  const { start, cancel } = useAbortableTimeout();

  if (permission === 'requesting') {
    requestedRef.current = true;
  }

  useEffect(() => {
    if (isPrompting) {
      cancel();
      setIsExiting(false);
      setIsVisible(true);
      return;
    }

    if (!isVisible) {
      return;
    }

    const close = () => {
      requestedRef.current = false;
      setIsVisible(false);
      setIsExiting(true);
    };

    if (!requestedRef.current) {
      close();
      return;
    }

    const delayClose = () => start(close, SYSTEM_DIALOG_DISMISS_MS);

    if (!document.hidden) {
      delayClose();
      return () => cancel();
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        return;
      }

      document.removeEventListener('visibilitychange', onVisibilityChange);
      delayClose();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      cancel();
    };
  }, [isPrompting, isVisible, start, cancel]);

  const onExitComplete = () => {
    setIsExiting(false);
  };

  return {
    isVisible,
    isBlocking: isVisible || isExiting,
    onExitComplete,
  };
};

export { useOverlayPresence };
