import type { FC } from 'react';
import { CountdownTimer } from './components/CountdownTimer/CountdownTimer';
import { Hero } from './components/Hero/Hero';
import { LineMotif } from './components/LineMotif/LineMotif';
import { Venue } from './components/Venue/Venue';
import styles from './App.module.css';

interface Props {}

const App: FC<Props> = () => {
  return (
    <main className={styles.weddingPage}>
      <LineMotif />
      <Hero>
        <div className={styles.countdownSection}>
          <p className={styles.countdownIntro}>우리의 결혼식까지</p>
          <CountdownTimer />
        </div>
        <Venue />
      </Hero>
    </main>
  );
};

export { App };
