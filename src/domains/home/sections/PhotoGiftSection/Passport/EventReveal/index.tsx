import type { FC, RefObject } from 'react';
import styles from './index.module.css';

interface Props {
  revealed: boolean;
  onReveal: () => void;
  contentId: string;
  buttonRef: RefObject<HTMLButtonElement | null>;
}

const EventReveal: FC<Props> = ({ revealed, onReveal, contentId, buttonRef }) => (
  <div
    className={`${styles.overlay} ${revealed ? styles.revealed : ''}`}
    inert={revealed}
    aria-hidden={revealed}
  >
    <button
      ref={buttonRef}
      type="button"
      className={styles.button}
      onClick={onReveal}
      aria-controls={contentId}
      aria-expanded={revealed}
    >
      예식장 이벤트 확인하기
    </button>
  </div>
);

export { EventReveal };
