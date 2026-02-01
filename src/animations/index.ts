/**
 * Animation System Entry Point
 * Orchestrates all GSAP animations across the site
 */

import { initMenuAnimations, destroyMenuAnimations } from './menu';
import { initHeroAnimations, destroyHeroAnimations } from './hero';
import { initScrollTransition, initAboutToMeetingsTransition, destroyScrollTransition, handleHashNavigation } from './scroll';
import './preload'; // Preload images in background

/**
 * Initializes all page animations
 * Should be called once DOM is ready
 */
export function initAnimations(): void {
  // Initialize individual animation modules
  initMenuAnimations();
  initHeroAnimations();
  initScrollTransition();
  initAboutToMeetingsTransition();
  handleHashNavigation();
}

/**
 * Destroys all animations and cleans up
 * Useful for page transitions or component unmounting
 */
export function destroyAnimations(): void {
  destroyMenuAnimations();
  destroyHeroAnimations();
  destroyScrollTransition();
}

/**
 * Auto-initialize when DOM is ready
 */
if (typeof window !== 'undefined') {
  // Disable browser scroll restoration to prevent auto-scrolling to meetings
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Only scroll to top on fresh page load (not hot reload)
      if (performance.navigation?.type === 0 || performance.getEntriesByType('navigation')[0]?.type === 'navigate') {
        window.scrollTo(0, 0);
      }
      initAnimations();
    });
  } else {
    initAnimations();
  }
}
