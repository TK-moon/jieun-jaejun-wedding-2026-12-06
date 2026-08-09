import type { FC, PropsWithChildren } from 'react';
import styles from './SectionTitle.module.css';

interface Props extends PropsWithChildren {
  label?: string;
  title: string;
  titleId?: string;
}

const SectionTitle: FC<Props> = (props) => {
  const { label, title, titleId, children } = props;

  return (
    <header className={styles.header}>
      {label ? <p className={styles.label}>{label}</p> : null}
      <h2 className={styles.title} id={titleId}>
        {title}
      </h2>
      {children}
    </header>
  );
};

export { SectionTitle };
