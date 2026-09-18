import type { FC } from 'react';
import { Picture } from '@/components/Picture';
import styles from './index.module.css';

interface Props {
  src: {
    webp: string;
    jpg: string;
  };
  alt: string;
}

const Photo: FC<Props> = (props) => {
  const { src, alt } = props;

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
      />
    </div>
  );
};

export { Photo };
