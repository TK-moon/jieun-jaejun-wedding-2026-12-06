import type { FC } from 'react';
import { WEDDING_INFO } from '../../../constants';
import styles from './index.module.css';

interface Props {}

const Family: FC<Props> = () => {
  const { groom, bride } = WEDDING_INFO;

  return (
    <ul className={styles.family}>
      <li className={styles.family_row}>
        <span className={styles.parents}>
          {groom.parents.father} · {groom.parents.mother}
        </span>
        <span className={styles.relation}>의 {groom.order}</span>
        <span className={styles.child}>{groom.name.ko}</span>
      </li>
      <li className={styles.family_row}>
        <span className={styles.parents}>
          {bride.parents.father} · {bride.parents.mother}
        </span>
        <span className={styles.relation}>의 {bride.order}</span>
        <span className={styles.child}>{bride.name.ko}</span>
      </li>
    </ul>
  );
};

export { Family };
