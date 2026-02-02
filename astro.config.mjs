// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://terrapinanimesociety.org',
  base: '/',
  output: 'server',
  adapter: vercel(),
  vite: {
    build: {
      cssMinify: true,
    },
    optimizeDeps: {
      include: ['gsap'],
    },
  },
});
