import type { FC } from 'react';
import kakaoMapIcon from '../../assets/kakao-map.ico';
import naverMapIcon from '../../assets/naver-map.ico';
import styles from './MapLink.module.css';

interface Props {
  href: string;
  service: 'naver' | 'kakao';
  label: string;
  variant?: 'button' | 'text';
}

const MapLink: FC<Props> = (props) => {
  const { href, service, label, variant = 'button' } = props;
  const iconSrc = service === 'naver' ? naverMapIcon : kakaoMapIcon;
  const className = variant === 'text' ? styles.text : styles.button;

  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      <img className={styles.icon} src={iconSrc} alt="" aria-hidden="true" />
      <span>{label}</span>
    </a>
  );
};

export { MapLink };
