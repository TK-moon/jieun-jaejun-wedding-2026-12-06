import type { FC } from 'react';
import { Toast } from './components/Toast/Toast';
import { ToastProvider } from './components/Toast/ToastProvider';
import { BannerSection } from './sections/BannerSection';
import { GreetingSection } from './sections/GreetingSection';
import { TicketSection } from './sections/TicketSection';
import { ContactSection } from './sections/ContactSection';

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
      <Toast />
    </ToastProvider>
  );
};

export { App };
