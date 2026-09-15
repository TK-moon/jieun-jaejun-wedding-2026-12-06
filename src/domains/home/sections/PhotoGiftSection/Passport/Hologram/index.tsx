import type { FC, Ref } from 'react';
import styles from './index.module.css';

interface Props {
  className?: string;
  hologramRef?: Ref<HTMLSpanElement>;
}

const Hologram: FC<Props> = (props) => {
  const { className, hologramRef } = props;

  return (
    <span
      ref={hologramRef}
      className={[styles.hologram, className].filter(Boolean).join(' ')}
      aria-hidden="true"
    />
  );
};

export { Hologram };
