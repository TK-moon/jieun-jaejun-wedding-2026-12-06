import { useId, useRef, useState, type FC } from 'react';
import { AnimatePresence } from 'motion/react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { SensorPermissionOverlay } from './SensorPermissionOverlay';
import { useMotionPermission } from './_hooks/useMotionPermission';
import { useOverlayPresence } from './_hooks/useOverlayPresence';
import { PageOne } from './PageOne';
import { PageTwo } from './PageTwo';
import styles from './index.module.css';

interface Props {}

const Passport: FC<Props> = () => {
  const bookRef = useRef<HTMLElement>(null);
  const contentId = useId();

  const { permission, requestPermission } = useMotionPermission();
  const {
    isVisible: overlayOpen,
    isBlocking,
    onRequestStart,
    onExitComplete,
  } = useOverlayPresence(permission);

  const requestSensorAccess = () => {
    onRequestStart();
    void requestPermission();
  };

  const finishOverlayExit = () => {
    onExitComplete();
    bookRef.current?.focus({ preventScroll: true });
  };

  const [hasIntersected, setHasIntersected] = useState(false);

  const { isSupported } = useIntersectionObserver(
    bookRef,
    (entry) => {
      if (entry.isIntersecting) {
        setHasIntersected(true);
      }
    },
    { threshold: 0.22, rootMargin: '0px 0px -12% 0px' },
  );

  const isVisible = !isSupported || hasIntersected;

  return (
    <article
      ref={bookRef}
      className={[styles.book, isVisible ? styles.is_visible : null].filter(Boolean).join(' ')}
      aria-label="사진 선물 이벤트 여권"
      tabIndex={-1}
    >
      <AnimatePresence onExitComplete={finishOverlayExit}>
        {overlayOpen ? (
          <SensorPermissionOverlay
            key="sensor-permission-overlay"
            requesting={permission === 'requesting'}
            disabled={permission !== 'prompt'}
            onRequest={requestSensorAccess}
            contentId={contentId}
          />
        ) : null}
      </AnimatePresence>
      <div id={contentId} className={styles.content} inert={isBlocking} aria-hidden={isBlocking}>
        <PageOne />
        <PageTwo permission={permission} />
      </div>
    </article>
  );
};

export { Passport };
