import { useContext, type FC } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MOTION_DURATION, MOTION_EASE } from '@/constants/motion';
import { ToastContext } from './ToastProvider';
import styles from './Toast.module.css';

interface Props {}

const Toast: FC<Props> = () => {
  const context = useContext(ToastContext);
  const shouldReduceMotion = useReducedMotion();

  if (!context) {
    throw new Error('Toast must be used within ToastProvider');
  }

  const { toasts } = context;

  return (
    <div className={styles.viewport} aria-live="polite">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            className={styles.toast}
            key={toast.id}
            role="status"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
            transition={{
              duration: shouldReduceMotion ? 0 : MOTION_DURATION,
              ease: MOTION_EASE,
            }}
          >
            {toast.content}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export { Toast };
