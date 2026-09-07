import type { FC } from 'react';
import styles from './index.module.css';

interface Props {
  id: string;
  src: string;
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
      <img
        className={styles.image}
        src={src}
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
