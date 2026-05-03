import { request } from './http';
import { Film, FilmDetail, mapFilm, mapFilmDetail } from '../types/film';
import { getSession } from '../storage/authStorage';

export async function getFilms() {
  const data = await request<Array<Partial<Film> & Record<string, unknown>>>('/api/films');
  return data.map(mapFilm);
}

export async function getFilmDetail(filmId: number) {
  const data = await request<Partial<FilmDetail> & Record<string, unknown>>(`/api/films/${filmId}`);
  return mapFilmDetail(data);
}

export async function createFilm(input: {
  title: string;
  posterUrl: string | null;
  genreIds: number[];
}) {
  const { token } = await getSession();

  if (!token) {
    throw new Error('Oturum bulunamadi. Lutfen tekrar giris yap.');
  }

  return request<{ Message?: string; message?: string }>('/api/films', {
    method: 'POST',
    token,
    body: JSON.stringify(input),
  });
}

export async function addRating(filmId: number, value: number) {
  const { token } = await getSession();

  if (!token) {
    throw new Error('Oturum bulunamadi. Lutfen tekrar giris yap.');
  }

  return request<{ Message?: string; message?: string }>(`/api/films/${filmId}/ratings`, {
    method: 'POST',
    token,
    body: JSON.stringify({ value }),
  });
}

export async function addReview(filmId: number, comment: string) {
  const { token } = await getSession();

  if (!token) {
    throw new Error('Oturum bulunamadi. Lutfen tekrar giris yap.');
  }

  return request<{ Message?: string; message?: string }>(`/api/films/${filmId}/reviews`, {
    method: 'POST',
    token,
    body: JSON.stringify({ comment }),
  });
}
