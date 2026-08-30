import { initMenuAnimations } from './menu';
import { initHeroAnimations } from './hero';
import './preload';

export function initAnimations(): void {
  initMenuAnimations();
  initHeroAnimations();
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initAnimations();
    });
  } else {
    initAnimations();
  }
}
