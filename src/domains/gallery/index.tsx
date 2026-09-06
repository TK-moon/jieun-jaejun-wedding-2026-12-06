import { useId, type FC, type MouseEventHandler } from 'react';
import { Link, useNavigate } from 'react-router';
import { SectionTitle } from '../../components/SectionTitle/SectionTitle';
import { ROUTES } from '../../constants/routes';
import styles from './index.module.css';
import { GALLERY_PHOTOS } from '../home/sections/GallerySection/_constants';

interface Props {}

const GalleryMain: FC<Props> = () => {
  const titleId = useId();
  const navigate = useNavigate();

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
          <span aria-hidden="true">←</span>
          뒤로가기
        </Link>
      </nav>
      <SectionTitle label="갤러리" title="우리의 사진첩" titleId={titleId} />
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

export { GalleryMain };
