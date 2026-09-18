import type { FC } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { getOverlayMotionVariants } from './_constants';
import styles from './index.module.css';

interface Props {
  requesting: boolean;
  disabled: boolean;
  onRequest: () => void;
  contentId: string;
}

const SensorPermissionOverlay: FC<Props> = (props) => {
  const { requesting, disabled, onRequest, contentId } = props;
  const shouldReduceMotion = useReducedMotion();
  const { overlayVariants, promptVariants } = getOverlayMotionVariants(shouldReduceMotion);

  return (
    <motion.div
      className={styles.overlay}
      variants={overlayVariants}
      initial={shouldReduceMotion ? false : 'hidden'}
      animate="visible"
      exit="exit"
    >
      <motion.div className={styles.prompt} variants={promptVariants}>
        <button
          type="button"
          className={styles.button}
          onClick={onRequest}
          disabled={disabled}
          aria-busy={requesting}
          aria-controls={contentId}
        >
          이벤트 확인하기
        </button>
      </motion.div>
    </motion.div>
  );
};

export { SensorPermissionOverlay };
