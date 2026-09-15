import { useId, type FC } from 'react';
import type { MotionPermissionStatus } from '../_hooks/useMotionPermission/_utils';
import styles from './index.module.css';

interface Props {
  permission: MotionPermissionStatus;
  hasGrantedBefore: boolean;
  onRequest: () => void;
  contentId: string;
}

const SensorPermissionOverlay: FC<Props> = ({
  permission,
  hasGrantedBefore,
  onRequest,
  contentId,
}) => {
  const descriptionId = useId();
  const requesting = permission === 'requesting';
  const denied = permission === 'denied';

  return (
    <div className={styles.overlay}>
      <div className={styles.prompt}>
        <p id={descriptionId} className={styles.description} role="status">
          {denied
            ? '센서 접근이 차단되어 있어요. 브라우저에서 이 사이트의 센서 권한을 허용해 주세요.'
            : '휴대폰의 움직임을 허용하면 기울기에 따라 은빛 홀로그램이 반짝여요.'}
        </p>
        <button
          type="button"
          className={styles.button}
          onClick={onRequest}
          disabled={requesting}
          aria-busy={requesting}
          aria-describedby={descriptionId}
          aria-controls={contentId}
        >
          {requesting
            ? '권한 요청 중'
            : denied
              ? '권한 다시 확인하기'
              : hasGrantedBefore
                ? '센서 다시 연결하기'
                : '기울기 효과 켜기'}
        </button>
      </div>
    </div>
  );
};

export { SensorPermissionOverlay };
