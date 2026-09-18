import type { FC } from 'react';
import type { MotionPermissionStatus } from '../_hooks/useMotionPermission/_utils';
import { Pattern } from '../Pattern';
import { Portrait } from '../Portrait';
import { Chip } from './Chip';
import { Header } from './Header';
import { Mrz } from './Mrz';
import { Visa } from './Visa';
import styles from './index.module.css';

interface Props {
  permission: MotionPermissionStatus;
}

const PageTwo: FC<Props> = (props) => {
  const { permission } = props;

  return (
    <div className={styles.leaf}>
      <Pattern variant="identity" />
      <div className={styles.page}>
        <div className={styles.mast}>
          <Header />
          <Chip permission={permission} />
        </div>
        <div className={styles.body}>
          <Portrait variant="mono" />
          <Visa />
        </div>
        <Mrz />
      </div>
    </div>
  );
};

export { PageTwo };
