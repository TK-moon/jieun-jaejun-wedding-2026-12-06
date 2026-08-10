import type { FC } from 'react';
import type { Account } from '../_types';
import { ContactActions } from '../ContactActions';
import styles from './index.module.css';

interface Props {
  role: string;
  name: string;
  phone: string;
  account: Account;
  contactLabel?: string;
}

const ContactPerson: FC<Props> = (props) => {
  const { role, name, phone, account, contactLabel = name } = props;

  return (
    <div className={styles.person}>
      <dt className={styles.name}>
        <span className={styles.role}>{role}</span>
        <span className={styles.personName}>{name}</span>
      </dt>
      <dd className={styles.actions}>
        <ContactActions name={contactLabel} phone={phone} account={account} />
      </dd>
    </div>
  );
};

export { ContactPerson };
