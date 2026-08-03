import type { FC } from 'react';
import venueMap from '../../assets/venue-map.png';
import { MapLink } from '../MapLink/MapLink';
import { TransportInfo } from '../TransportInfo/TransportInfo';
import styles from './Venue.module.css';

interface Props {}

const Venue: FC<Props> = () => {
  return (
    <section className={styles.venue} aria-labelledby="venue-name">
      <div className={styles.rule} aria-hidden="true" />
      <h2 className={styles.name} id="venue-name">
        THE MERRIDEN
      </h2>
      <address className={styles.address}>
        경기도 성남시 분당구 서현로 180번길 19 비전월드 8층
      </address>
      <img className={styles.mapImage} src={venueMap} alt="더 메리든 오시는 길 약도" />
      <nav className={styles.mapLinks} aria-label="지도 앱으로 길찾기">
        <MapLink href="https://naver.me/GzE979EN" service="naver" label="네이버지도" />
        <MapLink href="https://place.map.kakao.com/1905917949" service="kakao" label="카카오맵" />
      </nav>
      <TransportInfo />
    </section>
  );
};

export { Venue };
