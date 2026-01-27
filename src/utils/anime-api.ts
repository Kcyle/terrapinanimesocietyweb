/**
 * Anime API utility using Jikan (unofficial MAL API)
 * https://jikan.moe/
 */

export interface AnimeData {
  malId: number;
  title: string;
  synopsis: string;
  image: string;
  episodes: number | null;
  score: number | null;
}

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

/**
 * Search for anime by name
 */
export async function searchAnime(query: string): Promise<AnimeData[]> {
  try {
    const response = await fetch(`${JIKAN_BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=5`);
    const data = await response.json();

    return data.data.map((anime: any) => ({
      malId: anime.mal_id,
      title: anime.title,
      synopsis: anime.synopsis || 'No description available.',
      image: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || '',
      episodes: anime.episodes,
      score: anime.score,
    }));
  } catch (error) {
    console.error('Error searching anime:', error);
    return [];
  }
}

/**
 * Get anime by MAL ID
 */
export async function getAnimeById(malId: number): Promise<AnimeData | null> {
  try {
    const response = await fetch(`${JIKAN_BASE_URL}/anime/${malId}`);
    const data = await response.json();
    const anime = data.data;

    return {
      malId: anime.mal_id,
      title: anime.title,
      synopsis: anime.synopsis || 'No description available.',
      image: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || '',
      episodes: anime.episodes,
      score: anime.score,
    };
  } catch (error) {
    console.error('Error fetching anime:', error);
    return null;
  }
}

/**
 * Generate screening dates (Sundays starting from a given date)
 */
export function generateScreeningDates(startDate: string, count: number): Date[] {
  const dates: Date[] = [];
  const start = new Date(startDate);

  // Find the first Sunday on or after the start date
  let current = new Date(start);
  const dayOfWeek = current.getDay();
  if (dayOfWeek !== 0) {
    current.setDate(current.getDate() + (7 - dayOfWeek));
  }

  for (let i = 0; i < count; i++) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 7);
  }

  return dates;
}

/**
 * Format date for display
 */
export function formatScreeningDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get random top anime images for background collage
 */
export async function getRandomAnimeImages(count: number = 24): Promise<string[]> {
  try {
    // Fetch top anime (page 1-3 for variety)
    const page = Math.floor(Math.random() * 3) + 1;
    const response = await fetch(`${JIKAN_BASE_URL}/top/anime?page=${page}&limit=25`);
    const data = await response.json();

    const images = data.data
      .map((anime: any) => anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url)
      .filter((url: string) => url);

    // Shuffle and return requested count
    return images.sort(() => Math.random() - 0.5).slice(0, count);
  } catch (error) {
    console.error('Error fetching random anime images:', error);
    return [];
  }
}
