import type { FC } from 'react';
import { PHOTO_GIFT } from '../../_constants';
import { Pattern } from '../Pattern';
import { Portrait } from '../Portrait';
import { Bearer } from './Bearer';
import { Serial } from './Serial';
import { Signatures } from './Signatures';
import styles from './index.module.css';

interface Props {}

const PageOne: FC<Props> = () => {
  return (
    <div className={styles.leaf}>
      <Pattern variant="request" />
      <Serial />
      <div className={styles.page}>
        <div className={styles.request}>
          <div className={styles.lead}>
            <p>{PHOTO_GIFT.messages.join(' ')}</p>
          </div>
          <Signatures />
          <div className={`${styles.lead} ${styles.leadEn}`}>
            <p>{PHOTO_GIFT.messagesEn.join(' ')}</p>
          </div>
        </div>
        <div className={styles.portraitSlot}>
          <Portrait />
        </div>
        <div className={styles.signatureSlot}>
          <Bearer />
        </div>
      </div>
    </div>
  );
};

export { PageOne };
