import type { FC } from 'react';
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon';
import { Control } from '../Control';
import styles from './index.module.css';

interface Props {
  disabled: boolean;
  onClick: () => void;
}

const NextButton: FC<Props> = (props) => {
  const { disabled, onClick } = props;

  return (
    <Control className={styles.next} aria-label="다음 사진" disabled={disabled} onClick={onClick}>
      <ArrowRightIcon />
    </Control>
  );
};

export { NextButton };
