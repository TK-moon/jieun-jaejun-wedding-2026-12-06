import type { FC } from 'react';
import { PhoneIcon } from '../../../components/icons/PhoneIcon/PhoneIcon';
import { SmsIcon } from '../../../components/icons/SmsIcon/SmsIcon';
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
        <PhoneIcon />
      </a>
      <a className={styles.link} href={getSmsHref(phone)} aria-label={`${name}에게 문자`}>
        <SmsIcon />
      </a>
    </div>
  );
};

export { ContactActions };
