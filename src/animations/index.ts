import { initMenuAnimations } from './menu';
import { initHeroAnimations } from './hero';
import { initScrollTransition, initAboutToMeetingsTransition, handleHashNavigation } from './scroll';
import './preload';

export function initAnimations(): void {
  initMenuAnimations();
  initHeroAnimations();
  initScrollTransition();
  initAboutToMeetingsTransition();
  handleHashNavigation();
}

if (typeof window !== 'undefined') {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (performance.navigation?.type === 0 || performance.getEntriesByType('navigation')[0]?.type === 'navigate') {
        window.scrollTo(0, 0);
      }
      initAnimations();
    });
  } else {
    initAnimations();
  }
}
