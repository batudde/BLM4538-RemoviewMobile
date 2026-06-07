export type AuthStackParamList = {
  Login:
    | {
        registeredEmail?: string;
        registeredMessage?: string;
      }
    | undefined;
  Register: undefined;
};

export type RootStackParamList = {
  Home: undefined;
  FilmDetail: {
    filmId: number;
  };
  AddFilm: undefined;
  Profile: undefined;
  PublicProfile: {
    username: string;
  };
};
