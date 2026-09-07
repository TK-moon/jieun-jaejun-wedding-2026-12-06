import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';
import styles from './index.module.css';

interface Props {
  className?: string;
  color?: string;
}

const SuccessIcon: FC<Props> = (props) => {
  const { className, color } = props;

  return (
    <FontAwesomeIcon
      icon={faCheck}
      className={[styles.icon, className].filter(Boolean).join(' ')}
      style={color ? { color } : undefined}
      aria-hidden
      focusable="false"
    />
  );
};

export { SuccessIcon };
