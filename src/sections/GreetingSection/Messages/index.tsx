import type { FC } from 'react';
import styles from './index.module.css';

interface Props {}

const Messages: FC<Props> = () => {
  return (
    <div className={styles.messages}>
      <p>함께라서 더 즐거웠던 시간들이 모여</p>
      <p>이제 부부가 되려 합니다.</p>
      <p>서로를 아끼며 씩씩하게 살아갈게요.</p>
      <p>바쁘시더라도 오셔서</p>
      <p>저희의 새로운 시작을 지켜봐 주세요.</p>
    </div>
  );
};

export { Messages };
