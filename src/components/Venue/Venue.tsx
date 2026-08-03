import type { FC } from 'react';
import { LinkArrow } from '../LinkArrow/LinkArrow';
import styles from './Venue.module.css';

interface Props {}

const Venue: FC<Props> = () => {
  return (
    <div className={styles.venue}>
      <div className={styles.rule} aria-hidden="true" />
      <p className={styles.name}>THE MERRIDEN</p>
      <a className={styles.link} href="http://themerriden.com/" target="_blank" rel="noreferrer">
        <span>예식장 홈페이지</span>
        <LinkArrow />
      </a>
    </div>
  );
};

export { Venue };
