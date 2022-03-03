export interface SonarrTitle {
  title: string;
  overview: string;
  images: { remoteUrl: string }[];
  remotePoster: string;
  year: number;
  genres: string[];
  statistics: { seasonCount: number };
  tvdbId: number;
  imdbId: string;
}
