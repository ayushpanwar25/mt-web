export interface SonarrTitle {
  title: string;
  overview: string;
  images: { remoteUrl: string }[];
  remotePoster?: string;
  year: number;
  genres: string[];
  statistics: { seasonCount: number };
  tvdbId: number;
  imdbId: string;
}

export interface ITraktTitle {
  title: string;
  year: number;
  ids: {
    tvdb: number;
  };
}

export interface ITraktSearch {
  data: ITraktWrapper[];
}

interface ITraktWrapper {
  show?: ITraktTitle;
  movie?: ITraktTitle;
}

export interface TVMazeShow {
  externals: {
    imdb: string;
    thetvdb: number;
  };
  genres: string[];
  image: {
    medium: string;
    original: string;
  };
  name: string;
  premiered: string;
  _embedded?: {
    seasons?: [{}];
  };
}
