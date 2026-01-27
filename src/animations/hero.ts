/**
 * Hero Section Animation Module
 * Handles entrance animations for the hero section using GSAP timelines
 */

import { gsap } from 'gsap';

let heroTimeline: gsap.core.Timeline | null = null;

/**
 * Creates the hero entrance animation timeline
 */
function createHeroTimeline(): gsap.core.Timeline {
  const tl = gsap.timeline({
    defaults: {
      ease: 'power2.out',
    },
  });

  // Header elements
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('.menu-button');
  const discordLink = document.querySelector('.discord-link');

  // Footer elements
  const footerLeft = document.querySelector('.footer__left');
  const footerRight = document.querySelector('.footer__right');

  // Hero content
  const heroTitleLines = document.querySelectorAll('.hero-content__title-line');
  const heroDescription = document.querySelector('.hero-content__description');
  const heroButtons = document.querySelector('.hero-content__buttons');
  const heroCarousel = document.querySelector('.hero-carousel-wrapper');
  const heroMascot = document.querySelector('.hero__mascot');
  const backgroundText = document.querySelector('.hero-content__background-text');
  const ticketBanner = document.querySelector('[data-ticket-banner]');

  // Set initial states - using CSS classes would be better for no-JS fallback
  // For now, skip entrance animations to ensure content is visible
  // Carousel slides in from LEFT - no fade, pure slide
  if (heroCarousel) gsap.set(heroCarousel, { x: '-100vw' });
  if (ticketBanner) gsap.set(ticketBanner, { xPercent: 120 });

  // Build timeline - only animate elements that start off-screen
  // Carousel slides in from LEFT - no fade, pure slide showing entire animation
  if (heroCarousel) {
    tl.to(
      heroCarousel,
      {
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
      },
      0.3
    );
  }

  // Ticket banner slides in from right
  if (ticketBanner) {
    tl.to(
      ticketBanner,
      {
        xPercent: 0,
        duration: 0.6,
        ease: 'power2.out',
      },
      0.5
    );
  }

  return tl;
}

/**
 * Initializes hero section animations
 */
export function initHeroAnimations(): void {
  const hero = document.querySelector('[data-hero]');

  if (!hero) {
    return;
  }

  // Wait for fonts to load before animating
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      heroTimeline = createHeroTimeline();
    });
  } else {
    heroTimeline = createHeroTimeline();
  }
}

/**
 * Cleanup function for hero animations
 */
export function destroyHeroAnimations(): void {
  heroTimeline?.kill();
  heroTimeline = null;
}
