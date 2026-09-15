import { useRef, type FC } from 'react';
import { Hologram } from '../Hologram';
import { useHologramMotion } from './_hooks/useHologramMotion';
import styles from './index.module.css';

interface Props {}

const Chip: FC<Props> = () => {
  const chipRef = useRef<HTMLDivElement>(null);
  const hologramRef = useRef<HTMLSpanElement>(null);
  const { status } = useHologramMotion(chipRef, hologramRef);
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
