import type { FC } from 'react';
import { MapLink } from '../../../components/MapLink/MapLink';
import { WEDDING_INFO } from '../../../constants';
import styles from '../index.module.css';

interface Props {}

const MapLinks: FC<Props> = () => {
  const { maps } = WEDDING_INFO.venue;

  return (
    <nav className={styles.mapLinks} aria-label="지도로 길찾기">
      <MapLink href={maps.naver} service="naver" label="네이버로 길찾기" variant="text" />
      <span className={styles.mapLinksDivider} aria-hidden="true">
        ·
      </span>
      <MapLink href={maps.kakao} service="kakao" label="카카오로 길찾기" variant="text" />
    </nav>
  );
};

export { MapLinks };
