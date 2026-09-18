import { useId, useRef, useState, type FC } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { SensorPermissionOverlay } from './SensorPermissionOverlay';
import { useMotionPermission } from './_hooks/useMotionPermission';
import { PageOne } from './PageOne';
import { PageTwo } from './PageTwo';
import styles from './index.module.css';

interface Props {}

const Passport: FC<Props> = () => {
  const bookRef = useRef<HTMLElement>(null);
  const contentId = useId();

  const { permission, requestPermission } = useMotionPermission();

  const showPermissionOverlay = permission === 'prompt' || permission === 'requesting';

  const requestSensorAccess = async () => {
    await requestPermission();
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
      {showPermissionOverlay && (
        <SensorPermissionOverlay
          requesting={permission === 'requesting'}
          onRequest={requestSensorAccess}
          contentId={contentId}
        />
      )}
      <div
        id={contentId}
        className={styles.content}
        inert={showPermissionOverlay}
        aria-hidden={showPermissionOverlay}
      >
        <PageOne />
        <PageTwo permission={permission} />
      </div>
    </article>
  );
};

export { Passport };
