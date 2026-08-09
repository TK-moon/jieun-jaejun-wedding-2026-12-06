import type { ComponentProps, FC } from 'react';
import styles from './PhoneIcon.module.css';

interface Props extends ComponentProps<'svg'> {}

const PhoneIcon: FC<Props> = (props) => {
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
        d="M6.5 4.5h3.2l1.3 3.2-1.7 1.7a11.5 11.5 0 0 0 5.3 5.3l1.7-1.7 3.2 1.3v3.2a1.5 1.5 0 0 1-1.5 1.5A14.5 14.5 0 0 1 5 6a1.5 1.5 0 0 1 1.5-1.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export { PhoneIcon };
