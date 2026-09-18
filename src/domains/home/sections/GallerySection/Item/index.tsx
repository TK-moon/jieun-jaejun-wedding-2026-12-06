import type { FC, PropsWithChildren } from 'react';
import { useRevealMotion } from './_hooks/useRevealMotion';
import styles from './index.module.css';

interface Props extends PropsWithChildren {}

const Item: FC<Props> = (props) => {
  const { children } = props;
  const ref = useRevealMotion();

  return (
    <li ref={ref} className={styles.item}>
      <div className={styles.content}>{children}</div>
    </li>
  );
};

export { Item };
