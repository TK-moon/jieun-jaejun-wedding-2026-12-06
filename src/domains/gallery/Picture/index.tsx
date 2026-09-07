import type { FC, ImgHTMLAttributes, Ref } from 'react';
import styles from './index.module.css';

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'ref'> {
  webpSrc?: string;
  jpgSrc?: string;
  imageRef?: Ref<HTMLImageElement>;
}

const Picture: FC<Props> = (props) => {
  const { webpSrc, jpgSrc, className, imageRef, ...imgProps } = props;

  return (
    <picture className={[styles.picture, className].filter(Boolean).join(' ')}>
      {webpSrc ? <source type="image/webp" srcSet={webpSrc} /> : null}
      <img {...imgProps} ref={imageRef} src={jpgSrc} />
    </picture>
  );
};

export { Picture };
