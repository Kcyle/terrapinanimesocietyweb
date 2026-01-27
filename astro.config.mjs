// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://kcyle.github.io',
  base: '/terrapinanimesocietyweb',
  vite: {
    build: {
      cssMinify: true,
    },
    optimizeDeps: {
      include: ['gsap'],
    },
  },
});
