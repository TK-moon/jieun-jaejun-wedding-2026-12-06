import { useRef, useState, type FC } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { PHOTO_GIFT } from '../_constants';
import { Bearer } from './Bearer';
import { Chip } from './Chip';
import { Header } from './Header';
import { Mrz } from './Mrz';
import { Pattern } from './Pattern';
import { Portrait } from './Portrait';
import { Serial } from './Serial';
import { Signatures } from './Signatures';
import { Visa } from './Visa';
import styles from './index.module.css';

interface Props {}

const Passport: FC<Props> = () => {
  const bookRef = useRef<HTMLElement>(null);
  const [hasIntersected, setHasIntersected] = useState(false);

  const { isSupported } = useIntersectionObserver(
    bookRef,
    (entry) => {
      if (entry.isIntersecting) {
        setHasIntersected(true);
      }
    },
    { threshold: 0.22, rootMargin: '0px 0px -12% 0px' },
  );

  const isVisible = !isSupported || hasIntersected;

  return (
    <article
      ref={bookRef}
      className={[styles.book, isVisible ? styles.is_visible : null].filter(Boolean).join(' ')}
      aria-label="사진 선물 이벤트 여권"
    >
      <div className={`${styles.leaf} ${styles.pageOne}`}>
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
      <div className={`${styles.leaf} ${styles.pageTwo}`}>
        <Pattern variant="identity" />
        <div className={styles.page}>
          <div className={styles.mast}>
            <Header />
            <Chip />
          </div>
          <div className={styles.body}>
            <Portrait variant="mono" />
            <Visa />
          </div>
          <Mrz />
        </div>
      </div>
    </article>
  );
};

export { Passport };
