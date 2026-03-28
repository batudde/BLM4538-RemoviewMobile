import { request } from './http';
import { Film, mapFilm } from '../types/film';

export async function getFilms() {
  const data = await request<Array<Partial<Film> & Record<string, unknown>>>('/api/films');
  return data.map(mapFilm);
}
