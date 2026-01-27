import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let meetingsScrollTrigger: ScrollTrigger | null = null;

/**
 * Initialize the screening page animations
 * - Scroll-triggered section transitions
 * - Card selection interactivity
 * - Soft fade-in animations
 */
export function initScreeningAnimations(): void {
  // Check for admin mode
  checkAdminMode();

  // Initialize scroll-based transitions
  initMeetingsScrollTransition();

  // Initialize card selection
  initCardSelection();
}

/**
 * Check URL for admin parameter and enable admin mode
 */
function checkAdminMode(): void {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('admin') === 'true') {
    document.body.classList.add('admin-mode');
  }
}

/**
 * Initialize scroll-triggered transitions for the meetings page
 * Only runs on the standalone /meetings page, not on the index page
 * (Index page handles meetings transition via scroll.ts)
 */
function initMeetingsScrollTransition(): void {
  // Skip if we're on the index page (hero section exists)
  // The index page handles meetings transition differently via scroll.ts
  const heroSection = document.querySelector('[data-hero]');

  // On standalone meetings page, make elements visible immediately
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

  // Get all sections
  const hero = document.querySelector('[data-meetings-hero]') as HTMLElement;
  const title = document.querySelector('[data-meetings-title]') as HTMLElement;
  const description = document.querySelector('[data-meetings-description]') as HTMLElement;
  const grid = document.querySelector('[data-meetings-grid]') as HTMLElement;
  const gridCards = document.querySelectorAll('.meetings__card');
  const screenings = document.querySelector('[data-meetings-screenings]') as HTMLElement;
  const animeCards = document.querySelectorAll('.meetings__anime-card');
  const location = document.querySelector('[data-meetings-location]') as HTMLElement;

  if (!hero || !grid || !screenings || !location) return;

  // Set initial states - everything starts visible, will animate on scroll
  // Title slides in from left
  if (title) gsap.set(title, { x: -100, opacity: 0 });
  if (description) gsap.set(description, { x: -100, opacity: 0 });

  // Grid cards start off to the right
  if (gridCards.length) gsap.set(gridCards, { x: 100, opacity: 0 });

  // Screenings starts below
  if (screenings) gsap.set(screenings, { y: 50, opacity: 0 });
  if (animeCards.length) gsap.set(animeCards, { y: 30, opacity: 0 });

  // Location starts below
  if (location) gsap.set(location, { y: 50, opacity: 0 });

  // Create the scroll-triggered timeline
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

  // Store reference for cleanup
  meetingsScrollTrigger = tl.scrollTrigger as ScrollTrigger;

  // Phase 1: Title and description slide in from left (0 -> 0.15)
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

  // Phase 2: Grid cards slide in from right with stagger (0.15 -> 0.35)
  if (gridCards.length) {
    tl.fromTo(
      gridCards,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.15, ease: 'power2.out', stagger: 0.03 },
      0.15
    );
  }

  // Phase 3: Screenings section slides up (0.35 -> 0.55)
  if (screenings) {
    tl.fromTo(
      screenings,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.15, ease: 'power2.out' },
      0.35
    );
  }

  // Anime cards stagger in (0.4 -> 0.6)
  if (animeCards.length) {
    tl.fromTo(
      animeCards,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.12, ease: 'power2.out', stagger: 0.02 },
      0.4
    );
  }

  // Phase 4: Location section slides up (0.6 -> 0.8)
  if (location) {
    tl.fromTo(
      location,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.15, ease: 'power2.out' },
      0.6
    );
  }

  // Phase 5: Hero content slides out left, all other content remains (0.8 -> 1)
  // This creates space for any additional content or just a nice exit effect
}

/**
 * Card/slide selection interactivity
 * Note: The slider navigation is handled inline in NowScreening.astro
 * This function is kept for any additional interactivity that may be needed
 */
function initCardSelection(): void {
  // Slider navigation is now handled in NowScreening.astro inline script
  // This function is kept as a placeholder for future enhancements
}

/**
 * Cleanup screening animations
 */
export function destroyScreeningAnimations(): void {
  // Kill scroll trigger
  if (meetingsScrollTrigger) {
    meetingsScrollTrigger.kill();
    meetingsScrollTrigger = null;
  }

  // Remove admin mode
  document.body.classList.remove('admin-mode');
}
