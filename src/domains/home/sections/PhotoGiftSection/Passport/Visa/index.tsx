import type { FC } from 'react';
import { PHOTO_GIFT } from '../../_constants';
import styles from './index.module.css';

interface Props {}

const Visa: FC<Props> = () => {
  return (
    <ol className={styles.visa}>
      {PHOTO_GIFT.steps.map((step) => (
        <li key={step.code} className={styles.entry}>
          <span className={styles.code}>STEP {step.code}</span>
          <span className={styles.text}>{step.text}</span>
        </li>
      ))}
    </ol>
  );
};

export { Visa };
