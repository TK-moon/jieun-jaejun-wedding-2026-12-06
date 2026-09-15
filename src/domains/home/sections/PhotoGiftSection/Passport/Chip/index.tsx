import type { FC, RefObject } from 'react';
import { Hologram } from '../Hologram';
import type { Status } from './_hooks/useHologramMotion';
import styles from './index.module.css';

interface Props {
  chipRef: RefObject<HTMLDivElement | null>;
  hologramRef: RefObject<HTMLSpanElement | null>;
  status: Status;
}

const Chip: FC<Props> = ({ chipRef, hologramRef, status }) => {
  const description =
    status === 'active'
      ? '휴대폰을 기울이면 카메라의 빛이 달라져요.'
      : status === 'pointer'
        ? '화면에서 마우스를 움직이면 카메라의 빛이 달라져요.'
        : status === 'reduced'
          ? '동작 줄이기 설정에 따라 정적인 홀로그램을 표시해요.'
          : '사진 이벤트 카메라 홀로그램';

  return (
    <div ref={chipRef} className={styles.chip} title={description}>
      <span className={styles.camera} aria-hidden="true">
        <Hologram hologramRef={hologramRef} />
      </span>
      <span className={styles.status} aria-live="polite">
        {description}
      </span>
    </div>
  );
};

export { Chip };
