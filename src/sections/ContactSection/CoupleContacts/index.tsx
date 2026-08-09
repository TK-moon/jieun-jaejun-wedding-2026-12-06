import { useId, type FC } from 'react';
import { WEDDING_INFO } from '../../../constants';
import { ContactActions } from '../ContactActions';
import styles from './index.module.css';

interface Props {}

const CoupleContacts: FC<Props> = () => {
  const titleId = useId();
  const { groom, bride } = WEDDING_INFO;

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <h3 className={styles.title} id={titleId}>
        신랑, 신부에게 연락하기
      </h3>
      <dl className={styles.grid}>
        <div className={styles.person}>
          <dt className={styles.role}>신랑</dt>
          <dd className={styles.actions}>
            <ContactActions name={groom.name.ko} phone={groom.phone} />
          </dd>
        </div>
        <div className={styles.person}>
          <dt className={styles.role}>신부</dt>
          <dd className={styles.actions}>
            <ContactActions name={bride.name.ko} phone={bride.phone} />
          </dd>
        </div>
      </dl>
    </section>
  );
};

export { CoupleContacts };
