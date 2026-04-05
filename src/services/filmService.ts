import { request } from './http';
import { Film, FilmDetail, mapFilm, mapFilmDetail } from '../types/film';

export async function getFilms() {
  const data = await request<Array<Partial<Film> & Record<string, unknown>>>('/api/films');
  return data.map(mapFilm);
}

export async function getFilmDetail(filmId: number) {
  const data = await request<Partial<FilmDetail> & Record<string, unknown>>(`/api/films/${filmId}`);
  return mapFilmDetail(data);
}
