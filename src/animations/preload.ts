/**
 * Image preloader - loads images in the background while user is on home page
 */

// Critical images to preload first (backgrounds, characters, maid cafe photos)
const criticalImages = [
  // Maid cafe photos - load first since they're early in scroll
  '/images/Photos/maid1.webp',
  '/images/Photos/maid2.webp',
  '/images/Photos/maid3.webp',
  '/images/Photos/maid4.webp',
  // Backgrounds
  '/images/Backgrounds/tas4.webp',
  '/images/Backgrounds/background.webp',
  '/images/Backgrounds/kamecon.webp',
  '/images/Backgrounds/terpcon.webp',
  '/images/Backgrounds/tas1.webp',
  // Characters
  '/images/Characters/maids.webp',
  '/images/Characters/punch.webp',
  '/images/Characters/Reze.webp',
  '/images/Characters/samurai.webp',
  '/images/Characters/Tess-chan.webp',
  '/images/Characters/turtle.webp',
  '/images/Characters/c.c.webp',
  '/images/Characters/falling.webp',
];

// Secondary images (photos, cards) - loaded after critical images
const secondaryImages = [
  // About section photos
  '/images/Photos/tas2.webp',
  '/images/Photos/tas3.webp',
  '/images/Photos/tas5.webp',
  '/images/Photos/tas6.webp',
  '/images/Photos/tas7.webp',
  '/images/Photos/tas8.webp',
  // Kamecon poster
  '/images/Photos/KAMECON Poster.webp',
  // Cosplay photos
  '/images/Photos/Cosplay 1.webp',
  '/images/Photos/Cosplay 2.webp',
  '/images/Photos/Cosplay 3.webp',
  // Artwork
  '/images/Artwork/1.webp',
  '/images/Artwork/2.webp',
  '/images/Artwork/3.webp',
  '/images/Artwork/4.webp',
  '/images/Artwork/5.webp',
];

// Preload a single image
function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // Don't fail on error, just continue
    img.src = src;
  });
}

// Preload images in batches to avoid overwhelming the browser
async function preloadBatch(images: string[], batchSize = 3): Promise<void> {
  for (let i = 0; i < images.length; i += batchSize) {
    const batch = images.slice(i, i + batchSize);
    await Promise.all(batch.map(preloadImage));
  }
}

/**
 * Initialize image preloading
 * Call this on page load to start loading images in the background
 */
export function initPreloader(): void {
  // Use requestIdleCallback if available, otherwise use setTimeout
  const schedulePreload = window.requestIdleCallback || ((cb: () => void) => setTimeout(cb, 100));

  // Start preloading after the page has settled
  schedulePreload(async () => {
    // First, preload critical images (backgrounds and characters)
    await preloadBatch(criticalImages, 4);

    // Then preload secondary images
    await preloadBatch(secondaryImages, 3);

    console.log('[Preloader] All images preloaded');
  });
}

// Auto-initialize when the module is imported
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader);
  } else {
    initPreloader();
  }
}
