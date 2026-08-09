import type { FC } from 'react';
import { BannerSection } from './sections/BannerSection';
import { TicketSection } from './sections/TicketSection';

interface Props {}

const App: FC<Props> = () => {
  return (
    <main>
      <BannerSection />
      <TicketSection />
    </main>
  );
};

export { App };
