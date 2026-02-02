import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Expose ScrollTrigger globally for navigation teleport
(window as any).ScrollTrigger = ScrollTrigger;

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
 * Flow: Hero → About → Meetings → Activities
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

  // Activities elements
  const activitiesContent = document.querySelector('[data-activities-content]') as HTMLElement;
  const activitiesBg = document.querySelector('[data-activities-bg]') as HTMLElement;
  const activitiesCharacter = document.querySelector('[data-activities-character]') as HTMLElement;
  const activitiesTitle = document.querySelector('[data-activities-title]') as HTMLElement;
  const activitiesDescription = document.querySelector('[data-activities-description]') as HTMLElement;
  const activityCards = document.querySelectorAll('[data-activity-card]');
  const activitiesVoid = document.querySelector('[data-activities-void]') as HTMLElement;

  // Sky biome elements - 5 different skies that transition as character falls
  const skyBiome1 = document.querySelector('[data-sky-biome-1]') as HTMLElement; // Animusic
  const skyBiome2 = document.querySelector('[data-sky-biome-2]') as HTMLElement; // Cosplay
  const skyBiome3 = document.querySelector('[data-sky-biome-3]') as HTMLElement; // Old Anime
  const skyBiome4 = document.querySelector('[data-sky-biome-4]') as HTMLElement; // Book Club
  const skyBiome5 = document.querySelector('[data-sky-biome-5]') as HTMLElement; // Rainbow

  // Subgroups intro screen and content
  const subgroupsIntro = document.querySelector('[data-subgroups-intro]') as HTMLElement;
  const subgroupsHeading = document.querySelector('[data-subgroups-heading]') as HTMLElement;
  const subgroupsSubtitle = document.querySelector('[data-subgroups-subtitle]') as HTMLElement;
  const subgroupsPreviews = document.querySelector('[data-subgroups-previews]') as HTMLElement;
  const subgroup1 = document.querySelector('[data-subgroup-1]') as HTMLElement;
  const subgroup1Left = document.querySelector('[data-subgroup-1-left]') as HTMLElement;
  const subgroup1Right = document.querySelector('[data-subgroup-1-right]') as HTMLElement;
  const subgroup1PhotoLeft = document.querySelector('[data-subgroup-1-photo-left]') as HTMLElement;
  const subgroup1PhotoRight = document.querySelector('[data-subgroup-1-photo-right]') as HTMLElement;
  const subgroup2 = document.querySelector('[data-subgroup-2]') as HTMLElement;
  const subgroup2Left = document.querySelector('[data-subgroup-2-left]') as HTMLElement;
  const subgroup2Right = document.querySelector('[data-subgroup-2-right]') as HTMLElement;
  const subgroup2PhotoLeft = document.querySelector('[data-subgroup-2-photo-left]') as HTMLElement;
  const subgroup2PhotoRight = document.querySelector('[data-subgroup-2-photo-right]') as HTMLElement;
  const subgroup3 = document.querySelector('[data-subgroup-3]') as HTMLElement;
  const subgroup3Left = document.querySelector('[data-subgroup-3-left]') as HTMLElement;
  const subgroup3Right = document.querySelector('[data-subgroup-3-right]') as HTMLElement;
  const subgroup3PhotoLeft = document.querySelector('[data-subgroup-3-photo-left]') as HTMLElement;
  const subgroup3PhotoRight = document.querySelector('[data-subgroup-3-photo-right]') as HTMLElement;
  const subgroup4 = document.querySelector('[data-subgroup-4]') as HTMLElement;
  const subgroup4Left = document.querySelector('[data-subgroup-4-left]') as HTMLElement;
  const subgroup4Right = document.querySelector('[data-subgroup-4-right]') as HTMLElement;
  const subgroup5 = document.querySelector('[data-subgroup-5]') as HTMLElement;
  const subgroup5Left = document.querySelector('[data-subgroup-5-left]') as HTMLElement;
  const subgroup5Right = document.querySelector('[data-subgroup-5-right]') as HTMLElement;

  // Partners elements
  const partnersContent = document.querySelector('[data-partners-content]') as HTMLElement;
  const partnersBg = document.querySelector('[data-partners-bg]') as HTMLElement;
  const partnersHeader = document.querySelector('[data-partners-header]') as HTMLElement;
  const partnersTrinity = document.querySelector('[data-partners-trinity]') as HTMLElement;
  const partnerItems = document.querySelectorAll('[data-partner]');
  const partnersShowcase = document.querySelector('[data-partners-showcase]') as HTMLElement;

  // Footer - hide during subgroups
  const footer = document.querySelector('[data-footer]') as HTMLElement;

  if (!heroContent || !aboutContent) return;

  const hasMeetings = !!(meetingsContent && meetingsBg);
  const hasActivities = !!(activitiesContent && activitiesBg);
  const hasPartners = !!(partnersContent && partnersBg);

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
  applyGPUHints(activitiesBg);
  applyGPUHints(activitiesContent);

  console.log('[Scroll] Elements found:', {
    heroContent: !!heroContent,
    aboutContent: !!aboutContent,
    hasMeetings,
    hasActivities,
    hasPartners,
    partnersContent: !!partnersContent,
    partnersBg: !!partnersBg,
    partnersHeader: !!partnersHeader,
    partnersTrinity: !!partnersTrinity,
    partnerItems: partnerItems.length
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

  // Activities - starts off-screen (visibility hidden via CSS, revealed by GSAP)
  if (activitiesBg) gsap.set(activitiesBg, { autoAlpha: 0 });
  if (activitiesContent) gsap.set(activitiesContent, { visibility: 'visible', opacity: 1 });
  if (activitiesCharacter) gsap.set(activitiesCharacter, { x: '100vw', y: '100vh' });
  if (activitiesTitle) gsap.set(activitiesTitle, { y: '100vh' });
  if (activitiesDescription) gsap.set(activitiesDescription, { y: '100vh', opacity: 0 });
  // Void - hidden initially, shown after grid
  if (activitiesVoid) gsap.set(activitiesVoid, { opacity: 0 });

  // Subgroups intro - starts hidden, will fade in as fullscreen
  if (subgroupsIntro) gsap.set(subgroupsIntro, { opacity: 0 });
  if (subgroupsHeading) gsap.set(subgroupsHeading, { y: '40px', opacity: 0 });
  if (subgroupsSubtitle) gsap.set(subgroupsSubtitle, { y: '20px', opacity: 0 });
  if (subgroupsPreviews) gsap.set(subgroupsPreviews, { y: '30px', opacity: 0 });
  // First biome starts hidden - intro shows first
  if (skyBiome1) gsap.set(skyBiome1, { opacity: 0 });

  // Subgroup content - all start hidden with left/right offscreen
  if (subgroup1) gsap.set(subgroup1, { opacity: 0 });
  if (subgroup1Left) gsap.set(subgroup1Left, { x: '-100vw', opacity: 0 });
  if (subgroup1Right) gsap.set(subgroup1Right, { x: '100vw', opacity: 0 });
  if (subgroup1PhotoLeft) gsap.set(subgroup1PhotoLeft, { y: '100vh', opacity: 0 });
  if (subgroup1PhotoRight) gsap.set(subgroup1PhotoRight, { y: '-100vh', opacity: 0 });
  if (subgroup2) gsap.set(subgroup2, { opacity: 0 });
  if (subgroup2Left) gsap.set(subgroup2Left, { x: '-100vw', opacity: 0 });
  if (subgroup2Right) gsap.set(subgroup2Right, { x: '100vw', opacity: 0 });
  if (subgroup2PhotoLeft) gsap.set(subgroup2PhotoLeft, { y: '100vh', opacity: 0 });
  if (subgroup2PhotoRight) gsap.set(subgroup2PhotoRight, { y: '100vh', opacity: 0 });
  if (subgroup3) gsap.set(subgroup3, { opacity: 0 });
  if (subgroup3Left) gsap.set(subgroup3Left, { x: '-100vw', opacity: 0 });
  if (subgroup3Right) gsap.set(subgroup3Right, { x: '100vw', opacity: 0 });
  if (subgroup3PhotoLeft) gsap.set(subgroup3PhotoLeft, { y: '100vh', opacity: 0 });
  if (subgroup3PhotoRight) gsap.set(subgroup3PhotoRight, { y: '-100vh', opacity: 0 });
  if (subgroup4) gsap.set(subgroup4, { opacity: 0 });
  if (subgroup4Left) gsap.set(subgroup4Left, { x: '-100vw', opacity: 0 });
  if (subgroup4Right) gsap.set(subgroup4Right, { x: '100vw', opacity: 0 });
  if (subgroup5) gsap.set(subgroup5, { opacity: 0 });
  if (subgroup5Left) gsap.set(subgroup5Left, { x: '-100vw', opacity: 0 });
  if (subgroup5Right) gsap.set(subgroup5Right, { x: '100vw', opacity: 0 });

  // Partners - starts off-screen
  if (partnersContent) gsap.set(partnersContent, { visibility: 'visible', opacity: 1 });
  if (partnersBg) gsap.set(partnersBg, { yPercent: 100, visibility: 'visible' });
  if (partnersHeader) gsap.set(partnersHeader, { y: 40, opacity: 0 });
  if (partnersTrinity) gsap.set(partnersTrinity, { opacity: 0 });
  if (partnerItems.length) {
    partnerItems.forEach((item, i) => {
      gsap.set(item, { y: 30, opacity: 0 });
    });
  }
  if (partnersShowcase) gsap.set(partnersShowcase, { y: 30, opacity: 0 });

  // Activity cards - start off-screen, alternating left/right, fully opaque (no fade)
  if (activityCards.length) {
    activityCards.forEach((card, i) => {
      const fromLeft = i % 2 === 0;
      gsap.set(card, {
        x: fromLeft ? '-120vw' : '120vw',
        rotation: fromLeft ? -25 : 25,
        opacity: 1,
      });
    });
  }

  // ============================================
  // CALCULATE TOTAL SCROLL NEEDED
  // ============================================

  // Flow: Hero→About→Meetings→Activities (+ card pile)
  let numTransitions = 1; // Base: Hero→About
  if (hasMeetings) numTransitions += 1; // About→Meetings
  if (hasActivities) numTransitions += 1; // Meetings→Activities

  // Extra scroll units for partners (1.5) + intro screen + 5 sky biomes
  // Partners: 1.5 units, Intro: 1.5 units, 5 biomes x 1.5 units each = 12 total
  let effectiveUnits = numTransitions;
  if (hasPartners) effectiveUnits += 1.5;
  if (hasActivities) effectiveUnits += 12; // Subgroups section
  const totalScrollVh = effectiveUnits * 150;

  console.log('[Scroll] Transitions:', numTransitions, 'Effective units:', effectiveUnits, 'Total scroll:', totalScrollVh + 'vh');

  // ============================================
  // MASTER TIMELINE
  // ============================================

  let currentSection = 0;
  const transitionSize = 1 / effectiveUnits;
  const sectionBoundaries = {
    hero: transitionSize * 0.5,
    about: transitionSize,
    meetings: transitionSize * 2,
    activities: transitionSize * 3
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
        } else if (hasActivities && progress < sectionBoundaries.activities) {
          newSection = progress < transitionSize * 2.5 ? 2 : 3;
        } else {
          newSection = hasActivities ? 3 : 2;
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
          if (activitiesContent) {
            activitiesContent.style.pointerEvents = newSection === 3 ? 'auto' : 'none';
          }
        }
      }
    }
  });

  mainScrollTrigger = masterTl.scrollTrigger as ScrollTrigger;
  scrollTriggerInstances.push(mainScrollTrigger);

  // Prevent animations from triggering during browser resize
  let resizeTimeout: number | null = null;
  let isResizing = false;

  window.addEventListener('resize', () => {
    if (!isResizing && mainScrollTrigger) {
      isResizing = true;
      // Don't disable - just pause updates to prevent glitching
      masterTl.pause();
    }
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      if (mainScrollTrigger && isResizing) {
        // Refresh ScrollTrigger calculations for new dimensions
        ScrollTrigger.refresh();
        // Resume the timeline
        masterTl.resume();
        isResizing = false;
      }
    }, 200);
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
  // C.C. slides in separately from bottom, after collage is in place
  if (aboutMascot) masterTl.to(aboutMascot, { y: 0, duration: 0.4, ease: 'power2.out' }, 0.5);

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

  // ============================================
  // TRANSITION 3: MEETINGS → ACTIVITIES (position 2 to 3)
  // Makima bg fades in slowly/cinematically first,
  // then Chainsaw Man slides in from bottom-right,
  // then Activities title enters
  // ============================================

  if (hasActivities && hasMeetings) {
    // Meetings elements exit
    if (meetingsHeroTitle) masterTl.to(meetingsHeroTitle, { y: '-100vh', duration: 0.35, ease: 'none' }, 2.1);
    if (meetingsSectionHeader) masterTl.to(meetingsSectionHeader, { y: '-100vh', duration: 0.35, ease: 'none' }, 2.1);
    if (meetingsViewer) masterTl.to(meetingsViewer, { y: '100vh', duration: 0.35, ease: 'none' }, 2.12);
    if (meetingsThumbnails) masterTl.to(meetingsThumbnails, { x: '100vw', duration: 0.35, ease: 'none' }, 2.12);
    if (meetingsLocationSection) masterTl.to(meetingsLocationSection, { y: '100vh', duration: 0.35, ease: 'none' }, 2.14);
    if (meetingsSchedulerBtn) masterTl.to(meetingsSchedulerBtn, { y: '100vh', opacity: 0, duration: 0.35, ease: 'none' }, 2.14);
    if (meetingsPunch) masterTl.to(meetingsPunch, { x: '100vw', duration: 0.35, ease: 'none' }, 2.15);
    if (meetingsReze) masterTl.to(meetingsReze, { x: '-100vw', duration: 0.35, ease: 'none' }, 2.15);

    // Meetings bg exits upward
    if (meetingsBg) masterTl.to(meetingsBg, { yPercent: -100, duration: 0.4, ease: 'none' }, 2.1);

    // Makima background fades in slowly and cinematically
    // Starts early and takes a long duration for that slow cinematic feel
    if (activitiesBg) masterTl.to(activitiesBg, { autoAlpha: 1, duration: 0.5, ease: 'power1.inOut' }, 2.2);

    // Chainsaw Man slides in from bottom-right after bg is settling in
    if (activitiesCharacter) masterTl.to(activitiesCharacter, { x: 0, y: 0, duration: 0.4, ease: 'power2.out' }, 2.45);

    // Power stays hidden - will slide in from bottom after card pile animation

    // Activities title enters from below, arrives last
    if (activitiesTitle) masterTl.to(activitiesTitle, { y: 0, duration: 0.35, ease: 'power2.out' }, 2.55);

    // Description fades in after the title
    if (activitiesDescription) masterTl.to(activitiesDescription, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, 2.65);

    // ============================================
    // CARD PILE: Activity cards slide in one by one (positions 3.0 to ~4.7)
    // Each card slides from off-screen and lands in the pile
    // with a unique rotation and offset, like papers being tossed
    // ============================================

    if (activityCards.length) {
      // Final rotation and offset for each card in the pile
      const cardFinalStates = [
        { rotation: -7,  x: -15, y: 8   },  // Movie Bingo
        { rotation: 4,   x: 18,  y: -10  },  // Jeopardy
        { rotation: -12, x: -8,  y: 14   },  // Pictionary/Charades
        { rotation: 6,   x: 22,  y: -6   },  // 20 Questions
        { rotation: -3,  x: -20, y: 5    },  // Hot Takes
        { rotation: 10,  x: 10,  y: -16  },  // Magic Boy Screening
        { rotation: -9,  x: -12, y: 10   },  // Chainsaw Man Event
        { rotation: 5,   x: 16,  y: -8   },  // Scavenger Hunt
        { rotation: -5,  x: -18, y: 12   },  // Live Fandubs
        { rotation: 2,   x: 6,   y: -4   },  // Presentations
        { rotation: -8,  x: -10, y: 6    },  // Fujimoto 17-26 Screening
      ];

      activityCards.forEach((card, i) => {
        const state = cardFinalStates[i] || { rotation: 0, x: 0, y: 0 };
        const startPos = 3.0 + i * 0.18;

        masterTl.to(card, {
          x: state.x,
          y: state.y,
          rotation: state.rotation,
          duration: 0.2,
          ease: 'power3.out',
        }, startPos);
      });

      // ============================================
      // TRANSITION 4: ACTIVITIES → PARTNERS (position 5.0 to 6.5)
      // Cards explode outward from pile and disappear
      // ============================================

      // Activities elements slide off
      if (activitiesTitle) {
        masterTl.to(activitiesTitle, { x: '-100vw', opacity: 0, duration: 0.5, ease: 'power2.in' }, 5.0);
      }
      if (activitiesDescription) {
        masterTl.to(activitiesDescription, { x: '-100vw', opacity: 0, duration: 0.5, ease: 'power2.in' }, 5.05);
      }
      if (activitiesCharacter) {
        masterTl.to(activitiesCharacter, { x: '100vw', y: '100vh', opacity: 0, duration: 0.5, ease: 'power2.in' }, 5.1);
      }

      // Pop/explode effect for cards - they scale up, burst outward in all directions
      // Each card explodes in a unique direction from the pile center
      const explodeDirections = [
        { x: -250, y: -180, rot: -35 },   // Top-left burst
        { x: 280, y: -150, rot: 40 },     // Top-right burst
        { x: -200, y: 120, rot: -25 },    // Bottom-left burst
        { x: 260, y: 180, rot: 30 },      // Bottom-right burst
        { x: -300, y: 0, rot: -45 },      // Left burst
        { x: 320, y: -50, rot: 50 },      // Right burst
        { x: 0, y: -220, rot: 15 },       // Top burst
        { x: -180, y: 200, rot: -20 },    // Bottom-left burst
        { x: 200, y: 250, rot: 25 },      // Bottom-right burst
        { x: -280, y: -100, rot: -40 },   // Upper-left burst
      ];

      activityCards.forEach((card, i) => {
        const dir = explodeDirections[i] || { x: 0, y: -200, rot: 0 };
        masterTl.to(card, {
          x: `+=${dir.x}`,
          y: `+=${dir.y}`,
          scale: 1.4,
          rotation: `+=${dir.rot}`,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out',
        }, 5.0 + i * 0.02);
      });

      // Activities bg out, Partners bg in
      if (activitiesBg) {
        masterTl.to(activitiesBg, { autoAlpha: 0, duration: 0.4, ease: 'none' }, 5.0);
      }
      if (partnersBg) {
        masterTl.to(partnersBg, { yPercent: 0, duration: 0.4, ease: 'none' }, 5.0);
      }

      // Partners content animates in - fade up elegantly
      if (partnersHeader) {
        masterTl.to(partnersHeader, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, 5.25);
      }
      if (partnersTrinity) {
        masterTl.to(partnersTrinity, { opacity: 1, duration: 0.3, ease: 'none' }, 5.35);
      }
      // Partner items stagger in
      if (partnerItems.length) {
        partnerItems.forEach((item, i) => {
          masterTl.to(item, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, 5.4 + i * 0.08);
        });
      }
      // Showcase fades in after partners
      if (partnersShowcase) {
        masterTl.to(partnersShowcase, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, 5.7);
      }

      // Partners elements exit - fade out
      if (partnersHeader) {
        masterTl.to(partnersHeader, { y: -30, opacity: 0, duration: 0.35, ease: 'power2.in' }, 6.5);
      }
      if (partnerItems.length) {
        partnerItems.forEach((item, i) => {
          masterTl.to(item, { y: -20, opacity: 0, duration: 0.3, ease: 'power2.in' }, 6.5 + i * 0.02);
        });
      }
      if (partnersTrinity) {
        masterTl.to(partnersTrinity, { opacity: 0, duration: 0.2, ease: 'none' }, 6.6);
      }
      if (partnersShowcase) {
        masterTl.to(partnersShowcase, { y: -20, opacity: 0, duration: 0.3, ease: 'power2.in' }, 6.55);
      }

      // Partners bg out, Void fades in
      if (partnersBg) {
        masterTl.to(partnersBg, { yPercent: -100, duration: 0.4, ease: 'none' }, 6.7);
      }
      if (activitiesVoid) {
        masterTl.to(activitiesVoid, {
          opacity: 1,
          duration: 0.6,
          ease: 'power1.inOut',
        }, 6.8);
      }

      // ============================================
      // HIDE FOOTER during subgroups section
      // ============================================
      if (footer) {
        masterTl.to(footer, { opacity: 0, y: 50, duration: 0.3, ease: 'power2.in' }, 6.8);
      }

      // ============================================
      // SUBGROUPS INTRO - Clean Apple-style
      // ============================================
      if (subgroupsIntro) {
        masterTl.to(subgroupsIntro, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 6.8);
      }
      if (subgroupsHeading) {
        masterTl.to(subgroupsHeading, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, 7.0);
      }
      if (subgroupsSubtitle) {
        masterTl.to(subgroupsSubtitle, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, 7.15);
      }
      if (subgroupsPreviews) {
        masterTl.to(subgroupsPreviews, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, 7.3);
        masterTl.to(subgroupsPreviews, { y: '100px', opacity: 0, duration: 0.4, ease: 'power2.in' }, 7.8);
      }
      if (subgroupsIntro) {
        masterTl.to(subgroupsIntro, { opacity: 0, duration: 0.4, ease: 'power2.in' }, 8.0);
      }

      // ============================================
      // SKY BIOME TRANSITIONS - 5 different skies
      // Intro: 6.8 - 8.0
      // Biome 1 (Animusic): 8.0 - 9.5
      // Biome 2 (Cosplay): 9.5 - 11.0
      // Biome 3 (Old Anime): 11.0 - 12.5
      // Biome 4 (Book Club): 12.5 - 14.0
      // Biome 5 (Rainbow): 14.0 - 15.5
      // ============================================

      // ===== BIOME 1: ANIMUSIC (8.0 - 9.5) =====
      if (skyBiome1) {
        masterTl.to(skyBiome1, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 8.0);
      }
      if (subgroup1) {
        masterTl.to(subgroup1, { opacity: 1, duration: 0.2, ease: 'none' }, 8.2);
      }
      if (subgroup1Left) {
        masterTl.to(subgroup1Left, { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, 8.25);
      }
      if (subgroup1Right) {
        masterTl.to(subgroup1Right, { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, 8.3);
      }
      if (subgroup1PhotoRight) {
        masterTl.to(subgroup1PhotoRight, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 8.35);
      }
      if (subgroup1PhotoLeft) {
        masterTl.to(subgroup1PhotoLeft, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 8.4);
      }
      // Slide out
      if (subgroup1PhotoRight) {
        masterTl.to(subgroup1PhotoRight, { y: '-100vh', opacity: 0, duration: 0.3, ease: 'power2.in' }, 9.05);
      }
      if (subgroup1PhotoLeft) {
        masterTl.to(subgroup1PhotoLeft, { y: '100vh', opacity: 0, duration: 0.3, ease: 'power2.in' }, 9.05);
      }
      if (subgroup1Left) {
        masterTl.to(subgroup1Left, { x: '-100vw', opacity: 0, duration: 0.25, ease: 'power2.in' }, 9.1);
      }
      if (subgroup1Right) {
        masterTl.to(subgroup1Right, { x: '100vw', opacity: 0, duration: 0.25, ease: 'power2.in' }, 9.1);
      }
      if (subgroup1) {
        masterTl.to(subgroup1, { opacity: 0, duration: 0.15, ease: 'none' }, 9.4);
      }

      // Biome 1 → Biome 2 (position 9.5)
      if (skyBiome1) {
        masterTl.to(skyBiome1, { opacity: 0, duration: 0.3, ease: 'power1.inOut' }, 9.5);
      }
      if (skyBiome2) {
        masterTl.to(skyBiome2, { opacity: 1, duration: 0.3, ease: 'power1.inOut' }, 9.5);
      }

      // ===== BIOME 2: COSPLAY (9.5 - 11.0) =====
      if (subgroup2) {
        masterTl.to(subgroup2, { opacity: 1, duration: 0.2, ease: 'none' }, 9.7);
      }
      if (subgroup2Left) {
        masterTl.to(subgroup2Left, { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, 9.75);
      }
      if (subgroup2Right) {
        masterTl.to(subgroup2Right, { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, 9.8);
      }
      // Cosplay photos slide up from bottom
      if (subgroup2PhotoLeft) {
        masterTl.to(subgroup2PhotoLeft, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 9.85);
      }
      if (subgroup2PhotoRight) {
        masterTl.to(subgroup2PhotoRight, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 9.9);
      }
      // Slide out
      if (subgroup2PhotoLeft) {
        masterTl.to(subgroup2PhotoLeft, { y: '100vh', opacity: 0, duration: 0.3, ease: 'power2.in' }, 10.55);
      }
      if (subgroup2PhotoRight) {
        masterTl.to(subgroup2PhotoRight, { y: '100vh', opacity: 0, duration: 0.3, ease: 'power2.in' }, 10.55);
      }
      if (subgroup2Left) {
        masterTl.to(subgroup2Left, { x: '-100vw', opacity: 0, duration: 0.25, ease: 'power2.in' }, 10.6);
      }
      if (subgroup2Right) {
        masterTl.to(subgroup2Right, { x: '100vw', opacity: 0, duration: 0.25, ease: 'power2.in' }, 10.6);
      }
      if (subgroup2) {
        masterTl.to(subgroup2, { opacity: 0, duration: 0.15, ease: 'none' }, 10.9);
      }

      // Biome 2 → Biome 3 (position 11.0)
      if (skyBiome2) {
        masterTl.to(skyBiome2, { opacity: 0, duration: 0.3, ease: 'power1.inOut' }, 11.0);
      }
      if (skyBiome3) {
        masterTl.to(skyBiome3, { opacity: 1, duration: 0.3, ease: 'power1.inOut' }, 11.0);
      }

      // ===== BIOME 3: OLD ANIME (11.0 - 12.5) =====
      if (subgroup3) {
        masterTl.to(subgroup3, { opacity: 1, duration: 0.2, ease: 'none' }, 11.2);
      }
      if (subgroup3Left) {
        masterTl.to(subgroup3Left, { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, 11.25);
      }
      if (subgroup3Right) {
        masterTl.to(subgroup3Right, { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, 11.3);
      }
      // Old Anime character images slide in
      if (subgroup3PhotoRight) {
        masterTl.to(subgroup3PhotoRight, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 11.35);
      }
      if (subgroup3PhotoLeft) {
        masterTl.to(subgroup3PhotoLeft, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 11.4);
      }
      // Slide out
      if (subgroup3PhotoRight) {
        masterTl.to(subgroup3PhotoRight, { y: '-100vh', opacity: 0, duration: 0.3, ease: 'power2.in' }, 12.05);
      }
      if (subgroup3PhotoLeft) {
        masterTl.to(subgroup3PhotoLeft, { y: '100vh', opacity: 0, duration: 0.3, ease: 'power2.in' }, 12.05);
      }
      if (subgroup3Left) {
        masterTl.to(subgroup3Left, { x: '-100vw', opacity: 0, duration: 0.25, ease: 'power2.in' }, 12.1);
      }
      if (subgroup3Right) {
        masterTl.to(subgroup3Right, { x: '100vw', opacity: 0, duration: 0.25, ease: 'power2.in' }, 12.1);
      }
      if (subgroup3) {
        masterTl.to(subgroup3, { opacity: 0, duration: 0.15, ease: 'none' }, 12.4);
      }

      // Biome 3 → Biome 4 (position 12.5)
      if (skyBiome3) {
        masterTl.to(skyBiome3, { opacity: 0, duration: 0.3, ease: 'power1.inOut' }, 12.5);
      }
      if (skyBiome4) {
        masterTl.to(skyBiome4, { opacity: 1, duration: 0.3, ease: 'power1.inOut' }, 12.5);
      }

      // ===== BIOME 4: BOOK CLUB (12.5 - 14.0) =====
      if (subgroup4) {
        masterTl.to(subgroup4, { opacity: 1, duration: 0.2, ease: 'none' }, 12.7);
      }
      if (subgroup4Left) {
        masterTl.to(subgroup4Left, { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, 12.75);
      }
      if (subgroup4Right) {
        masterTl.to(subgroup4Right, { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, 12.8);
      }
      if (subgroup4Left) {
        masterTl.to(subgroup4Left, { x: '-100vw', opacity: 0, duration: 0.25, ease: 'power2.in' }, 13.6);
      }
      if (subgroup4Right) {
        masterTl.to(subgroup4Right, { x: '100vw', opacity: 0, duration: 0.25, ease: 'power2.in' }, 13.6);
      }
      if (subgroup4) {
        masterTl.to(subgroup4, { opacity: 0, duration: 0.15, ease: 'none' }, 13.9);
      }

      // Biome 4 → Biome 5 (position 14.0)
      if (skyBiome4) {
        masterTl.to(skyBiome4, { opacity: 0, duration: 0.3, ease: 'power1.inOut' }, 14.0);
      }
      if (skyBiome5) {
        masterTl.to(skyBiome5, { opacity: 1, duration: 0.3, ease: 'power1.inOut' }, 14.0);
      }

      // ===== BIOME 5: RAINBOW (14.0 - 15.5) =====
      if (subgroup5) {
        masterTl.to(subgroup5, { opacity: 1, duration: 0.2, ease: 'none' }, 14.2);
      }
      if (subgroup5Left) {
        masterTl.to(subgroup5Left, { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, 14.25);
      }
      if (subgroup5Right) {
        masterTl.to(subgroup5Right, { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, 14.3);
      }

      // Force timeline to extend for proper scroll mapping
      masterTl.to({}, { duration: 0.01, ease: 'none' }, 15.49);
    }
  }

  // Force ScrollTrigger to recalculate positions after all animations are set up
  // Defer to prevent auto-scroll issues on page load
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
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
