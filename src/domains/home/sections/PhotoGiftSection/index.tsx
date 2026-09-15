import { useId, type FC } from 'react';
import { SectionTitle } from '@/components/SectionTitle';
import { PHOTO_GIFT } from './_constants';
import { Passport } from './Passport';
import styles from './index.module.css';

interface Props {}

const PhotoGiftSection: FC<Props> = () => {
  const titleId = useId();

  return (
    <section className={styles.container} aria-labelledby={titleId}>
      <SectionTitle label={PHOTO_GIFT.label} title={PHOTO_GIFT.title} titleId={titleId} />
      <Passport />
    </section>
  );
};

export { PhotoGiftSection };
