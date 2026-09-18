import { useId, type FC } from 'react';
import { SectionTitle } from '@/components/SectionTitle';
import { Cover } from './Cover';
import { Item } from './Item';
import { Photo } from './Photo';
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
            <Item key={photo.id}>
              <Photo src={photo.src} alt={photo.alt} />
            </Item>
          ))}
          <Item>
            <Cover />
          </Item>
        </ol>
      </div>
    </section>
  );
};

export { GallerySection };
