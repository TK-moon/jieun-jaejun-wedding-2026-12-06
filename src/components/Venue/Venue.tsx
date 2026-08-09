import type { FC } from 'react';
import venueMap from '../../assets/venue-map.png';
import { WEDDING_INFO } from '../../constants';
import { MapLink } from '../MapLink/MapLink';
import { TransportInfo } from '../TransportInfo/TransportInfo';
import styles from './Venue.module.css';

interface Props {}

const Venue: FC<Props> = () => {
  return (
    <section className={styles.venue} aria-labelledby="venue-name">
      <div className={styles.rule} aria-hidden="true" />
      <h2 className={styles.name} id="venue-name">
        {WEDDING_INFO.venue.name}
      </h2>
      <address className={styles.address}>{WEDDING_INFO.venue.address}</address>
      <img className={styles.mapImage} src={venueMap} alt="더 메리든 오시는 길 약도" />
      <nav className={styles.mapLinks} aria-label="지도 앱으로 길찾기">
        <MapLink href={WEDDING_INFO.venue.maps.naver} service="naver" label="네이버지도" />
        <MapLink href={WEDDING_INFO.venue.maps.kakao} service="kakao" label="카카오맵" />
      </nav>
      <TransportInfo />
    </section>
  );
};

export { Venue };
