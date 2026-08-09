import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';
import styles from './PhoneIcon.module.css';

interface Props {
  className?: string;
}

const PhoneIcon: FC<Props> = (props) => {
  const { className } = props;

  return (
    <FontAwesomeIcon
      icon={faPhone}
      className={[styles.icon, className].filter(Boolean).join(' ')}
      aria-hidden
      focusable="false"
    />
  );
};

export { PhoneIcon };
