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
    >
      <span className={styles.background} data-hologram-part="background">
        <canvas className={styles.foil} data-hologram-layer="surface" />
        <canvas className={styles.light} data-hologram-layer="reflection" />
      </span>
      <span className={styles.lensRing} data-hologram-part="lens-ring">
        <canvas className={styles.foil} data-hologram-layer="surface" />
        <canvas className={styles.light} data-hologram-layer="reflection" />
      </span>
      <span className={styles.lens} data-hologram-part="lens">
        <canvas className={styles.foil} data-hologram-layer="surface" />
        <canvas className={styles.light} data-hologram-layer="reflection" />
      </span>
      <span className={styles.flash} data-hologram-part="flash">
        <canvas className={styles.foil} data-hologram-layer="surface" />
        <canvas className={styles.light} data-hologram-layer="reflection" />
      </span>
    </span>
  );
};

export { Hologram };
