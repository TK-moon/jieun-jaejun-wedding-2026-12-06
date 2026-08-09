import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';
import styles from './CopyIcon.module.css';

interface Props {
  className?: string;
}

const CopyIcon: FC<Props> = (props) => {
  const { className } = props;

  return (
    <FontAwesomeIcon
      icon={faCopy}
      className={[styles.icon, className].filter(Boolean).join(' ')}
      aria-hidden
      focusable="false"
    />
  );
};

export { CopyIcon };
