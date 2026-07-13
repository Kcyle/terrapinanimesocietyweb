
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://tas.umd.edu',
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
