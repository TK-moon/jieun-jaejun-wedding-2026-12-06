import type { ComponentProps, FC } from 'react';
import styles from './SmsIcon.module.css';

interface Props extends ComponentProps<'svg'> {}

const SmsIcon: FC<Props> = (props) => {
  const { className, ...rest } = props;

  return (
    <svg
      className={[styles.icon, className].filter(Boolean).join(' ')}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path
        d="M5.5 5.5h13A1.5 1.5 0 0 1 20 7v8a1.5 1.5 0 0 1-1.5 1.5H10l-3.8 3.2c-.5.4-1.2 0-1.2-.6V16.5H5.5A1.5 1.5 0 0 1 4 15V7a1.5 1.5 0 0 1 1.5-1.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 10h8M8 13h5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export { SmsIcon };
