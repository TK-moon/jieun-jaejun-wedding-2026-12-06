import type { FC } from 'react';
import { WEDDING_INFO } from '@/constants';
import { Stamp } from './Stamp';
import styles from './index.module.css';

interface Props {}

const Signatures: FC<Props> = () => {
  const { bride, groom } = WEDDING_INFO;

  return (
    <div className={styles.signatures}>
      <p className={styles.names}>
        {bride.name.full} · {groom.name.full}
      </p>
      <Stamp />
    </div>
  );
};

export { Signatures };
