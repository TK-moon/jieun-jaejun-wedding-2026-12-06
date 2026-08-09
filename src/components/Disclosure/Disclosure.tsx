import type { FC, ReactNode } from 'react';
import { ChevronIcon } from '../ChevronIcon/ChevronIcon';
import styles from './Disclosure.module.css';

interface Props {
  summary: ReactNode;
  children: ReactNode;
}

const Disclosure: FC<Props> = (props) => {
  const { summary, children } = props;

  return (
    <details className={styles.root}>
      <summary className={styles.summary}>
        <span className={styles.summaryLabel}>{summary}</span>
        <ChevronIcon />
      </summary>
      {children}
    </details>
  );
};

export { Disclosure };
