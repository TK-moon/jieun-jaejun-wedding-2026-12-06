import { useId, type FC } from 'react';
import { SectionTitle } from '../../components/SectionTitle/SectionTitle';
import { CoupleContacts } from './CoupleContacts';
import { HostContacts } from './HostContacts';
import styles from './index.module.css';

interface Props {}

const ContactSection: FC<Props> = () => {
  const titleId = useId();

  return (
    <section className={styles.container} aria-labelledby={titleId}>
      <SectionTitle label="연락처" title="연락하기" titleId={titleId} />
      <div className={styles.frame}>
        <CoupleContacts />
        <HostContacts />
      </div>
    </section>
  );
};

export { ContactSection };
