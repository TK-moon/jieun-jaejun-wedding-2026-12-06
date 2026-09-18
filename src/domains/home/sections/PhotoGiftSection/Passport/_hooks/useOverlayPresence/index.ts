import { useEffect, useState } from 'react';
import { useAbortableTimeout } from '@/hooks/useAbortableTimeout';
import type { MotionPermissionStatus } from '../useMotionPermission/_utils';
import { SYSTEM_DIALOG_DISMISS_MS } from './_constants';

const isPromptPermission = (permission: MotionPermissionStatus) =>
  permission === 'prompt' || permission === 'requesting';

const useOverlayPresence = (permission: MotionPermissionStatus) => {
  const isPrompting = isPromptPermission(permission);
  const [isHolding, setIsHolding] = useState(false);
  const [isBlocking, setIsBlocking] = useState(isPrompting);
  const { start, cancel } = useAbortableTimeout();
  const isVisible = isPrompting || isHolding;

  if (isVisible && !isBlocking) {
    setIsBlocking(true);
  }

  useEffect(() => {
    if (isPrompting || !isHolding) {
      cancel();
      return;
    }

    const releaseHold = () => setIsHolding(false);
    const delayRelease = () => start(releaseHold, SYSTEM_DIALOG_DISMISS_MS);

    if (!document.hidden) {
      delayRelease();
      return () => cancel();
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        return;
      }

      document.removeEventListener('visibilitychange', onVisibilityChange);
      delayRelease();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      cancel();
    };
  }, [isPrompting, isHolding, start, cancel]);

  const onRequestStart = () => {
    setIsHolding(true);
  };

  const onExitComplete = () => {
    setIsBlocking(false);
  };

  return {
    isVisible,
    isBlocking,
    onRequestStart,
    onExitComplete,
  };
};

export { useOverlayPresence };
