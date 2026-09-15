import { useId, useRef, type FC } from 'react';
import { Hologram } from '../Hologram';
import { useHologramMotion } from './_hooks/useHologramMotion';
import styles from './index.module.css';

interface Props {}

const Chip: FC<Props> = () => {
  const chipRef = useRef<HTMLDivElement>(null);
  const hologramRef = useRef<HTMLSpanElement>(null);
  const statusId = useId();
  const { status, activate } = useHologramMotion(chipRef, hologramRef);
  const showPermission = status === 'permission' || status === 'requesting';
  const description =
    status === 'active'
      ? '휴대폰을 기울이면 카메라의 빛이 달라져요.'
      : status === 'pointer'
        ? '화면에서 마우스를 움직이면 카메라의 빛이 달라져요.'
        : status === 'permission' || status === 'requesting'
          ? '카메라를 눌러 기울기에 반응하는 빛을 켜 보세요.'
          : status === 'reduced'
            ? '동작 줄이기 설정에 따라 정적인 홀로그램을 표시해요.'
            : '사진 이벤트 카메라 홀로그램';

  return (
    <div ref={chipRef} className={styles.chip} title={description}>
      <span className={styles.camera} aria-hidden="true">
        <Hologram hologramRef={hologramRef} />
      </span>
      {showPermission ? (
        <button
          type="button"
          className={styles.permission}
          onClick={activate}
          aria-label="카메라 홀로그램 빛 켜기"
          aria-describedby={statusId}
          aria-busy={status === 'requesting'}
          disabled={status === 'requesting'}
        >
          <span className={styles.hint}>빛 켜기</span>
        </button>
      ) : null}
      <span id={statusId} className={styles.status} aria-live="polite">
        {description}
      </span>
    </div>
  );
};

export { Chip };
