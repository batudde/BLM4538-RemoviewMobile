export type Genre = {
  id: number;
  name: string;
};

export function mapGenre(raw: Partial<Genre> & Record<string, unknown>): Genre {
  return {
    id: typeof raw.id === 'number' ? raw.id : Number(raw.id ?? 0),
    name: typeof raw.name === 'string' ? raw.name : '',
  };
}
