import type { FC } from 'react';
import { SITE_INFO } from './_constants';
import styles from './index.module.css';

interface Props {}

const FooterSection: FC<Props> = () => {
  const { creator, copyright } = SITE_INFO;

  return (
    <footer className={styles.footer}>
      <div className={styles.frame}>
        <a className={styles.email} href={`mailto:${creator.email}`}>
          {creator.email}
        </a>
        <p className={styles.notice}>{copyright.notice}</p>
        <p className={styles.copyright}>{copyright.text}</p>
      </div>
    </footer>
  );
};

export { FooterSection };
