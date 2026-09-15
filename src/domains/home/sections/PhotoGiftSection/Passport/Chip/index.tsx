import type { FC, Ref } from 'react';
import { Hologram } from '../Hologram';
import styles from './index.module.css';

interface Props {
  hologramRef?: Ref<HTMLSpanElement>;
}

const Chip: FC<Props> = (props) => {
  const { hologramRef } = props;

  return (
    <div className={styles.chip} aria-hidden="true">
      <Hologram hologramRef={hologramRef} />
      <svg className={styles.mark} viewBox="0 0 71 40" focusable="false">
        <path
          className={styles.ring}
          fillRule="evenodd"
          d="M35.5 5a15 15 0 1 1 0 30 15 15 0 0 1 0-30Zm0 5.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19Z"
        />
      </svg>
    </div>
  );
};

export { Chip };
