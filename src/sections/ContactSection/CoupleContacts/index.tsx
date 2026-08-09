import { useId, type FC } from 'react';
import { WEDDING_INFO } from '../../../constants';
import { ContactPerson } from '../ContactPerson';
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
        <ContactPerson role="신랑" name={groom.name.ko} phone={groom.phone} />
        <ContactPerson role="신부" name={bride.name.ko} phone={bride.phone} />
      </dl>
    </section>
  );
};

export { CoupleContacts };
