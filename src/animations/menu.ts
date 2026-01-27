/**
 * Menu Animation Module
 * Handles navigation menu open/close animations using GSAP timelines
 */

import { gsap } from 'gsap';

interface MenuElements {
  menu: HTMLElement;
  backdrop: HTMLElement;
  panel: HTMLElement;
  items: NodeListOf<HTMLElement>;
}

let menuTimeline: gsap.core.Timeline | null = null;

/**
 * Creates the menu animation timeline
 */
function createMenuTimeline(elements: MenuElements): gsap.core.Timeline {
  const { menu, backdrop, panel, items } = elements;

  const tl = gsap.timeline({
    paused: true,
    defaults: {
      ease: 'power4.out',
    },
    onStart: () => {
      menu.setAttribute('data-open', 'true');
      menu.style.visibility = 'visible';
      menu.style.pointerEvents = 'auto';
    },
    onReverseComplete: () => {
      menu.setAttribute('data-open', 'false');
      menu.style.visibility = 'hidden';
      menu.style.pointerEvents = 'none';
    },
  });

  // Fast dramatic backdrop
  tl.to(backdrop, {
    opacity: 1,
    duration: 0.15,
  });

  // Panel pops in fast
  tl.to(
    panel,
    {
      x: 0,
      duration: 0.2,
      ease: 'power4.out',
    },
    '<'
  );

  // Items appear quickly with minimal stagger
  tl.to(
    items,
    {
      opacity: 1,
      x: 0,
      duration: 0.15,
      stagger: 0.02,
    },
    '-=0.1'
  );

  return tl;
}

/**
 * Initializes menu interactions
 */
export function initMenuAnimations(): void {
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const trigger = document.querySelector<HTMLElement>('[data-menu-trigger]');
  const backdrop = document.querySelector<HTMLElement>('[data-menu-backdrop]');
  const panel = document.querySelector<HTMLElement>('[data-menu-panel]');
  const closeBtn = document.querySelector<HTMLElement>('[data-menu-close]');
  const items = document.querySelectorAll<HTMLElement>('.navigation-menu__item');

  if (!menu || !trigger || !backdrop || !panel || !closeBtn || items.length === 0) {
    return;
  }

  // Set initial states
  gsap.set(backdrop, { opacity: 0 });
  gsap.set(panel, { x: '-100%' });
  gsap.set(items, { opacity: 0, x: -20 });

  menuTimeline = createMenuTimeline({
    menu,
    backdrop,
    panel,
    items,
  });

  const openMenu = (): void => {
    trigger.setAttribute('aria-expanded', 'true');
    menuTimeline?.play();
  };

  const closeMenu = (): void => {
    trigger.setAttribute('aria-expanded', 'false');
    menuTimeline?.reverse();
  };

  // Event listeners
  trigger.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);

  // Close on escape key
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && menu.getAttribute('data-open') === 'true') {
      closeMenu();
    }
  });

  // Close menu when clicking links
  const menuLinks = document.querySelectorAll<HTMLElement>('[data-menu-link]');
  menuLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

/**
 * Cleanup function for menu animations
 */
export function destroyMenuAnimations(): void {
  menuTimeline?.kill();
  menuTimeline = null;
}
