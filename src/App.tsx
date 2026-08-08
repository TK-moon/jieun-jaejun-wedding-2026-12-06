import type { FC } from 'react';
import { CountdownTimer } from './components/CountdownTimer/CountdownTimer';
import { Hero } from './components/Hero/Hero';
import { LineMotif } from './components/LineMotif/LineMotif';
import { Venue } from './components/Venue/Venue';
import styles from './App.module.css';
import { BannerSection } from './sections/BannerSection';
import { TicketSection } from './sections/TicketSection';

interface Props {}

const App: FC<Props> = () => {
  return (
    <>
      {/* Primary design — new UI lives in src/sections */}
      <main>
        <BannerSection />
        <TicketSection />
      </main>

      {/*
        Reference archive — keep for wedding info, assets, and logic only.
        Do not evolve this visual design; restyle features inside primary sections.
      */}
      <div className={styles.weddingPage}>
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
      </div>
    </>
  );
};

export { App };
