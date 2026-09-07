import type { FC } from 'react';
import { Picture } from '@/components/Picture';
import styles from './index.module.css';

interface Props {
  id: string;
  src: {
    webp: string;
    jpg: string;
  };
  alt: string;
  onReady?: (photoId: string) => void;
}

const Photo: FC<Props> = (props) => {
  const { id, src, alt, onReady } = props;

  const handleReady = () => {
    onReady?.(id);
  };

  return (
    <div className={styles.frame}>
      <Picture
        className={styles.image}
        webpSrc={src.webp}
        jpgSrc={src.jpg}
        alt={alt}
        width={1200}
        height={1800}
        loading="lazy"
        decoding="async"
        onLoad={handleReady}
        onError={handleReady}
      />
    </div>
  );
};

export { Photo };
