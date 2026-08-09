import type { ComponentProps, FC } from 'react';
import styles from './ChevronIcon.module.css';

interface Props extends ComponentProps<'svg'> {}

const ChevronIcon: FC<Props> = (props) => {
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
        d="M6.5 9.5 12 15l5.5-5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export { ChevronIcon };
