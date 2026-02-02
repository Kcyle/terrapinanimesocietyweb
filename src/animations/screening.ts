import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let meetingsScrollTrigger: ScrollTrigger | null = null;

export function initScreeningAnimations(): void {
  checkAdminMode();
  initMeetingsScrollTransition();
  initCardSelection();
}

function checkAdminMode(): void {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('admin') === 'true') {
    document.body.classList.add('admin-mode');
  }
}

function initMeetingsScrollTransition(): void {
  const heroSection = document.querySelector('[data-hero]');

  if (!heroSection) {
    const meetingsBg = document.querySelector('[data-meetings-bg]') as HTMLElement;
    const meetingsContent = document.querySelector('[data-meetings-content]') as HTMLElement;
    if (meetingsBg) meetingsBg.style.visibility = 'visible';
    if (meetingsContent) {
      meetingsContent.style.visibility = 'visible';
      meetingsContent.style.opacity = '1';
    }
  }

  if (heroSection) return;

  const meetingsSection = document.querySelector('[data-meetings]');
  const scrollContainer = document.querySelector('[data-meetings-scroll]');
  if (!meetingsSection || !scrollContainer) return;

  const hero = document.querySelector('[data-meetings-hero]') as HTMLElement;
  const title = document.querySelector('[data-meetings-title]') as HTMLElement;
  const description = document.querySelector('[data-meetings-description]') as HTMLElement;
  const grid = document.querySelector('[data-meetings-grid]') as HTMLElement;
  const gridCards = document.querySelectorAll('.meetings__card');
  const screenings = document.querySelector('[data-meetings-screenings]') as HTMLElement;
  const animeCards = document.querySelectorAll('.meetings__anime-card');
  const location = document.querySelector('[data-meetings-location]') as HTMLElement;

  if (!hero || !grid || !screenings || !location) return;

  if (title) gsap.set(title, { x: -100, opacity: 0 });
  if (description) gsap.set(description, { x: -100, opacity: 0 });

  if (gridCards.length) gsap.set(gridCards, { x: 100, opacity: 0 });

  if (screenings) gsap.set(screenings, { y: 50, opacity: 0 });
  if (animeCards.length) gsap.set(animeCards, { y: 30, opacity: 0 });

  if (location) gsap.set(location, { y: 50, opacity: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: meetingsSection,
      start: 'top top',
      end: '+=300%',
      scrub: 0.5,
      pin: true,
      anticipatePin: 1,
    },
  });

  meetingsScrollTrigger = tl.scrollTrigger as ScrollTrigger;

  if (title) {
    tl.fromTo(
      title,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.15, ease: 'power2.out' },
      0
    );
  }

  if (description) {
    tl.fromTo(
      description,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.15, ease: 'power2.out' },
      0.05
    );
  }

  if (gridCards.length) {
    tl.fromTo(
      gridCards,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.15, ease: 'power2.out', stagger: 0.03 },
      0.15
    );
  }

  if (screenings) {
    tl.fromTo(
      screenings,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.15, ease: 'power2.out' },
      0.35
    );
  }

  if (animeCards.length) {
    tl.fromTo(
      animeCards,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.12, ease: 'power2.out', stagger: 0.02 },
      0.4
    );
  }

  if (location) {
    tl.fromTo(
      location,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.15, ease: 'power2.out' },
      0.6
    );
  }
}

function initCardSelection(): void {
}

export function destroyScreeningAnimations(): void {
  if (meetingsScrollTrigger) {
    meetingsScrollTrigger.kill();
    meetingsScrollTrigger = null;
  }

  document.body.classList.remove('admin-mode');
}
