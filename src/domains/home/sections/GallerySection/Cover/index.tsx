import type { FC } from 'react';
import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon/ArrowRightIcon';
import { ROUTES } from '@/constants/routes';
import styles from './index.module.css';

interface Props {}

const Cover: FC<Props> = () => {
  return (
    <Link className={styles.cover} to={ROUTES.gallery} aria-label="전체 사진 보기">
      <span className={styles.spine} aria-hidden="true" />
      <span className={styles.pages} aria-hidden="true" />
      <span className={styles.kicker}>더 많은 순간</span>
      <span className={styles.body}>
        <span className={styles.copy}>전체 보기</span>
        <span className={styles.rule} aria-hidden="true" />
      </span>
      <span className={styles.arrow} aria-hidden="true">
        <ArrowRightIcon />
      </span>
    </Link>
  );
};

export { Cover };
