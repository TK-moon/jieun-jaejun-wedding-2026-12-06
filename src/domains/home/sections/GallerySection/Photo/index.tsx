import type { FC } from 'react';
import { Picture } from '@/components/Picture';
import styles from './index.module.css';

interface Props {
  src: {
    webp: string;
    jpg: string;
  };
  alt: string;
  onReady?: () => void;
}

const Photo: FC<Props> = (props) => {
  const { src, alt, onReady } = props;

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
        onLoad={onReady}
        onError={onReady}
      />
    </div>
  );
};

export { Photo };
