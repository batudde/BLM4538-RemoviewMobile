export type Film = {
  id: number;
  title: string;
  posterUrl: string | null;
  averageRating: number;
  genres: string[];
};

export type FilmDetail = Film & {
  reviews: Array<{
    id: number;
    comment: string;
    createdAt: string;
    userId: number;
  }>;
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

export function mapFilmDetail(raw: Partial<FilmDetail> & Record<string, unknown>): FilmDetail {
  return {
    ...mapFilm(raw),
    reviews: Array.isArray(raw.reviews)
      ? raw.reviews.map((review) => {
          const item = review as Record<string, unknown>;

          return {
            id: typeof item.id === 'number' ? item.id : Number(item.id ?? 0),
            comment: typeof item.comment === 'string' ? item.comment : '',
            createdAt: typeof item.createdAt === 'string' ? item.createdAt : '',
            userId: typeof item.userId === 'number' ? item.userId : Number(item.userId ?? 0),
          };
        })
      : [],
  };
}
