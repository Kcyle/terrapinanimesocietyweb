// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://terrapinanimesociety.org',
  base: '/',
  vite: {
    build: {
      cssMinify: true,
    },
    optimizeDeps: {
      include: ['gsap'],
    },
  },
});
