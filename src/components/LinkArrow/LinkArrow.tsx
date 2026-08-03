import type { FC } from 'react';
import styles from './LinkArrow.module.css';

interface Props {}

const LinkArrow: FC<Props> = () => {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 7l5 5-5 5" />
    </svg>
  );
};

export { LinkArrow };
