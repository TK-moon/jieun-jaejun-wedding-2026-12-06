import type { ComponentProps, FC } from 'react';
import styles from './CalendarIcon.module.css';

interface Props extends ComponentProps<'svg'> {}

const CalendarIcon: FC<Props> = (props) => {
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
        x="3.5"
        y="5.5"
        width="17"
        height="15"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 3.5v4M16 3.5v4M3.5 10.5h17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export { CalendarIcon };
