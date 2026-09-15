import { useRef, type FC } from 'react';
import type { MotionPermissionStatus } from '../_hooks/useMotionPermission/_utils';
import { useAccelerometer } from '../_hooks/useAccelerometer';
import { Hologram } from '../Hologram';
import { useHologramMotion } from './_hooks/useHologramMotion';
import { useMotionEnvironment } from './_hooks/useMotionEnvironment';
import styles from './index.module.css';

interface Props {
  permission: MotionPermissionStatus;
}

const Chip: FC<Props> = (props) => {
  const { permission } = props;

  const chipRef = useRef<HTMLDivElement>(null);
  const hologramRef = useRef<HTMLSpanElement>(null);

  const { environment, sensorEnabled } = useMotionEnvironment(chipRef);
  const { input, status: sensorStatus } = useAccelerometer(permission, sensorEnabled);
  const { mode } = useHologramMotion(hologramRef, input, environment);
  const status = mode ?? sensorStatus;

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
