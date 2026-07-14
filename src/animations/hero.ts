import { gsap } from 'gsap';

let heroTimeline: gsap.core.Timeline | null = null;

function createHeroTimeline(): gsap.core.Timeline {
  const tl = gsap.timeline({
    defaults: {
      ease: 'power2.out',
    },
  });

  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('.menu-button');
  const discordLink = document.querySelector('.discord-link');

  const footerLeft = document.querySelector('.footer__left');
  const footerRight = document.querySelector('.footer__right');

  const heroTitleLines = document.querySelectorAll('.hero-content__title-line');
  const heroDescription = document.querySelector('.hero-content__description');
  const heroButtons = document.querySelector('.hero-content__buttons');
  const heroCarousel = document.querySelector('.hero-carousel-wrapper');
  const heroMascot = document.querySelector('.hero__mascot');
  const backgroundText = document.querySelector('.hero-content__background-text');

  if (heroCarousel) gsap.set(heroCarousel, { x: '-100vw' });

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


  return tl;
}

export function initHeroAnimations(): void {
  const hero = document.querySelector('[data-hero]');

  if (!hero) {
    return;
  }

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      heroTimeline = createHeroTimeline();
    });
  } else {
    heroTimeline = createHeroTimeline();
  }
}

