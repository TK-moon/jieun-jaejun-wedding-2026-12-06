import type { FC } from 'react';
import { Picture } from '@/components/Picture';
import mainImageJpg from '../../../BannerSection/_images/main.jpg';
import mainImageWebp from '../../../BannerSection/_images/main.webp';
import styles from './index.module.css';

interface Props {
  variant?: 'color' | 'mono';
}

const Portrait: FC<Props> = (props) => {
  const { variant = 'color' } = props;

  return (
    <div className={[styles.portrait, styles[variant]].join(' ')}>
      <Picture
        className={styles.photo}
        webpSrc={mainImageWebp}
        jpgSrc={mainImageJpg}
        alt=""
        aria-hidden="true"
      />
    </div>
  );
};

export { Portrait };
