export type Film = {
  id: number;
  title: string;
  posterUrl: string | null;
  averageRating: number;
  genres: string[];
};

export function mapFilm(raw: Partial<Film> & Record<string, unknown>): Film {
  const rating = raw.averageRating;

  return {
    id: typeof raw.id === 'number' ? raw.id : Number(raw.id ?? 0),
    title: typeof raw.title === 'string' ? raw.title : '',
    posterUrl: typeof raw.posterUrl === 'string' ? raw.posterUrl : null,
    averageRating: typeof rating === 'number' ? rating : Number(rating ?? 0),
    genres: Array.isArray(raw.genres) ? raw.genres.map((genre) => String(genre)) : [],
  };
}
