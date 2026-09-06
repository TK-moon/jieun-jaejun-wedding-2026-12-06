import type { FC } from 'react';
import styles from './index.module.css';

interface Props {}

const Divider: FC<Props> = () => {
  return (
    <span className={styles.separator} aria-hidden="true">
      ·
    </span>
  );
};

export { Divider };
