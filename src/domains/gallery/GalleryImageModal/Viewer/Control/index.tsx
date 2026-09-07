import type { FC, PropsWithChildren } from 'react';
import styles from './index.module.css';

interface Props extends PropsWithChildren {
  className: string;
  'aria-label': string;
  disabled?: boolean;
  onClick: () => void;
}

const Control: FC<Props> = (props) => {
  const { className, disabled, onClick, children, 'aria-label': ariaLabel } = props;

  return (
    <button
      type="button"
      className={styles.control + ' ' + className}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export { Control };
