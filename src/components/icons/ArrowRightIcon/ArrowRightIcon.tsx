import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';
import styles from './ArrowRightIcon.module.css';

interface Props {
  className?: string;
}

const ArrowRightIcon: FC<Props> = (props) => {
  const { className } = props;

  return (
    <FontAwesomeIcon
      icon={faArrowRight}
      className={[styles.icon, className].filter(Boolean).join(' ')}
      aria-hidden
      focusable="false"
    />
  );
};

export { ArrowRightIcon };
