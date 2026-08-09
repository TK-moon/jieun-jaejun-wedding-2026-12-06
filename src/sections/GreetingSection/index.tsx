import { useId, type FC } from 'react';
import { SectionTitle } from '../../components/SectionTitle/SectionTitle';
import { Family } from './Family';
import { Messages } from './Messages';
import styles from './index.module.css';

interface Props {}

const GreetingSection: FC<Props> = () => {
  const titleId = useId();

  return (
    <section className={styles.container} aria-labelledby={titleId}>
      <SectionTitle label="인사말" title="초대합니다" titleId={titleId} />
      <div className={styles.frame}>
        <Family />
        <Messages />
      </div>
    </section>
  );
};

export { GreetingSection };
