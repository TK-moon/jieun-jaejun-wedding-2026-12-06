import { useId, useState, type FC, type MouseEventHandler } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon';
import { Picture } from '@/components/Picture';
import { SectionTitle } from '@/components/SectionTitle';
import { ROUTES } from '@/constants/routes';
import { GALLERY_PHOTOS } from './_constants';
import { GalleryImageModal } from './GalleryImageModal';
import styles from './index.module.css';

interface Props {}

const GalleryMain: FC<Props> = () => {
  const titleId = useId();
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleBackClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (event.button !== 0) {
      return;
    }

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    if (window.history.state?.idx > 0) {
      event.preventDefault();
      void navigate(-1);
    }
  };

  return (
    <section className={styles.container} aria-labelledby={titleId}>
      <nav className={styles.navigation} aria-label="갤러리 페이지 이동">
        <Link className={styles.back_link} to={ROUTES.invitation} onClick={handleBackClick}>
          <ArrowRightIcon className={styles.back_icon} />
          뒤로가기
        </Link>
      </nav>
      <SectionTitle label="갤러리" title="우리의 순간" titleId={titleId} />
      <div className={styles.frame}>
        <ol className={styles.grid}>
          {GALLERY_PHOTOS.map((photo, index) => (
            <li className={styles.item} key={photo.id}>
              <button
                type="button"
                className={styles.photo_button}
                aria-label={`${photo.alt} 크게 보기`}
                aria-haspopup="dialog"
                onClick={() => setSelectedIndex(index)}
              >
                <Picture
                  className={styles.image}
                  webpSrc={photo.thumbnailSrc.webp}
                  jpgSrc={photo.thumbnailSrc.jpg}
                  alt={photo.alt}
                  width={1200}
                  height={1800}
                  loading="lazy"
                  decoding="async"
                />
              </button>
            </li>
          ))}
        </ol>
      </div>
      <GalleryImageModal
        photos={GALLERY_PHOTOS}
        selectedIndex={selectedIndex}
        onIndexChange={setSelectedIndex}
        onClose={() => setSelectedIndex(null)}
      />
    </section>
  );
};

export { GalleryMain };
