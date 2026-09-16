import type { FC } from 'react';
import styles from './index.module.css';

interface Props {
  requesting: boolean;
  onRequest: () => void;
  contentId: string;
}

const SensorPermissionOverlay: FC<Props> = (props) => {
  const { requesting, onRequest, contentId } = props;

  return (
    <div className={styles.overlay}>
      <div className={styles.prompt}>
        <button
          type="button"
          className={styles.button}
          onClick={onRequest}
          disabled={requesting}
          aria-busy={requesting}
          aria-controls={contentId}
        >
          이벤트 확인하기
        </button>
      </div>
    </div>
  );
};

export { SensorPermissionOverlay };
