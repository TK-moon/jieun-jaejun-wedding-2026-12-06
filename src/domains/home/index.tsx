import type { FC } from 'react';
import { BannerSection } from './sections/BannerSection';
import { ClosingSection } from './sections/ClosingSection';
import { ContactSection } from './sections/ContactSection';
import { GallerySection } from './sections/GallerySection';
import { GreetingSection } from './sections/GreetingSection';
import { PhotoGiftSection } from './sections/PhotoGiftSection';
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
      <PhotoGiftSection />
      <ClosingSection />
    </>
  );
};

export { HomeMain };
