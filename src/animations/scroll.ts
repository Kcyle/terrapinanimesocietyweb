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
 * Hide the loading screen after GSAP initialization and all resources are loaded
 */
function hideLoadingScreen(): void {
  const loadingScreen = document.getElementById('loading-screen');
  if (!loadingScreen) return;

  const doHide = () => {
    // Small delay to ensure all GSAP sets have applied
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        loadingScreen.classList.add('hidden');
        // Remove from DOM after transition
        setTimeout(() => {
          loadingScreen.remove();
        }, 500);
      });
    });
  };

  // Wait for all images and fonts to load
  if (document.readyState === 'complete') {
    doHide();
  } else {
    window.addEventListener('load', doHide);
  }
}

/**
 * Independent section-based scroll animation system
 * One master ScrollTrigger pins for entire duration
 * Each transition uses fixed absolute positions (no percentages)
 * Adding a new section = add animations at position N, increase total duration
 *
 * Flow: Hero → About → Meetings → TerpCon → Kamecon → Maid Cafe
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

  // TerpCon elements
  const terpconSection = document.querySelector('[data-terpcon-section]') as HTMLElement;
  const terpconTitle = document.querySelector('[data-terpcon-title]') as HTMLElement;
  const terpconTitleEcho = document.querySelector('[data-terpcon-title-echo]') as HTMLElement;
  const terpconBackgroundText = document.querySelector('[data-terpcon-background-text]') as HTMLElement;
  const terpconSubtitle = document.querySelector('[data-terpcon-subtitle]') as HTMLElement;
  const terpconDesc = document.querySelector('[data-terpcon-desc]') as HTMLElement;
  const terpconDetails = document.querySelectorAll('[data-terpcon-detail]');
  const terpconCta = document.querySelector('[data-terpcon-cta]') as HTMLElement;
  const terpconVendorsHeader = document.querySelector('[data-terpcon-vendors-header]') as HTMLElement;
  const terpconVendorsScroll = document.querySelector('[data-terpcon-vendors-scroll]') as HTMLElement;
  const terpconFeaturedArtists = document.querySelector('[data-terpcon-featured-artists]') as HTMLElement;

  // Kamecon elements
  const kameconSection = document.querySelector('[data-kamecon-section]') as HTMLElement;
  const kameconCarousel = document.querySelector('[data-kamecon-carousel]') as HTMLElement;
  const kameconTitle = document.querySelector('[data-kamecon-title]') as HTMLElement;
  const kameconDesc = document.querySelector('[data-kamecon-desc]') as HTMLElement;
  const kameconButtons = document.querySelector('[data-kamecon-buttons]') as HTMLElement;
  const kameconVendors = document.querySelector('[data-kamecon-vendors]') as HTMLElement;
  const kameconTurtle = document.querySelector('[data-kamecon-turtle]') as HTMLElement;

  // Maid Cafe elements
  const maidCafeSection = document.querySelector('[data-maidcafe-section]') as HTMLElement;
  const maidCafeTitle = document.querySelector('[data-maidcafe-title]') as HTMLElement;
  const maidCafeDesc = document.querySelector('[data-maidcafe-desc]') as HTMLElement;
  const maidCafeInfo = document.querySelector('[data-maidcafe-info]') as HTMLElement;
  const maidCafeImage = document.querySelector('[data-maidcafe-image]') as HTMLElement;
  const maidCafeCollage = document.querySelector('[data-maidcafe-collage]') as HTMLElement;

  if (!heroContent || !aboutContent) return;

  const hasMeetings = !!(meetingsContent && meetingsBg);
  const hasTerpcon = !!terpconSection;
  const hasKamecon = !!kameconSection;
  const hasMaidCafe = !!maidCafeSection;

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
  applyGPUHints(terpconSection);
  applyGPUHints(kameconSection);
  applyGPUHints(maidCafeSection);

  console.log('[Scroll] Elements found:', {
    heroContent: !!heroContent,
    aboutContent: !!aboutContent,
    hasMeetings,
    hasTerpcon,
    hasKamecon,
    hasMaidCafe
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

  // TerpCon - entire section slides in from yPercent: 100 (off-screen below)
  // autoAlpha handles visibility+opacity together, more reliable than visibility alone
  if (terpconSection) gsap.set(terpconSection, { zIndex: 100, yPercent: 100, autoAlpha: 1 });
  if (terpconTitle) gsap.set(terpconTitle, { y: '100vh', scale: 0.3, opacity: 1 });
  if (terpconSubtitle) gsap.set(terpconSubtitle, { x: '-100vw', opacity: 1 });
  if (terpconDesc) gsap.set(terpconDesc, { x: '-100vw', opacity: 1 });
  if (terpconDetails.length) gsap.set(terpconDetails, { x: '-100vw', opacity: 1 });
  if (terpconCta) gsap.set(terpconCta, { x: '-100vw', opacity: 1 });
  if (terpconVendorsHeader) gsap.set(terpconVendorsHeader, { x: '100vw', opacity: 1 });
  if (terpconVendorsScroll) gsap.set(terpconVendorsScroll, { x: '100vw', opacity: 1 });
  if (terpconFeaturedArtists) gsap.set(terpconFeaturedArtists, { y: '50vh', opacity: 1 });

  // Kamecon - entire section slides in from yPercent: 100 (off-screen below)
  // autoAlpha handles visibility+opacity together, more reliable than visibility alone
  if (kameconSection) gsap.set(kameconSection, { zIndex: 150, yPercent: 100, autoAlpha: 1 });
  if (kameconCarousel) gsap.set(kameconCarousel, { x: '-100vw', opacity: 1 });
  if (kameconTitle) gsap.set(kameconTitle, { y: '-100vh', opacity: 1 });
  if (kameconDesc) gsap.set(kameconDesc, { y: '100vh', opacity: 1 });
  if (kameconButtons) gsap.set(kameconButtons, { y: '100vh', opacity: 1 });
  if (kameconVendors) gsap.set(kameconVendors, { x: '100vw', opacity: 1 });
  if (kameconTurtle) gsap.set(kameconTurtle, { x: '100vw', opacity: 1 });

  // Maid Cafe - entire section slides in from yPercent: 100 (off-screen below)
  // autoAlpha handles visibility+opacity together, more reliable than visibility alone
  if (maidCafeSection) gsap.set(maidCafeSection, { zIndex: 250, yPercent: 100, autoAlpha: 1 });
  if (maidCafeTitle) gsap.set(maidCafeTitle, { y: '100vh', scale: 0.3, opacity: 1 });
  if (maidCafeDesc) gsap.set(maidCafeDesc, { y: '50vh', opacity: 1 });
  if (maidCafeInfo) gsap.set(maidCafeInfo, { y: '50vh', opacity: 1 });
  if (maidCafeImage) gsap.set(maidCafeImage, { x: '-100vw', opacity: 1 });
  if (maidCafeCollage) gsap.set(maidCafeCollage, { x: '100vw', opacity: 1 });

  // ============================================
  // CALCULATE TOTAL SCROLL NEEDED
  // ============================================

  // Flow: Hero→About→Meetings→TerpCon→Kamecon→MaidCafe
  let numTransitions = 1; // Base: Hero→About
  if (hasMeetings) numTransitions += 1; // About→Meetings
  if (hasTerpcon) numTransitions += 1; // Meetings→TerpCon
  if (hasKamecon) numTransitions += 1; // TerpCon→Kamecon
  if (hasMaidCafe) numTransitions += 1; // Kamecon→MaidCafe
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
    meetings: transitionSize * 2,
    terpcon: transitionSize * 3,
    kamecon: transitionSize * 4,
    maidcafe: transitionSize * 5
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
        } else if (hasTerpcon && progress < sectionBoundaries.terpcon) {
          newSection = 3; // TerpCon
        } else if (hasKamecon && progress < sectionBoundaries.kamecon) {
          newSection = 4; // Kamecon
        } else if (hasMaidCafe) {
          newSection = 5; // Maid Cafe
        } else {
          newSection = 2; // Meetings fallback
        }

        if (newSection !== currentSection) {
          currentSection = newSection;

          // Update pointer events only - visibility is handled by GSAP positioning
          // Elements at yPercent: 100 are off-screen and don't render anyway
          if (heroContent) {
            heroContent.style.pointerEvents = newSection === 0 ? 'auto' : 'none';
          }
          if (aboutContent) {
            aboutContent.style.pointerEvents = newSection === 1 ? 'auto' : 'none';
          }
          if (meetingsContent) {
            meetingsContent.style.pointerEvents = newSection === 2 ? 'auto' : 'none';
          }
          if (terpconSection) {
            terpconSection.style.pointerEvents = newSection === 3 ? 'auto' : 'none';
          }
          if (kameconSection) {
            kameconSection.style.pointerEvents = newSection === 4 ? 'auto' : 'none';
          }
          if (maidCafeSection) {
            maidCafeSection.style.pointerEvents = newSection === 5 ? 'auto' : 'none';
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

    // ============================================
    // TRANSITION 3: MEETINGS → TERPCON (position 2 to 3)
    // ============================================

    if (hasTerpcon) {
      if (meetingsPunch) masterTl.to(meetingsPunch, { x: '100vw', duration: 0.35, ease: 'none' }, 2.1);
      if (meetingsReze) masterTl.to(meetingsReze, { x: '-100vw', duration: 0.35, ease: 'none' }, 2.1);
      if (meetingsHeroTitle) masterTl.to(meetingsHeroTitle, { y: '-100vh', duration: 0.35, ease: 'none' }, 2.12);
      if (meetingsSectionHeader) masterTl.to(meetingsSectionHeader, { y: '-100vh', duration: 0.35, ease: 'none' }, 2.12);
      if (meetingsViewer) masterTl.to(meetingsViewer, { y: '100vh', duration: 0.35, ease: 'none' }, 2.15);
      if (meetingsThumbnails) masterTl.to(meetingsThumbnails, { x: '100vw', duration: 0.35, ease: 'none' }, 2.15);
      if (meetingsLocationSection) masterTl.to(meetingsLocationSection, { y: '100vh', duration: 0.35, ease: 'none' }, 2.18);
      if (meetingsSchedulerBtn) masterTl.to(meetingsSchedulerBtn, { y: '100vh', opacity: 0, duration: 0.35, ease: 'none' }, 2.1);
      // Meetings bg exits and TerpCon section enters - SYNCED with yPercent to stick together
      // Use fromTo() to prevent GSAP from reading DOM on first forward scroll (fixes glitch)
      if (meetingsBg) masterTl.fromTo(meetingsBg, { yPercent: 0 }, { yPercent: -100, duration: 0.4, ease: 'none' }, 2.1);
      if (terpconSection) masterTl.fromTo(terpconSection, { yPercent: 100 }, { yPercent: 0, duration: 0.4, ease: 'none' }, 2.1);
      // TerpCon content elements - finish by 2.7 to give dwell time before exit at 3.1
      if (terpconTitle) masterTl.fromTo(terpconTitle, { y: '100vh', scale: 0.3 }, { y: 0, scale: 1, duration: 0.1, ease: 'none' }, 2.5);
      if (terpconSubtitle) masterTl.fromTo(terpconSubtitle, { x: '-100vw' }, { x: 0, duration: 0.1, ease: 'none' }, 2.52);
      if (terpconDesc) masterTl.fromTo(terpconDesc, { x: '-100vw', opacity: 1 }, { x: 0, opacity: 1, duration: 0.08, ease: 'none' }, 2.54);
      if (terpconVendorsHeader) masterTl.fromTo(terpconVendorsHeader, { x: '100vw' }, { x: 0, duration: 0.1, ease: 'none' }, 2.56);
      if (terpconDetails.length) masterTl.fromTo(terpconDetails, { x: '-100vw', opacity: 1 }, { x: 0, opacity: 1, duration: 0.08, ease: 'none', stagger: 0.01 }, 2.58);
      if (terpconVendorsScroll) masterTl.fromTo(terpconVendorsScroll, { x: '100vw' }, { x: 0, duration: 0.1, ease: 'none' }, 2.6);
      if (terpconCta) masterTl.fromTo(terpconCta, { x: '-100vw', opacity: 1 }, { x: 0, opacity: 1, duration: 0.08, ease: 'none' }, 2.62);
      if (terpconFeaturedArtists) masterTl.fromTo(terpconFeaturedArtists, { y: '50vh', opacity: 1 }, { y: 0, opacity: 1, duration: 0.08, ease: 'none' }, 2.64);

      // ============================================
      // TRANSITION 4: TERPCON → KAMECON (position 3 to 4)
      // ============================================

      if (hasKamecon) {
        // TerpCon content exits
        if (terpconTitle) masterTl.to(terpconTitle, { y: '-100vh', scale: 0.3, duration: 0.3, ease: 'none' }, 3.1);
        if (terpconSubtitle) masterTl.to(terpconSubtitle, { x: '-100vw', duration: 0.3, ease: 'none' }, 3.1);
        if (terpconDesc) masterTl.to(terpconDesc, { x: '-100vw', opacity: 0, duration: 0.25, ease: 'none' }, 3.1);
        if (terpconDetails.length) masterTl.to(terpconDetails, { x: '-100vw', opacity: 0, duration: 0.25, ease: 'none' }, 3.1);
        if (terpconCta) masterTl.to(terpconCta, { x: '-100vw', opacity: 0, duration: 0.25, ease: 'none' }, 3.1);
        if (terpconFeaturedArtists) masterTl.to(terpconFeaturedArtists, { y: '50vh', opacity: 0, duration: 0.25, ease: 'none' }, 3.1);
        if (terpconVendorsHeader) masterTl.to(terpconVendorsHeader, { x: '100vw', duration: 0.3, ease: 'none' }, 3.1);
        if (terpconVendorsScroll) masterTl.to(terpconVendorsScroll, { x: '100vw', duration: 0.3, ease: 'none' }, 3.1);
        // TerpCon section exits and Kamecon section enters - overlap to prevent gaps
        // Use fromTo() to prevent GSAP from reading DOM on first forward scroll (fixes glitch)
        if (kameconSection) masterTl.fromTo(kameconSection, { yPercent: 100 }, { yPercent: 0, duration: 0.45, ease: 'none' }, 3.05);
        if (terpconSection) masterTl.fromTo(terpconSection, { yPercent: 0 }, { yPercent: -100, duration: 0.4, ease: 'none' }, 3.1);
        // Kamecon content elements - finish by 3.7 to give dwell time before exit at 4.1
        if (kameconCarousel) masterTl.fromTo(kameconCarousel, { x: '-100vw' }, { x: 0, duration: 0.1, ease: 'none' }, 3.5);
        if (kameconTitle) masterTl.fromTo(kameconTitle, { y: '-100vh' }, { y: 0, duration: 0.1, ease: 'none' }, 3.5);
        if (kameconDesc) masterTl.fromTo(kameconDesc, { y: '100vh' }, { y: 0, duration: 0.08, ease: 'none' }, 3.55);
        if (kameconButtons) masterTl.fromTo(kameconButtons, { y: '100vh' }, { y: 0, duration: 0.08, ease: 'none' }, 3.58);
        if (kameconVendors) masterTl.fromTo(kameconVendors, { x: '100vw' }, { x: 0, duration: 0.1, ease: 'none' }, 3.6);
        if (kameconTurtle) masterTl.fromTo(kameconTurtle, { x: '100vw' }, { x: 0, duration: 0.1, ease: 'none' }, 3.65);

        // ============================================
        // TRANSITION 5: KAMECON → MAID CAFE (position 4 to 5)
        // ============================================

        if (hasMaidCafe) {
          // Kamecon content exits (sliding out, not fading)
          if (kameconCarousel) masterTl.to(kameconCarousel, { x: '-100vw', duration: 0.3, ease: 'none' }, 4.1);
          if (kameconTitle) masterTl.to(kameconTitle, { y: '-100vh', duration: 0.3, ease: 'none' }, 4.1);
          if (kameconDesc) masterTl.to(kameconDesc, { y: '100vh', duration: 0.25, ease: 'none' }, 4.1);
          if (kameconButtons) masterTl.to(kameconButtons, { y: '100vh', duration: 0.25, ease: 'none' }, 4.1);
          if (kameconVendors) masterTl.to(kameconVendors, { x: '100vw', duration: 0.3, ease: 'none' }, 4.1);
          if (kameconTurtle) masterTl.to(kameconTurtle, { x: '100vw', duration: 0.3, ease: 'none' }, 4.1);
          // Kamecon section exits and Maid Cafe section enters - overlap to prevent gaps
          // Use fromTo() to prevent GSAP from reading DOM on first forward scroll (fixes glitch)
          if (maidCafeSection) masterTl.fromTo(maidCafeSection, { yPercent: 100 }, { yPercent: 0, duration: 0.45, ease: 'none' }, 4.05);
          if (kameconSection) masterTl.fromTo(kameconSection, { yPercent: 0 }, { yPercent: -100, duration: 0.4, ease: 'none' }, 4.1);
          // Maid Cafe content elements - start AFTER section is fully visible (section ends at 4.5)
          // Faster animations so content is visible sooner
          if (maidCafeTitle) masterTl.fromTo(maidCafeTitle, { y: '100vh', scale: 0.3 }, { y: 0, scale: 1, duration: 0.1, ease: 'none' }, 4.5);
          if (maidCafeImage) masterTl.fromTo(maidCafeImage, { x: '-100vw' }, { x: 0, duration: 0.1, ease: 'none' }, 4.52);
          if (maidCafeDesc) masterTl.fromTo(maidCafeDesc, { y: '50vh', opacity: 1 }, { y: 0, opacity: 1, duration: 0.08, ease: 'none' }, 4.54);
          if (maidCafeCollage) masterTl.fromTo(maidCafeCollage, { x: '100vw' }, { x: 0, duration: 0.1, ease: 'none' }, 4.56);
          if (maidCafeInfo) masterTl.fromTo(maidCafeInfo, { y: '50vh', opacity: 1 }, { y: 0, opacity: 1, duration: 0.08, ease: 'none' }, 4.58);
        }
      }
    }
  }

  // Force ScrollTrigger to recalculate positions after all animations are set up
  ScrollTrigger.refresh();

  // All GSAP initial states and animations are set up - hide loading screen
  // Small delay ensures layout is fully stable before revealing
  setTimeout(() => {
    hideLoadingScreen();
  }, 50);
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
 * Scroll to the maid cafe section
 */
export function scrollToMaidCafe(): void {
  if (!mainScrollTrigger) {
    console.warn('[Scroll] ScrollTrigger not initialized yet');
    return;
  }
  const endScroll = mainScrollTrigger.end;
  gsap.to(window, {
    scrollTo: { y: endScroll, autoKill: false },
    duration: 1.5,
    ease: 'power2.inOut'
  });
}

/**
 * Check URL hash and scroll to section if needed
 */
export function handleHashNavigation(): void {
  if (window.location.hash === '#maidcafe') {
    setTimeout(() => {
      scrollToMaidCafe();
    }, 500);
  }

  const maidCafeLinks = document.querySelectorAll('a[href="/#maidcafe"], a[href="#maidcafe"]');
  maidCafeLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.history.pushState(null, '', '/#maidcafe');
      scrollToMaidCafe();
    });
  });
}
