import type { FC } from 'react';
import { CountdownTimer } from './components/CountdownTimer/CountdownTimer';
import { Hero } from './components/Hero/Hero';
import { LineMotif } from './components/LineMotif/LineMotif';
import { Venue } from './components/Venue/Venue';
import styles from './App.module.css';
import { BannerSection } from './sections/BannerSection';

interface Props {}

const App: FC<Props> = () => {
  return (
    <>
      <BannerSection />
      <main className={styles.weddingPage}>
        <LineMotif />
        <Hero>
          <section className={styles.countdownSection} aria-labelledby="countdown-intro">
            <p className={styles.countdownIntro} id="countdown-intro">
              우리의 결혼식까지
            </p>
            <CountdownTimer />
          </section>
          <Venue />
        </Hero>
      </main>
    </>
  );
};

export { App };
