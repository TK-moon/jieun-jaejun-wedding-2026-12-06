import type { FC } from 'react';
import venueMap from '../../assets/venue-map.png';
import { Disclosure } from '../../components/Disclosure/Disclosure';
import { MapLink } from '../../components/MapLink/MapLink';
import {
  BUS_STOPS,
  HIGHWAY_INFORMATION,
  SUBWAY_INFORMATION,
} from '../../components/TransportInfo/_constants';
import { WEDDING_INFO } from '../../constants';
import styles from './index.module.css';

interface Props {}

const VenueSection: FC<Props> = () => {
  const { venue } = WEDDING_INFO;

  return (
    <section className={styles.container} aria-labelledby="venue-section-title">
      <div className={styles.frame}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Location</p>
          <h2 className={styles.name} id="venue-section-title">
            {venue.name}
          </h2>
          <p className={styles.hall}>
            {venue.hall} · {venue.floor}
          </p>
          <address className={styles.address}>{venue.address}</address>
        </header>

        <figure className={styles.map}>
          <img className={styles.mapImage} src={venueMap} alt="더 메리든 오시는 길 약도" />
        </figure>

        <nav className={styles.mapLinks} aria-label="지도 앱으로 길찾기">
          <MapLink href={venue.maps.naver} service="naver" label="네이버지도" />
          <MapLink href={venue.maps.kakao} service="kakao" label="카카오맵" />
        </nav>

        <div className={styles.transport}>
          <Disclosure summary="버스">
            <dl className={styles.busStops}>
              {BUS_STOPS.map(({ name, routes }) => (
                <div className={styles.busStop} key={name}>
                  <dt className={styles.stopName}>{name}</dt>
                  <dd className={styles.routes}>{routes.join(', ')}</dd>
                </div>
              ))}
            </dl>
          </Disclosure>
          <Disclosure summary="지하철">
            <p className={styles.description}>{SUBWAY_INFORMATION}</p>
          </Disclosure>
          <Disclosure summary="고속도로">
            <p className={styles.description}>{HIGHWAY_INFORMATION}</p>
          </Disclosure>
        </div>
      </div>
    </section>
  );
};

export { VenueSection };
