import { request } from './http';
import { Genre, mapGenre } from '../types/genre';

export async function getGenres() {
  const data = await request<Array<Partial<Genre> & Record<string, unknown>>>('/api/genres');
  return data.map(mapGenre);
}
