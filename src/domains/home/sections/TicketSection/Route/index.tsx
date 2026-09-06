import type { FC } from 'react';
import { TICKET } from '../_constants';
import styles from './index.module.css';

interface Props {
  isVisible: boolean;
}

const Route: FC<Props> = (props) => {
  const { isVisible } = props;

  return (
    <div className={[styles.route, isVisible ? styles.is_visible : null].filter(Boolean).join(' ')}>
      <div className={styles.endpoint}>
        <p className={styles.code}>{TICKET.from.code}</p>
        <p className={styles.endpoint_name}>{TICKET.from.name}</p>
      </div>

      <div className={styles.flight_path} aria-hidden="true">
        <span className={styles.path_line} />
        <svg className={styles.plane} viewBox="0 0 24 24" focusable="false">
          <path
            d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
            fill="currentColor"
          />
        </svg>
        <span className={styles.path_line} />
      </div>

      <div className={styles.endpoint}>
        <p className={styles.code}>{TICKET.to.code}</p>
        <p className={styles.endpoint_name}>{TICKET.to.name}</p>
      </div>
    </div>
  );
};

export { Route };
