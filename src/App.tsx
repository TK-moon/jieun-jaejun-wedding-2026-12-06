import type { FC } from 'react';
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
        <Venue />
      </div>
    </>
  );
};

export { App };
