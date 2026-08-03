import type { FC } from 'react';
import styles from './LineMotif.module.css';

interface Props {}

const LineMotif: FC<Props> = () => {
  return (
    <div className={styles.motif} aria-hidden="true">
      <svg viewBox="0 0 1440 150" preserveAspectRatio="none">
        <path d="M-20 34c202 106 454 118 634 61 92-29 109-91 54-103-53-12-76 68-4 100 42 19 85 19 127-2 67-34 36-111-22-96-54 14-34 75 56 103 183 57 427 38 615-64" />
      </svg>
    </div>
  );
};

export { LineMotif };
