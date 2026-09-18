import { useRef, type FC } from 'react';
import type { MotionPermissionStatus } from '../../_hooks/useMotionPermission/_utils';
import { useAccelerometer } from './_hooks/useAccelerometer';
import { Hologram } from './Hologram';
import { useHologramMotion } from './_hooks/useHologramMotion';
import { useMotionEnvironment } from './_hooks/useMotionEnvironment';
import { useScrollMotion } from './_hooks/useScrollMotion';
import { getHologramStatusDescription } from './_utils';
import styles from './index.module.css';

interface Props {
  permission: MotionPermissionStatus;
}

const Chip: FC<Props> = (props) => {
  const { permission } = props;

  const chipRef = useRef<HTMLDivElement>(null);
  const hologramRef = useRef<HTMLSpanElement>(null);

  const { environment, motionEnabled } = useMotionEnvironment(chipRef);
  const { input, status: sensorStatus } = useAccelerometer(permission, motionEnabled);
  const scrollInput = useScrollMotion(motionEnabled);
  const { mode } = useHologramMotion(hologramRef, input, scrollInput, environment);
  const description = getHologramStatusDescription(mode ?? sensorStatus);

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
