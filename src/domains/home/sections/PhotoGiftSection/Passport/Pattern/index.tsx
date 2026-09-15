import type { FC } from 'react';
import styles from './index.module.css';

interface Props {
  variant: 'request' | 'identity';
}

const Pattern: FC<Props> = (props) => {
  const { variant } = props;

  return (
    <svg
      className={[styles.pattern, styles[variant]].join(' ')}
      viewBox="0 0 500 352"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className={styles.cloud}
        d="M-18 83c38-41 70-43 93-12 9-25 39-31 56-11 17 20 5 45-19 48-29 4-41-24-24-41-31 15-46 42-65 63"
      />
      <path className={styles.ridge} d="M-25 286c74-48 150-70 227-64 102 8 174 73 323 51" />
      <path className={styles.ridge} d="M-25 298c80-42 153-57 226-49 104 12 182 66 324 42" />
      <path className={styles.ridge} d="M-25 310c91-36 164-46 233-35 101 17 181 54 317 31" />
      <circle className={styles.orbit} cx="388" cy="235" r="56" />
      <circle className={styles.orbit} cx="388" cy="235" r="38" />
      <circle className={styles.orbit} cx="388" cy="235" r="21" />
      <path className={styles.arc} d="M288 352A154 154 0 0 1 500 210" />
      <path className={styles.arc} d="M328 352A123 123 0 0 1 500 236" />
      <text className={styles.watermark} x="268" y="242">
        대한민국
      </text>
    </svg>
  );
};

export { Pattern };
