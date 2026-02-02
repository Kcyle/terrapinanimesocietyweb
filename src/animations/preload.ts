const criticalImages = [
  '/images/Photos/maid1.webp',
  '/images/Photos/maid2.webp',
  '/images/Photos/maid3.webp',
  '/images/Photos/maid4.webp',
  '/images/Backgrounds/tas4.webp',
  '/images/Backgrounds/background.webp',
  '/images/Backgrounds/kamecon.webp',
  '/images/Backgrounds/terpcon.webp',
  '/images/Backgrounds/tas1.webp',
  '/images/Characters/maids.webp',
  '/images/Characters/punch.webp',
  '/images/Characters/Reze.webp',
  '/images/Characters/samurai.webp',
  '/images/Characters/Tess-chan.webp',
  '/images/Characters/turtle.webp',
  '/images/Characters/c.c.webp',
  '/images/Characters/falling.webp',
];

const secondaryImages = [
  '/images/Photos/tas2.webp',
  '/images/Photos/tas3.webp',
  '/images/Photos/tas5.webp',
  '/images/Photos/tas6.webp',
  '/images/Photos/tas7.webp',
  '/images/Photos/tas8.webp',
  '/images/Photos/KAMECON Poster.webp',
  '/images/Photos/Cosplay 1.webp',
  '/images/Photos/Cosplay 2.webp',
  '/images/Photos/Cosplay 3.webp',
  '/images/Artwork/1.webp',
  '/images/Artwork/2.webp',
  '/images/Artwork/3.webp',
  '/images/Artwork/4.webp',
  '/images/Artwork/5.webp',
];

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

async function preloadBatch(images: string[], batchSize = 3): Promise<void> {
  for (let i = 0; i < images.length; i += batchSize) {
    const batch = images.slice(i, i + batchSize);
    await Promise.all(batch.map(preloadImage));
  }
}

export function initPreloader(): void {
  const schedulePreload = window.requestIdleCallback || ((cb: () => void) => setTimeout(cb, 100));

  schedulePreload(async () => {
    await preloadBatch(criticalImages, 4);
    await preloadBatch(secondaryImages, 3);
    console.log('[Preloader] All images preloaded');
  });
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader);
  } else {
    initPreloader();
  }
}
