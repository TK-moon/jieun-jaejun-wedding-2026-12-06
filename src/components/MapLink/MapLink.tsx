import type { FC } from 'react';
import kakaoMapIcon from '../../assets/kakao-map.ico';
import naverMapIcon from '../../assets/naver-map.ico';
import styles from './MapLink.module.css';

interface Props {
  href: string;
  service: 'naver' | 'kakao';
  label: string;
}

const MapLink: FC<Props> = ({ href, service, label }) => {
  const isNaver = service === 'naver';
  const iconSrc = isNaver ? naverMapIcon : kakaoMapIcon;

  return (
    <a className={styles.link} href={href} target="_blank" rel="noreferrer">
      <img className={styles.icon} src={iconSrc} alt="" aria-hidden="true" />
      <span>{label}</span>
    </a>
  );
};

export { MapLink };
