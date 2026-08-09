import type { FC } from 'react';
import styles from './Toast.module.css';

interface Props {
  message: string;
}

const Toast: FC<Props> = (props) => {
  const { message } = props;

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      {message}
    </div>
  );
};

export { Toast };
