import type { FC } from 'react';
import styles from './index.module.css';

interface Props {}

const Messages: FC<Props> = () => {
  return (
    <div className={styles.messages}>
      <p>에베베</p>
      <p>에베베베</p>
      <p>에베베베베</p>
      <p>에베베, 에베베베</p>
    </div>
  );
};

export { Messages };
