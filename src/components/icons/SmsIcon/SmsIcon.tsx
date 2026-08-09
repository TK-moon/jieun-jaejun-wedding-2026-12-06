import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';
import styles from './SmsIcon.module.css';

interface Props {
  className?: string;
}

const SmsIcon: FC<Props> = (props) => {
  const { className } = props;

  return (
    <FontAwesomeIcon
      icon={faComment}
      className={[styles.icon, className].filter(Boolean).join(' ')}
      aria-hidden
      focusable="false"
    />
  );
};

export { SmsIcon };
