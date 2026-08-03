import type { FC } from 'react';
import { BUS_STOPS, HIGHWAY_INFORMATION, SUBWAY_INFORMATION } from './_constants';
import styles from './TransportInfo.module.css';

interface Props {}

const TransportInfo: FC<Props> = () => {
  return (
    <section className={styles.transport} aria-labelledby="transport-title">
      <h2 className={styles.title} id="transport-title">
        오시는 길
      </h2>

      <section className={styles.section}>
        <h3 className={styles.heading}>버스</h3>
        <dl className={styles.busStops}>
          {BUS_STOPS.map(({ name, routes }) => (
            <div className={styles.busStop} key={name}>
              <dt className={styles.stopName}>{name}</dt>
              <dd className={styles.routes}>{routes.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.section}>
        <h3 className={styles.heading}>지하철</h3>
        <p className={styles.description}>{SUBWAY_INFORMATION}</p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.heading}>고속도로</h3>
        <p className={styles.description}>{HIGHWAY_INFORMATION}</p>
      </section>
    </section>
  );
};

export { TransportInfo };
