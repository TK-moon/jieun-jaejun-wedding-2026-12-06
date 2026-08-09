import { StrictMode } from 'react';
import { preload } from 'react-dom';
import { createRoot } from 'react-dom/client';
import cormorant400 from '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2?url';
import cormorant500 from '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2?url';
import cormorant600 from '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2?url';
import { App } from './App.tsx';
import './styles/fonts.css';
import './index.css';

const fontPreloadOptions = {
  as: 'font',
  type: 'font/woff2',
  crossOrigin: 'anonymous',
} as const;

preload(cormorant600, { ...fontPreloadOptions, fetchPriority: 'high' });
preload(cormorant500, fontPreloadOptions);
preload(cormorant400, fontPreloadOptions);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
