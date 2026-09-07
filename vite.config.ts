import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ROUTES } from './src/constants/routes.ts';

// GitHub Pages에서는 응답 헤더를 직접 설정할 수 없어 지원되는 CSP 지시문을
// 빌드 HTML에 넣습니다. frame-ancestors는 meta에서 지원되지 않습니다.
const contentSecurityPolicy = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "base-uri 'none'",
  "object-src 'none'",
  "form-action 'none'",
].join('; ');

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/jieun-jaejun-wedding-2026-12-06/' : '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),
    {
      name: 'invitation-static-gallery',
      apply: 'build',
      enforce: 'post',
      generateBundle(_options, bundle) {
        const indexHtml = bundle['index.html'];

        if (!indexHtml || indexHtml.type !== 'asset') {
          this.error('The invitation HTML is required to build the gallery entry.');
        }

        // GitHub Pages에서 갤러리 직접 접속과 새로고침에도 앱을 제공합니다.
        this.emitFile({
          type: 'asset',
          fileName: `${ROUTES.gallery.slice(1)}/index.html`,
          source: indexHtml.source,
        });
      },
    },
    {
      name: 'invitation-content-security-policy',
      apply: 'build',
      transformIndexHtml: () => [
        {
          tag: 'meta',
          attrs: {
            'http-equiv': 'Content-Security-Policy',
            content: contentSecurityPolicy,
          },
          injectTo: 'head-prepend',
        },
      ],
    },
  ],
  build: {
    sourcemap: false,
  },
}));
