import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';
import checker from "vite-plugin-checker";
import svgr from 'vite-plugin-svgr';

/**
 * Возвращает максимальное время хранения кэша (в секундах).
 */
const CACHE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
      svgr({
        include: "**/*.svg?react",
      }),
      VitePWA({
      registerType: 'prompt',
      injectRegister: 'inline',
      workbox: {
        navigateFallback: '/',
        globPatterns: ['**/*.{woff,woff2}', '/', '/index.html'],
        additionalManifestEntries: [
          // Добавлено для предотвращения кэширования sw.js
          { url: '/sw.js', revision: `${Date.now()}` },
        ],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'CacheFirst',
            options: {
              cacheName: 'html-cache',
              cacheableResponse: {
                statuses: [0, 200],
              },
              expiration: {
                maxAgeSeconds: CACHE_MAX_AGE_SECONDS,
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'script' || request.destination === 'style',
            handler: 'CacheFirst',
            options: {
              cacheName: 'js-css-cache',
              cacheableResponse: {
                statuses: [0, 200],
              },
              expiration: {
                maxAgeSeconds: CACHE_MAX_AGE_SECONDS,
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              cacheableResponse: {
                statuses: [0, 200],
              },
              expiration: {
                maxAgeSeconds: CACHE_MAX_AGE_SECONDS,
              },
            },
          },
        ],
        // skipWaiting: true,
        clientsClaim: true
      },

      manifest: {
        name: 'ЛПЦ3',
        short_name: 'ЛПЦ3',
        description: 'Приложение ЛПЦ3',
        display: 'fullscreen',
        orientation: 'portrait-primary',
        scope: './',
        start_url: './',
      },
    }),
      checker({
      typescript: true,
    }),],
})
