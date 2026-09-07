import { useEffect, useEffectEvent, useRef, useState, type FC } from 'react';
import { Picture } from '@/components/Picture';
import type { GalleryPhoto } from '../../_types';
import { useIdleImageLoad } from '../_hooks/useIdleImageLoad';
import styles from './index.module.css';

interface Props {
  photo: GalleryPhoto;
  active: boolean;
  preloadEnabled: boolean;
  canPreload: () => boolean;
  onReady: () => void;
}

const Photo: FC<Props> = (props) => {
  const { photo, active, preloadEnabled, canPreload, onReady } = props;
  const imageRef = useRef<HTMLImageElement>(null);
  const notifyReady = useEffectEvent(onReady);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const shouldLoad = useIdleImageLoad({ active, enabled: preloadEnabled, canPreload });

  useEffect(() => {
    const image = imageRef.current;
    let cancelled = false;

    if (!image || !shouldLoad) {
      return;
    }

    void image
      .decode()
      .then(() => {
        if (cancelled) {
          return;
        }

        setStatus('loaded');
        notifyReady();
      })
      .catch(() => {
        if (!cancelled) {
          setStatus('error');
          notifyReady();
        }
      });

    return () => {
      cancelled = true;
    };
  }, [photo.displaySrc.src, attempt, shouldLoad]);

  const handleRetry = () => {
    setStatus('loading');
    setAttempt((previous) => previous + 1);
  };

  return (
    <div className={styles.container} aria-busy={status === 'loading'}>
      <div className={styles.backdrop} aria-hidden>
        <Picture
          className={styles.background}
          webpSrc={photo.thumbnailSrc.webp}
          jpgSrc={photo.thumbnailSrc.jpg}
          alt=""
          decoding="async"
          draggable={false}
        />
      </div>
      <img
        ref={imageRef}
        key={attempt}
        className={`${styles.image} ${status === 'loaded' ? styles.loaded : ''}`}
        src={shouldLoad ? photo.displaySrc.src : undefined}
        srcSet={shouldLoad ? photo.displaySrc.srcSet : undefined}
        sizes={photo.displaySrc.sizes}
        width={photo.displaySrc.width}
        height={photo.displaySrc.height}
        alt={photo.alt}
        decoding="async"
        loading="eager"
        fetchPriority={active ? 'high' : 'low'}
        draggable={false}
      />
      {status === 'loading' ? (
        <p className={styles.status} role="status">
          사진을 불러오는 중…
        </p>
      ) : null}
      {status === 'error' ? (
        <div className={styles.status}>
          <p role="alert">사진을 불러오지 못했습니다.</p>
          <button
            type="button"
            className={styles.retry}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={handleRetry}
          >
            다시 시도
          </button>
        </div>
      ) : null}
    </div>
  );
};

export { Photo };
