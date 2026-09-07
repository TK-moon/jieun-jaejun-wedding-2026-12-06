import type { FC } from 'react';
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon';
import { Control } from '../Control';
import styles from './index.module.css';

interface Props {
  disabled: boolean;
  onClick: () => void;
}

const PreviousButton: FC<Props> = (props) => {
  const { disabled, onClick } = props;

  return (
    <Control
      className={styles.previous}
      aria-label="이전 사진"
      disabled={disabled}
      onClick={onClick}
    >
      <ArrowRightIcon className={styles.icon} />
    </Control>
  );
};

export { PreviousButton };
