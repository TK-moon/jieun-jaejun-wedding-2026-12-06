import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import './index.css';
import { App } from './App.tsx';
import { ROUTES } from './constants/routes';
import { GalleryMain } from './domains/gallery';
import { HomeMain } from './domains/home';

const router = createBrowserRouter(
  [
    {
      Component: App,
      children: [
        { index: true, Component: HomeMain },
        { path: ROUTES.gallery, Component: GalleryMain },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
