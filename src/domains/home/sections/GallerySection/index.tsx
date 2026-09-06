import { useId, type FC } from 'react';
import { Link } from 'react-router';
import { SectionTitle } from '@/components/SectionTitle/SectionTitle';
import { ROUTES } from '@/constants/routes';
import { GALLERY_PREVIEW_PHOTOS } from './_constants';
import styles from './index.module.css';

interface Props {}

const GallerySection: FC<Props> = () => {
  const titleId = useId();

  return (
    <section className={styles.container} aria-labelledby={titleId}>
      <SectionTitle label="갤러리" title="우리의 순간" titleId={titleId} />
      <div className={styles.frame}>
        <ol className={styles.grid}>
          {GALLERY_PREVIEW_PHOTOS.map((photo) => (
            <li className={styles.item} key={photo.id}>
              <img
                className={styles.image}
                src={photo.src}
                alt={photo.alt}
                width={4672}
                height={7008}
                loading="lazy"
                decoding="async"
              />
            </li>
          ))}
          <li className={styles.item}>
            <Link className={styles.gallery_link} to={ROUTES.gallery}>
              <span>전체 사진 보기</span>
              <span className={styles.arrow} aria-hidden="true">
                ↗
              </span>
            </Link>
          </li>
        </ol>
      </div>
    </section>
  );
};

export { GallerySection };
