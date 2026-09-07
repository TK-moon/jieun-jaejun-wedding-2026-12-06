import { useLayoutEffect, type FC } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { Toast } from './components/Toast';
import { ToastProvider } from './components/Toast/ToastProvider';
import { ROUTES } from './constants/routes';
import { GalleryMain } from './domains/gallery';
import { HomeMain } from './domains/home';
import { useOpenKakaoExternalBrowser } from './hooks/useOpenKakaoExternalBrowser';
import { FooterSection } from './domains/home/sections/FooterSection';

interface Props {}

const App: FC<Props> = () => {
  const { pathname } = useLocation();
  useOpenKakaoExternalBrowser();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <ToastProvider>
      <main>
        <Routes>
          <Route path={ROUTES.invitation} element={<HomeMain />} />
          <Route path={ROUTES.gallery} element={<GalleryMain />} />
        </Routes>
      </main>
      <FooterSection />
      <Toast />
    </ToastProvider>
  );
};

export { App };
