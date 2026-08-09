import type { ComponentProps, FC } from 'react';
import styles from './CopyIcon.module.css';

interface Props extends ComponentProps<'svg'> {}

const CopyIcon: FC<Props> = (props) => {
  const { className, ...rest } = props;

  return (
    <svg
      className={[styles.icon, className].filter(Boolean).join(' ')}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <rect
        x="8.5"
        y="8.5"
        width="11"
        height="11"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M15.5 8.5V6.5A1.5 1.5 0 0 0 14 5H6.5A1.5 1.5 0 0 0 5 6.5V14a1.5 1.5 0 0 0 1.5 1.5h2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export { CopyIcon };
