import type { FC } from 'react';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { Control } from '../Control';
import styles from './index.module.css';

interface Props {
  onClose: () => void;
}

const CloseButton: FC<Props> = (props) => {
  const { onClose } = props;

  return (
    <Control className={styles.close} aria-label="사진 닫기" onClick={onClose}>
      <CloseIcon />
    </Control>
  );
};

export { CloseButton };
