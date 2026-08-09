import type { FC } from 'react';
import { Toast } from './components/Toast/Toast';
import { ToastProvider } from './components/Toast/ToastProvider';
import { BannerSection } from './sections/BannerSection';
import { ContactSection } from './sections/ContactSection';
import { FooterSection } from './sections/FooterSection';
import { GreetingSection } from './sections/GreetingSection';
import { TicketSection } from './sections/TicketSection';

interface Props {}

const App: FC<Props> = () => {
  return (
    <ToastProvider>
      <main>
        <BannerSection />
        <GreetingSection />
        <TicketSection />
        <ContactSection />
      </main>
      <FooterSection />
      <Toast />
    </ToastProvider>
  );
};

export { App };
