import type { FC } from 'react';
import { BannerSection } from './sections/BannerSection';
import { ContactSection } from './sections/ContactSection';
import { GallerySection } from './sections/GallerySection';
import { GreetingSection } from './sections/GreetingSection';
import { TicketSection } from './sections/TicketSection';

interface Props {}

const HomeMain: FC<Props> = () => {
  return (
    <>
      <BannerSection />
      <GreetingSection />
      <TicketSection />
      <GallerySection />
      <ContactSection />
    </>
  );
};

export { HomeMain };
