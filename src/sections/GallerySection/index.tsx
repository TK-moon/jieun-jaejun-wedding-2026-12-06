import { useId, type FC } from 'react';
import { SectionTitle } from '../../components/SectionTitle/SectionTitle';
import { GALLERY_PHOTOS } from './_constants';
import styles from './index.module.css';

interface Props {}

const GallerySection: FC<Props> = () => {
  const titleId = useId();

  return (
    <section className={styles.container} aria-labelledby={titleId}>
      <SectionTitle label="갤러리" title="우리의 순간" titleId={titleId} />
      <div className={styles.frame}>
        <ol className={styles.grid}>
          {GALLERY_PHOTOS.map((photo) => (
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
        </ol>
      </div>
    </section>
  );
};

export { GallerySection };
