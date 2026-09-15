import { faGift } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';
import styles from './index.module.css';

interface Props {
  className?: string;
}

const GiftIcon: FC<Props> = (props) => {
  const { className } = props;

  return (
    <FontAwesomeIcon
      icon={faGift}
      className={[styles.icon, className].filter(Boolean).join(' ')}
      aria-hidden
      focusable="false"
    />
  );
};

export { GiftIcon };
