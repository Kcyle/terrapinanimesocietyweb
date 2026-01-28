import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Force GPU acceleration for all animations
gsap.config({ force3D: true });

// Store all ScrollTrigger instances for cleanup
const scrollTriggerInstances: ScrollTrigger[] = [];

// Store main ScrollTrigger reference for programmatic navigation
let mainScrollTrigger: ScrollTrigger | null = null;

/**
 * Independent section-based scroll animation system
 * One master ScrollTrigger pins for entire duration
 * Each transition uses fixed absolute positions (no percentages)
 *
 * Flow: Hero → About → Meetings
 */
export function initScrollTransition(): void {
  const heroSection = document.querySelector('[data-hero]') as HTMLElement;
  if (!heroSection) return;

  // ============================================
  // GATHER ALL ELEMENTS
  // ============================================

  // Hero elements
  const heroContent = document.querySelector('[data-hero-content]') as HTMLElement;
  const heroMascot = document.querySelector('[data-hero-mascot]') as HTMLElement;
  const heroCarousel = document.querySelector('[data-hero-carousel]') as HTMLElement;
  const ticketBanner = document.querySelector('[data-ticket-banner]') as HTMLElement;
  const heroBg = document.querySelector('.hero__bg') as HTMLElement;

  // About elements
  const aboutContent = document.querySelector('[data-about-content]') as HTMLElement;
  const aboutBg = document.querySelector('[data-about-bg]') as HTMLElement;
  const aboutMascot = document.querySelector('.about-content__mascot-container .about__mascot') as HTMLElement;
  const collageItems = document.querySelectorAll('.about-content__collage-item');
  const aboutTitleWrapper = document.querySelector('.about-content__title-wrapper') as HTMLElement;
  const aboutBackgroundText = document.querySelector('.about-content__background-text') as HTMLElement;
  const aboutInfo = document.querySelector('.about-content__info') as HTMLElement;
  const aboutButtons = document.querySelector('.about-content__buttons') as HTMLElement;

  // Meetings elements
  const meetingsContent = document.querySelector('[data-meetings-content]') as HTMLElement;
  const meetingsBg = document.querySelector('[data-meetings-bg]') as HTMLElement;
  const meetingsPunch = document.querySelector('.meetings__punch') as HTMLElement;
  const meetingsReze = document.querySelector('.meetings__reze') as HTMLElement;
  const meetingsHeroTitle = document.querySelector('.meetings__hero-title') as HTMLElement;
  const meetingsSectionHeader = document.querySelector('.meetings__section-header') as HTMLElement;
  const meetingsViewer = document.querySelector('.meetings__viewer') as HTMLElement;
  const meetingsThumbnails = document.querySelector('.meetings__thumbnails') as HTMLElement;
  const meetingsLocationSection = document.querySelector('.meetings__location-section') as HTMLElement;
  const meetingsSchedulerBtn = document.querySelector('.meetings__admin-btn') as HTMLElement;

  if (!heroContent || !aboutContent) return;

  const hasMeetings = !!(meetingsContent && meetingsBg);

  // ============================================
  // APPLY GPU ACCELERATION HINTS (MINIMAL)
  // ============================================
  const applyGPUHints = (el: HTMLElement | null) => {
    if (!el) return;
    el.style.willChange = 'transform';
    el.style.backfaceVisibility = 'hidden';
  };

  applyGPUHints(heroContent);
  applyGPUHints(aboutBg);
  applyGPUHints(aboutContent);
  applyGPUHints(meetingsBg);
  applyGPUHints(meetingsContent);

  console.log('[Scroll] Elements found:', {
    heroContent: !!heroContent,
    aboutContent: !!aboutContent,
    hasMeetings
  });

  // ============================================
  // SET INITIAL STATES
  // ============================================

  // Force browser to compute layout before GSAP reads any positions
  // This prevents race conditions on hard refresh
  void document.body.offsetHeight;

  // Hero - starts in natural position
  gsap.set(heroContent, { x: 0, zIndex: 10 });
  if (heroMascot) gsap.set(heroMascot, { y: 0 });
  if (heroCarousel) gsap.set(heroCarousel, { x: 0, autoAlpha: 1 });
  if (ticketBanner) gsap.set(ticketBanner, { x: 0, autoAlpha: 1 });

  // About - starts off-screen
  if (aboutBg) gsap.set(aboutBg, { yPercent: 100, visibility: 'visible' });
  if (aboutContent) gsap.set(aboutContent, { visibility: 'visible', opacity: 1, zIndex: 5 });
  if (aboutMascot) gsap.set(aboutMascot, { y: '100vh' });
  if (aboutTitleWrapper) gsap.set(aboutTitleWrapper, { y: '-100vh' });
  if (aboutBackgroundText) gsap.set(aboutBackgroundText, { y: '-100vh' });
  if (aboutInfo) gsap.set(aboutInfo, { y: '100vh' });
  if (aboutButtons) gsap.set(aboutButtons, { y: '100vh' });
  if (collageItems.length) gsap.set(collageItems, { y: '100vh' });

  // Meetings - starts off-screen
  if (meetingsBg) gsap.set(meetingsBg, { yPercent: 100, visibility: 'visible' });
  if (meetingsContent) gsap.set(meetingsContent, { visibility: 'visible', opacity: 1 });
  if (meetingsPunch) gsap.set(meetingsPunch, { x: '100vw' });
  if (meetingsReze) gsap.set(meetingsReze, { x: '-100vw' });
  if (meetingsHeroTitle) gsap.set(meetingsHeroTitle, { y: '100vh' });
  if (meetingsSectionHeader) gsap.set(meetingsSectionHeader, { y: '100vh' });
  if (meetingsViewer) gsap.set(meetingsViewer, { y: '100vh' });
  if (meetingsThumbnails) gsap.set(meetingsThumbnails, { x: '100vw' });
  if (meetingsLocationSection) gsap.set(meetingsLocationSection, { y: '100vh' });
  if (meetingsSchedulerBtn) gsap.set(meetingsSchedulerBtn, { y: '100vh', opacity: 0 });

  // ============================================
  // CALCULATE TOTAL SCROLL NEEDED
  // ============================================

  // Flow: Hero→About→Meetings
  let numTransitions = 1; // Base: Hero→About
  if (hasMeetings) numTransitions += 1; // About→Meetings
  const totalScrollVh = numTransitions * 150;

  console.log('[Scroll] Transitions:', numTransitions, 'Total scroll:', totalScrollVh + 'vh');

  // ============================================
  // MASTER TIMELINE
  // ============================================

  let currentSection = 0;
  const transitionSize = 1 / numTransitions;
  const sectionBoundaries = {
    hero: transitionSize * 0.5,
    about: transitionSize,
    meetings: transitionSize * 2
  };

  const masterTl = gsap.timeline({
    defaults: {
      immediateRender: false,
    },
    scrollTrigger: {
      trigger: heroSection,
      start: 'top top',
      end: `+=${totalScrollVh}%`,
      scrub: 1.5,
      pin: true,
      anticipatePin: 1,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;

        let newSection = 0;
        if (progress < sectionBoundaries.hero) {
          newSection = 0; // Hero
        } else if (progress < sectionBoundaries.about) {
          newSection = 1; // About
        } else if (hasMeetings && progress < sectionBoundaries.meetings) {
          newSection = progress < transitionSize * 1.5 ? 1 : 2;
        } else {
          newSection = 2; // Meetings fallback
        }

        if (newSection !== currentSection) {
          currentSection = newSection;

          // Update pointer events only - visibility is handled by GSAP positioning
          if (heroContent) {
            heroContent.style.pointerEvents = newSection === 0 ? 'auto' : 'none';
          }
          if (aboutContent) {
            aboutContent.style.pointerEvents = newSection === 1 ? 'auto' : 'none';
          }
          if (meetingsContent) {
            meetingsContent.style.pointerEvents = newSection === 2 ? 'auto' : 'none';
          }
        }
      }
    }
  });

  mainScrollTrigger = masterTl.scrollTrigger as ScrollTrigger;
  scrollTriggerInstances.push(mainScrollTrigger);

  // Prevent animations from triggering during browser resize
  let resizeTimeout: number | null = null;
  let savedProgress: number | null = null;

  window.addEventListener('resize', () => {
    if (savedProgress === null && mainScrollTrigger) {
      savedProgress = mainScrollTrigger.progress;
      mainScrollTrigger.disable(false);
    }
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      if (mainScrollTrigger && savedProgress !== null) {
        mainScrollTrigger.enable(false);
        mainScrollTrigger.refresh();
        const newScrollPos = mainScrollTrigger.start + (savedProgress * (mainScrollTrigger.end - mainScrollTrigger.start));
        window.scrollTo(0, newScrollPos);
        savedProgress = null;
      }
    }, 150);
  });

  // ============================================
  // TRANSITION 1: HERO → ABOUT (position 0 to 1)
  // ============================================

  // Hero elements staggered to prevent glitch when scrolling back
  masterTl.fromTo(heroContent, { x: 0 }, { x: '-100vw', duration: 0.4, ease: 'none' }, 0.1);
  if (heroMascot) masterTl.fromTo(heroMascot, { y: 0 }, { y: '100vh', duration: 0.4, ease: 'none' }, 0.15);
  if (heroCarousel) masterTl.fromTo(heroCarousel, { x: 0, autoAlpha: 1 }, { x: '-100vw', autoAlpha: 0, duration: 0.4, ease: 'none', immediateRender: true }, 0.12);
  if (ticketBanner) masterTl.fromTo(ticketBanner, { x: 0, autoAlpha: 1 }, { x: '100vw', autoAlpha: 0, duration: 0.4, ease: 'none', immediateRender: true }, 0.18);
  // Hide hero background so it doesn't show through later sections
  if (heroBg) masterTl.to(heroBg, { autoAlpha: 0, duration: 0.3, ease: 'none' }, 0.25);

  if (aboutBg) masterTl.to(aboutBg, { yPercent: 0, duration: 0.4, ease: 'none' }, 0.1);
  if (aboutTitleWrapper) masterTl.to(aboutTitleWrapper, { y: 0, duration: 0.35, ease: 'none' }, 0.25);
  if (aboutBackgroundText) masterTl.to(aboutBackgroundText, { y: 0, duration: 0.35, ease: 'none' }, 0.23);
  if (aboutInfo) masterTl.to(aboutInfo, { y: 0, duration: 0.35, ease: 'none' }, 0.28);
  if (aboutButtons) masterTl.to(aboutButtons, { y: 0, duration: 0.35, ease: 'none' }, 0.3);
  if (collageItems.length) masterTl.to(collageItems, { y: 0, duration: 0.35, ease: 'none', stagger: 0.02 }, 0.28);
  if (aboutMascot) masterTl.to(aboutMascot, { y: 0, duration: 0.35, ease: 'none' }, 0.32);

  // ============================================
  // TRANSITION 2: ABOUT → MEETINGS (position 1 to 2)
  // ============================================

  if (hasMeetings) {
    if (aboutTitleWrapper) masterTl.to(aboutTitleWrapper, { y: '-100vh', duration: 0.35, ease: 'none' }, 1.1);
    if (aboutBackgroundText) masterTl.to(aboutBackgroundText, { y: '-100vh', duration: 0.35, ease: 'none' }, 1.1);
    if (aboutInfo) masterTl.to(aboutInfo, { y: '100vh', duration: 0.35, ease: 'none' }, 1.12);
    if (aboutButtons) masterTl.to(aboutButtons, { y: '100vh', duration: 0.35, ease: 'none' }, 1.12);
    if (collageItems.length) masterTl.to(collageItems, { y: '100vh', duration: 0.35, ease: 'none', stagger: 0.01 }, 1.12);
    if (aboutMascot) masterTl.to(aboutMascot, { y: '100vh', duration: 0.35, ease: 'none' }, 1.15);
    // About bg exits and Meetings bg enters - SYNCED with yPercent to stick together
    if (aboutBg) masterTl.to(aboutBg, { yPercent: -100, duration: 0.4, ease: 'none' }, 1.1);
    if (meetingsBg) masterTl.to(meetingsBg, { yPercent: 0, duration: 0.4, ease: 'none' }, 1.1);
    if (meetingsPunch) masterTl.to(meetingsPunch, { x: 0, duration: 0.35, ease: 'none' }, 1.35);
    if (meetingsReze) masterTl.to(meetingsReze, { x: 0, duration: 0.35, ease: 'none' }, 1.35);
    if (meetingsHeroTitle) masterTl.to(meetingsHeroTitle, { y: 0, duration: 0.35, ease: 'none' }, 1.38);
    if (meetingsSectionHeader) masterTl.to(meetingsSectionHeader, { y: 0, duration: 0.35, ease: 'none' }, 1.4);
    if (meetingsViewer) masterTl.to(meetingsViewer, { y: 0, duration: 0.35, ease: 'none' }, 1.42);
    if (meetingsThumbnails) masterTl.to(meetingsThumbnails, { x: 0, duration: 0.35, ease: 'none' }, 1.44);
    if (meetingsLocationSection) masterTl.to(meetingsLocationSection, { y: 0, duration: 0.35, ease: 'none' }, 1.46);
    if (meetingsSchedulerBtn) masterTl.to(meetingsSchedulerBtn, { y: 0, opacity: 1, duration: 0.35, ease: 'none' }, 1.42);
  }

  // Force ScrollTrigger to recalculate positions after all animations are set up
  ScrollTrigger.refresh();
}

/**
 * Stub for backwards compatibility
 */
export function initAboutToMeetingsTransition(): void {
  // Now handled within initScrollTransition
}

/**
 * Destroy scroll animations and clean up
 */
export function destroyScrollTransition(): void {
  scrollTriggerInstances.forEach(st => {
    if (st) st.kill();
  });
  scrollTriggerInstances.length = 0;
}

/**
 * Handle hash navigation (stub for backwards compatibility)
 */
export function handleHashNavigation(): void {
  // Hash navigation removed - individual pages now handle their own sections
}
