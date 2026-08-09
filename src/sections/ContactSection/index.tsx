import { useId, type FC } from 'react';
import { SectionTitle } from '../../components/SectionTitle/SectionTitle';
import styles from './index.module.css';

interface Props {}

const ContactSection: FC<Props> = () => {
  const titleId = useId();

  return (
    <section className={styles.container}>
      <SectionTitle label="연락처" title="마음 전하실 곳" titleId={titleId} />
    </section>
  );
};

export { ContactSection };
