import { useCallback, useId, useRef, useState, type FC } from 'react';
import { useReducedMotion } from 'motion/react';
import { SectionTitle } from '@/components/SectionTitle/SectionTitle';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Cover } from './Cover';
import { Photo } from './Photo';
import { GALLERY_PREVIEW_PHOTOS } from './_constants';
import styles from './index.module.css';

interface Props {}

const GallerySection: FC<Props> = () => {
  const titleId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const [hasIntersected, setHasIntersected] = useState(false);
  const [readyPhotoIds, setReadyPhotoIds] = useState<Set<string>>(() => new Set());
  const shouldReduceMotion = useReducedMotion();

  const { isSupported } = useIntersectionObserver(
    sectionRef,
    (entry) => {
      if (entry.isIntersecting) {
        setHasIntersected(true);
      }
    },
    { threshold: 0.2, rootMargin: '0px 0px -10% 0px' },
  );

  const isSectionVisible = !isSupported || hasIntersected;
  const arePhotosReady = readyPhotoIds.size === GALLERY_PREVIEW_PHOTOS.length;

  const handlePhotoReady = useCallback((photoId: string) => {
    setReadyPhotoIds((currentIds) => {
      if (currentIds.has(photoId)) {
        return currentIds;
      }

      const nextIds = new Set(currentIds);
      nextIds.add(photoId);
      return nextIds;
    });
  }, []);

  return (
    <section ref={sectionRef} className={styles.container} aria-labelledby={titleId}>
      <SectionTitle label="갤러리" title="우리의 순간" titleId={titleId} />
      <div className={styles.frame}>
        <ol className={styles.grid}>
          {GALLERY_PREVIEW_PHOTOS.map((photo, index) => (
            <li className={styles.item} key={photo.id}>
              <Photo
                id={photo.id}
                src={photo.src}
                alt={photo.alt}
                index={index}
                isSectionVisible={isSectionVisible}
                shouldReduceMotion={shouldReduceMotion}
                onReady={handlePhotoReady}
              />
            </li>
          ))}
          <li className={styles.item}>
            <Cover
              index={GALLERY_PREVIEW_PHOTOS.length}
              isSectionVisible={isSectionVisible && arePhotosReady}
              shouldReduceMotion={shouldReduceMotion}
            />
          </li>
        </ol>
      </div>
    </section>
  );
};

export { GallerySection };
