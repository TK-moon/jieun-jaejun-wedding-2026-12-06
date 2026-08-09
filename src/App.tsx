import type { FC } from 'react';
import { BannerSection } from './sections/BannerSection';
import { TicketSection } from './sections/TicketSection';
import { VenueSection } from './sections/VenueSection';

interface Props {}

const App: FC<Props> = () => {
  return (
    <main>
      <BannerSection />
      <TicketSection />
      <VenueSection />
    </main>
  );
};

export { App };
