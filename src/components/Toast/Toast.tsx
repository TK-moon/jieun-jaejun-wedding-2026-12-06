import { useContext, type FC } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
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
            transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: 'easeOut' }}
          >
            {toast.content}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export { Toast };
