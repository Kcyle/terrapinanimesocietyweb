export interface AnimeData {
  malId: number;
  title: string;
  synopsis: string;
  image: string;
  episodes: number | null;
  score: number | null;
}

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

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

export function generateScreeningDates(startDate: string, count: number): Date[] {
  const dates: Date[] = [];
  const start = new Date(startDate);

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

export function formatScreeningDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export async function getRandomAnimeImages(count: number = 24): Promise<string[]> {
  try {
    const page = Math.floor(Math.random() * 3) + 1;
    const response = await fetch(`${JIKAN_BASE_URL}/top/anime?page=${page}&limit=25`);
    const data = await response.json();

    const images = data.data
      .map((anime: any) => anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url)
      .filter((url: string) => url);

    return images.sort(() => Math.random() - 0.5).slice(0, count);
  } catch (error) {
    console.error('Error fetching random anime images:', error);
    return [];
  }
}
