import { useId, type FC } from 'react';
import { WEDDING_INFO } from '../../../constants';
import { ContactActions } from '../ContactActions';
import styles from './index.module.css';

interface Props {}

const HostContacts: FC<Props> = () => {
  const titleId = useId();
  const groomHostsTitleId = useId();
  const brideHostsTitleId = useId();
  const { groom, bride } = WEDDING_INFO;

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <h3 className={styles.title} id={titleId}>
        혼주에게 연락하기
      </h3>
      <div className={styles.grid}>
        <section className={styles.side} aria-labelledby={groomHostsTitleId}>
          <h4 className={styles.sideTitle} id={groomHostsTitleId}>
            신랑측 혼주
          </h4>
          <dl className={styles.list}>
            <div className={styles.person}>
              <dt className={styles.name}>
                <span className={styles.relation}>아버지</span>
                <span className={styles.personName}>{groom.parents.father.name}</span>
              </dt>
              <dd className={styles.actions}>
                <ContactActions
                  name={`아버지 ${groom.parents.father.name}`}
                  phone={groom.parents.father.phone}
                />
              </dd>
            </div>
            <div className={styles.person}>
              <dt className={styles.name}>
                <span className={styles.relation}>어머니</span>
                <span className={styles.personName}>{groom.parents.mother.name}</span>
              </dt>
              <dd className={styles.actions}>
                <ContactActions
                  name={`어머니 ${groom.parents.mother.name}`}
                  phone={groom.parents.mother.phone}
                />
              </dd>
            </div>
          </dl>
        </section>
        <section className={styles.side} aria-labelledby={brideHostsTitleId}>
          <h4 className={styles.sideTitle} id={brideHostsTitleId}>
            신부측 혼주
          </h4>
          <dl className={styles.list}>
            <div className={styles.person}>
              <dt className={styles.name}>
                <span className={styles.relation}>아버지</span>
                <span className={styles.personName}>{bride.parents.father.name}</span>
              </dt>
              <dd className={styles.actions}>
                <ContactActions
                  name={`아버지 ${bride.parents.father.name}`}
                  phone={bride.parents.father.phone}
                />
              </dd>
            </div>
            <div className={styles.person}>
              <dt className={styles.name}>
                <span className={styles.relation}>어머니</span>
                <span className={styles.personName}>{bride.parents.mother.name}</span>
              </dt>
              <dd className={styles.actions}>
                <ContactActions
                  name={`어머니 ${bride.parents.mother.name}`}
                  phone={bride.parents.mother.phone}
                />
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </section>
  );
};

export { HostContacts };
