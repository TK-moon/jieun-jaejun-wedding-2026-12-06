import type { FC } from 'react';
import { Outlet, ScrollRestoration } from 'react-router';
import { Toast } from './components/Toast';
import { ToastProvider } from './components/Toast/ToastProvider';
import { useOpenKakaoExternalBrowser } from './hooks/useOpenKakaoExternalBrowser';
import { FooterSection } from './domains/home/sections/FooterSection';

interface Props {}

const App: FC<Props> = () => {
  useOpenKakaoExternalBrowser();

  return (
    <ToastProvider>
      <main>
        <Outlet />
      </main>
      <FooterSection />
      <Toast />
      <ScrollRestoration />
    </ToastProvider>
  );
};

export { App };
