import { useId, type FC } from 'react';
import { SectionTitle } from '@/components/SectionTitle';
import styles from './index.module.css';

interface Props {}

const ClosingSection: FC<Props> = () => {
  const titleId = useId();

  return (
    <section className={styles.container} aria-labelledby={titleId}>
      <SectionTitle title="고맙습니다" titleId={titleId} />
      <div className={styles.frame}>
        <p>
          저희를 위해 내어주시는 귀한 시간과
          <br />
          축하의 마음에 깊이 감사드립니다.
        </p>
        <p>
          함께해 주신 따뜻한 마음,
          <br />
          오래도록 소중히 간직하겠습니다.
        </p>
      </div>
    </section>
  );
};

export { ClosingSection };
