import type { FC } from 'react';
import { Toast } from './components/Toast/Toast';
import { ToastProvider } from './components/Toast/ToastProvider';
import { BannerSection } from './sections/BannerSection';
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
      </main>
      <Toast />
    </ToastProvider>
  );
};

export { App };
