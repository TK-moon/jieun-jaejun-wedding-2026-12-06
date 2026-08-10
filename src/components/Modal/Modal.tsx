import { useId, useRef, type FC, type PropsWithChildren, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Portal } from '../Portal/Portal';
import { getModalMotionVariants } from './_constants';
import { useModalFocusTrap } from './_hooks/useModalFocusTrap';
import { useModalHistory } from './_hooks/useModalHistory';
import { useModalScrollLock } from './_hooks/useModalScrollLock';
import styles from './Modal.module.css';

interface Props extends PropsWithChildren {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
}

const Modal: FC<Props> = (props) => {
  const { open, onClose, title, children } = props;
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  const shouldReduceMotion = useReducedMotion();

  const { rootVariants, backdropVariants, dialogVariants } =
    getModalMotionVariants(shouldReduceMotion);

  useModalScrollLock(open);
  useModalHistory({ open, onClose });
  useModalFocusTrap({ open, onClose, dialogRef });

  return (
    <Portal>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="modal"
            className={styles.root}
            variants={rootVariants}
            initial={shouldReduceMotion ? false : 'initial'}
            animate="animate"
            exit="exit"
          >
            <motion.button
              type="button"
              className={styles.backdrop}
              aria-label="닫기"
              onClick={onClose}
              variants={backdropVariants}
            />
            <motion.div
              ref={dialogRef}
              className={styles.dialog}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
              variants={dialogVariants}
            >
              <header className={styles.header}>
                <h2 className={styles.title} id={titleId}>
                  {title}
                </h2>
                <button type="button" className={styles.close} onClick={onClose}>
                  닫기
                </button>
              </header>
              <div className={styles.body}>{children}</div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Portal>
  );
};

export { Modal };
