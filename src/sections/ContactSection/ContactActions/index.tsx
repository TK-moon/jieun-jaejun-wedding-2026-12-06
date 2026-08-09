import type { FC } from 'react';
import { getSmsHref, getTelHref } from '../_utils';
import styles from './index.module.css';

interface Props {
  name: string;
  phone: string;
}

const ContactActions: FC<Props> = (props) => {
  const { name, phone } = props;

  return (
    <div className={styles.actions}>
      <a className={styles.link} href={getTelHref(phone)} aria-label={`${name}에게 전화`}>
        전화
      </a>
      <span className={styles.separator} aria-hidden="true">
        ·
      </span>
      <a className={styles.link} href={getSmsHref(phone)} aria-label={`${name}에게 문자`}>
        문자
      </a>
    </div>
  );
};

export { ContactActions };
